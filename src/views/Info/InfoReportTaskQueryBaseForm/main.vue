<template>
  <CustomView :location="[{ text: '企业信息安全日报表' }]">
    <CustomTitle>
      {{row.tcDwmc}}
    </CustomTitle>
    <el-form :inline="true" :rules="formRules" :model="formData" :disabled="controlButton" label-position="top" class="common-form">
      
      <div class="type">
        <span class="type-title">企业全国范围查处的违禁品数量</span>
        <el-form-item label="枪支弹药" prop="tnQzdy_0">
          <el-input  v-model="formData['tnQzdy_0']" type="number" size="mini" placeholder="请输入枪支弹药数量"></el-input>
        </el-form-item>
        <el-form-item label="易燃易爆品" prop="tnYrybp_0">
          <el-input  v-model="formData['tnYrybp_0']" type="number" size="mini" placeholder="请输入易燃易爆品数量"></el-input>
        </el-form-item>
        <el-form-item label="剧毒物品" prop="tnJdwp_0">
          <el-input  v-model="formData['tnJdwp_0']" type="number" size="mini" placeholder="请输入剧毒物品数量"></el-input>
        </el-form-item>
        <el-form-item label="管制刀具" prop="tnGzdj_0">
          <el-input  v-model="formData['tnGzdj_0']" type="number" size="mini" placeholder="请输入管制刀具数量"></el-input>
        </el-form-item>
        <el-form-item label="政治性反动刊物" prop="tnZzxfdkw_0">
          <el-input  v-model="formData['tnZzxfdkw_0']" type="number" size="mini" placeholder="请输入政治性反动刊物数量"></el-input>
        </el-form-item>
        <el-form-item label='"低慢小"航空器' prop="tnDmxhkq_0">
          <el-input  v-model="formData['tnDmxhkq_0']" type="number" size="mini" placeholder="请输入低慢小航空器数量"></el-input>
        </el-form-item>
        <el-form-item label="其他违禁品" prop="tnQtwjp_0">
          <el-input  v-model="formData['tnQtwjp_0']" type="number" size="mini" placeholder="请输入其他违禁品数量"></el-input>
        </el-form-item>
      </div>
      <div class="type">
        <span class="type-title">二次安检执行情况</span>
        <el-form-item label="二次安检业务量" prop="tnAjywl_0">
          <el-input  v-model="formData['tnAjywl_0']" type="number" size="mini" placeholder="请输入二次安检业务量"></el-input>
        </el-form-item>
        <el-form-item label="发现违禁品数量" prop="tnWjpsl_0">
          <el-input  v-model="formData['tnWjpsl_0']" type="number" size="mini" placeholder="请输入发现违禁品数量"></el-input>
        </el-form-item><br>
        <span class="type-input">列出具体违禁品</span>
        <el-input v-model="formData['tcWjpsm_2']" type="textarea" :rows="3" size="mini" placeholder="请列出具体违禁品"></el-input>
       
      </div>
      <div class="type">
        <span class="type-title">单位安全检查情况</span>
        <el-form-item label="每日组织安全检查人次" prop="tnAqjcrc_0">
          <el-input  v-model="formData['tnAqjcrc_0']" type="number" size="mini" placeholder="请输入每日组织安全检查人次"></el-input>
        </el-form-item><br>
        <span class="type-input">主要问题及整改措施</span>
        <el-input v-model="formData['tcWtjzgcs_2']" type="textarea" :rows="3" size="mini" placeholder="请输入单位安全检查情况发现的主要问题及整改措施"></el-input>
      </div>
      <div class="type">
        <span class="type-title">邮件、快件积压爆仓延误情况</span>
        <el-input v-model="formData['tcYjqksm_2']" type="textarea" :rows="3" size="mini" placeholder="请输入邮件、快件积压爆仓延误情况"></el-input>
      </div>
      <div class="type">
        <span class="type-title">单位安全生产事件事故</span>
        <el-input v-model="formData['tcSgqksm_2']" type="textarea" :rows="3" size="mini" placeholder="请输入单位安全生产事件事故"></el-input>
      </div>    
    </el-form>

    <CustomControlBar slot="bottom">
      <el-button v-if="controlButton" class="update" type="primary" size="mini" @click="_ButtonUpdateClick">修改</el-button>
      <el-button v-if="!controlButton" class="save" type="primary" size="mini" @click="_ButtonSaveClick(0)">保存</el-button>
      <el-button v-if="controlButton" class="submit" type="primary" size="mini" @click="_ButtonSubmitClick(0)">提交</el-button>
      <el-button  v-if="!controlButton" class="submit" type="primary" size="mini" @click="_ButtonCancelClick">取消</el-button>
    </CustomControlBar>

  </CustomView>
</template>

<script>
import Moment from 'moment'
import Mixin from '@mixins'
import Validator from '@commons/validator.js'

import Model from './model.js'
// import { async } from 'q';
export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      formData: {
        tnQzdy_0: '',
        tnYrybp_0: '',
        tnJdwp_0: '',
        tnGzdj_0: '',
        tnZzxfdkw_0: '',
        tnDmxhkq_0: '',
        tnQtwjp_0: '',
        tnAjywl_0: '',
        tnWjpsl_0: '',
        tcWjpsm_2: '',
        tnAqjcrc_0: '',
        tcWtjzgcs_2: '',
        tcYjqksm_2: '',
        tcSgqksm_2: '',
      },    
      formRules:{
        tnQzdy_0:[Validator.length(1,11)],
        tnYrybp_0:[Validator.length(1,11)],
        tnJdwp_0:[Validator.length(1,11)],
         tnGzdj_0:[Validator.length(1,11)],
        tnZzxfdkw_0:[Validator.length(1,11)],
        tnDmxhkq_0:[Validator.length(1,11)],
        tnQtwjp_0:[Validator.length(1,11)],
        tnAjywl_0:[Validator.length(1,11)],
        tnWjpsl_0:[Validator.length(1,11)],
        tnAqjcrc_0:[Validator.length(1,11)],
      },
      optionAjywl: [],
      controlButton: false,
      row: {}
    }
  },
  methods: {
    $init(options) {
      this.getDetail()
    },
      // 判断填报后填充数据
    async getDetail() {
      this.row = JSON.parse(this.$route.query.row)
      if(this.row.xxglTbsjList && this.row.xxglTbsjList.length !== 0) {
        this.controlButton = true
        this.row.xxglTbsjList.forEach(item => {
          if(item[0].tnHh < this.row.xxglTbsjList.length) {
            if(item[0].tnHh === 0) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnQzdy_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnQzdy_0 = ''
              }
            } else if(item[0].tnHh === 1) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnYrybp_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnYrybp_0 = ''
              }
            } else if(item[0].tnHh === 2) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnJdwp_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnJdwp_0 = ''
              }
            } else if(item[0].tnHh === 3) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnGzdj_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnGzdj_0 = ''
              }
            } else if(item[0].tnHh === 4) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnZzxfdkw_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnZzxfdkw_0 = ''
              }
            } else if(item[0].tnHh === 5) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnDmxhkq_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnDmxhkq_0 = ''
              }
            } else if(item[0].tnHh === 6) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnQtwjp_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnQtwjp_0 = ''
              }
            } else if(item[0].tnHh === 7) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnAjywl_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnAjywl_0 = ''
              }
            } else if(item[0].tnHh === 8) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnWjpsl_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnWjpsl_0 = ''
              }
            } else if(item[0].tnHh === 9) {
              if(item[0].tcZfclxsj !== 0) {
                this.formData.tcWjpsm_2 = item[0].tcZfclxsj
              } else {
                this.formData.tcWjpsm_2 = ''
              }
            } else if(item[0].tnHh === 10) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnAqjcrc_0 = item[0].tnSzzxsj
              } else {
                this.formData.tnAqjcrc_0 = ''
              }
            } else if(item[0].tnHh === 11) {
              if(item[0].tcZfclxsj !== 0) {
                this.formData.tcWtjzgcs_2 = item[0].tcZfclxsj
              } else {
                this.formData.tcWtjzgcs_2 = ''
              }
            } else if(item[0].tnHh === 12) {
              if(item[0].tcZfclxsj !== 0) {
                this.formData.tcYjqksm_2 = item[0].tcZfclxsj
              } else {
                this.formData.tcYjqksm_2 = ''
              }
            } else {
              if(item[0].tcZfclxsj !== 0) {
                this.formData.tcSgqksm_2 = item[0].tcZfclxsj
              } else {
                this.formData.tcSgqksm_2 = ''
              }
            }
          }
        })
      }
    },
    // 事件-修改
    async _ButtonUpdateClick() {
      this.controlButton = false
    },
    // 事件-报表保存
    async _ButtonSaveClick(sffg) {
      if(this.formData.tcWtjzgcs_2.length > 200 
      || this.formData.tcWtjzgcs_2.lenth > 200 
      || this.formData.tcYjqksm_2.length > 200
      || this.formData.tcSgqksm_2.length > 200){
        this.$alert('输入情况或事故不能大于200字').catch(()=>{})
        return
      }
      let data="";
       for (let i = 0; i < Object.values(this.formData).length ; i++) {
          data=data+ Object.values(this.formData)[i];
       }
      //  console.log(data);
      //  console.log(Object.values(this.formData).length );
      if(data.trim() !== "") {
        this.row= JSON.parse(this.$route.query.row)
        let xxglTbsjList = []
        Object.keys(this.formData).forEach((item, index) => {
          const sjlx = item.split('_')
          let itemArr = []
          let obj = {}
          if(this.formData[item] !== '') {
            obj = {
              tnBbtiid: 1,
              value: this.formData[item],
              sjlx: parseInt(sjlx[1])
            }
          } else {
            if(parseInt(sjlx[1]) === 0) {
              obj = {
                tnBbtiid: 1,
                value: 0,
                sjlx: parseInt(0)
              }
            } else {
              obj = {
                tnBbtiid: 1,
                value: '',
                sjlx: parseInt(2)
              }
            }
          }
          itemArr.push(obj)
          xxglTbsjList.push(itemArr)
        })
        const result = await Model.saveForm({
          isQuery: 0,
          cdId: '0004030303',
          requestData: {
            tnRwid: this.row.tnRwid,
            tcRwmc: this.row.tcRwmc,
            tcRwsm: this.row.tcRwsm,
            tnTbzt: this.row.tnTbzt,
            tnLx: this.row.tnLx,
            tnBbtoid: this.row.tcMbid,
            xxglTbsjList: xxglTbsjList,
            sffg: sffg
          }
        })
        if(result.state === '1') {
          if(result.data){
            this.$confirm(result.msg).then(() => {
              this._ButtonSaveClick(1)
            }).catch(err => { })
          }
          else{
            this.$message({
              message: "报表保存成功！",
              type: 'success',
              showClose: true,
              duration: 1000,
              customClass: "middle",
            })
            this.controlButton = true
          }
        }
      } else {
        this.$message({
          message: "报表不能为空！",
          type: 'warning',
          showClose: true,
          duration: 1000,
          customClass: "middle",
        })
      }
    },
    // 事件-报表提交
    async _ButtonSubmitClick(sffg) {
      if(this.formData.tcWtjzgcs_2.length > 200 
      || this.formData.tcWtjzgcs_2.lenth > 200 
      || this.formData.tcYjqksm_2.length > 200
      || this.formData.tcSgqksm_2.length > 200){
        this.$alert('输入情况或事故不能大于200字').catch(()=>{})
        return
      }
       let data="";
       for (let i = 0; i < Object.values(this.formData).length; i++) {
              data=data+ Object.values(this.formData)[i];
       }
      if(data.trim() !== "") {
        this.row= JSON.parse(this.$route.query.row)
        let xxglTbsjList = []
        Object.keys(this.formData).forEach((item, index) => {
          const sjlx = item.split('_')
          let itemArr = []
          let obj = {}
          if(this.formData[item] !== '') {
            obj = {
              tnBbtiid: 1,
              value: this.formData[item],
              sjlx: parseInt(sjlx[1])
            }
          } else {
            if(sjlx[1]===0) {
              obj = {
                tnBbtiid: 1,
                value: 0,
                sjlx: parseInt(0)
              }
            } else {
              obj = {
                tnBbtiid: 1,
                value: '',
                sjlx: parseInt(2)
              }
            }
          }
          itemArr.push(obj)
          xxglTbsjList.push(itemArr)
        })
        const result = await Model.saveForm({
          isQuery: 0,
          cdId: '0004030303',
          requestData: {
            tnRwid: this.row.tnRwid,
            tcRwmc: this.row.tcRwmc,
            tcRwsm: this.row.tcRwsm,
            tnTbzt: 1,
            tnLx: this.row.tnLx,
            tnBbtoid: this.row.tcMbid,
            xxglTbsjList: xxglTbsjList,
            sffg: sffg
          }
        })
        if(result.state === '1') {
          if(result.data === 1){
            this.$confirm(result.msg).then(() => {
              this._ButtonSubmitClick(1)
            }).catch(err => { })
          }
          else{
            this.$message({
              message: result.msg,
              type: 'success',
              showClose: true,
              duration: 1000,
              customClass: "middle",
            })
            this.$router.push({
              path: '/info/report/task-query'
            })
          }
        }
      } else {
        this.$message({
          message:"报表不能为空！",
          type: 'warning',
          showClose: true,
          duration: 1000,
          customClass: "middle",
        })
      }
    },
    // 事件-取消修改
    _ButtonCancelClick () {
      this.getDetail()
    }
  },
}
</script>

<style lang="scss" scoped>
  
  .title {
    height:48px;
    background:rgba(248,248,248,1);
    opacity:1;
    padding: 10px;
    .org {
      width:160px;
      height:26px;
      font-size:20px;
      font-family:Microsoft YaHei;
      font-weight:bold;
      line-height:28px;
      color:rgba(51,51,51,1);
      opacity:1;
    }
    .date {
      width:78px;
      height:19px;
      float: right;
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      line-height:28px;
      color:rgba(51,51,51,1);
      opacity:1;
    }
  }
  .type {
    padding: 10px;
    .type-title {
      display: block;
      height:32px;
      font-size:14px;
      font-weight:bold;
      line-height:32px;
      color:rgba(51,51,51,1);
      opacity:1;
    }
    .type-input {
      display: block;
      height:19px;
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      line-height:19px;
      color:rgba(102,102,102,1);
      opacity:1;
    }
  }
  .button {
    height:64px;
    background:rgba(255,255,255,1);
    box-shadow:0px -3px 6px rgba(0,0,0,0.08);
    opacity:1;
    .save, .update {
      // width:128px;
      // height:48px;
      margin: 18px;
      background:rgba(0,161,68,1);
      opacity:1;
      border-radius:4px;
      color:rgba(255,255,255,1);
    }
    .submit {
      // width:128px;
      // height:48px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(204,204,204,1);
      opacity:1;
      border-radius:4px;
      color:rgba(102,102,102,1);
    }
  }
</style>

