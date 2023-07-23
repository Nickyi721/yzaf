function bubbleSort (array) {
  let len = array.length
  let temp
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j <= len - 1 -1; j++) {
      if (array[j] > array[j + 1]) {
        temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp
      }
    }
  }
  return array
}

export default {
  getMenuId: () => {
    let menuId = ''
    let menuArr = []
    const menus = window.sessionStorage.menu ? JSON.parse(window.sessionStorage.menu) : {}
    for (let i in menus) {
      if (window.$app.$route.path === menus[i].path) {
        menuId = menus[i].tcCdid
      }
    }
    if (menuId === '') {
      for (let i in menus) {
        const path = menus[i].path
        const pattren = new RegExp('^' + path, 'g')
        if (window.$app.$route.path.match(pattren)) {
          menuArr.push(menus[i].tcCdid)
        }
      }
      menuArr = bubbleSort(menuArr)
      menuId = menuArr[menuArr.length - 1]
    }
    return menuId
  }
}