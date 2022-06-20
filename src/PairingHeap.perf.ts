import {calcPerformance} from 'rdtsc'
import {PairingHeap} from 'src/PairingHeap'

describe('pairing-heap > PairingHeap perf', function () {
  this.timeout(600000)

  it('base', async function () {
    const pairingHeap = new PairingHeap()
    const array = []
    const set = new Set()

    function getMinIndex(arr) {
      let minItem = arr[0]
      let minIndex = 0
      for (let i = 1, len = arr.length; i < len; i++) {
        const item = arr[i]
        if (item < minItem) {
          minItem = item
          minIndex = i
        }
      }
      return minIndex
    }

    function getMinValue(set) {
      let minItem = null
      set.forEach(o => {
        if (minItem == null || o < minItem) {
          minItem = o
        }
      })
      return minItem
    }

    function arrayDeleteMin(arr) {
      const minIndex = getMinIndex(arr)
      const len = arr.length - 1
      for (let i = minIndex; i < len; i++) {
        arr[i] = arr[i + 1]
      }
      arr.length = len
    }

    function setDeleteMin(arr) {
      const minItem = getMinValue(set)
      set.delete(minItem)
    }

    const count = 10

    let result = calcPerformance(
      10000,
      () => {

      },
      () => {
        for (let i = 0; i < count; i++) {
          array.push(i % 2 === 0 ? i - 2 : i)
        }
      },
      () => {
        for (let i = 0; i < count; i++) {
          arrayDeleteMin(array)
        }
      },
      () => {
        for (let i = 0; i < count; i++) {
          set.add(i % 2 === 0 ? i - 2 : i)
        }
      },
      () => {
        for (let i = 0; i < count; i++) {
          setDeleteMin(set)
        }
      },
      () => {
        for (let i = 0; i < count; i++) {
          pairingHeap.add(i % 2 === 0 ? i - 2 : i)
        }
      },
      () => {
        for (let i = 0; i < count; i++) {
          pairingHeap.deleteMin()
        }
      },
    )
    
    console.log(result)
  })
})
