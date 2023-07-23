<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    label-width="80px"
    label-position="top"
    class="common-form common-form-dlg"
  >
    <el-form-item label="排班数量" prop="time">
      <el-input
        v-model="formData.time"
        size="mini"
        maxlength="1"
        placeholder="请输入"
        @input="_change"
        class="classNum"
      ></el-input>
    </el-form-item>
    <div v-for="(el,index) in formData.xfaqRybcbList" :key="index" class="setClass">
      班次{{index+1}}
      <el-input size="mini" v-model="el.tcBcmc" placeholder="请输入班次名称"></el-input>
      <div>
        开始时间：
        <el-time-picker
          size="mini"
          v-model="el.tcKssj"
          width="200px;"
          type="datetime"
          placeholder="请选择开始时间"
        ></el-time-picker>
      </div>
      <el-radio-group v-model="el.tnBrcr">
        <el-radio :label="0">本日</el-radio>
        <el-radio :label="1">次日</el-radio>
      </el-radio-group>
      <div class="endTime">
        结束时间：
        <el-time-picker size="mini" v-model="el.tcJssj" type="datetime" placeholder="请选择结束时间"></el-time-picker>
      </div>
    </div>
    <div>
      <el-button type="primary" size="mini" @click="saveTimeSet">提 交</el-button>
    </div>
    <p v-for="className in formData.classes" class="classInfo">
      <span class="className">{{className.tcBcmc}}</span>
      :
      {{className.tcKssj}}
      <span>-</span>
      {{className.tcJssj}}
      <!-- <span class="classBtn">
                <CustomButton text="启用" @click="startClass(className.tnRybcbid)"/>
                <CustomButton text="停用" @click="blockClass(className.tnRybcbid)"/>
      </span>-->
      <el-switch
        v-model="className.tnSfyx"
        active-text="启用"
        :active-value="active"
        inactive-text="停用"
        :inactive-value="stop"
        class="classBtn"
        @change=" (val) => _SwitchChange(val, className.tnRybcbid)"
      ></el-switch>
    </p>
  </el-form>
</template>

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "../model.js";
import Validator from "@commons/validator.js";

export default {
  mixins: [Mixin.init],
  data() {
    return {
      rules: {
        time: [Validator.required("请输入排班数量"), Validator.isNumber()]
      },
      active: 1,
      stop: 0,
      formData: {
        xfaqRybcbList: [],
        classes: []
      }
    };
  },
  methods: {
    _change(val) {
      this.formData.xfaqRybcbList = [];
      for (let i = 0; i < parseInt(val); i++) {
        this.formData.xfaqRybcbList.push({
          tcBcmc: "",
          tcKssj: "",
          tcJssj: "",
          tnBrcr: ""
        });
      }
    },
    saveTimeSet() {
      for (let item of this.formData.xfaqRybcbList.values()) {
        if (!item.tcKssj && !item.tcJssj && !item.tnBrcr) {
          this.$msgbox({
            type: "warning",
            message: "请选择时间和时日"
          });
          return;
        }
      }
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.$emit("query", this.formData.xfaqRybcbList);
        } else {
          const firstKey = Object.keys(obj)[0];
          this.$alert(obj[firstKey][0].message);
        }
      });
    },
    async getClass() {
      const result = await Model.getClassTime({
        isQuery: 1,
        cdId: "00040802",
        requestData: {}
      });
      if (result.data) {
        this.formData.classes = result.data;
        this.$forceUpdate();
      }
    },
    // startClass(tnRybcbid) {
    //     this.controlClass(status = 1,tnRybcbid)
    // },
    // blockClass(tnRybcbid) {
    //     this.controlClass(status = 0,tnRybcbid)
    // },
    _SwitchChange(val, id) {
      this.controlClass(val, id);
    },
    async controlClass(status, tnRybcbid) {
      const result = await Model.controlClass({
        isQuery: 0,
        cdId: "00040802",
        requestData: {
          tnSfyx: status,
          tnRybcbid: tnRybcbid
        }
      });
      if (result.state === "1") {
        if ((this.formData.classes.tnRybcbid = 1)) {
          this.formData.classes.tnRybcbid = this.active;
        }
        if ((this.formData.classes.tnRybcbid = 0)) {
          this.formData.classes.tnRybcbid = this.stop;
        }
        this.$forceUpdate();
      }
    },
    clearTimeSet() {
      this.formData = {
        xfaqRybcbList: []
      };
      this.getClass();
    }
  }
};
</script>

<style scoped>
.setClass {
  border: 1px dashed gainsboro;
  margin-bottom: 10px;
  padding: 10px;
}
.endTime {
  margin-top: 10px;
}
.el-dialog {
  width: 550px;
}
.classNum {
  margin: 0px 0px;
}
.el-input {
  margin: 10px 0px;
}
.el-button--primary {
  margin-bottom: 10px;
}
.el-form-item {
  margin-bottom: 22px;
}
.el-form-item__label {
  line-height: 60px;
}
.classInfo {
  margin-bottom: 10px;
  line-height: 30px;
  display: block;
  clear: both;
  content: "";
}
.className {
  font-weight: 600;
}
.classBtn {
  float: right;
}
.el-button :nth-child(2) {
  margin-left: 0px;
}
</style>

