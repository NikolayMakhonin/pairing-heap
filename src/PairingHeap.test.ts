import {ObjectPool} from 'src/test/object-pool'
import {PairingHeap, PairingNode, TLessThanFunc} from './PairingHeap'
import {createTestVariants} from '@flemist/test-variants'

describe('pairing-heap > PairingHeap', function () {
  this.timeout(600000)

  it('iterator', function () {
    const heap = new PairingHeap<number>()

    function addItems(seek: number) {
      for (let i = 0; i < 10; i++) {
        const value = ((i + 2) * 46337) % 10 // pseudo random without duplicates
        heap.add(value * 3 + seek)
      }
    }

    addItems(1)

    let i = 0
    for (const item of heap) {
      assert.strictEqual(item, i * 3 + 1)
      i++
    }

    addItems(0)
    addItems(2)

    i = 0
    for (const item of heap) {
      assert.strictEqual(item, i)
      i++
    }

    i = 0
    heap.add(25.5)
    for (const item of heap) {
      if (item === 25.5) {
        assert.strictEqual(i, 26)
      }
      else {
        assert.strictEqual(item, i)
        i++
      }
    }
  })

  const testVariants = createTestVariants(({
    decreaseKey,
    objectPoolSize,
    count,
    sort,
    withEqualItems,
  }: {
    decreaseKey: boolean,
    objectPoolSize: number|undefined|null,
    count: number,
    sort: -1|1|undefined|null,
    withEqualItems: boolean,
  }) => {
    const objectPool = objectPoolSize == null
      ? null
      : new ObjectPool<PairingNode<number>>(objectPoolSize)
    const lessThanFunc: TLessThanFunc<number>|undefined|null = sort == null
      ? null
      : function lessThanFunc(o1, o2) {
        if (sort > 0) {
          return o1 < o2
        }
        else {
          return o2 < o1
        }
      }
    const heap = new PairingHeap<number>({objectPool, lessThanFunc})
    const items: number[] = new Array(count)

    let iterations = 1
    for (let i = 0; i < count; i++) {
      items[i] = i
      if (i < 6) {
        iterations *= i + 1
      }
    }

    if (withEqualItems) {
      if (count > 0) {
        items.push(items[0])
      }
      if (count > 2) {
        items.push(items[Math.floor((items.length - 1) / 2)])
      }
      if (count > 1) {
        items.push(items[items.length - 1])
      }
    }

    const itemsSorted = items.slice()
    if (decreaseKey) {
      for (let i = 0; i < itemsSorted.length; i++) {
        if (itemsSorted[i] % 2 === 0) {
          // itemsSorted[i] += 3
        }
        else {
          itemsSorted[i] -= 3
        }
      }
    }
    itemsSorted.sort((o1, o2) => (o1 > o2) === (sort == null || sort >= 0) ? 1 : -1)

    for (let iteration = 0; iteration < iterations; iteration++) {
      assert.strictEqual(heap.size, 0)
      assert.strictEqual(heap.isEmpty, true)
      assert.strictEqual(heap.deleteMin(), void 0)

      items.sort(() => Math.random() > 0.5 ? 1 : -1)
      const nodes: PairingNode<number>[] = new Array(items.length)
      for (let i = 0; i < items.length; i++) {
        const node = heap.add(items[i])

        assert.ok(node)
        nodes.push(node)
        assert.strictEqual(node.item, items[i])
        assert.strictEqual(heap.size, i + 1)
        assert.strictEqual(heap.isEmpty, false)

        if (decreaseKey) {
          if (items[i] % 2 === 0) {
            // node.item += 3
          }
          else {
            node.item -= 3
          }
          heap.decreaseKey(node)
        }

        assert.strictEqual(node.item, items[i])
        assert.strictEqual(heap.size, i + 1)
        assert.strictEqual(heap.isEmpty, false)
      }

      nodes.sort(() => Math.random() > 0.5 ? 1 : -1)
      for (let i = 0; i < items.length; i++) {
        const node = nodes[i]
        heap.delete(node)
        assert.strictEqual(heap.size, items.length - i - 1)
        assert.strictEqual(heap.isEmpty, i === items.length - 1)
        if (!objectPool) {
          heap.delete(node)
          assert.strictEqual(heap.size, items.length - i - 1)
          assert.strictEqual(heap.isEmpty, i === items.length - 1)
        }
      }

      assert.strictEqual(heap.size, 0)
      assert.strictEqual(heap.isEmpty, true)
      assert.strictEqual(heap.deleteMin(), void 0)

      for (let i = 0; i < items.length; i++) {
        const node = heap.add(items[i])

        assert.ok(node)
        assert.strictEqual(node.item, items[i])
        assert.strictEqual(heap.size, i + 1)
        assert.strictEqual(heap.isEmpty, false)

        if (decreaseKey) {
          if (items[i] % 2 === 0) {
            // node.item += 3
          }
          else {
            node.item -= 3
          }
          heap.decreaseKey(node)
        }

        assert.ok(node)
        assert.strictEqual(node.item, items[i])
        assert.strictEqual(heap.size, i + 1)
        assert.strictEqual(heap.isEmpty, false)
      }

      const resultItems: any[] = []
      for (const item of heap) {
        resultItems.push(item)
      }

      assert.deepStrictEqual(resultItems, itemsSorted)
      resultItems.length = 0

      for (let i = 0; i < items.length; i++) {
        const valueMin = heap.getMin()
        ;(resultItems as any[]).push(valueMin)
        // assert.strictEqual(valueMin, itemsSorted[i])

        const minNode = heap.getMinNode()
        assert.strictEqual(minNode!.item, valueMin)

        assert.strictEqual(heap.size, items.length - i)
        assert.strictEqual(heap.isEmpty, false)

        const valueDeleted = heap.deleteMin()

        assert.strictEqual(valueDeleted, valueMin)
        assert.strictEqual(heap.size, items.length - i - 1)
        assert.strictEqual(heap.isEmpty, i === items.length - 1)
      }

      assert.deepStrictEqual(resultItems, itemsSorted)

      assert.strictEqual(heap.size, 0)
      assert.strictEqual(heap.isEmpty, true)
      assert.strictEqual(heap.deleteMin(), void 0)
    }

    return iterations
  })

  it('variants', async function () {
    await testVariants({
      decreaseKey   : [false],
      objectPoolSize: [null, 0, 1, 3, 10],
      sort          : [null, 1, -1],
      count         : [0, 1, 2, 3, 4, 5, 6, 7, 10, 100],
      withEqualItems: [false, true],
    })()
  })
})
