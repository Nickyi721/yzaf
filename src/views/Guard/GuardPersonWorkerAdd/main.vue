<template>
  <CustomView :location="[{ text: $route.params.type === 'add' ? '新增工作人员' : '工作人员详情' }]">
    <el-form ref="form" :model="formData" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="姓名" prop="tcXm">
        <el-input v-model="formData['tcXm']" size="mini" style="width:600px" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="tcXb">
        <el-select v-model="formData['tcXb']" placeholder="请选择性别" size="mini" style="width:300px">
          <el-option
            v-for="item in sexType['050301']"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="民族" prop="tcMz">
        <el-input v-model="formData['tcMz']" size="mini" style="width:600px" placeholder="请输入民族"></el-input>
      </el-form-item>
      <el-form-item label="出生年月" prop="tdCsny">
        <el-date-picker
          v-model="formData['tdCsny']"
          align="right"
          :picker-options="pickerOptions"
          size="mini"
          type="date"
          placeholder="请选择出生年月"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="籍贯" prop="tcJg">
        <el-input v-model="formData['tcJg']" size="mini" style="width:600px" placeholder="请输入籍贯"></el-input>
      </el-form-item>
      <el-form-item label="参加工作时间" prop="tdCjgzsj">
        <el-date-picker
          v-model="formData['tdCjgzsj']"
          align="right"
          :picker-options="pickerOptions"
          size="mini"
          type="date"
          placeholder="请选择参加工作时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="政治面貌" prop="tcZzmm">
        <el-select
          v-model="formData['tcZzmm']"
          placeholder="请选择政治面貌"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in zzmmType['050302']"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="婚姻状态" prop="tcHyzt">
        <el-select
          v-model="formData['tcHyzt']"
          placeholder="请选择婚姻状态"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in hyztType['050303']"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文化程度" prop="tcWhcd">
        <el-select
          v-model="formData['tcWhcd']"
          placeholder="请选择文化程度"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in whcdType['050304']"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身体状况" prop="tcStzk">
        <el-select
          v-model="formData['tcStzk']"
          placeholder="请选择身体状况"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in stzkType['050305']"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="家庭住址" prop="tcJtzz">
        <el-input
          v-model="formData['tcJtzz']"
          size="mini"
          style="width:600px"
          placeholder="请输入家庭住址"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="tcLxdh">
        <el-input
          v-model="formData['tcLxdh']"
          size="mini"
          style="width:600px"
          placeholder="请输入联系电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="工作岗位" prop="tcGzgw">
        <el-select
          v-model="formData['tcGzgw']"
          placeholder="请选择工作岗位"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in gzgwType['050306']"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间" prop="tdRzsj">
        <el-date-picker
          v-model="formData['tdRzsj']"
          align="right"
          size="mini"
          :picker-options="pickerOptions"
          type="date"
          placeholder="请选择入职时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="用工性质" prop="tcYgxz">
        <el-select
          v-model="formData['tcYgxz']"
          placeholder="请选择用工性质"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in ygxzType['050307']"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保安员证"
        prop="tcBayz"
        v-if="!(formData['tcGzgw'] == '05030605' || formData['tcGzgw'] == '05030606')"
      >
        <el-select
          v-model="formData['tcBayz']"
          placeholder="请选择保安员证"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in bayz"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="持枪证"
        prop="tcCqz"
        v-if="formData['tcGzgw'] == '05030603' || formData['tcGzgw'] == '05030604'"
      >
        <el-select v-model="formData['tcCqz']" placeholder="请选择持枪证" size="mini" style="width:300px">
          <el-option
            v-for="item in cqz"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消防资格证书" prop="tcXfzs" v-if="formData['tcGzgw'] == '05030605'?true:false">
        <el-select
          v-model="formData['tcXfzs']"
          placeholder="请选择消防资格证书"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in xfz"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="持枪证编号"
        prop="tcCqzbh"
        v-if="(formData['tcGzgw'] == '05030603' || formData['tcGzgw'] == '05030604') && formData['tcCqz'] == '0'"
      >
        <el-input
          v-model="formData['tcCqzbh']"
          size="mini"
          style="width:600px"
          placeholder="请输入持枪证编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="最近参加培训时间" prop="tcZjcjpxsj">
        <el-date-picker
          v-model="formData['tcZjcjpxsj']"
          align="right"
          size="mini"
          :picker-options="pickerOptions"
          type="date"
          placeholder="请选择最近参加培训时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="人员状态" prop="tcRyzt">
        <el-select
          v-model="formData['tcRyzt']"
          placeholder="请选择人员状态"
          size="mini"
          style="width:300px"
        >
          <el-option
            v-for="item in ryzt"
            :key="item.tcSjubm"
            :label="item.tcSjnr"
            :value="item.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最近风险排查日期" prop="tcZjfxpcrq">
        <el-date-picker
          v-model="formData['tcZjfxpcrq']"
          align="right"
          size="mini"
          :picker-options="pickerOptions"
          type="date"
          placeholder="请选择最近风险排查日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="选择用户" prop="tcYhzh">
        <el-button ref="person" class="common-form-dlg-btn" @click="_choosePerson" :disabled="isEditable">{{formData.tcYhzh ? formData.tcYhzh : '请选择人员'}}</el-button>
      </el-form-item>            
      <el-form-item>
        <el-button type="primary" size="mini" @click="_SaveButtonClick()">保存</el-button>
      </el-form-item>
    </el-form>

    <CustomDialog title="选择用户" width="90%" top="40px" :visible="dialogVisible" @close="dialogVisible = false">
      <ChooseUser @choose="_ChooseUserChange" :tcSsdwbm="tcSsdwbm"/>
    </CustomDialog>        
  </CustomView>
</template>

<script>
import Mixin from "@mixins";
import Model from "./model.js";
import axios from "axios";
import Validator from "@commons/validator.js";
import config from "@commons/config.js";
import CommonModel from "@commons/model.js";
import Moment from "moment";
import ChooseUser from './components/ChooseUser.vue'

export default {
  mixins: [Mixin.page, Mixin.init],
  components: {ChooseUser},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      query: {},
      rules: {
        tcXm: [Validator.required("请输入姓名"), Validator.length(1, 15)],
        tcXb: [Validator.required("请选择性别")],
        tcMz: [Validator.required("请输入民族"), Validator.length(1, 50)],
        tdCsny: [Validator.required("请选择出生年月")],
        tcJg: [Validator.required("请输入籍贯"), Validator.length(1, 50)],
        tdCjgzsj: [Validator.required("请选择参加工作时间")],
        tcZzmm: [Validator.required("请选择政治面貌")],
        tcHyzt: [Validator.required("请选择婚姻状态")],
        tcWhcd: [Validator.required("请选择文化程度")],
        tcJtzz: [
          Validator.required("请输入家庭住址"),
          Validator.length(1, 60)
        ],
        tcLxdh: [
          Validator.required('请输入固话或者手机号，固话格式为0000-00000000'),
          Validator.length(1, 13),
          Validator.isFixedPhoneNumber()
        ],
        tcGzgw: [Validator.required("请选择工作岗位")],
        tdRzsj: [Validator.required("请选择入职时间")],
        tcBayz: [Validator.required("请选择安保员证")],
        tcCqz: [Validator.required("请选择持枪证")],
        tcXfzs: [Validator.required("请选择消防资格证书")],
        tcCqzbh: [
          Validator.required("请选择持枪证编号"),
          Validator.length(1, 20),
          Validator.fixedNumber()
        ]
      },
      sexType: [],
      stzkType: [],
      gzgwType: [],
      ygxzType: [],
      zzmmType: [],
      hyztType: [],
      whcdType: [],
      tcSsdwbm:this.$route.params.tcSsdwbm,      
      ryzt: [
        { tcSjubm: "0", tcSjnr: "在岗" },
        { tcSjubm: "1", tcSjnr: "离岗" }
      ],
      cqz: [{ tcSjubm: "0", tcSjnr: "有" }, { tcSjubm: "1", tcSjnr: "无" }],
      xfz: [{ tcSjubm: "0", tcSjnr: "有" }, { tcSjubm: "1", tcSjnr: "无" }],
      bayz: [{ tcSjubm: "0", tcSjnr: "有" }, { tcSjubm: "1", tcSjnr: "无" }],
      formData: {
        tcRyzt: "0"
      },
      disabled: false,
      isEditable: false,
      dialogVisible: false
    };
  },
  methods: {
    $init(options) {
      this.getSex();
      this.getSTZK();
      this.getGZGW();
      this.getYGXZ();
      this.getZZMM();
      this.getHYZT();
      this.getWHCD();
      if (this.$route.params.type === "add") {
        this.formData.tnAbjgid = parseInt(this.$route.params.tnAbjgid);
      } else {
        this.query.tnAbgzryid = this.$route.params.tnAbgzryid;
        this.getDetail();
      }
    },
    _SaveButtonClick() {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.$route.params.type === "add"
            ? this.addData()
            : this.updateData();
        } else {
          const firstKey = Object.keys(obj)[0];
          this.$alert(obj[firstKey][0].message);
        }
      });
    },
    _choosePerson() {
      this.dialogVisible = true
      this.$forceUpdate()
    },
    _ChooseUserChange(selection) {
      this.formData.tcZzid = selection[0].tnYhid
      this.formData.tnYhid = selection[0].tnYhid      
      this.formData.tcZzmc = selection[0].tcYhmc
      this.formData.tcYhzh = selection[0].tcYhzh
      this.$forceUpdate()
      this.$refs.form.clearValidate(['tcZzid'])
      this.dialogVisible = false
    },    
    //获取性别
    async getSex() {
      const result = await CommonModel.getDictData(["050301"]);
      if (result && result.data) {
        this.sexType = result.data;
      }
    },
    //政治面貌
    async getZZMM() {
      const result = await CommonModel.getDictData(["050302"]);
      if (result && result.data) {
        this.zzmmType = result.data;
      }
    },
    //婚姻状态
    async getHYZT() {
      const result = await CommonModel.getDictData(["050303"]);
      if (result && result.data) {
        this.hyztType = result.data;
      }
    },
    //文化程度
    async getWHCD() {
      const result = await CommonModel.getDictData(["050304"]);
      if (result && result.data) {
        this.whcdType = result.data;
      }
    },
    //身体状况
    async getSTZK() {
      const result = await CommonModel.getDictData(["050305"]);
      if (result && result.data) {
        this.stzkType = result.data;
      }
    },
    //工作岗位
    async getGZGW() {
      const result = await CommonModel.getDictData(["050306"]);
      if (result && result.data) {
        this.gzgwType = result.data;
      }
    },
    //用工性质
    async getYGXZ() {
      const result = await CommonModel.getDictData(["050307"]);
      if (result && result.data) {
        this.ygxzType = result.data;
      }
    },
    //增加数据
    async addData() {
      this.formData.tdCjgzsj = Moment(this.formData.tdCjgzsj).format('YYYY-MM-DD')
      this.formData.tdRzsj = Moment(this.formData.tdRzsj).format('YYYY-MM-DD')
      this.formData.tcZjcjpxsj = Moment(this.formData.tcZjcjpxsj).format('YYYY-MM-DD')
      this.formData.tdCsny = Moment(this.formData.tdCsny).format('YYYY-MM-DD')
      this.formData.tcZjfxpcrq = Moment(this.formData.tcZjfxpcrq).format('YYYY-MM-DD')
      if(this.formData.tcGzgw=='05030605' || this.formData.tcGzgw=='05030606'){
        this.formData.tcBayz = ''
      }
      if(!(this.formData.tcGzgw=='05030603' || this.formData.tcGzgw=='05030604')){
        this.formData.tcCqz = ''
      }
      if(this.formData.tcCqz=='1'){
        this.formData.tcCqzbh = ''
      }
      if(this.formData.tcGzgw!=='05030605'){
        this.formData.tcXfzs = ''
      }
      const result = await Model.addData({
        isQuery: 0, //是否是查询类 0-否 1-是
        cdId: "00040402", //菜单ID
        cdMc: "安全保卫人员管理",
        requestData: this.formData
      });
      if (result.state === "1") {
        this.$message({
          message: "新增成功!",
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true
        });
        this.$router.push({
          name: "guardPersonWorker",
          params: { id: parseInt(this.formData.tnAbjgid) }
        });
        // this.$router.push({path: '/guard/person/worker'})
      }
      // else{
      //   let _this = this
      //   this.$message({
      //     message:'新增失败!',
      //     type:"fail",
      //     duration:2000,
      //     customClass: "middle",
      //     onClose:function(){

      //     }
      //   })
      // }
    },
    //更新数据
    async updateData() {
      this.formData.tdCjgzsj = Moment(this.formData.tdCjgzsj).format('YYYY-MM-DD')
      this.formData.tdRzsj = Moment(this.formData.tdRzsj).format('YYYY-MM-DD')
      this.formData.tcZjcjpxsj = Moment(this.formData.tcZjcjpxsj).format('YYYY-MM-DD')
      this.formData.tdCsny = Moment(this.formData.tdCsny).format('YYYY-MM-DD')
      this.formData.tcZjfxpcrq = Moment(this.formData.tcZjfxpcrq).format('YYYY-MM-DD')
      if(this.formData.tcGzgw=='05030605' || this.formData.tcGzgw=='05030606'){
        this.formData.tcBayz = ''
      }
      if(!(this.formData.tcGzgw=='05030603' || this.formData.tcGzgw=='05030604')){
        this.formData.tcCqz = ''
      }
      if(this.formData.tcCqz=='1'){
        this.formData.tcCqzbh = ''
      }
      if(this.formData.tcGzgw!=='05030605'){
        this.formData.tcXfzs = ''
      }
      const result = await Model.updateData({
        isQuery: 0, //是否是查询类 0-否 1-是
        cdId: "00040402", //菜单ID
        cdMc: "安全保卫人员管理",
        requestData: this.formData
      });
      if (result.state === "1") {
        this.$message({
          message: "修改成功!",
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true
        });
        this.$router.push({
          name: "guardPersonWorker",
          params: { id: parseInt(this.formData.tnAbjgid) }
        });
        // this.$router.push({path: '/guard/person/manager'})
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
    async getDetail() {
      const result = await Model.getDetail({
        isQuery: 1, //是否是查询类 0-否 1-是
        cdId: "00040402", //菜单ID
        cdMc: "安全保卫人员管理",
        requestData: this.query
      });
      if (result.state === "1") {
        this.formData = result.data[0];
        // this.formData.tdCjgzsj = Moment(this.formData.tdCjgzsj, 'YYYY-MM-DD').valueOf();
      }
    }
  }
};
</script>
