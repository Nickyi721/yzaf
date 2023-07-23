<template>
  <CustomView :location="[{ text: '安保机构详情' }]">
    <el-form ref="form" :model="formData" label-position="top" :rules="rules" label-width="300px" class="common-form">
      <el-form-item label="安保机构名称" prop="tcAbjgmc">
        <el-input v-model="formData['tcAbjgmc']" size="mini" placeholder="请输入机构名称"></el-input>
      </el-form-item>
      <el-form-item label="安保机构地址" prop="tcDz">
        <el-input v-model="formData['tcDz']" size="mini" placeholder="请输入机构地址"></el-input>
      </el-form-item>
      <el-form-item label="所属板块" prop="bkbmList">
        <el-checkbox-group v-model="formData['bkbmList']">
          <el-checkbox  v-for="bk in plates" :key="bk.tcBkbm" :label="bk.tcBkbm">{{bk.tcSjnr}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="安保机构性质" prop="tcAbjgxz">
        <el-select v-model="formData['tcAbjgxz']" placeholder="请选择安保机构性质" size="mini" style="width:300px">
          <el-option v-for="item in abdwxzType['050101']" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专、兼职安保人员数量" prop="tnRysl">
        <el-input v-model="formData['tnRysl']" :disabled="true" size="mini" placeholder="请输入专、兼职安保人员数量"></el-input>
      </el-form-item>
      <el-form-item label="是否有外包人员" prop="tcWbbz">
        <el-select v-model="formData['tcWbbz']"  placeholder="请选择是否有外包人员" size="mini" style="width:300px">
          <el-option v-for="wbry in wbryType" :key="wbry.tcSjubm" :label="wbry.tcSjnr" :value="wbry.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="外包安保人员数量" prop="tnWbrysl" v-if="formData['tcWbbz']" >
        <el-input v-model="formData['tnWbrysl']"  size="mini" placeholder="请输入外包安保人员数量"></el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="tcYzbm">
        <el-input v-model="formData['tcYzbm']" size="mini" placeholder="请输入邮政编码"></el-input>
      </el-form-item>
      <el-form-item label="机构电话" prop="tcCzdh">
        <el-input v-model="formData['tcCzdh']" size="mini" placeholder="请输入机构电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="_SaveButtonClick()" >保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'
import CommonModel from '@commons/model.js'

export default {
  mixins: [
    Mixin.page,
    Mixin.init, 
  ],
  data () {
    return {
      rules:{
        tcAbjgmc: [
          Validator.required('请输入安保机构名称'),
          Validator.length(1, 100)
        ],
        tcDz: [
          Validator.required('请输入安保机构地址'),
          Validator.length(1, 100)
        ],
        tcAbjgxz: [
          Validator.required('请选择安保机构性质')
        ],
        tnWbrysl: [
          Validator.required('只能输入数字'),
          Validator.isNumber()
        ],        
        tcYzbm: [
          Validator.required('请输入邮政编码'),
          Validator.length(6, 6),
          Validator.isFixedMail()
        ],
        tcCzdh: [
          Validator.required('请输入机构固话或者手机号，固话格式为0000-00000000'),
          Validator.length(1, 13),
          Validator.isFixedPhoneNumber()
        ],
        bkbmList: [
          Validator.required('请选择所属板块'),
        ],
      },
      wbryType: [
        {"tcSjubm":1,"tcSjnr":"是"},
        {"tcSjubm":0,"tcSjnr":"否"}
      ],
      abdwxzType: [],
      query: {},
      formData:{
        tnAbjgid:'',
        tcAbjgmc:'',//安保机构名称
        tcDz:'',//安保机构地址
        tcAbjgxz:'',//安保机构性质
        tnRysl: '',//专、兼职安保人员数量
        tnWbrysl: '',//外包安保人员数量
        tcYzbm:'',//邮政编码
        tcCzdh:'',//机构电话
        bkbmList:[],
        tcSsdwbm:'',
        tcWbbz: ''
      },
      plates:[],
      disabled: true
    }
  },
  methods: {
    $init(options) {
      this.plates = window.localStorage.getItem('bk').split(';').filter(el=> {
        return el!=''
      }).map(ele=>{
        return ele = JSON.parse(ele)
      })
      this.formData.tcSsdwbm = this.$route.params.dwbm
      this.formData.tnAbjgid = this.$route.params.tnAbjgid
      this.getABDWXZ()
      this.getDetail()
    },

    _SaveButtonClick(){
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.updateData()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    //获取安保单位性质
    async getABDWXZ () {
      const result = await CommonModel.getDictData(['050101'])
      if (result && result.data) {
        this.abdwxzType = result.data;
      }
    },
    //更新数据
    async updateData(){
      this.formData.tnWbrysl = this.formData.tcWbbz=='1'? this.formData.tnWbrysl : 0
      const result = await Model.updateData({
        isQuery:0,  //是否是查询类 0-否 1-是
        cdId:'00040401', //菜单ID
        cdMc:'安全保卫机构管理',
        requestData: this.formData
      })
      if (result.state==="1") {
        this.$message({
          message: '修改成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.$router.push({path: '/guard/org'})
      }
      // else{
      //   let _this = this
      //   this.$message({
      //     message:'修改失败!',
      //     type:"fail",
      //     duration:2000,
      //     customClass: "middle",
      //     onClose:function(){

      //     }
      //   })
      // }
    },
    async getDetail(){
      const result = await Model.getDetail({
        isQuery:1,  //是否是查询类 0-否 1-是
        cdId:'00040401', //菜单ID
        cdMc:'安全保卫机构管理',
        requestData: this.formData
      })
      if(result.state==='1'){
        this.formData = result.data
        this.formData.tcWbbz = parseInt(result.data.tcWbbz)
        this.formData.bkbmList = result.data.tcBkbmList.map(el=>{
          return el.tcBkbm
        })
      }
    }
  }
}
</script>
