<template>
  <ul class="main-menu">
    <li v-for="(item, $index) in data" :key="$index" :class="{'active': $index === current}" @click="_ItemClick(item, $index)">
      <CustomIcon :name="item.icon"/>
      <span>{{item.text}}</span>
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
      current: 0
    }
  },
  methods: {
    _ItemClick (item, index) {
      this.current = index
      this.$emit('click', item)
    },
    setCurrent () {
      if (this.$route.path === '/') {
        this.current = 0
      } else {
        this.data.forEach((item, idx) => {
          const reg = new RegExp('^' + item.path)
          if (this.$route.path.match(reg)) {
            this.current = idx
          }
        })
      }
    }
  },
  mounted () {
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
@import "~@assets/styles/define.scss";

.main-menu{
  background: $green;
  list-style: none;
  overflow: hidden;
  position: relative;
  user-select: none;
  padding-left: 40px;
  
  >li{
    float: left;
    padding: 0 6px;
    margin-right: 8px;
    height: 36px;
    line-height: 36px;
    color: rgba(255,255,255, 0.75);
    cursor: pointer;
    font-size: 14px;

    i{
      font-size: 16px;
      margin-right: 5px;
    }

    &.active{
      background: #fff;
      color: $green;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      &:hover{
        background: #fff;
        color: $green;
      }
    }

    &:hover{
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      color: #fff;
      position: relative;
      background: rgba(0,0,0, 0.1)
    }
  }
}
</style>
