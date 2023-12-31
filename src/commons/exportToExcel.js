import XLSX from 'xlsx-style'
// 配置
const wopts = {
  bookType: 'xlsx',
  bookSST: true,
  type: 'binary',
  cellStyles: true
}
function downloadExl (json, config, fileName, type) {
  var tmpdata = json[0]
  json.unshift({})
  var keyMap = [] // 获取keys
  for (var k in tmpdata) {
    keyMap.push(k)
    json[0][k] = k
  }
  var tmpdata = [] // 用来保存转换好的json
  json
    .map((v, i) =>
      keyMap.map((k, j) =>
        Object.assign(
          {},
          {
            v: v[k],
            position:
                            (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) +
                            (i + 1)
          }
        )
      )
    )
    .reduce((prev, next) => prev.concat(next))
    .forEach((v, i) => {
      // 在遍历时修改样式
      let s = {
        font: { sz: 10, name: '微软雅黑' },
        border: {
          right: { style: 'thin', color: { rgb: '000000' } },
          top: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } }
        },
        alignment: {
          horizontal: 'center',
          wrapText: true,
          vertical: 'center'
        }
      }
      // 判断是否是标题
      if (config._this.title.includes(v.v) && ((v.position.length == 2 && v.position[1] == '1') ||
            (v.position.length == 3 && v.position[2] == '1') || (v.position.length == 3 && v.position[2] == '1'))) {
        // debugger
        s.font.bold = true
        s.fill = { fgColor: { rgb: 'bfbfbf' } }
        // 判断是否是需要红色字体的标题字段
        // if (config._this.redTitle.includes(v.v)) {
        //     s.font.color = { rgb: "ff0000" };
        // }
      }
      tmpdata[v.position] = { v: v.v || '', s }
    })
  // console.log('tmpdata', tmpdata)
  var outputPos = Object.keys(tmpdata) // 设置区域,比如表格从A1到D10
  // 设置每列对应的宽度
  let colwidth = new Array(config._this.title.length).fill({ wpx: 150 })
  // tmpdata["!cols"] = config.colwidth;
  tmpdata['!cols'] = config.colwidth || colwidth
  var tmpWB = {
    SheetNames: ['mySheet'], // 保存的表标题
    Sheets: {
      mySheet: Object.assign(
        {},
        tmpdata, // 内容
        {
          '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
        }
      )
    }
  }
  const tmpDown = new Blob(
    [
      s2ab(
        XLSX.write(
          tmpWB,
          {
            bookType: type == undefined ? 'xlsx' : type,
            bookSST: false,
            type: 'binary'
          } // 这里的数据是用来定义导出的格式类型
        )
      )
    ],
    {
      type: 'application/octet-stream'
    }
  )
  // 数据处理完后传入下载
  saveAs(
    tmpDown,
    fileName +
        '.' +
        (wopts.bookType == 'biff2' ? 'xls' : wopts.bookType)
  )
}
// 获取26个英文字母用来表示excel的列
function getCharCol (n) {
//   let temCol = ''
  let s = ''
  let m = 0
  while (n > 0) {
    m = (n % 26) + 1
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}
function s2ab (s) {
  if (typeof ArrayBuffer !== 'undefined') {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  } else {
    var buf = new Array(s.length)
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff
    return buf
  }
}
// 下载功能
function saveAs (obj, fileName) {
  var tmpa = document.createElement('a')
  tmpa.download = fileName || '未命名'
  // 兼容ie 火狐 下载文件
  if ('msSaveOrOpenBlob' in navigator) {
    window.navigator.msSaveOrOpenBlob(obj, fileName)
  } else if (window.navigator.userAgent.includes('Firefox')) {
    var a = document.createElement('a')
    a.href = URL.createObjectURL(obj)
    a.download = fileName
    document.body.appendChild(a)
    a.click()
  } else {
    tmpa.href = URL.createObjectURL(obj)
  }
  tmpa.click()
  setTimeout(function () {
    URL.revokeObjectURL(obj)
  }, 100)
}
export default downloadExl
