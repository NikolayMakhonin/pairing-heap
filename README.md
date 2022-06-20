[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][github-image]][github-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Fastest pairing heap (priority queue) implementation on JavaScript

# Usage

```ts
import {PairingHeap, PairingNode} from "./PairingHeap";

const pairingHeap = new PairingHeap({
  lessThanFunc: (o1, o2) => o1 < o2 // optional
})

let node: PairingNode<number>

node = pairingHeap.add(5)
pairingHeap.add(9)
pairingHeap.add(3)
pairingHeap.add(7)
pairingHeap.getMin() // 3
pairingHeap.deleteMin() // 3
pairingHeap.delete(node)
pairingHeap.deleteMin() // 7
pairingHeap.size() // 1
pairingHeap.isEmpty() // false
pairingHeap.clear()
pairingHeap.deleteMin() // undefined
```

# License

[Unlimited Free](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@flemist/pairing-heap.svg
[npm-url]: https://npmjs.org/package/@flemist/pairing-heap
[downloads-image]: https://img.shields.io/npm/dm/@flemist/pairing-heap.svg
[downloads-url]: https://npmjs.org/package/@flemist/pairing-heap
[github-image]: https://github.com/NikolayMakhonin/pairing-heap/actions/workflows/test.yml/badge.svg
[github-url]: https://github.com/NikolayMakhonin/pairing-heap/actions
[coveralls-image]: https://coveralls.io/repos/github/NikolayMakhonin/pairing-heap/badge.svg
[coveralls-url]: https://coveralls.io/github/NikolayMakhonin/pairing-heap
