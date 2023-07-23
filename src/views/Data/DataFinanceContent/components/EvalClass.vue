<template lang="html">
  <div class="eval-class">
    <span>{{index + 1}} - {{content.tcPgnr}} （{{content.tnKfbz}}分）</span>
    <span><slot></slot></span>
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

.eval-class{
  padding: 5px 10px;
  border-bottom: 1px solid #bbe2c8;
  font-size: 14px;
  background: #eaf6ee;
  overflow: hidden;
  line-height: 28px;
  font-weight: bold;
  color: $green;

  >span{
    display: block;
    float: left;
    &:nth-child(2){
      float: right;
    }
  }
}
</style>
