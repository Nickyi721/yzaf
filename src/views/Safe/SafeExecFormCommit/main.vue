<template>
  <CustomView :location="[{ text: '填写安全检查表' }]">
    <div class="common-info">
      <div class="common-info-unit">
        <span class="common-info-label">计划名称：</span>
        <span class="common-info-content">{{bindData['tcJhmc']}}</span>
      </div>
      <div class="common-info-unit">
        <span class="common-info-label">接收单位：</span>
        <span class="common-info-content">{{bindData['tcDwmc']}}</span>
        <span class="common-info-label">计划截止时间：</span>
        <span class="common-info-content">{{bindData['tcJhjzsj']}}</span>
      </div>

      <div class="common-info-unit">
        <span class="common-info-label">计划说明：</span>
        <span class="common-info-content">{{bindData['tcJhsm']}}</span>
      </div>
      <el-form :model="bindData" ref="form" label-width="80px" :rules="rules">
        <el-form-item label="情况说明" prop="tcWtsm">
          <el-input
            type="textarea"
            :readonly="readonly"
            v-model="bindData['tcWtsm']"
            placeholder="请输入情况说明"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <CustomButton
            v-if="pageData.tbzt!='1'"
            icon="add"
            text="保存"
            @click="_onSave('0')"
          />
          <CustomButton
            v-if="pageData.tbzt!='1'"
            icon="add"
            text="提交"
            @click="_onSave('1')"
          />
          <CustomButton
            v-if="pageData.tbzt=='1' && pageData.tcLrrzh!==tcYhzh"
            icon="agree"
            text="认同"
            @click="_onAgree"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="common-grid">
      <el-table stripe
        border
        ref="table" 
        class="grid-table" 
        header-cell-class-name="table-hd" 
        height="100%" 
        size="mini" 
        :data="this.bindData['aqjcAqjctiDto']" 
        :row-class-name="$listeners.dblClick ? 'click-row' : ''" 
        :span-method="_objectSpanMethod"
        >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="tcJcfs" label="检查方式"></el-table-column>
        <el-table-column prop="tcJcqy" label="检查区域"></el-table-column>
        <el-table-column prop="tcJcnr" label="检查内容"></el-table-column>
        <el-table-column prop="tcSfxcjc" label="现场检查(是/否）">
          <template slot-scope="scope">
            <p v-if="scope.row.tcSfxcjc=='1'">现场检查</p>
            <p v-if="scope.row.tcSfxcjc=='2'">非现场检查</p>
          </template>
        </el-table-column>
        <el-table-column label="检查结果" min-width="300px">
          <template slot-scope="scope" v-if='scope.row.aqjctiList.length'>
            <div class="check" v-for="(yhct, index) in scope.row.aqjctiList[0].yhctList" :key="index">
              <el-checkbox class="checkbox" v-model="yhct.select" @change="(val) => _checkboxChange(val, scope.row.tnAqjczjid.toString(), yhct.tnYhctid.toString())" :disabled="disabled"></el-checkbox>
              <span class="yhct">{{index+1}}、{{yhct.tcCtnr}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="附件" min-width="100px">
          <template slot-scope="scope">
            <CommonFileUpload
              v-if='!disabled'
              :list="scope.row.xtFjList" 
              :limit='200'
              @uploadFile='(param) => _requestFile(param, scope.row.tnAqjczjid.toString())' 
              >
            </CommonFileUpload>
            <CommonFileDownload 
              :list="scope.row.xtFjList" 
              :id='scope.row.tnAqjczjid' 
              :disabled='disabled' 
              @remove='_onRemove'
              >
            </CommonFileDownload>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </CustomView>
</template>
<style scoped>
.el-checkbox {
  margin-right: 10px;
}

.el-form-item {
  margin-left: 36px;
}

.common-info-unit {
  height: 30px;
}
.common-grid {
  border: 1px solid #ebeef5;
}
</style>
<script>
import Mixin from "@mixins";
import Model from "./model.js";
import request from "@commons/request.js";
import Validator from "@commons/validator.js";
import CommonModel from '@commons/model.js'

export default {
  mixins: [Mixin.Grid, Mixin.init],

  data() {
    return {
      dialogVisible: false,
      quote: '',
      bindData: {//提交后台使用
        tnAqjcjhid:'',
        tcJhmc:'',
        tcJhjzsj:'',
        tcJhsm: '',
        tnTbzt:'',
        tcWtsm:'',
        tcDwdm:'',
        tcDwmc:'',
        //安全检查表
        aqjcAqjctiDto: [],//提交后台使用
      },
      rules: {
        tcWtsm: [Validator.required("请输入情况说明")]
      },
      readonly: false,
      disabled: false,
      spanArr: [],
      pos: 0,
      pageData: JSON.parse(this.$route.query.row),
      tcYhzh: JSON.parse(window.sessionStorage.user).tcYhzh
    };
  },
  methods: {
    $init(options) {
      const data = JSON.parse(this.$route.query.row);
      if (data.tbzt === "1") {
        this.readonly = true;
        this.disabled = true;
      } else {
        this.readonly = false;
        this.disabled = false;
      }
      //赋值任务信息
      this.bindData.tnAqjcjhid = data.tnAqjcjhid;
      this.bindData.tcJhmc = data.tcJhmc;
      this.bindData.tcJhsm = data.tcJhsm;
      this.bindData.tcJhjzsj = data.tcJhjzsj;
      this.bindData.tcDwdm = data.sxid || data.tcDwdm;
      this.bindData.tcDwmc = data.sxmc || data.tcDwmc;
      this.bindData.tdCjsj = data.tdCjsj;
      this.getListData();
    },
    _onSave(tnTbzt) {
      //现场检查验证
      this.bindData["aqjcAqjctiDto"][0]["tcWtsm"] = this.bindData.tcWtsm;
      this.bindData.tnTbzt = tnTbzt;
      this.bindData["tcWtsm"] = this.bindData.aqjcAqjctiDto[0].tcWtsm;
      if (this.bindData.tcWtsm) {
        this.addData("2");
      }
    },
    _onAgree(){
      this.setAgree()
    },
    _checkboxChange(val, tnAqjczjid, yhctId){
      if(val){
        this.bindData.aqjcAqjctiDto.forEach(el => {
          if(tnAqjczjid === el.tnAqjczjid){
            el.yhctList.push({tnYhctid:yhctId})
          }
        })
      }
      else{
        this.bindData.aqjcAqjctiDto.forEach(ele => {
          if(ele.tnAqjczjid === tnAqjczjid){
            ele.yhctList.filter(yhct => {
              return yhct.tnYhctid!==yhctId
            })
          }
        });
      }
    },
    _objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    setColRowSpan() {
      const data = this.bindData.aqjcAqjctiDto;
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].tcJcfs === data[i - 1].tcJcfs) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },

    _onRemove(attachment, tnAqjczjid){
      this.$confirm('确认删除当前附件？').then(() => {
        //移除文件显示列表数据
        this.bindData.aqjcAqjctiDto.forEach(el=>{
          if(el.tnAqjczjid === tnAqjczjid){
            el.xtFjList = el.xtFjList.filter(ele => ele.uid != attachment.uid);
          }
        })
      }).catch(err => {})
    },
    _requestFile(param, tnAqjczjid) {
      var fileObj = param.file
      var form = new FormData()    // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId',window.sessionStorage.sessionId)
      form.append('lylx', 0),
      form.append('isVideo', 1),//0否1是
      form.append('cdId','0004060201')
      form.append('isQuery', 0)
      this.uploadFile(form, fileObj.name, tnAqjczjid, fileObj.uid)
    },
    async uploadFile(data, name, tnAqjczjid, uid) {
      const result = await CommonModel.uploadFile(data);
      if (result.state === "1") {
        this.$message({
          message: "上传成功!",
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true
        });
        //修改上传图片文件名
        this.bindData.aqjcAqjctiDto.forEach(el => {
          if (el.tnAqjczjid === tnAqjczjid) {
            el.xtFjList.push({
              name: name,
              tcYwjmc: result.data.split(",")[0],
              url: "",
              tcXwjmc: result.data.split(",")[1],
              tcWjmc: result.data,
              uid: uid
            });
          }
        });
      } else {
        this.bindData.aqjcAqjctiDto.forEach(el => {
          if (el.tnAqjczjid === tnAqjczjid) {
            el.xtFjList = el.xtFjList.filter(ele => {
              return ele.name != name;
            });
          }
        });
      }
    },
    async getListData() {
      const result = await Model.getListData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1, //是否是查询类 0-否 1-是
        cdId: "0004060201", //菜单ID
        requestData: this.bindData
      });
      if (result) {
        const data = result.data
        data.forEach(el => {
          el['xtFjList'] = el['xtFjList'] || []
          if(!el.aqjctiList || el.aqjctiList.length == 0){
            el.aqjctiList = []
            el.aqjctiList.push({yhctList: [...el.yhctList]})
          }
          el['tnAqjczjid'] = el['tnAqjczjid'].toString()
          el['tcSxid'] = el['tnAqjczjid']
        })
        this.bindData['aqjcAqjctiDto'] = data.map(item => ({ ...item }))
        this.bindData.tcWtsm = this.bindData['aqjcAqjctiDto'][0]['tcWtsm']
        this.setColRowSpan()
      }
    },
    async addData(qztg) {
      const data = this.bindData.aqjcAqjctiDto;
      this.bindData.fxcjc = "1"; //必传1不验证，2验证
      this.bindData.aqjcAqjctiDto.forEach(el => {
        el.yhctList = el.aqjctiList[0].yhctList.filter(
          ele => ele.select === true
        );
        if (el.tcSfxcjc === "2") {
          this.bindData.fxcjc = "2";
        }
      });
      //1不验证，2验证
      this.bindData.qztg = qztg === "1" ? "1" : "2";
      const result = await Model.addData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 0, //是否是查询类 0-否 1-是
        cdId: "0004060201", //菜单ID
        requestData: this.bindData
      });
      if (result.state === "1") {
        if (result.data) {
          this.$confirm("未找到对应非现场数据，是否强制通过验证？")
            .then(() => {
              //不进行验证
              this.addData("1");
            })
            .catch(err => {});
        } else {
          this.$message({
            message: "操作成功!",
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true
          });
          this.$router.push({ path: "/safe/exec/form" });
        }
      }
    },
    async setAgree(){
      const result = await Model.setAgree({
        isQuery: 1, //是否是查询类 0-否 1-是
        cdId: "0004060201", //菜单ID
        requestData: {
          tnAqjctoid: this.pageData.tnAqjctoid
        }
      })
      if(result){
        this.$message({
          message: result.msg,
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true
        })
      }
    },
  }
};
</script>