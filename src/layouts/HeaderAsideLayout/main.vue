<template>
  <div class="app-wrapper" >
    <Header ref="header" @alterPwd="alterPwd"/>
    <MainMenu :data="mainMenu" @click="_MainMenuClick"/>
    <ModuleMenu ref="moduleMenu" :data="moduleMenu" v-if="moduleMenu.length"/>

    <section class="app-content" ref="bindStyle" :style="{'height': `calc(100% - ${ 85 + (moduleMenu.length ? 40 : 0) + 'px' })`}">
      <div class="app-tab">
        <ul>
          <li v-for="(item, index) in switchMenu" v-on:click.stop="pageCount(item.path)" :key="index">
            <span class="app-tab-name">{{ item.title }}</span> 
            <span @click.stop="closePage(item)" class="app-tab-close"><CustomIcon name="close" /></span>
          </li>
        </ul>
      </div>

      <transition name="fade" mode="out-in">
        <!-- <keep-alive include="FinanceEquipTotal,GuardOrg,GuardPerson"> -->
        <keep-alive :include="cached">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </section>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import MainMenu from './components/MainMenu.vue'
import ModuleMenu from './components/ModuleMenu.vue'

export default {
  components: { Header, MainMenu, ModuleMenu },
  data () {
    return {
      // 主导航
      mainMenu: [],
      // 模块导航
      moduleMenu: [],
      // 是否有菜单项
      isMenu: true,
      cached: [],
      switchMenu: []
    }
  },
  methods: {
    initMenu () {
      this.mainMenu = [{ icon: 'menu-home', text: '首页', path: '/' }].concat(JSON.parse(window.sessionStorage.menuIds))
      if (this.$route.path !== '/') {
        this.mainMenu.forEach((item, idx) => {
          const reg = new RegExp('^' + item.path)
          if (this.$route.path.match(reg)) {
            this.moduleMenu = item.children
          }
        })
      }
    },
    _MainMenuClick (item) {
      this.moduleMenu = item.children || [] 
      if (this.moduleMenu.length) {
        this.$nextTick(() => {
          this.$refs.moduleMenu.init()
        })
      } else {
        this.$router.push(item.path)
      }
    },
    alterPwd(){
      this.isMenu = false
      this.$router.push("/password")
    },
    pageCount(path) {
      this.$router.push({
        path: path
      })
    },
    closePage(item) {
      // 关闭开关页时清除缓存
      this.cached = this.cached.filter(list => list != item.name)
      // 关闭开关页--视图更新
      this.switchMenu = this.switchMenu.filter(list => list.name != item.name)
      this.$bus.$emit('switchPage', this.switchMenu)
    }
  },
  created () {
    if(this.isMenu) {
      this.initMenu()
    }
    this.$bus.$on('switchPage', (params) => {  //获取传递的参数并进行操作
      this.switchMenu = params
      //给keep-alive中的cashed数组push新元素
      params.forEach(item => {
        if(this.cached.indexOf(item.name) === -1) {
          this.cached.push(item.name)
        }
      })
    })
  },
  beforeDestroy () {
    // 页面销毁时清空预存数组
    this.$bus.$emit('switchPage',[]);
    this.$bus.$off('switchPage');
  },
  watch: {
    '$route': function () {
      if (this.isMenu) {
        this.initMenu()
      }
      if (this.$route.fullPath === '/') {
        this.moduleMenu = []
      }
    },
    switchMenu() {
      if(this.switchMenu.length === 0) {
        this.$refs.bindStyle.style.paddingLeft = '0'
      } else {
        this.$refs.bindStyle.style.paddingLeft = '40px'
      }
    },
  },
}
</script>

<style lang="scss">
@import "~@assets/styles/define.scss";

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .app-top{
    position: relative;
    z-index: 100;
  }

  .app-content{
    height: 100%;
    overflow-y: auto;
    // z-index: 99;
    position: relative;
    // padding-left: 40px;

    .app-tab{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 40px;
      background: #f3f3f3;
      border-right: 1px solid $border;
      box-shadow: inset 2px 0px 5px rgba($color: #000000, $alpha: 0.07);
      overflow: hidden;
      overflow-y: auto;
      width: 60px;

      ul{
        list-style: none;
        li{
          padding: 8px 0;
          width: 32px;
          border: 1px solid $border-light;
          cursor: pointer;
          margin: 5px 0;
          background: #fff;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          color: $text;
          box-shadow: 0px 2px 7px rgba($color: #000000, $alpha: 0.04);

          .app-tab-name{
            margin: 0 auto;
            margin-bottom: 5px;
            width: 16px;
            -moz-writing-mode: sideways-rl;
            -webkit-writing-mode: sideways-rl;
            -ms-writing-mode: sideways-rl;
            font-size: 14px;
            display: block;
          }

          .app-tab-close{
            display: block;
            width: 16px;
            height: 16px;
            border-radius: 100%;
            margin-left: 6px;
            text-align: center;
            line-height: 13px;

            i{
              font-size: 10px;
              color: $gray;
            }

            &:hover{
              background: $gray;

              i{
                color: #fff;
              }
            }
          }
          

          &:hover{
            color: $green;
            border: 1px solid $border;
          }
        }
      }
    }
  }
}
</style>
