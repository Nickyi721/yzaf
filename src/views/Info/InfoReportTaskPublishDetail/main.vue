<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增报表任务' : '报表任务详情' }]">
    <el-form
      :model="formData"
      ref="ruleForm"
      :rules="formRules"
      label-position="top"
      class="common-form"
    >
      <el-form-item label="任务类型" prop="tnRwlx">
        <el-select v-model="formData['tnRwlx']" size="mini" @change="_ChangeRwlx" placeholder="请选择任务类型">
          <el-option
            v-for="option in optionRwlx"
            :key="option.tcSjubm"
            :label="option.tcSjnr"
            :value="option.tcSjubm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="tcRwmc">
        <el-input v-model="formData['tcRwmc']" size="mini" placeholder="请输入任务名称" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="报表名称" prop="tcMbid">
        <el-select v-model="formData['tcMbid']" size="mini" placeholder="请选择报表">
          <el-option
            v-for="option in optionsBb"
            :key="option.tcZdybbid"
            :label="option.tcZdybbmc"
            :value="option.tcZdybbid"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务说明" prop="tcRwsm">
        <el-input
          type="textarea"
          rows="2"
          v-model="formData['tcRwsm']"
          size="mini"
          placeholder="请输入任务说明"
          maxlength="200"
        ></el-input>
      </el-form-item>

      <!--<el-form-item label="任务起止时间" prop="range">
        <el-date-picker
          v-model="formData['range']"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> !-->

       <el-form-item label="任务开始时间" prop="tcRwkssj">
        <el-date-picker
          v-model="formData['tcRwkssj']"
          size="mini"
          type="date"
          placeholder="选择任务开始时间"
          value-format="yyyy-MM-dd"
          
        ></el-date-picker>
      </el-form-item>

       <el-form-item label="任务截止时间" prop="tcRwjzsj">
        <el-date-picker
          v-model="formData['tcRwjzsj']"
          size="mini"
          type="date"
          placeholder="选择任务截止时间"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions2"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="提醒天数" prop="tnTxts">
        <el-input v-model="formData['tnTxts']" size="mini" @change="txtsChange" placeholder="请输入提醒天数"></el-input>
      </el-form-item>

      <el-form-item label="填报单位">
        <CommonMultiSelect
          class="form-tree"
          ref="orgTree"
          fnCode="000403"
          :apiUrl="treeApi"
          :requestData="treeRequestData"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>

<script>
import Mixin from "@mixins";
import Validator from "@commons/validator.js";

import Model from "./model.js";
import { type } from 'os';
export default {
  mixins: [Mixin.init],
  data() {
    return {
      treeApi: "rwfb/getOrgListTreeByAsync",
      treeRequestData: {
        name: "tnRwid",
        id: this.$route.query.tnRwid || "0"
      },
      formData: {
        tnRwlx: 1,
        tcMbid: '',
        tnTxts:''
      },
      tnRwlx: 1,
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now() -8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      formRules: {
        tnRwlx: [Validator.required("请选择任务类型")],
        tcRwmc: [Validator.required("请输入任务名称")],
        tcMbid: [Validator.required("请选择报表名称")],
        tcRwsm: [Validator.required("请输入任务说明")],
        //range: [Validator.required("请选择任务起止时间")],
        tcRwkssj:[Validator.required("请选择任务开始时间")],
        tcRwjzsj:[Validator.required("请选择任务截至时间")],
        tnTxts: [
          // Validator.required('请输入提醒天数'),
          Validator.isNumber(2),
        ],
        tcDw: [Validator.required("请选择填报单位")]
      },
      optionsBb: [],
      optionRwlx: [
        {
          tcSjubm: 0,
          tcSjnr: "日常任务"
        },
        {
          tcSjubm: 1,
          tcSjnr: "非日常任务"
        }
      ]
    };
  },
  methods: {
    $init(options) {
      if (this.$route.query.type === "update") {
        this.getTaskDetail();
      }
      this.getTemplateList();
    },
    // 提醒天数判断
    txtsChange () {
      const txts = this.formData['tnTxts']
      const jzsj = this.formData['tcRwjzsj']
      const kssj = this.formData['tcRwkssj']
      const restDay = Math.ceil((Date.parse(jzsj) - Date.parse(kssj)) / 86400000)
      if (restDay < txts){
        this.formData['tnTxts'] = restDay
      }
    },
    // 事件-选择机构
    _OrgTreeCheckChange(node, check) {
      /* const list = this.$refs.orgTree.$refs.tree.getCheckedNodes()
      this.formData.tcDw = list.map(org => ({
        tcDwdm: org.id,
        tcDwmc: org.name
      }))
      if (list && list.length) {
        this.$refs.ruleForm.clearValidate(['tcDw'])
      } */
      let data = this.$refs.orgTree.getCheckedNodes();
      let newData = data.map(item => {
        const { xjxz, id, bjxz, name } = item;
        if (xjxz && xjxz !== 3) {
          return {
            mode: xjxz,
            tcDwdm: id,
            tcDwmc: name,
            selected: !!bjxz
          };
        } else {
          return {
            tcDwdm: id,
            tcDwmc: name,
            selected: !!bjxz
          };
        }
      });
      return newData;
    },
    // 事件-保存
    _ButtonSaveClick() {
      if (this.$refs.orgTree.isLoading) {
        this.$msgbox({
          message: `正在加载数据请稍后！`,
          type: "warning"
        });
        return;
      }
      this.formData.tcDw = this._OrgTreeCheckChange();
      if (!this.formData.tcDw.length) {
        this.$msgbox({
          message: `请选择单位`,
          type: "warning"
        });
        return;
      }
      if (this.$route.query.type === "add") {
        this.addInfoData();
      } else {
        this.updateInfoData();
      }
    },
    _ChangeRwlx(val) {
      this.tnRwlx = val
      this.formData['tcMbid'] = ''
      this.getTemplateList()
    },
    // 报表列表
    async getTemplateList() {
      const result = await Model.getTemplateList({
        isQuery: 1,
        cdId: "0004030302",
        requestData: {
          tnLx: this.tnRwlx
        }
      });
      if (result.data) {
        this.optionsBb = result.data;
      }
    },
    // 详情
    async getTaskDetail() {
      const result = await Model.getTaskDetail({
        isQuery: 1,
        cdId: "0004030302",
        requestData: {
          tnRwid: this.$route.query.tnRwid
        }
      });
      if (result.data) {
        this.formData = result.data;
        this.formData.tcDw = result.data.rwdwpzList;
        this.tnRwlx = result.data.tnRwlx
        this.getTemplateList()
        //this.formData.range = [result.data.tcRwkssj, result.data.tcRwjzsj];
        this.formData.tcRwkssj = result.data.tcRwkssj;
        this.formData.tcRwjzsj =  result.data.tcRwjzsj;
      }
    },
    // 新增
    async addInfoData() {
      this.$refs.ruleForm.validate(async (valid, obj) => {
        if (valid) {
          let tcBb = this.optionsBb.find(item => {
            return item.tcZdybbid === this.formData.tcMbid;
          });
          if(this.formData.tcRwkssj>this.formData.tcRwjzsj){
              this.$msgbox({
              message: `任务开始时间不能大于任务截止时间`,
              type: "warning"
              });
            return;
          }
          const result = await Model.saveTask({
            isQuery: 0,
            cdId: "0004030302",
            requestData: {
              tnRwlx: this.formData.tnRwlx,
              tcRwmc: this.formData.tcRwmc,
              tcRwnr: this.formData.tcRwnr,
              tcRwsm: this.formData.tcRwsm,
              //tcRwkssj: this.formData.range[0],
              //tcRwjzsj: this.formData.range[1],
              tcRwkssj: this.formData.tcRwkssj,
              tcRwjzsj: this.formData.tcRwjzsj,
              tnTxts: parseInt(this.formData.tnTxts),
              tcMbid: this.formData.tcMbid,
              tcMbmc: tcBb.tcZdybbmc,
              rwdwpzList: this.formData.tcDw
            }
          });
          if (result && result.state === "1") {
            this.$message({
              message: "新增成功！",
              type: "success",
              customClass: "middle"
            });
            this.$router.push({
              path: "/info/report/task-publish"
            });
          }
          this.$refs.ruleForm.clearValidate();
          this.dlgTypeVisble = false;
        } else {
          const firstKey = Object.keys(obj)[0];
          this.$alert(obj[firstKey][0].message);
        }
      });
    },
    // 修改
    async updateInfoData() {
      this.$refs.ruleForm.validate(async (valid, obj) => {
        if (valid) {
          let tcBb = this.optionsBb.find(item => {
            return item.tcZdybbid === this.formData.tcMbid;
          });
          if(this.formData.tcRwkssj>this.formData.tcRwjzsj){
              this.$msgbox({
              message: `任务开始时间不能大于任务截止时间`,
              type: "warning"
              });
            return;
          }
          const result = await Model.saveTask({
            isQuery: 0,
            cdId: "0004030302",
            requestData: {
              tnRwid: this.$route.query.tnRwid,
              tnRwlx: this.formData.tnRwlx,
              tcRwmc: this.formData.tcRwmc,
              tcRwnr: this.formData.tcRwnr,
              tcRwsm: this.formData.tcRwsm,
              //tcRwkssj: this.formData.range[0],
              //tcRwjzsj: this.formData.range[1],
              tcRwkssj: this.formData.tcRwkssj,
              tcRwjzsj: this.formData.tcRwjzsj,
              tnTxts: parseInt(this.formData.tnTxts),
              tcMbid: tcBb.tcZdybbid,
              tcMbmc: tcBb.tcZdybbmc,
              rwdwpzList: this.formData.tcDw
            }
          });
          if (result && result.state === "1") {
            this.$message({
              message: "保存成功！",
              type: "success",
              customClass: "middle"
            });
            this.$router.push({
              path: "/info/report/task-publish"
            });
          }
          this.$refs.ruleForm.clearValidate();
          this.dlgTypeVisble = false;
        } else {
          const firstKey = Object.keys(obj)[0];
          this.$alert(obj[firstKey][0].message);
        }
      });
    }
  }
};
</script>
