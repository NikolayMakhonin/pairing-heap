/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly linked list of
 * siblings and has a pointer to it's first child.  If a node is the
 * first of its siblings, then its prev pointer points to their
 * collective parent.  The last child is marked by a null next pointer.
 */
import type {IObjectPool} from 'src/test/object-pool'

// source: https://github.com/patmorin/priority-queue-testing/blob/master/queues/pairing_heap.c
// see also: https://github.com/NikolayMakhonin/priority-queues-ts
export interface PairingNode<TItem> {
	// ! Pointer to a piece of client data
	item: TItem

	// ! First child of this node
	child: PairingNode<TItem>|undefined|null
	// ! Next node in the list of this node's siblings
	next: PairingNode<TItem>|undefined|null
	// ! Previous node in the list of this node's siblings
	prev: PairingNode<TItem>|undefined|null
}

export type TLessThanFunc<TItem> = (o1: TItem, o2: TItem) => boolean

function lessThanDefault(o1, o2) {
  return o1 < o2
}

/**
 * A mutable, meldable, two-pass Pairing heap.  Maintains a single multiary tree
 * with no structural constraints other than the standard heap invariant.
 * Handles most operations through cutting and pairwise merging.  Primarily uses
 * iteration for merging rather than the standard recursion methods (due to
 * concerns for stackframe overhead).
 */
export class PairingHeap<TItem> {
  // ! Memory map to use for node allocation
  private readonly _objectPool: IObjectPool<PairingNode<TItem>>|undefined|null
  private readonly _lessThanFunc: TLessThanFunc<TItem>
  // ! The number of items held in the queue
  private _size: number = 0
  // ! Pointer to the minimum node in the queue
  private _root: PairingNode<TItem>|undefined|null = null

  constructor({
    objectPool,
    lessThanFunc,
  }: {
		objectPool?: IObjectPool<PairingNode<TItem>>|undefined|null,
		lessThanFunc?: TLessThanFunc<TItem>|null,
	} = {}) {
    this._objectPool = objectPool
    this._lessThanFunc = lessThanFunc || lessThanDefault
  }

  /**
	 * Deletes all nodes, leaving the queue empty.
	 */
  clear(): void {
    // without put back to the pool
    this._root = null
    this._size = 0
  }

  /**
	 * Returns the current size of the queue.
	 *
	 * @return      Size of queue
	 */
  get size(): number {
    return this._size
  }

  /**
	 * Takes an item to insert it into the queue and creates a new
	 * corresponding node.  Merges the new node with the root of the queue.
	 *
	 * @param item  Item to insert
	 * @return      Pointer to corresponding node
	 */
  add(item: TItem): PairingNode<TItem> {
    let node: PairingNode<TItem>|undefined|null = this._objectPool != null
      ? this._objectPool.get()
      : null

    if (node == null) {
      node = {
        child: null,
        next : null,
        prev : null,
        item,
      }
    }
    else {
      node.item = item
    }

    this._size++

    this._root = merge(this._root, node, this._lessThanFunc)

    return node
  }

  /**
	 * Returns the minimum item from the queue without modifying any data.
	 *
	 * @return      Minimum item
	 */
  getMin(): TItem|undefined|null {
    const {_root} = this
    return _root == null
      ? void 0
      : _root.item
  }

  /**
   * Returns the minimum node from the queue without modifying any data.
   *
   * @return      Minimum item
   */
  getMinNode(): PairingNode<TItem>|undefined|null {
    return this._root
  }

  /**
	 * Deletes the minimum item from the queue and returns it, restructuring
	 * the queue along the way to maintain the heap property.  Relies on the
	 * @ref <pq_delete> method to delete the root of the tree.
	 *
	 * @return      Minimum item, corresponding to item deleted
	 */
  deleteMin(): TItem|undefined|null {
    const {_root} = this
    if (_root == null) {
      return void 0
    }

    const result = _root.item

    this.delete(_root)

    return result
  }

  /**
	 * Deletes an arbitrary item from the queue and modifies queue structure
	 * to preserve the heap invariant.  Requires that the location of the
	 * item's corresponding node is known.  Removes the node from its list
	 * of siblings, then merges all its children into a new tree and
	 * subsequently merges that tree with the root.
	 *
	 * @param node  Pointer to node corresponding to the item to delete
	 */
  delete(node: PairingNode<TItem>): void {
    if (node === this._root) {
      this._root = collapse(node.child, this._lessThanFunc)
    }
    else {
      if (node.prev == null) {
        if (this._objectPool) {
          throw new Error(`The node is already deleted. Don't use the objectPool to prevent this error.`)
        }
        // already deleted
        return
      }
      if (node.prev.child === node) {
        node.prev.child = node.next
      }
      else {
        node.prev.next = node.next
      }

      if (node.next != null) {
        node.next.prev = node.prev
      }

      this._root = merge(this._root, collapse(node.child, this._lessThanFunc), this._lessThanFunc)
    }

    node.child = null
    node.prev = null
    node.next = null
    node.item = void 0 as any
    this._objectPool?.release(node)

    this._size--
  }

  /**
	 * If the item in the queue is modified in such a way to decrease the
	 * item, then this function will update the queue to preserve queue
	 * properties given a pointer to the corresponding node.  Cuts the node
	 * from its list of siblings and merges it with the root.
	 *
	 * @param node      Node to change
	 */
  decreaseKey(node: PairingNode<TItem>): void {
    if (node === this._root) {
      return
    }

    if (node.prev!.child === node) {
      node.prev!.child = node.next
    }
    else {
      node.prev!.next = node.next
    }

    if (node.next != null) {
      node.next.prev = node.prev
    }

    this._root = merge(this._root, node, this._lessThanFunc)
  }

  /**
	 * Determines whether the queue is empty, or if it holds some items.
	 *
	 * @return      True if queue holds nothing, false otherwise
	 */
  get isEmpty(): boolean {
    return this._root == null
  }

  [Symbol.iterator]() {
    return this._iterate(false)
  }

  nodes() {
    return {
      [Symbol.iterator]: () => {
        return this._iterate(true)
      },
    }
  }

  private _iterate(nodes: false): Iterator<TItem>
  private _iterate(nodes: true): Iterator<PairingNode<TItem>>
  private _iterate(nodes: boolean): Iterator<PairingNode<TItem>|TItem> {
    const lessThanFunc = this._lessThanFunc

    function *iterate(node: PairingNode<TItem>|undefined|null) {
      if (node) {
        if (nodes) {
          yield node
        }
        else {
          yield node.item
        }
        if (node.child) {
          if (node.child.next != null) {
            node.child = collapse(node.child, lessThanFunc)
            node.child!.prev = node
          }
          yield* iterate(node.child)
        }
      }
    }
    return iterate(this._root)
  }

  readonly merge = merge
  readonly collapse = collapse
}

/**
 * Merges two nodes together, making the greater item the child
 * of the other.
 *
 * @param a     First node
 * @param b     Second node
 * @return      Resulting tree root
 */
export function merge<TItem>(
  a: PairingNode<TItem>|undefined|null,
  b: PairingNode<TItem>|undefined|null,
  lessThanFunc: TLessThanFunc<TItem>,
): PairingNode<TItem>|undefined|null {
  let parent: PairingNode<TItem>
  let child: PairingNode<TItem>

  if (a == null) {
    return b
  }

  if (b == null) {
    return a
  }

  if (a === b) {
    return a
  }

  if (lessThanFunc(b.item, a.item)) {
    parent = b
    child = a
  }
  else {
    parent = a
    child = b
  }

  child.next = parent.child
  if (parent.child != null) {
    parent.child.prev = child
  }
  child.prev = parent
  parent.child = child

  parent.next = null
  parent.prev = null

  return parent
}

/**
 * Performs an iterative pairwise merging of a list of nodes until a
 * single tree remains.  Implements the two-pass method without using
 * explicit recursion (to prevent stack overflow with large lists).
 * Performs the first pass in place while maintaining only the minimal list
 * structure needed to iterate back through during the second pass.
 *
 * @param node  Head of the list to collapse
 * @return      Root of the collapsed tree
 */
export function collapse<TItem>(
  node: PairingNode<TItem>|undefined|null,
  lessThanFunc: TLessThanFunc<TItem>,
): PairingNode<TItem>|undefined|null {
  let tail: PairingNode<TItem>|undefined|null
  let a: PairingNode<TItem>
  let b: PairingNode<TItem>|undefined|null
  let next: PairingNode<TItem>|undefined|null
  let result: PairingNode<TItem>|undefined|null

  if (node == null) {
    return null
  }

  next = node
  tail = null
  while (next != null) {
    a = next
    b = a.next
    if (b != null) {
      next = b.next
      result = merge(a, b, lessThanFunc)
      // tack the result onto the end of the temporary list
      result!.prev = tail
      tail = result
    }
    else {
      a.prev = tail
      tail = a
      break
    }
  }

  result = null
  while (tail != null) {
    // trace back through to merge the list
    next = tail.prev
    result = merge(result, tail, lessThanFunc)
    tail = next
  }

  return result
}
