<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增安全检查表' : '安全检查表详情'}]">
    <CustomToolbar slot="top">
      <div slot="left" class="top-left">
        <span>检查表名称：</span>
        <el-input size="mini" v-model="bindData['tcAqjcbmc']" placeholder="请设置安全检查表名称"/>
      </div>
      
      <!-- <CustomButton icon="delete" text="删除检查项目" @click="_ButtonDeleteClick"/> -->
      <CustomButton icon="add" v-if="$route.query.type === 'add'" text="添加检查项目" @click="_ButtonAddClick"/>
      <CustomButton icon="save" v-if="$route.query.type === 'add'" text="保存检查表" @click="_ButtonSaveClick"/>
    </CustomToolbar>
    <EditableList :list="bindData.aqjcList" :type="$route.query.type" @selection-change="_EditableListChange" @alterYhct="_alterYhct" @rowDelete="_RowDelete"/>

    <CustomDialog title="选择词条" width="90%" top="40px" :visible="dialogVisible" @close="dialogVisible = false">
      <Danger ref="danger" style="height: 500px" @select="_DangerSelect" :checked="bindData.aqjcList['yhctList']"/>
    </CustomDialog>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import EditableList from './components/EditableList.vue'
import Danger from './components/Danger.vue'
export default {
  components: { EditableList, Danger },
  mixins: [
    Mixin.init,
  ],
  data () {
    return {
      bindData:{
        tcAqjcbmc: '',
        aqjcList: []
      },
      dialogVisible: false,
      currentItemIndex: ''
    }
  },
  methods: {
    $init (options) {
      if (this.$route.query.type === 'update') {
        this.formId = parseInt(this.$route.query.id)
        this.getFormData()
      }
    },
    // 事件 - 点击删除按钮
    _ButtonDeleteClick () {
      if (this.selection.length) {
        this.$confirm('是否删除选中的检查表?').then(() => {
          this.list = this.list.filter(item => this.selection.findIndex(select => select.tnAqjczjid === item.tnAqjczjid) < 0)
        }).catch(() => {})
      } else {
        this.$alert('请选择要删除的检查表').catch(() => {})
      }
    },
    // 事件 - 点击新增按钮
    _ButtonAddClick () {
      this.bindData.aqjcList.push({
        tcJcbxh: (this.bindData.aqjcList.length + 1).toString(),
        tcJcfs: '',
        tcJcqy: '',
        tcJcnr: '',
        tcSfxcjc: '',
        yhctList: []
      })
    },
    //删除安全检查表某一行
    _RowDelete (list) {
      this.bindData.aqjcList = list
    },
    // 事件 - 添加选择项目
    _DangerSelect (selected) {
      this.dialogVisible = false
      // console.log(selected)
      // console.log(this.bindData.aqjcList)
      this.bindData.aqjcList.forEach(el => {
        if(el.tcJcbxh == this.currentItemIndex){
          el.yhctList = el.yhctList.concat(selected)
        }
      })
    },
    // 事件 - 点击保存按钮
    _ButtonSaveClick () {
      if (!this.bindData.tcAqjcbmc) {
        this.$alert('请设置检查表名称').catch(() => {})
      } else if (!this.bindData.aqjcList.length){
        this.$alert('请添加检查表项目').catch(() => {})
      } else if(!this.validateData()){
        this.$alert('请将检查表项目填写完整！').catch(() => {})
      }else{
        this.saveFormData()
      }
    },
    _EditableListChange (selection) {
      this.selection = selection
    },
    validateData(){
      let validate = true
      const data = this.bindData.aqjcList
      const length = data.length
      for(let i = 0; i< length; i++){
        if(data[i].tcJcfs=='' || data[i].tcJcnr=='' || data[i].tcSfxcjc=='' || data[i].yhctList.length <= 0){
          validate = false
        }
      }
      return validate
    },
    _alterYhct(index){
      this.dialogVisible = true
      this.currentItemIndex = index
      if(this.$refs.danger){
        this.$refs.danger.clearSelection()
        this.$refs.danger.selection = []
        this.$refs.danger.selected = []
        this.$refs.danger.query = {}
        this.$refs.danger.$refs.dataFilter.bindData = {}
        this.$refs.danger.getDataList()
      }
    },
    // 保存检查表
    async saveFormData () {
      if(this.bindData.tcAqjcbmc.length > 60){
        this.$alert("安全检查表名称不能超过60字符！")
        return
      }
      const result = await Model.saveFormData({
        isQuery:0,  //是否是查询类 0-否 1-是
	      cdId:'0004010502', //菜单ID
        requestData: this.bindData
      })
      if (result.state === '1') {
        this.$message({
          message: '成功保存检查表',
          duration: 1000,
          onClose: () => {
            // this.getFormData()
            this.$router.go(-1)
          }
        })
      }
    },
    // 查询检查表
    async getFormData () {
      const result = await Model.getFormDetail({
        requestData:{
          isQuery: 1,
          tnAqjcbid: this.formId
        }
      })
      if (result.data) {
        this.bindData.tcAqjcbmc = result.data[0].tcAqjcbmc
        this.bindData.aqjcList = result.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.top-left{
  font-size: 14px;
  white-space: nowrap;
  >*{
    display: inline-block;
  }
}
</style>
