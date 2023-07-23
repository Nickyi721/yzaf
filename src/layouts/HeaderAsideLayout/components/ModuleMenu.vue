<template>
  <ul class="module-menu">
    <li v-for="(item, $index) in data" :key="$index" :class="{'active': $index === current}">
      <span class="module" @click="_ItemClick(item, $index)">{{item.text}}</span>
      <template v-if="item.children && item.children.length && $index === current">
        <CustomIcon name="right"/>
        <ul class="func-menu" v-if="item.children && item.children.length && $index === current">
          <li v-for="(func, idx) in item.children" :key="idx" :class="{'active': idx === funcCurrent}" @click="_FuncItemClick(func, idx)">{{func.text}}</li>
        </ul>
      </template>
    </li>
  </ul>  
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      current: -1,
      funcCurrent: -1
    }
  },
  methods: {
    init () {
      this.current = 0
      this.setRouter(this.data[0])
    },
    _ItemClick (item, index) {
      this.current = index
      this.setRouter(item)
    },
    _FuncItemClick (item, index) {
      this.funcCurrent = index
      this.$router.push(item.path)
    },
    setRouter (item) {
      if (item.children && item.children.length) {
        this.funcCurrent = 0
        this.$router.push(item.children[0].path)
      } else {
        this.$router.push(item.path)
      }
    },
    setCurrent () {
      this.data.forEach((item, idx) => {
        const reg = new RegExp('^' + item.path)
        if (this.$route.path.match(reg)) {
          this.current = idx
          const funcs = this.data[this.current].children
          if (funcs && funcs.length) {
            funcs.forEach((func, i) => {
              const reg = new RegExp('^' + func.path)
              if (this.$route.path.match(reg)) {
                this.funcCurrent = i
              }
            })
          }
        }
      })
    }
  },
  created () {
    this.setCurrent()
  },
  watch: {
    '$route': function () {
      this.setCurrent()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@assets/styles/define.scss';

.module-menu{
  background: #fff;
  list-style: none;
  overflow: hidden;
  height: 40px;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.04);
  border-bottom: 1px solid $border;
  position: relative;
  user-select: none;

  >li{
    position: relative;
    float: left;
    padding: 0 20px;
    cursor: pointer;

    >span{
      display: inline-block;
      height: 40px;
      line-height: 40px;
      font-size: 13px;
    }

    >i{
      font-size: 14px;
      margin-right: 5px;
      color: $green;
    }

    >ul{
      overflow: hidden;
      display: inline-block;
      height: 40px;
      list-style: none;
      vertical-align: top;
      
      >li{
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        padding: 0 10px;
        color: #aaa;

        &.active{
          border-bottom: 3px solid $green;
        }
      }
    }

    &::after{
      content: '';
      display: block;
      position: absolute;
      width: 1px;
      top: 12px;
      bottom: 12px;
      right: 0px;
      background: #ccc;
    }

    &.active{
      >span{
        &.module{
          color: $green;
          font-weight: bold;
        }
      }
    }

    &:hover{
      >span{
        &.module{
          color: $green;
          font-weight: bold;
        }
      }
    }

    &:last-child{
      &::after{
        content: '';
        display: none;
      }
    }
  }
}
</style>
