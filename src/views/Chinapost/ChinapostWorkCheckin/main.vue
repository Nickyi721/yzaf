<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <CustomToolbar>
        <CustomButton icon="add" text="新增" @click="_ButtonClick"/>
      </CustomToolbar>
    </div>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick">
      
    </DataGrid>

    <!-- 设置年度重点工作 -->
    <CustomDialog title="新增年度重点工作" :visible="dlgVisble" @open="_DlgAddOpen" @close="dlgVisble = false">
      <el-form ref="typeForm" :rules="typeRules" :model="formData" label-position="top" class="common-form common-form-dlg">
        <el-form-item label="年度" prop="tcNd">
          <el-date-picker clearable v-model="formData['tcNd']" type="year" size="mini" placeholder="选择年度"></el-date-picker>
        </el-form-item>
        <el-form-item label="重点工作说明" prop="tcGznr">
          <el-input type="textarea" rows="3" v-model="formData['tcGznr']" size="mini" placeholder="请输入重点工作说明"></el-input>
        </el-form-item>

        <el-form-item label="附件"> 
          <el-upload class="upload-demo" 
            action='' 
            :http-request="(param) => _requestFile(param)"
            :auto-upload="true"
            :show-file-list='true'>
            <el-button size="mini" type="default">上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="_ButtonDlgSaveClick">确定</el-button>
        </el-form-item>
      </el-form>
    </CustomDialog>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'

// 页面组件
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'ChinapostWorkCheckin',
  mixins: [
    Mixin.init, 
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      list: [],
      dlgVisble: false,
      typeRules: {
        tcNd: [
          Validator.required('请选择年度'),
        ],
        tcGznr: [
          Validator.required('请输入重点工作说明'),
          Validator.length(5, 600)
        ]
      },
      formData: {},
      xtFjList: [],
      isFirstEnter: true
    }
  },
  methods: {
    $init(options) {
      this.getList()
    },
    // 新增
    _ButtonClick() {
      this.dlgVisble = true
    },
    // 新增确定
    _ButtonDlgSaveClick() {
      this.$refs.typeForm.validate(async (valid, obj) => {
        if (valid) {
          const result = await Model.addYearWork({
            isQuery: 0,
            cdId: '0004090102',
            requestData: {
              tcNd: this.formData.tcNd.getFullYear().toString(),
              tcGznr: this.formData.tcGznr,
              xtFjList: this.xtFjList
            }
          })
          if(result.state === '1') {
            this.dlgVisble = false
            this.$message({
              message: '保存成功！',
              type: 'success',
              customClass: "middle",
            })
            this.getList()
          }
          this.$refs.typeForm.clearValidate()
          this.dlgTypeVisble = false
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    _DataGridDblClick(row) {
      this.$router.push({
        path: '/chinapost/work/checkin/commit',
        query: {
          year: row.tcNd
        }
      })
    },
    _requestFile(param) {
      var fileObj = param.file
      this.file = fileObj
      var form = new FormData()    // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId',window.sessionStorage.sessionId)
      form.append('lylx',0),
      form.append('cdId','0004090102')
      form.append('isQuery', 0)
      form.append('isVideo', 0)
      const isLt2M = param.file.size / 1024 / 1024 < 200;
      if(isLt2M) {
        this.uploadFile(form,fileObj.name)
      } else{
        this.$msgbox({
          message: '上传附件大小不能超过 200MB!',
          type: 'warning'
        })
      }
    },
    async uploadFile(data, name) {
      const result = await Model.uploadFile(data);
      if (result.state === "1") {
        this.$message({
          message:'上传成功!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
        const wjmc = result.data.split(",")
        let fileObj = {
          tcYwjmc: wjmc[0],
          tcXwjmc: wjmc[1]
        }
        this.xtFjList.push(fileObj)
      }else{
        this.$message({
          message:'上传失败!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
      }
    },
    async getList() {
      const result = await Model.getList({
        isQuery: 1,
        cdId: '0004090102',
        requestData: {}
      })
      if(result.data) {
        this.list = result.data
      }
    },
    _DlgAddOpen () {
      // this.$refs.typeForm.reset();
      this.formData = {}  
      // this.$refs.typeForm.clearValidate()
    },
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
