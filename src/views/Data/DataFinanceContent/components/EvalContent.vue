<template lang="html">
  <div class="eval-row">
    <div class="eval-row-title">
      <span>{{index + 1}} - {{content.tcPgnr}}</span>
      <span><slot></slot></span>
    </div>
    <div class="eval-row-content">
      <p class="eval-item">扣分标准：<span class="eval-score">{{content.tnKfbz}}分</span></p>
      <p class="eval-item">扣分原因：<span v-for="(item, idx) in content.wtfzDto" :key="idx"><span>{{idx + 1}}.</span> {{item.tcWtms}}</span></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    content: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@assets/styles/define.scss';

.eval-row{
  padding: 10px;
  border-bottom: 1px solid #bbe2c8;
  font-size: 12px;
  background: #fff;
  .eval-row-title{
    margin-bottom: 10px;
    font-size: 14px;
    >span{
      display: inline-block;
      vertical-align: middle;
      &:nth-child(1){
        width: 80%;
        padding-right: 33px;
      }
      &:nth-child(2){
        text-align: right;
        float: right;
        width: 20%;
      }
    }
  }
  .eval-row-content{
    .eval-item{
      margin-bottom: 10px;
      >span{
        display: inline-block;
        margin-right: 10px;
        >span{
          color: $green;
        }
      }
    }
    .eval-score{
      color: $green;
    }
  }
}
</style>
