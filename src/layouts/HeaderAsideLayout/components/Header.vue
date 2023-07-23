<template>
  <div class="header">
    <div class="logo">
      <router-link to="/"><img src="../../../assets/logo.png" alt=""></router-link>
    </div>
    <div class="extra">
      <div class="qr-code" @click="_btnClick">
        <CustomIcon name="qr-code" />
        <span>二维码</span>
      </div>
      <div class="user" @click="alterPassword">
        <CustomIcon name="user" />
        <span>{{this.userName}}</span>
      </div>
      <div class="exit" @click="logout">
        <CustomIcon name="exit"/>
        <span>退出</span>
      </div>
    </div>
    <CustomDialog title="二维码信息" width="300px" top="110px" :visible="userDlgVisible" @close="userDlgVisible = false">
      <img :src="src" />
      <div class="dialog-button">
        <el-button type="primary" size="mini" style='background: white!important;width: 2px!important;height: 2px!important;border: none;'></el-button>
      </div>
    </CustomDialog>
  </div>
</template>
<style scoped>
  button{
    width: 55px;
    height: 25px!important;
    background: #e8efec;
    border: 1px solid #e8efec;
    border-radius: 5px;
    color: grey!important;
    line-height: 25px!important;
  }
  .dialog-button{
    margin: -25px 0 10px 120px
  }
</style>

<script>
import CommonModel from '@commons/model.js'
import config from '@commons/config.js'
import Mixin from '@mixins'

export default {
  data () {
    return {
      userName:JSON.parse(window.sessionStorage.user).tcYhmc,
      breads: [],
      userDlgVisible: false,
      src: ""
    };
  },
  mixins: [
    Mixin.init, 
  ],
  methods: {
    $init(){
    },
    _btnClick() {
      this.userDlgVisible = true
      this.src = `${config.host + config.api}/qrcode/loadQrCodeItem?v=${new Date()}`
    },
    async logout () {
      const result = await CommonModel.logOut()
      if (result && result.state === '1') {
        delete window.sessionStorage.user
        delete window.sessionStorage.sessionId
        delete window.sessionStorage.menuIds
        delete window.sessionStorage.boardIds
        this.$router.push('/sign')
      }
      this.$message({
        message: result.msg,
        type: 'success',
        duration: 1000,
        customClass: "middle",
        showClose: true
      })
    },
    alterPassword(){
      this.$emit("alterPwd")
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";

.header{
  background: $green;
  height: 49px;
  position: relative;
  user-select: none;

  &::after{
    content: '';
    display: block;
    clear: both;
  }

  .logo{
    float: left;
    height: 49px;
    padding: 5px 0px 4px 10px;
    img{
      // width: 381px;
      height: 20px;
      margin: 10px
    }
  }

  .extra{
    float: right;
    margin-right: 15px;

    >*{
      display: inline-block;
      height: 49px;
      line-height: 49px;
      color: rgba(255,255,255,0.9);
      font-size: 13px;
      margin-left: 24px;
      cursor: pointer;

      i{
        color: rgba(255,255,255,0.9);
        font-size: 18px;
        vertical-align: middle;
      }
      span{
        margin-left: 8px;
      }
    }

  }
}
</style>
