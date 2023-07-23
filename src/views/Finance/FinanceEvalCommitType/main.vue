<template>
  <CustomView :location="[{ text: '设置评分表' }]">
    <div slot="top">
      <CustomToolbar>
        <span slot="left">{{$route.query.orgName}}</span>
        <CustomButton icon="save" text="保存" @click="_ButtonClick"/>
      </CustomToolbar>
    </div>
    <!-- 表格 -->
    <DataGrid ref="table" :selectedIds="selected" :list="list" @selection-change="_TableSelectionChange"/>  
  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import DataGrid from './components/DataGrid.vue'

export default {
  mixins: [
    Mixin.init, 
  ],
  components: {
    DataGrid
  },
  data () {
    return {
      dict: ['0310'],
      list: [],
      selection: [],
      selected: []
    }
  },
  methods: {
    $init(options) {
      this.list = options['0310']
      this.getList()
    },
    // 事件-行选
    _TableSelectionChange (selection) {
      this.selection = selection
    },
    async _ButtonClick() {
      if (this.selection.length !== 0) {
        const tcXxx = this.selection.map(item => ({
          tcXxxlx: item.tcSjubm,
          tcXxxlxmc: item.tcSjnr,
        }))
        const result = await Model.saveEvalList({
          requestData: {
            tcDwbm: this.$route.query.orgCode,
            tcXxx: tcXxx
          }
        })
        if (result.state === '1') {
          this.$message({
            message: '设置成功!',
            type: 'success',
            showClose: true,
            duration: 1500,
            customClass: 'middle',
            onClose: () => {
              // if(this.$route.query.type !== 'setting') {
              //   this.$router.push({
              //     path: '/finance/eval/form',
              //     query: {
              //       orgCode: this.$route.query.orgCode,
              //       orgName: this.$route.query.orgName,
              //       isGroup: this.$route.query.isGroup,
              //       tnPgztid: this.$route.query.tnPgztid,
              //       jumpMode: 'button',
              //       pgsjbzw: this.$route.query.pgsjbzw,
              //       tcPgrid: this.$route.query.tcPgrid
              //     }
              //   })
              // } else {
              //   this.$router.push({
              //     path: '/finance/eval/commit',
              //   })
              // }
              this.$router.push({
                path: '/finance/eval/commit',
              })
            }
          })
        }
      } else {
        this.$alert('请至少勾选一种评估类型！')
      }
    },
    async getList() {
      this.selected = []
      const result = await Model.getList(this.$route.query.orgCode)
      this.selected = result.data || []
    },
  },
}
</script>

<style scoped>
  .tips {
    position: relative;
    font-size: 14px;
    color: red;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    margin-right: 30px;
    font-weight: bold;
  }
</style>

