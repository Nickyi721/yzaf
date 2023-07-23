<template>
  <div class="unit-detail">
    <!-- title -->
    <div class="unit-title-bar">
      <div class="unit-flag" :class="flagColor" @click="_ExpandClick">
        <span>
          <CustomIcon :name="isExpand ? 'collapse' : 'expand' " />
        </span>
        <span>{{type}} {{idx ? '#' + idx : ''}}</span>
      </div>
      <div class="unit-title">{{content['tcXxbtShow']}}</div>
      <div class="unit-control" v-if="isExpand">
        <el-button :disabled="content['tnYqzt'] === 1" @click="_ButtonClick" size="mini" icon="el-icon-edit">阅签</el-button>
      </div>
    </div>

    <!-- info -->
    <div class="unit-info" v-if="isExpand">
      <div class="unit-info-item">
        <div class="unit-info-label">案件类型</div>    
        <div class="unit-info-content">{{content['tcXxlxmc']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">案发时间</div>    
        <div class="unit-info-content">{{content['tdAfrq']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">案发部位</div>    
        <div class="unit-info-content">{{content['tcAfbwmc']}}</div>
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">案发部位所属</div>    
        <div class="unit-info-content">{{content['tcAfbwssmc']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">案发单位</div>    
        <div class="unit-info-content">{{content['tcSbdwmc']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">上报时间</div>    
        <div class="unit-info-content">{{content['tdSbsj']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">涉案金额</div>    
        <div class="unit-info-content">{{content['tcSaje']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">人员伤亡</div>    
        <div class="unit-info-content">{{content['tcRysw']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">邮件损失情况</div>    
        <div class="unit-info-content">{{content['tcYjssqk']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">作案人类型</div>    
        <div class="unit-info-content">{{content['tcZalxmc']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">情况说明</div>    
        <div class="unit-info-content">{{content['tcQksm']}}</div>    
      </div>

      <div class="unit-info-item">
        <div class="unit-info-label">附件</div> 
        <div class="unit-info-content">
          <CommonFileDownload :list="content.fileList" :disabled="true"></CommonFileDownload> 
        </div>
      </div>

      <!-- <div class="unit-info-item">
        <div class="unit-info-label">事件状态</div>    
        <div class="unit-info-content">{{content['tnSjztmc']}}</div>    
      </div> -->

      <div class="unit-info-item" v-if="content['tcYqyj']">
        <div class="unit-info-label">阅签意见</div>    
        <div class="unit-info-content">{{content['tcYqyj']}}</div>    
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
    type: String,
    idx: Number,
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
  computed: {
    flagColor () {
      return {
        'color-yellow': this.type === '续报',
        'color-orange': this.type === '初报',
      }
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

.unit-detail{
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
        &.unit-info-content{
          width: calc(100% - 120px);
        }
      }
      
    }
  }
}
</style>
