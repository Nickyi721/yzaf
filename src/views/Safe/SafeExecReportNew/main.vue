<template>
  <CustomView title="安全检查报告书详情">
    <el-form ref="form" :rules="rules" :model="formData"  label-width="120px" class="common-form-dlg">
      <el-form-item>
        <div class="title">
          <h2 class="safeTittle">安全检查报告</h2>
        </div>
      </el-form-item>
      <div class="header">
        <div class="check">
          <div class="checkDetail">
            <img src="../../../assets/image/jcry.png" alt="">
            <p class=checkType>检查人员</p>
            <p class="checkTypeInfo">{{ formData.tcJcry }}</p>
          </div>
          <div class="checkDetail">
            <img src="../../../assets/image/jcrq.png" alt="">
            <p class=checkType>检查日期</p>
            <p class="checkTypeInfo">{{ formData.jcdate }}</p>
          </div>
          <div class="checkDetail">
            <img src="../../../assets/image/jcdw.png" alt="">
            <p class=checkType>检查单位</p>
            <p class="checkTypeInfo">{{ formData.tcJcdw }}</p>
          </div>
        </div>
      </div>
      <p class="checkDw"><span>被检单位：</span>{{ formData.tcBjcdwmc }}</p>
       <ul class="detail">
        <li>
          <p class="tittleDetail">
            <CustomIcon name="time-limits"/>
            检查内容及存在问题
          </p>
          <el-form-item prop="tcNrwtXS">
            <el-input v-model="formData['tcNrwtXS']" rows="10" type="textarea" size="mini" placeholder="检查内容及存在问题"></el-input>
          </el-form-item>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="rectification-opinion"/>
            整改意见和时限
          </p>
          <el-form-item prop="tcZgyjsx">
            <el-input v-model="formData['tcZgyjsx']" rows="10" type="textarea" size="mini" placeholder="整改意见和时限"></el-input>
          </el-form-item>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="inspection-opinion"/>
            被检查单位意见
          </p>
          <el-form-item prop="tcBjcdwyj">
            <el-input v-model="formData['tcBjcdwyj']" rows="10" type="textarea" size="mini" placeholder="被检查单位意见"></el-input>
          </el-form-item>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="leader-instruction"/>
            检查单位主管领导批示
          </p>
          <el-form-item prop="tcJcdwzg">
            <el-input v-model="formData['tcJcdwzg']" rows="10" type="textarea" size="mini" placeholder="检查单位主管领导批示"></el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form>

    <CustomControlBar slot="bottom">
      <el-button type="primary" size="mini" @click="_ButtonSubmit">生成安全检查报告</el-button>
    </CustomControlBar>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      formData: {
        tcNrwtXS: '',
        tcNrwt: '',
        tcZgyjsx: '',
        tcBjcdwyj: '',
        tcJcdwzg: ''
      }, 
      rules: {
        tcBgsbh: [
          Validator.required('请输入报告编号'),
        ],
        tcNrwtXS: [
          Validator.required('请输入整改意见和时限'),
          Validator.length(1, 2000)
        ],
        tcZgyjsx: [
          Validator.required('请输入整改意见和时限'),
          Validator.length(1, 800)
        ],
        tcBjcdwyj: [
          Validator.required('请输入被检查单位意见'),
          Validator.length(1, 800)
        ],
        tcJcdwzg: [
          Validator.required('请输入检查单位主管领导批示'),
          Validator.length(1, 800)
        ],
      }
    }
  },
  methods: {
    $init() {
      this.formData = JSON.parse(this.$route.query.report)
      this.formData.tcJcry = JSON.parse(window.sessionStorage.user).tcYhmc
      this.formData.tcNrwt = this.formData.jcnrlist.join(',').replace(new RegExp('null--','gm'),'')
      this.formData.tcNrwtXS = this.formData.tcNrwt.replace(new RegExp('###','gm'),'')
      this.formData.tcBjcdwid = this.formData.bjdwdmlist.join(',')
      this.formData.tcBjcdwmc = this.formData.bjdwlist.join(',')
    },
    _ButtonSubmit() {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          // this.$confirm('保存后上级单位会实时接收到此报告书，且无法修改，是否确认保存？').then(async () => {
          this.$confirm('保存后无法修改，是否确认保存？').then(async () => {
            const result = await Model.saveSafeReport({
              isQuery: 0,
              cdId: '0004060202',
              requestData: {
                tcAqjctoid: this.formData.tcAqjctoid || '',
                tnAqjcjhid: this.formData.tnAqjcjhid || '',
                // tcBgsbh: this.formData.tcBgsbh || '',
                tcNrwt: this.formData.tcNrwt || '',
                tcZgyjsx: this.formData.tcZgyjsx || '',
                tcBjcdwyj: this.formData.tcBjcdwyj || '',
                tcJcdwzg: this.formData.tcJcdwzg || '',
                tcJcdwid: this.formData.tcJcdwdm || '',
                tcJcdwmc: this.formData.tcJcdw || '',
                tcBjcdwid: this.formData.tcBjcdwid || '',
                tcBjcdwmc: this.formData.tcBjcdwmc || '',
                tcJcry: this.formData.tcJcry || '',
                tcJcrq: this.formData.jcdate || '',
                tcDwdm: this.formData.tcJcdwdm || '',
                tcDwmc: this.formData.tcJcdw || '',
              }
            })
            if(result.state === '1') {
              this.$message({
                  message: "保存报告书成功！",
                  type: 'success',
                  showClose: true,
                  duration: 1000,
                  customClass: "middle",
                })
                this.$router.push({path: '/safe/exec/query'})
            }
          }).catch(err => {})
          this.$refs.form.clearValidate()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";

  /deep/ .view-body{
    background:#f8f8f8;
    padding-top:10px !important;
  }
  .common-form{
  width: calc(100% - 20px);
  margin-left:10px;
  background:rgba(255,255,255,1);
  margin-bottom:100px;
  }
/deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
  h2{
    text-align: center;
  }
.header{
    width:100%;
    height:58px;
  }
  .check{
    width:510px;
    height:58px;
    margin:auto;
  }
  .checkDetail{
    float:left;
    width:170px;
    height:58px;
    position:relative;
  }
  .checkType{
    height:19px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:19px;
    color:rgba(153,153,153,1);
    position:absolute;
    top:8px;
    left:58px;
  }
 .checkTypeInfo{
    height:19px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:19px;
    color:rgba(51,51,51,1);
    opacity:1;
    position:absolute;
    top:28px;
    left:58px;
}
.checkDw{
    width:100%;
    height:19px;
    margin-left: 10px;
    margin-bottom: 16px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:19px;
    color:rgba(51,51,51,1);
    span{
      color:rgba(153,153,153,1);
    }
}
.detail{
    li{
      overflow: hidden;
      border:transparent;
      border-top:1px dotted rgba(238,238,238,1);
      width: calc(100% - 32px);
      margin-left:16px;
      padding-bottom:20px;
      .iconfont{
        font-weight: normal;     
        font-size: 24px;
        vertical-align: -3px;
      }
      &:nth-child(1){
        .iconfont{
          color:$orange
        }
      }
      &:nth-child(2){
        .iconfont{
          color:$blue
        }
      }
      &:nth-child(3){
        .iconfont{
          color:$cyan
        }
      }
      &:nth-child(4){
        border-bottom:1px dotted rgba(238,238,238,1);
        .iconfont{
          color:$error
        }
      }
    }
  }
  .tittleDetail{
    height:19px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    line-height:19px;
    color:rgba(51,51,51,1);
    padding-top: 12px;
    padding-bottom: 15px;
  }
  .detailContent{
    width:100%;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:19px;
    color:rgba(51,51,51,1);
    padding-top:14px;
    padding-bottom:25px;
  }  
  .icon {
    width: 24px;
    height: 24px;
    vertical-align: -6px;
    fill: currentColor;
    overflow: hidden;
    margin-right:8px;
  }
  .icon1 {
    width:16px;
    height:16px;
    vertical-align: -6px;
    fill: currentColor;
    overflow: hidden;
    margin-right:8px;
    vertical-align: -3px;
  }  
  .save {
    width:100%;
    height:64px;
    position:fixed;
    bottom:0;
    background:#fff;
  }
 
  .el-form-item{
    margin-top:10px;
    margin-bottom:0;
  }
</style>
