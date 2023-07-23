<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #636576;
  height: 100%;
}
</style>

<script>
export default {
  mounted () {
    // 禁止input[type=number]数字跟随鼠标滚动变动
    document.body.addEventListener('mousewheel', event => {
      if ((event.target.className.match('el-input') || event.target.className.match('table-input')) && event.target.type === 'number') {
        event.preventDefault()
      }
    }, { passive: false })

    document.body.addEventListener('mousewheel', event => {
      if (event.wheelDelta && event.ctrlKey) {
        event.returnValue=false;
      }
    })

    document.body.addEventListener('input', event => {
      if ((event.target.className.match('el-input') || event.target.className.match('table-input')) && event.target.type === 'number') {
        const pattern = new RegExp("/[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\n]")
        const c = event.target.value.replace(pattern, "");
      }
    })
  }
}
</script>

