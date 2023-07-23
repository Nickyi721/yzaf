<template lang="html">
    <el-form ref="form" :model="formData" label-position="top" class="common-form common-form-dlg">
        <el-form-item label="姓名" prop="name" size="mini">
            <el-select v-model="formData.tnRyxxgjid" placeholder="请选择人员姓名">
                <el-option v-for="workName in nameList" :key="workName.tnAbryid" :value="workName.tnAbryid" :label="workName.tcAbryxm"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="班次" prop="classes">
             <el-radio-group v-model="formData.tnRybcbid">
                <el-radio v-for="classTime in classList" :key="classTime.tnRybcbid" :label="classTime.tnRybcbid" @change="getTime">{{classTime.tcBcmc}}</el-radio>
            </el-radio-group>
        </el-form-item>
        <p>工时：{{beginWorkTime}}<span v-if="this.beginWorkTime"> 至 </span>{{endWorkTime}}</p>
        <el-form-item label="备注" label-position="left" prop="note">
            <el-input type="textarea" v-model="formData.tcBz"></el-input>
        </el-form-item>
        <el-form-item size="small">
            <el-button type="primary" @click="workSave">提交</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import Mixin from "@mixins";
import Model from "../model.js";

import Validator from "@commons/validator.js";
// 页面组件
export default {
  mixins: [Mixin.init],
  data() {
    return {
      nameList: [],
      classList: [],
      beginWorkTime: '',
      endWorkTime: '',
      formData: {},
      // rules: {
      //   name: [Validator.required("请选择人员")],
      //   classes: [Validator.required("请选择班次")],
      //   note: [Validator.length("1,200")]
      // }      
    };
  },
  methods: {
    $init() {
      this.getPearson();
      this.getClassTime();
    },
    reset() {
      this.formData = {};
    },
    // 获取人员
    async getPearson() {
      const result = await Model.getPearson({
        isQuery: 1,
        cdId: "00040802",
        rows: 100,
        pageNum: 1,    
        requestData: {
          tnSfyx: 1
        }
      });
      if (result.data) {
        this.nameList = result.data.list;
      }
    },
    // 获取班次信息
    async getClassTime() {
      const result = await Model.getClassTime({
        isQuery: 1,
        cdId: "00040802",
        requestData: {
          tnSfyx : 1
        }
      });
      if (result.data) {
        this.classList = result.data;
      }
    },
    getTime() {
      this.tnRybcbid = this.formData.classes
      this.getWorkTime()
    },
    // 获取工时信息
    async getWorkTime() {
      const result = await Model.getWorkTime({
        isQuery: 1,
        cdId: "00040802",
        requestData: {
          tnRybcbid:this.formData.tnRybcbid
        }
      });
      if (result.data) {
        this.beginWorkTime = result.data[0].tcKssj
        this.endWorkTime = result.data[0].tcJssj
      }
    },    
    workSave() {
      // let date = new Date()
      // let year = date.getFullYear()
      // let month = date.getMonth() + 1
      // if(month < 10){
      //   month = "0" + month
      // }
      // let day = date.getDate()
      // if(day < 10){
      //   day = "0" + day
      // }
      // let sj = year + "-" + month + "-" +day;
      if(this.formData.tnRybcbid === undefined || this.formData.tnRyxxgjid === undefined){
        this.$confirm('请选择人员和班次',{showCancelButton:false}).catch(err=>{})
      }else{  
        // this.formData.tcKssj = sj + " " + this.beginWorkTime
        this.formData.tcKssj = this.beginWorkTime
        // this.formData.tcJssj = sj + " " + this.endWorkTime
        this.formData.tcJssj = this.endWorkTime
        this.formData.tcAbryxm = this.nameList.find(el => el.tnAbryid === this.formData.tnRyxxgjid).tcAbryxm
        this.formData.tnRyxxzjid = this.nameList.find(el => el.tnAbryid === this.formData.tnRyxxgjid).tnRyxxgjid
        this.formData.tcBcmc = this.classList.find(el => el.tnRybcbid === this.formData.tnRybcbid).tcBcmc
        this.$refs.form.validate((valid, obj) => {
          if (valid) {
            this.$emit("save", this.formData);
          } else {
            const firstKey = Object.keys(obj)[0];
            this.$alert(obj[firstKey][0].message);
          }
        })
      };
    }
  }
};
</script>

<style scoped>
.endTime {
  margin-top: 10px;
}
>>>.el-form-item {
  margin-bottom: 5px;
}
.el-form-item__label{
  line-height: 50px;
}
p{
  margin: 15px 0px;
}
>>>.el-radio {
  margin-top:10px;
  margin-left: 0px;
}
>>>.el-radio__input {
  margin-left:8px;
}
>>>.el-radio__label {
  padding-left: 4px;
}
</style>


