<template>
  <CustomView :location="[{ text: '新增隐患词条详情'}]">
    <el-form :model="bindData" label-position="top" class="common-form" ref="form" :rules="rules">
      <el-form-item label="业务条线" prop="tcYwtxid">
        <el-select v-model="bindData['tcYwtxid']" placeholder="请选择业务条线" size="mini">
          <el-option v-for="YwtxType in YwtxTypes" :key="YwtxType.tcSjubm" :label="YwtxType.tcSjnr" :value="YwtxType.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属环节" prop="tcSshjid">
        <el-select v-model="bindData['tcSshjid']" placeholder="请选择所属环节" size="mini">
          <el-option v-for="SshjType in SshjTypes" :key="SshjType.tcSjubm" :label="SshjType.tcSjnr" :value="SshjType.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属类别" prop="tcSslbid">
        <el-select v-model="bindData['tcSslbid']" placeholder="请选择所属类别" size="mini">
          <el-option v-for="SslbType in SslbTypes" :key="SslbType.tcSjubm" :label="SslbType.tcSjnr" :value="SslbType.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查方式" prop="tcJcfsid">
        <el-select v-model="bindData['tcJcfsid']" placeholder="请选择检查方式" size="mini">
          <el-option v-for="JcfsType in JcfsTypes" :key="JcfsType.tcSjubm" :label="JcfsType.tcSjnr" :value="JcfsType.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="词条内容" prop="tcCtnr">
        <el-input type="textarea" v-model="bindData['tcCtnr']" placeholder="请输入词条内容" :rows="5" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="_saveClick">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      rules: {
        tcYwtxid:[
          Validator.required('请选择业务条线')
        ],
        tcSshjid:[
          Validator.required('请选择所属环节')
        ],
        tcSslbid:[
          Validator.required('请选择所属类别')
        ],
        tcJcfsid:[
          Validator.required('请选择检查方式')
        ],
        tcCtnr:[
          Validator.required('请输入词条内容'),
          Validator.length(1, 100)
        ]
      },
      bindData:{
        tcCtnr: '',
        tcYwtxid: '',
        tcSshjid: '',
        tcSslbid: '',
        tcJcfsid: '',
        tcYwtx: '',
        tcSshjmc: '',
        tcSslbmc: '',
        tcJcfsmc: '',
      },
      JcfsTypes:[],
      SslbTypes:[],
      SshjTypes:[],
      YwtxTypes:[],
    }
  },
  methods: {
    $init(){
      this.getJcfsTypes()
      this.getSslbTypes()
      this.getSshjTypes()
      this.getYwtxTypes()
    },
    _saveClick () {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.addData()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    async addData(){
      let obj = this.JcfsTypes.find(item=>{
        return item.tcSjubm === this.bindData.tcJcfsid
      })
      this.bindData.tcJcfsmc = obj.tcSjnr
      let obj1 = this.SslbTypes.find(item=>{
        return item.tcSjubm === this.bindData.tcSslbid
      })
      this.bindData.tcSslbmc = obj1.tcSjnr
      let obj2 = this.SshjTypes.find(item=>{
        return item.tcSjubm === this.bindData.tcSshjid
      })
      this.bindData.tcSshjmc = obj2.tcSjnr
      let obj3 = this.YwtxTypes.find(item=>{
        return item.tcSjubm === this.bindData.tcYwtxid
      })
      this.bindData.tcYwtx = obj3.tcSjnr
      const result = await Model.addData({
        isQuery:0,  //是否是查询类 0-否 1-是
        cdId:'0004010501', //菜单ID
        cdMc:"隐患词条",
        requestData: this.bindData
      })
      if (result.state==="1") {
        this.$message({
          message: '新增成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.$router.push({path: '/data/safe/danger/'})
      }
      // else{
      //   let _this = this
      //   this.$message({
      //     message:'新增失败!',
      //     type:"fail",
      //     duration:2000,
      //     customClass: "middle"
      //   })
      // }
    },
    async getJcfsTypes(){
      const result = await Model.getJcfsTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010501', //菜单ID
        requestData: ''
      })
      this.JcfsTypes = result.data
    },
    async getSslbTypes(){
      const result = await Model.getSslbTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010501', //菜单ID
        requestData: ''
      })
      this.SslbTypes = result.data
    },
    async getSshjTypes(){
      const result = await Model.getSshjTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010501', //菜单ID
        requestData: ''
      })
      this.SshjTypes = result.data
    },
    async getYwtxTypes(){
      const result = await Model.getYwtxTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010501', //菜单ID
        requestData: ''
      })
      this.YwtxTypes = result.data
    }
  }
}
</script>
