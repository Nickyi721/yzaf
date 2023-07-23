<template lang="html">
  <el-dialog :visible.sync="dlgVisable" @close="_DialogClose" class="custom-dialog" :width="width" :top="top" :modal="modal" :append-to-body="true">
    <div class="custom-dialog-title" slot="title">
      <CustomIcon name="popup"/>
      <span>{{title}}</span>
    </div>
    <div class="custom-dialog-content">
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CustomDialog',
  props: {
    title: String,
    visible: Boolean,
    modal: {
      type: Boolean,
      default () {
        return true
      }
    },
    width: String,
    top: String
  },
  data () {
    return {
      dlgVisable: this.visible
    }
  },
  watch: {
    visible () {
      this.dlgVisable = this.visible
      if (this.dlgVisable) {
        this.$nextTick(() => {
          this.$emit('open')
        })
      }
    }
  },
  methods: {
    _DialogClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/styles/define.scss";

.custom-dialog {
  .custom-dialog-title {
    font-size: 15px !important;
    color: $green;

    i {
      margin-right: 5px;
      color: $gray;
    }
  }
  .custom-dialog-content {
    max-height: 500px;
    overflow-y: auto;
    margin: -10px;
  }
  .el-dialog__header {
    padding: 10px !important;
    border-bottom: 1px solid $border;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04) !important;
  }
  .el-dialog__body {
    padding: 10px !important;
  }
  .el-dialog__headerbtn {
    top: 10px !important;
    right: 10px !important;
    &:hover .el-dialog__close{
      color: $green!important
    }
  }
}
</style>
