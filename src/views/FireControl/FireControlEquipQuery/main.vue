<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000408" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>
    
     <div slot="top" v-if="currentOrg">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" />
      <InfoCard :infoCardShow="infoCardShow" :title="currentOrg.name" :info="currentOrg"/>
      <el-tabs v-if="currentOrg && type==1" v-model="activeTab" @tab-click="_TabClick">
        <el-tab-pane :label="tab.tcSjnr" v-for="(tab, $index) in equipType" :key="$index"></el-tab-pane>
      </el-tabs>

      <!-- <CustomToolbar>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
        <CustomButton icon="add" text="新增" @click="dialogFormVisible = true" />
        <template>
        <el-dialog title="请选择新增设备类型" :visible.sync="dialogFormVisible" :modal="false" style="width:50%;margin:0 auto;">
          <el-form :model="formData">
            <el-form-item label="设备类型" :label-width="formLabelWidth">
              <el-select v-model="formData.sblx" placeholder="请选择新增设备类型">
                <el-option v-for="option in options['1002']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="_ButtonSaveClick()">确 定</el-button>
          </div>
        </el-dialog>
        </template>
      </CustomToolbar>-->
    </div>
    <DataGrid v-if="currentOrg" :currentType="currentType" :currentOrg="currentOrg" :detailType="detailType" :detailTypeText="detailTypeText" :config="config[currentType]" :list="list" @dblclick="_DataGridDblClick" @selection-change="_GridSelectionChange"/>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import InfoCard from './components/InfoCard.vue'
import Moment from 'moment'

export default {
  name: 'FireControlEquipQuery',
  mixins: [
    Mixin.init,
  ],
  components: {
    DataGrid,
    InfoCard,
    DataFilter
  },
  data () {
    return {
      dict: ['100206'],
      equipTypeSet: [],
      equipType: [],
      currentType: '',
      currentTypeText: '',
      detailType: '',
      detailTypeText: '',
      activeTab: '',
      config: {},
      list: [],
      selection: [],
      currentOrg: {},
      type: 1,
      isFirstEnter: true,
      tempCurrentType: '',
      tempCurrentTypeText: '',
      infoCardShow: true,

      
      dialogFormVisible: false,
      formData: {
        name: '',
        sblx: '',
        type: [],
      },
      options: {
      },
      formLabelWidth: '120px',
      query: {}
    }
  },
  methods: {
    $init (options) {
      if (options && options['100206']) {
        this.options=options
        this.dialogFormVisible=false
        this.equipTypeSet = options['100206']
        this.equipType = this.equipTypeSet.filter(item => item.tcSjubm !== '030108' && item.tcSjubm !== '030109')
        this.currentType = this.equipType[0].tcSjubm
        this.tempCurrentType = this.equipType[0].tcSjubm
        this.currentTypeText = this.equipType[0].tcSjnr
        this.tempCurrentTypeText = this.equipType[0].tcSjnr
      }
      this.getEquipConfig()
      this.getEquipData()
    },
    //点击查询按钮
    _DataFilterQuery(query) {
      this.query = query
      this.getEquipConfig()
      this.getEquipData()
    },
    // 事件 - 树节点点击
    _OrgTreeClick (node) {
      /*  原来的写法，浅拷贝，后续修改了对象的属性，会导致错误
        this.currentOrg = node
      */
      this.currentOrg = JSON.parse(JSON.stringify(node))
      this.type = this.currentOrg.type == 2 ? 2 : 1
      if(this.type == 2) {
        this.currentType = node.id
        this.currentOrg.id = node.dwbm
        if (this.currentType === '030106') {
          this.detailType = '030108'
          this.detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.detailType)[0].tcSjnr
        } else if (this.currentType === '030107') {
          this.detailType = '030109'
          this.detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.detailType)[0].tcSjnr
        } else {
          this.detailType = ''
          this.detailTypeText = ''
        }
        this.infoCardShow = false
        // this.currentTypeText = node.name
      } else {
        this.infoCardShow = true
        this.currentType = this.tempCurrentType
      }
      this.getEquipData()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      this.type = this.currentOrg.type == 2 ? 2 : 1
      this.getEquipData()
      // this.dwbm = node.id
      // if (node) {
      //   if(node.jgtype==='1'){//1为单位2为安保机构
      //     this.type = 'grid'//显示列表
      //     this.getSecurityOrgList()
      //   }
      //   if(node.jgtype==='2'){
      //     this.type = 'item'//显示机构详细信息
      //     this.getSecurityOrgInfo()
      //   }
      // }
    },
    // _ButtonSaveClick () {
    //   this.saveListData()
    //   //this.dialogFormVisible = false
    // },
    // 事件 - 选项卡切换
    _TabClick () {
      this.currentType = this.equipType[this.activeTab].tcSjubm
      this.currentTypeText = this.equipType[this.activeTab].tcSjnr
      this.tempCurrentType = this.equipType[this.activeTab].tcSjubm
      this.tempCurrentTypeText = this.equipType[this.activeTab].tcSjnr

      if (this.currentType === '030106') {
        this.detailType = '030108'
        this.detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.detailType)[0].tcSjnr
      } else if (this.currentType === '030107') {
        this.detailType = '030109'
        this.detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.detailType)[0].tcSjnr
      } else {
        this.detailType = ''
        this.detailTypeText = ''
      }

      this.getEquipData()
    },
    // 事件 - 表格双击
    _DataGridDblClick (row) {
      this.$router.push({
        path: '/firecontrol/equip/querydetail',
        query: {
          type: 'update',
          orgId: this.currentOrg.id,
          orgName: this.currentOrg.name,
          equipType: row.tcXxxlx,
          equipTypeText: this.currentTypeText,
          equipOrder: row.tnYwpc,
          detailType: this.detailType,
          detailTypeText: this.detailTypeText,
          curType: 'dbClick',
          sfDcjj: row[16],
          sfFuncTest: row.tcGnjcxxxlx ? '是' : '否',
          tnYwpc: row.tnYwpc
        }
      })
    },
    // 事件 - 表格勾选
    _GridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件 - 新增按钮点击
    // _ButtonAddClick () {
    //   this.$router.push({
    //     path: '/firecontrol/equip/detail',
    //     query: {
    //       type: 'add',
    //       orgId: this.currentOrg.id,
    //       orgName: this.currentOrg.name,
    //       equipType: this.currentType,
    //       equipTypeText: this.equipType[this.activeTab].tcSjnr,
    //     }
    //   })
    // },
    // _ButtonDeleteClick () {
    //   if (this.selection.length) {
    //     this.$confirm('是否删除所选数据？').then(() => {
    //       this.deleteEquipData(this.selection.filter(item => item.tnYwpc).map(item => item.tnYwpc))
    //     }).catch(err => { })
    //   } else {
    //     this.$msgbox({
    //       message: '请选择数据',
    //       type: 'warning'
    //     })
    //   }
    // },
     // 保存关联信息
    // async saveListData () {
    //   const list = this.list.filter(row => row.facilityType)
    //   if(this.formData.sblx===''){
    //     this.$msgbox({
    //       message:'设备类型信息项不能为空',
    //       type: 'warning'
    //     })
    //   }
       
    //   else {
    //       this.$router.push({
    //         path: '/firecontrol/equip/detail',
    //         query: {
    //           type: 'add',
    //           orgId: this.currentOrg.id,
    //           orgName: this.currentOrg.name,
    //           equipType:this.formData.sblx,
    //           //equipTypeText: this.equipType[this.activeTab].tcSjnr,
    //         }
    //       }) 
    //       this.dialogFormVisible = false
    //   }
    // },
    async getEquipConfig () {
      const result = await Model.getEquipConfig()
      if (result.data) {
        this.config = result.data
      }
    },
    // async deleteEquipData (selection) {
    //   const result = await Model.deleteEquipData({
    //     tnDllx: 0,
    //     tcXxxlx: this.currentType,
    //     tcSsdwdm: this.currentOrg.id,
    //     tnYwpc: selection.length ? selection : null
    //   })

    //   if (result.state === '1') {
    //     this.$message({
    //       message: '删除成功!',
    //       type: "success",
    //       duration: 1000,
    //       customClass: "middle",
    //       showClose: true,
    //     })
    //     this.getEquipData()
    //   }
    // },
    async getEquipData () {
      const result = await Model.getEquipData({
        tnDllx: 0,
        tcXxxlx: this.currentType,
        tcSsdwdm: this.currentOrg.id,
        ...this.query
      })
      if (result.data) {
       this.list = this.processData(result.data)  
      }
    },
    processData (listData) {
      const data = {}
      listData.forEach(item => {
        data[item.tnYwpc] = data[item.tnYwpc] || []
        data[item.tnYwpc].push(item)
      })
      return Object.keys(data)
        .map(key => data[key])
        .sort((a, b) => b.tnYwpc - a.tnYwpc)
        .map(fields => {
          const data = {}
          fields.forEach(item => {
            let value
            if (typeof item.tcZfclxsj !== 'undefined') {
              value = item.tcZfclxsj
            }
            if (typeof item.tnSzzxsj !== 'undefined') {
              value = item.tnSzzxsj
            }
            if (typeof item.tnFdxsj !== 'undefined') {
              value = item.tnFdxsj
            }
            data[item.tnLbtid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          data.tcXxxlx= fields[0].tcXxxlx
          data.tcEwmmc= fields[0].tcEwmmc
          data.tnWxzt= fields[0].tnWxzt
          data.tcSbid= fields[0].tcSbid
          data.tnGnjcywpc= fields[0].tnGnjcywpc
          data.tnGnjcwxzt= fields[0].tnGnjcwxzt
          data.tcGnjcxxxlx= fields[0].tcGnjcxxxlx
          data.tcCjrmc= fields[0].tcCjrmc
          data.tdCjsj= Moment(fields[0].tdCjsj).format('YYYY-MM-DD')
          return data
        })
    },
    refresh () {
      this.getEquipData()
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      if (this.currentType && this.currentOrg) {
        this.refresh()
      }
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
