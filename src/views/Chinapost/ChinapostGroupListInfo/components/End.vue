<template>
  <div class="unit-end">
    <!-- title -->
    <div class="unit-title-bar">
      <div class="unit-flag" @click="_ExpandClick">
        <span>
          <CustomIcon :name="isExpand ? 'collapse' : 'expand' " />
        </span>
        <span>完结信息</span>
      </div>
    </div>

    <!-- info -->
    <div class="unit-info" v-if="isExpand">
      
      <div class="unit-info-item">
        <div class="unit-info-label">完结情况说明</div>    
        <div class="unit-info-content">{{content['tcWjsm']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">事故报告书</div>    
        <!-- <div class="unit-info-content"></div>     -->
        <CommonFileDownload :list="content.fileList" :disabled="true"></CommonFileDownload>
      </div>
    </div>
  </div>
</template>

<script>
import Mixin from "@mixins";

export default {
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    },
    expand: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isExpand: this.expand
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('check', this.content)
    },
    _ExpandClick () {
      this.isExpand = !this.isExpand
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";

.unit-end{
  margin: 0 60px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid $border-light;
  border-radius: 4px;

  .unit-title-bar{
    &::after{
      content: '';
      display: block;
      clear: both;
    }

    .unit-flag{
      float: left;
      width: 100px;
      position: relative;
      color: #fff;
      overflow: hidden;
      padding: 5px 10px;
      margin-left: -11px;
      user-select: none;
      font-size: 13px;

      >span{
        position: relative;
        z-index: 2;
        cursor: pointer;

        &:first-child{
          margin-right: 8px;
          display: inline-block;
          background: rgba(0, 0, 0, 0.1);
          width: 16px;
          height: 16px;
          line-height: 16px;
          border-radius: 100%;
          text-align: center;
          >i{
            color: #fff;
            font-size: 12px;
            margin-left: -2px;
            margin-top: -2px;
          }
        }
      }

      

      &::after{
        content: '';
        display: block;
        background: $green;
        width: 100%;
        height: 100%;
        position: absolute;
        left: -5px;
        top: 0;
        transform: skewX(-15deg);
        border-radius: 4px;
        background: $green;
        z-index: 1;
      }

      &.color-yellow{
        &::after{
          background: $warn;
        }
      }
      &.color-orange{
        &::after{
          background: $orange;
        }
      }
    }
    .unit-title{
      float: left;
      padding: 5px;
      
    }
    .unit-control{
      float: right;
    }
  }

  .unit-info{
    padding-top: 20px;
    .unit-info-item{
      font-size: 14px;
      overflow: hidden;
      margin-bottom: 10px;
      >*{
        float: left;
        &.unit-info-label{
          width: 120px;
          text-align: right;
          padding-right: 10px;
          color: $text-light;
        }
      }
      
    }
  }
}
</style>
