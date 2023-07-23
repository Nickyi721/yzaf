<template>
  <div class="sign">
    <div class="container">
        <h2>修改密码</h2>
        <div class="main">
          <span>用户名</span>
          <input type=text v-model="userName" readonly>
          <span>原密码</span>
          <el-tooltip class="item" effect="dark" placement="top-start" :manual="true" :hide-after="2000" v-model="origionPwdToolTipVisable">
            <div slot="content">{{origionPwdToolTip}}</div>
            <input type=password v-model="origionPwd" placeholder="请输入原密码">
          </el-tooltip>
          <span>新密码</span>
          <el-tooltip class="item" effect="dark" placement="top-start" :manual="true" :hide-after="2000" v-model="newPwdToolTipVisable">
            <div slot="content">{{newPwdToolTip}}</div>
            <input type=password v-model="newPwd" placeholder="请输入新密码">
          </el-tooltip>
          <span>确认新密码</span>
          <el-tooltip class="item" effect="dark" placement="top-start" :manual="true" :hide-after="2000" v-model="comfirmPwdToolTipVisable">
            <div slot="content">{{comfirmPwdToolTip}}</div>
            <input type=password v-model="comfirmPwd" placeholder="请再次输入新密码"  >
          </el-tooltip>
          <button type="button" name="button" @click="comfirm">确认</button>
          <button type="button" name="button" @click="cancel">取消</button>
        </div>
      </div>
    </div>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  data(){
    return{
      userName:'',
      origionPwd:'',
      newPwd: '',
      comfirmPwd: '',
      origionPwdToolTip: '',
      origionPwdToolTipVisable: false,
      newPwdToolTip: '',
      newPwdToolTipVisable: false,
      comfirmPwdToolTip: '',
      comfirmPwdToolTipVisable: false
    }
  },
  methods: {
    $init(options) {
      let user = JSON.parse(window.sessionStorage.user)
      this.userName = user.tcYhmc
    },
    async comfirm() {
      if(this.validation()){
        console.log(this.newPwd)
        const result = await Model.alterPwd({
          requestData: {
            passwordOld : encodeURI(this.origionPwd),
            passwordNew : encodeURI(this.newPwd),
            passwordNewSec: encodeURI(this.comfirmPwd), 
          }
        })
        if(result){
          const router = this.$router
          this.$message({
            message:result.msg + ", 请重新登录!",
            type:"success",
            duration:1000,
            customClass: "middle",
            onClose:function(){
              delete window.sessionStorage.user
              delete window.sessionStorage.sessionId
              delete window.sessionStorage.menuIds
              delete window.sessionStorage.boardIds
              router.push('/sign')
            }
          })
        }
        
      }
    },
    cancel(){
      this.$router.push('/')
    },
    validation(){
      let flag = 1
      let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{16,32}$/;
      if(this.origionPwd==null||this.origionPwd==''){
        this.origionPwdToolTip= '请输入原密码!'
        this.origionPwdToolTipVisable = true
        setTimeout(()=> {
          this.origionPwdToolTipVisable = false
        },2000)
        flag=0
      }
      if(this.newPwd==null||this.newPwd==''){
        this.newPwdToolTip= '请输入新密码!'
        this.newPwdToolTipVisable = true
        setTimeout(()=> {
          this.newPwdToolTipVisable = false
        },2000)
        flag=0
      }
      if(!reg.test(this.newPwd)){
        this.newPwdToolTip= '密码必须包含大小写字母、数字、特殊字符，长度为16-32位!'
        // var str = "ssssss";
        // console.log(reg.test(str));
        this.newPwdToolTipVisable = true
        setTimeout(()=> {
          this.newPwdToolTipVisable = false
        },2000)
        flag=0
      }
      if(this.comfirmPwd==null||this.comfirmPwd==''){
        this.comfirmPwdToolTip= '请确认新密码!'
        this.comfirmPwdToolTipVisable = true
        setTimeout(()=> {
          this.comfirmPwdToolTipVisable = false
        },2000)
        flag=0
      }
      if(this.origionPwd===this.newPwd){
        this.newPwdToolTip= '新密码不能与原密码相同，请重新输入!'
        this.newPwdToolTipVisable = true
        setTimeout(()=> {
          this.newPwdToolTipVisable = false
        },2000)
        flag=0
      }
      if(this.comfirmPwd!=null&&this.comfirmPwd!=''&&this.comfirmPwd!=this.newPwd){
        this.comfirmPwdToolTip = '两次输入密码不一致，请重新输入!'
        this.comfirmPwdToolTipVisable = true
        setTimeout(()=> {
          this.comfirmPwdToolTipVisable = false
        },2000)
        flag=0
      }
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/define.scss";
.sign{
  height: 100%;
  width: 100%;
  background: linear-gradient(#0daf5a, #3fc29e);
  display: flex;
  align-items: center;
  justify-content: center;

  *{
    user-select: none;
    outline:none
  }

  .container{

    height: 500px;
    background: white;  
    width: 400px;
    overflow: hidden;
    border-radius: 4px;

    h2{
      padding: 20px;
    text-align: center;
    }

    .main{
      height: 80%;
      width: 100%;
      background: #fff;
      padding: 20px 48px;

      span{
        display: block;
        align-items: center;
        margin-bottom: 10px;
      }

      input{
        height: 36px;
        line-height: 36px;
        background: #eeeeee;
        border: none;
        border: 1px solid #eeeeee;
        margin-bottom: 10px;
        border-radius: 4px;
        width: 310px;
        text-indent: 10px;
        font-size: 12px;
      }

      button{
        background: $green;
        color: #fff;
        font-weight: bold;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
        border: none;
        border-radius: 20px;
        width: 40%;
        cursor: pointer;
        margin: 20px 5%;
      }
    }
  }
}
</style>
