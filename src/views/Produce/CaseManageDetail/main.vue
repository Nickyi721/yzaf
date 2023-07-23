<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增安全生产事故' : '安全生产事故详情'}]">
    <el-form :model="bindData" label-position="top" class="common-form" ref="ruleForm" :rules="rules">
      <el-form-item label="事故类型" prop="tcSglx">
        <el-select clearable v-model="bindData['tcSglx']" size="mini" placeholder="请选择事故类型">
          <el-option v-for="option in optionsType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事故发生时间" prop="tcSgsj">
        <el-date-picker v-model="bindData['tcSgsj']" size="mini" type="datetime" :picker-options="pickerOptions" placeholder="请选择事故发生时间" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
      </el-form-item>
      <el-form-item label="事故发生部位" prop="tcSgbw">
        <el-input v-model="bindData['tcSgbw']" type="text" maxlength="65" size="mini" placeholder="请输入事故发生部位"></el-input>
      </el-form-item>
      <el-form-item label="事故发生单位" prop="tcSgdwmc">
        <el-input readonly v-model="bindData['tcSgdwmc']" size="mini" placeholder="请选择事故发生单位" @focus="formChooseHandle"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="tcBz">
        <el-input type="textarea" v-model="bindData['tcBz']" maxlength="65" placeholder="请输入备注" :rows="3" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="_saveClick">保存</el-button>
      </el-form-item>
    </el-form>


    <!-- 选择参加机构 -->
    <CustomDialog title=" 选择事故单位"  :visible="dialogVisible" @close="closeHandle">
      <CommonOrgTree ref="orgTree" check-strictly content fnCode="000407" style="height: 400px" @click="_OrgTreeRegionClick" />
      <div class="filter-btn" style="text-align:right;padding: 10px;">
        <el-button type="primary" size="mini" @click="_DlgButtonClick">确定</el-button>
      </div>
    </CustomDialog>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'
import Moment from 'moment'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      // 加载数据字典
      dict: ["110201"],
      rules: {
        tcSglx: [
          Validator.required('请选择事故类型')
        ],
        tcSgsj:[
          Validator.required('请选择事故发生时间')
        ],
        tcSgbw:[
          Validator.required('请输入事故发生部位')
        ],
        tcSgdwmc:[
          Validator.required('请选择事故发生单位'),
        ]
      },
      bindData:{
        tcSgdwmc: '',
        tcSgdwdm: ''
      },
      optionsType: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      dlgVisble: false,
      dialogVisible: false,
      sgRegion: {},
    }
  },
  methods: {
    $init(options){
      options["110201"].forEach(element => {
        this.optionsType.push(element);
      });
    },
    _saveClick () {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          this.addData()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    async addData() {
      console.log(this.bindData)
      // 案件类型-名称
      if(this.bindData.tcSglx !== undefined) {
        let objType = this.optionsType.find(item=>{
          return item.tcSjubm === this.bindData.tcSglx  
        })
        this.bindData.tcSglxmc = objType.tcSjnr
      }
      const result = await Model.addSggl({
        cdId: '00040702',
        isQuery: 0,
        requestData: {
          tcSgbw: this.bindData.tcSgbw,
          tcSgfsdwbm: this.bindData.tcSgdwdm,
          tcSgfsdwmc: this.bindData.tcSgdwmc,
          tcSglxbm: this.bindData.tcSglx,
          tcSglxmc: this.bindData.tcSglxmc,
          tcSgsm: this.bindData.tcBz || '',
          tdSgfssj: Moment(this.bindData.tcSgsj, 'YYYY-MM-DD HH:mm').valueOf()
        }
      })
      if(result.state === '1') {
        this.$message({
          message: '新增成功！',
          type: 'success',
          customClass: "middle",
        })
        this.$router.push({ 
          path: '/produce/case/manage',
        })
      }
    },
    formChooseHandle() {
      this.dialogVisible = true
    },
    // 事件-事故单位-点击树节点
    _OrgTreeRegionClick(node) {
      this.sgRegion = node
      if(Object.keys(this.sgRegion).length !== 0) {
        this.$refs.ruleForm.clearValidate(['tcSgdwmc'])
      }
    },
    closeHandle() {
      this.dialogVisible = false
    },
    _DlgButtonClick() {
      this.dialogVisible = false
      this.bindData.tcSgdwmc = this.sgRegion.name
      this.bindData.tcSgdwdm = this.sgRegion.id
    }
  },
  
}
</script>

<style lang="scss" scoped>
  .el-dialog {
    height: 419px;
  }
  /deep/ .el-dialog__body {
    .ctrl {
      text-align: right;
      padding: 10px;
    }
  }
</style>
