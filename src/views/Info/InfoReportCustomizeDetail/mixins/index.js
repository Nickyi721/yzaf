export default {
  methods: {
    _setListOrder (list) {
      let resulData = []
      list.forEach((item, index) => {
        item.rowId = index
        item.canUse = !!(item.tnSfmj && item.tcLrfs === '0' && (item.tnSjlx === 0 || item.tnSjlx === 1))
        item.tcBblsz = item.tcBblsz && item.tcBblsz.replace(/加/g, '+')
        resulData.push(item)
        for (let i = 0; i < item.zdybbtiList.length; i++) {
          let ceil = item.zdybbtiList[i]
          ceil.pId = index
          ceil.tcBblsz = ceil.tcBblsz && ceil.tcBblsz.replace(/加/g, '+')
          ceil.canUse = !!(ceil.tnSfmj && ceil.tcLrfs === '0' && (ceil.tnSjlx === 0 || ceil.tnSjlx === 1))
          resulData.push(ceil)
        }
      })
      resulData.forEach((item, index) => {
        item.tnLxh = String.fromCharCode(65 + index)
      })
      resulData.filter(item => item.rowId)
      list.forEach(item => {
        item.zdybbtiList = resulData.filter(ceil => {
          return item.rowId === ceil.pId
        })
      })
    },
    _maxLength (list) {
      let resulData = []
      list.forEach(item => {
        resulData.push(item)
        resulData = [...resulData, ...item.zdybbtiList]
      })
      if (resulData.filter(item => item.tnSfmj === 1).length >= 26) {
        return true
      }
    }
  }
}
