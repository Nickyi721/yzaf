<template>
  <div class="c-watch">
    <span class="icon">n</span><span class="value">未完成评估数</span>
    <img src="~@assets/tips.gif"/><span class="value">未评或不合格</span> 
    <img src="~@assets/good.png"/><span class="value">评分合格</span> 
    <img src="~@assets/tips2.gif"/><span class="value">平均分不合格</span> 
    <img src="~@assets/good2.png"/><span class="value">平均分合格</span>
  </div>
</template>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";

.c-watch {
  padding: 8px 10px;
  border-bottom: 1px solid $border-light;
  .icon {
    display: inline-block;
    vertical-align: middle;
    height: 16px;
    min-width: 16px;
    padding: 0 3px;
    border-radius: 4px;
    background: $warn;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: $bg !important;
  }
  .value {
    margin: 0 15px 0 5px;
    font-size: 12px;
    color: $text-light;
  }

  img {
    width: 15px;
    height: 15px;
    vertical-align: middle;
  }
}
</style>
