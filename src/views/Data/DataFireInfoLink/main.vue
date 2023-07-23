<template>
  <CustomView>
    <CustomToolbar slot="top">
      <!---select slot="left" v-model="evalType" size="mini" @change="_SelectEvalTypeChange">
        <el-option v-for="option in options['evalType']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>-->
      <CustomButton icon="add" text="新增" @click="_ButtonAddClick()"/>
      <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick()"/>
      <template>
      <el-dialog title="请关联功能检查设置" :visible.sync="dialogFormVisible"  :modal="false" style="width:50%;margin:0 auto;">
      <el-form :model="formData" >
      <el-form-item label="运行情况信息项" :label-width="formLabelWidth">
          <el-select v-model="formData['tcYxqkxxxlx']" placeholder="请选择运行情况信息">
             <el-option v-for="option in options['100201']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能检查信息项" :label-width="formLabelWidth">
          <el-select v-model="formData['tcGnjcxxxlx']" placeholder="请选择功能检查信息">
             <el-option v-for="option in options['100205']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="_ButtonSaveClick()">确 定</el-button>
      </div>
    </el-dialog>
      </template>
    </CustomToolbar>

    <!--<div class="common-editable">
      <el-table @dblclick="_DataGridDblClick" stripe border height="100%" :data="list" size="mini" class="grid-table" header-cell-class-name="grid-table-hd">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="tcXxxmc" label="表头类型" min-width="200px"></el-table-column>
        <el-table-column prop="tnXxxsjlx" label="表信息类型" >
          <span  slot-scope="scope">{{dataEnum.type[scope.row.tnXxxsjlx]}}</span>
        </el-table-column>
      </el-table>
    </div>-->

    <DataGrid :list="list"  @selection-change="_DataGridSelectionChange">
      <!--<CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>-->
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

// 页面组件
export default {
  name: 'DataFireInfoLink',
  mixins: [
    Mixin.init,
  ],
  components: {
    DataFilter,
    DataGrid,
  },
  data () {
    return {
     
      dict: ['1002', '100201','100205'],
      // 下拉选项集合
      options: {
      },
      option2: {
      },
      dataEnum: {
        type: {
          0: '整数',
          1: '字符',
          2: '浮点',
        },
        method: {
          1: '填写',
          2: '单选',
          3: '多选',
          4: '下拉',
          5: '日期',
        }
      },
      list: [],   //表头类型
      list2:[],  //表信息类型
      originList: [],
      evalType: '',
      evalTypeText: '',
      facilityType: {},
      isFirstEnter: true,

      dialogTableVisible: false,
      dialogFormVisible: false,
      formData: {
        name: '',
        tcYxqkxxxlx: '',
         tcGnjcxxxlx:'',
         tcYxqkxxxmc: '',
         tcGnjcxxxmc:'',
        tnLx:1,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      
    }
  },
  
  methods: {
    // 初始化
    $init (options) {
      if (options) {
         //console.log();
        if (options['1002']) {
        console.log(options,'options')
          this.options=options
          console.log(this.options,'this.options')
          // this.options.evalType = options['1002']
          // if (this.options.evalType.length) {
          //   this.evalType = this.options.evalType[0].tcSjubm
          //   this.evalTypeText = this.options.evalType[0].tcSjnr
          //   this.getEvalList()
          // }
          // this.options.facilityType = [{ tcSjubm: '', tcSjnr: '请选择' }].concat(options['0301'])
           this.getEvalList()
        }
      }
    },
    // 事件 - 切换评估类型
    // _SelectEvalTypeChange (value) {
    //   const idx = this.options.evalType.findIndex(item => item.tcSjubm === value)
    //   this.evalTypeText = this.options.evalType[idx].tcSjnr
    //   this.getEvalList()
    // },
    // async _SelectFacilityTypeChange (row) {
    //   const type = row['facilityType']
    //   row.facilityItem = ''
    //   if (type && typeof this.facilityType[type] === 'undefined') {
    //     const list = await this.getFacilityList(type)
    //     this.$set(this.facilityType, type, list)
    //   } 
    // },
    // createFacilityList (row) {
    //   const list = this.facilityType[row.facilityType] || []
    //   return list.filter(item => (item.tnXxxlrfs === row.tnXxxlrfs) && (item.tnXxxsjlx === row.tnXxxsjlx) && (item.tnXxxsjcd === row.tnXxxsjcd) && (item.tcXxxxxxnr === row.tcXxxxxxnr)) 
    // },
    // 事件 - 点击保存按钮
    _ButtonAddClick () {
      //this.saveListData()
      this.dialogFormVisible=true
      
      //this.getBtlxList()
      //this.getBxxlxList()
    },
    _ButtonSaveClick () {
      this.saveListData()
      //this.dialogFormVisible = false
    },
    _ButtonDeleteClick() {
      if (this.selection.length > 0) {
        this.$confirm('是否删除当前所选数据？').then(() => {
          this.deleteItems(this.selection.map(item => item.tnRcxjpzgjid.toString()))
        }).catch(err => {})
      } else {
        this.$alert('请选择需要删除的数据！').catch(err => {})
      }
    },
    // 事件-双击表格行
    // _DataGridDblClick(row) {
      
    //   this.$router.push({ name: 'DataFireInfoLinkDetail', query: {btxxxlx : row.tcYxqkxxxlx, mxxxxlx: row.tcGnjcxxxlx}}) 
    // },
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    //获取表头类型
    // async getBtlxList () {
    //   const result = await Model.getEvalList(this.evalType)
    //   if (result.data) {
    //     console.log(result.data)
    //     this.list = result.data.map(item => ({
    //       ...item,
    //       facilityType: ''
    //     }))
    //     this.getLinkList()
    //   }
    // },
    //获取表信息类型
    // async getBxxlxList () {
    //   const result = await Model.getEvalList(this.evalType)
    //   if (result.data) {
    //     this.list2 = result.data.map(item => ({
    //       ...item,
    //       facilityType: ''
    //     }))
    //     this.getLinkList()
    //   }
    // },
    async deleteItems (ids) {
      const result = await Model.deleteItems(
        {
        requestData: {
          isQuery:0,  //是否是查询类 0-否 1-是
          cdMc:'设备及故障信息配置', //菜单ID
          cdId:'0004010603',
          deletelist: ids
        }
      })
      if (result) {
        if(result.state == '1'){
          this.$message({
            message: result.msg,
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true,
          })
          this.getEvalList()
        }
      }
    },
    // 获取评估信息项列表
    async getEvalList () {
      const result = await Model.getEvalList(this.evalType)
      if (result.data) {
        //console.log(result.data)
        this.list = result.data.map(item => ({
          ...item,
          facilityType: ''
        }))
        
      }
    },
    // async getFacilityList (type) {
    //   const result = await Model.getFacilityList(type)
    //   return result.data || []
    // },
    // async getLinkList () {
    //   const result = await Model.getLinkList(this.evalType)
    //   const linkData = result.data || []
    //   this.list.forEach(row => {
    //     const idx = linkData.findIndex(item => item.tnPgjbxxbid === row.tnPgjbxxbid)
    //     if (idx >= 0) {
    //       row.facilityType = linkData[idx].tcAfabxxxlx
    //       row.facilityItem = linkData[idx].tnAfabszid
    //     }
    //   })

    //   const types = Array.from(new Set(
    //     this.list
    //     .filter(row => row.facilityType)
    //     .map(row => row.facilityType)
    //     .filter(type => !this.facilityType[type])
    //   ))

    //   if (types.length) {
    //     const results = await Promise.all(types.map(type => this.getFacilityList(type)))
    //     types.forEach((type, idx) => {
    //       this.$set(this.facilityType, type, results[idx])
    //     })
    //   }
    // },
    // 保存关联信息
    async saveListData () {
      const list = this.list.filter(row => row.facilityType)
      //console.log(this.formData)
      if(this.formData.btlx===''){
        this.$msgbox({
          message: '运行情况信息项不能为空',
          type: 'warning'
        })
      }
       else if(this.formData.bxxlx===''){
        this.$msgbox({
          message: '功能检查信息项不能为空',
          type: 'warning'
        })
      }
      else {

        let obj1 = this.options['100205'].find(item=>{
          console.log(item.tcSjubm,'item.tcSjubm')
           console.log(this.formData.tcGnjcxxxlx,'this.formData.tcGnjcxxxlx')
          return item.tcSjubm === this.formData.tcGnjcxxxlx
        })
        console.log(obj1, 'obj1')
        
        this.formData.tcGnjcxxxmc=obj1.tcSjnr

        let obj2 = this.options['100201'].find(item=>{
          return item.tcSjubm === this.formData.tcYxqkxxxlx
        })
        console.log(obj2, 'obj2')
        this.formData.tcYxqkxxxmc=obj2.tcSjnr
        const result = await Model.saveListData({
         requestData:this.formData
         
        })
        if (result.state === '1') {
          this.$message({
            message: '关联信息保存成功',
            duration: 1000,
          })
          this.getEvalList()
        }
         this.dialogFormVisible = false
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.evalType && this.getEvalList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
