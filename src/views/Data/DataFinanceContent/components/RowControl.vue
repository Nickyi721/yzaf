<template lang="html">
  <div class="row-control">
    <button v-for="btn in buttons" class="row-control-btn" @click="_ButtonClick(btn)" :disabled="setStatus(btn)">
      <CustomIcon :name="btn"/>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    max: Number,
    buttons: Array,
  },
  methods: {
    _ButtonClick (btn) {
      this.$emit('control', btn)
    },
    setStatus (btn) {
      return (btn === 'arrow-down' && this.index === 0) || (btn === 'arrow-up' && this.index === this.max -1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@assets/styles/define.scss';

.row-control{
  button{
    background: #fff;
    height: 28px;
    line-height: 28px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 8px;
    margin: 0 3px;
    outline: none;
    cursor: pointer;
    &:disabled{
      cursor: not-allowed;
      i{
        font-size: 14px;
        color: #ccc;
      }
    }

    i{
      font-size: 14px;
      color: #666;
    }
  }
}

</style>
