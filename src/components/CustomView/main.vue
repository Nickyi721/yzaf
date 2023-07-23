<template>
  <div class="custom-view">
    <!-- location -->
    <div class="view-location" v-if="location.length" ref="location">
      <span class="btn-back" @click="_ButtonClick"><CustomIcon name="back"/></span>
      <template v-for="(item, idx) in location">
        <span class="title" @click="_TextClick(item.path)">{{item.text}}</span>
        <CustomIcon class="spacer" name="right" v-if="idx !== location.length - 1"/>
      </template>
      <slot name="view-title-right"></slot>
    </div>
    <div class="view-content" :style="{ 'paddingTop': locationHeight + 'px' }" @mousedown="_MouseDown" @mousemove="_MouseMove" @mouseup="_MouseUp">
      <!-- side slot -->
      <div class="view-side" :style="styleObject" v-if="$slots.side" ref="side">
        <slot name="side"></slot>
        <div class="view-resize"></div>
      </div>
      <div class="view-main" ref="bodyRight" :style="bodyStyle">
        <!-- top slot -->
        <div class="view-top" v-if="$slots.top" ref="top">
          <slot name="top"></slot>
        </div>
        <!-- default slot -->
        <div class="view-body" :style="{
          'paddingTop': topHeight + 'px',
          'paddingBottom': bottomHeight + 'px',
        }">
          <slot></slot>
        </div>
        <!-- bottom slot -->
        <div class="view-bottom" v-if="$slots.bottom" ref="bottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomView',
  props: {
    back: Object,
    location: {
      type: Array,
      default: () => []
    },
    isFinshed: {
      type: Boolean,
      default: true
    }
  },
  data () {
    const marginLeft = this.$slots.side ? '256px' : '0px'
    return {
      locationHeight: 0,
      topHeight: 0,
      bottomHeight: 0,
      styleObject: {
        width: '256px'
      },
      bodyStyle: { marginLeft },
      isDown: false
    }
  },
  methods: {
    setDomSize () {
      setTimeout(() => {
        this.locationHeight = (this.location.length && this.$refs.location) ? this.$refs.location.offsetHeight : 0
        this.topHeight = (this.$slots.top && this.$refs.top) ? this.$refs.top.offsetHeight : 0
        this.bottomHeight = (this.$slots.bottom && this.$refs.bottom) ? this.$refs.bottom.offsetHeight : 0
      }, 0)
    },
    _ButtonClick () {
      if (this.back) {
        this.$router.push(this.back)
      } else {
        if(this.location[0].text === '消防信息录入' && !this.isFinshed) {
          this.$confirm('返回会丢失已经填写信息，是否确认退出？').then(() => {
            this.$router.go(-1)
          }).catch(() => {})
        } else {
          this.$router.go(-1)
        }
      }
    },
    _TextClick (path) {
      path && this.$router.push(path)
    },
    _MouseDown(e) {
      if (e.target.className === 'view-resize') {
        this.isDown = true
        this.startX = e.pageX
      }
    },
    _MouseMove(e) {
      if (this.isDown) {
        const moveX = 256 + e.pageX - this.startX
        let posX = moveX

        if (moveX > 400) {
          posX = 400
        } else if (moveX < 256) {
          posX = 256
        }
        this.styleObject.width = posX + 'px'
        this.bodyStyle.marginLeft = posX + 'px'
      }
    },
    _MouseUp(e) {
      this.isDown = false      
    },
  },
  mounted () {
    this.setDomSize()
    window.addEventListener('resize', () => {
      this.setDomSize()
    })
  },
  updated () {
    this.setDomSize()
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/define.scss";
.custom-view {
  height: 100%;
  position: relative;
  background: #fff;

  > .view-location {
    position: absolute;
    z-index: 900;
    left: 0;
    right: 0;
    top: 0;
    height: 38px;
    line-height: 38px;
    padding: 0 10px;
    font-size: 14px;
    border-bottom: 1px solid $border;
    background: #f5f5f5;
    color: $text;
    vertical-align: middle;

    .btn-back{
      cursor: pointer;
      display: inline-block;
      width: 24px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      margin-right: 5px;
      color: $gray;
      vertical-align: middle;

      i{
        display: inline-block;
        font-size: 17px;
      }
    }

    .spacer{
      color: #999;
      margin-right: 10px;
      font-size: 12px;
    }

    .title{
      margin-right: 10px;
    }
    .des{
      color: #999;
    }
  }

  > .view-content {
    position: relative;
    height: 100%;
    > .view-side {
      position: absolute;
      z-index: 999;
      left: 0px;
      top: 0px;
      bottom: 0px;
      border-right: 1px solid $border;
      box-shadow: 2px 0px 6px rgba(0, 0, 0, 0.04)!important;
      width: 256px;
      padding-right: 5px;
      

      .view-resize{
        position: absolute;
        content: '';
        display: block;
        top: 0;
        bottom: 0;
        right: 0;
        width: 5px;
        border-left: 1px solid $border-light;
        cursor: e-resize;
      }
    }

    > .view-main {
      position: relative;
      height: 100%;

      > .view-top {
        position: absolute;
        z-index: 990;
        left: 0;
        top: 0;
        right: 0;
      }

      > .view-bottom {
        position: absolute;
        z-index: 990;
        left: 0;
        bottom: 0;
        right: 0;
      }

      > .view-body {
        height: 100%;
        overflow-y: auto;
        position: relative;
      }
    }
  }
}
</style>
