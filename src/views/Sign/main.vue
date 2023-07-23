<template>
  <div>
    <!-- 非第三方登录情况 -->
    <div v-if="!!!UID" class="sign">
      <video id="background_video" loop muted></video>
      <div class="sign-container" :class="{show:isActive}">
        <div class="sign-container-img" style="height:100px">
          <img style="margin-top:40px" src="../../assets/sign/projectn2.png" alt>
        </div>
        <div class="sign-container-form">
          <div class="item">
            <el-tooltip
              class="item-user"
              placement="top-start"
              :manual="true"
              :hide-after="2000"
              v-model="userToolTipVisable"
            >
              <div slot="content">{{userToolTip}}</div>
              <input v-model.lazy="user" autofocus type="text" name placeholder="输入用户名" maxlength="50">
            </el-tooltip>
          </div>
          <div class="item">
            <el-tooltip
              class="item-pwd"
              placement="top-start"
              :manual="true"
              :hide-after="2000"
              v-model="passwordToolTipVisable"
            >
              <div slot="content">{{passwordToolTip}}</div>
              <input
                v-model="password"
                autocomplete="new-password"
                type="password"
                name
                placeholder="输入密码"
                @keydown.13="signin"
                maxlength="50"
              >
            </el-tooltip>
          </div>
          <div class="item item-code" v-if="showYzm">
            <el-tooltip
              class="item-validator"
              effect="dark"
              placement="top-start"
              :manual="true"
              :hide-after="2000"
              v-model="yzmToolTipVisable"
            >
              <div slot="content">请输入验证码</div>
              <input
                v-model="yzm"
                autocomplete="new-password"
                name
                placeholder="输入验证码"
                @keydown.13="signin"
                maxlength="10"
              >
            </el-tooltip>
            <img
              class="code"
              :src="`${config.host + config.api}/system/getVerificationCode?tcYhzh=${user}&v=${timestr}`"
              alt="密码"
              @click="getCode"
            >
          </div>
          <button type="button" onMouse name="button" @click="signin">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../assets/styles/define.scss";



.sign {
  * {
    user-select: none;
    outline: none;
  }
  video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .sign-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    > .sign-container-img {
      margin-bottom: 20px;
      height: 200px;
      > img {
        display: block;
        text-align: center;
        padding-bottom: 30px;
        margin: 0 auto;
      }
    }
    .sign-container-form {
      .item {
        .item-user {
          background: $bg url(../../assets/sign/user.png) no-repeat;
          background-position: 20px 10px;
        }
        .item-pwd {
          background: $bg url(../../assets/sign/pwd.png) no-repeat;
          background-position: 20px 10px;
        }
        .item-validator {
          background: $bg url(../../assets/sign/validator.png) no-repeat;
          background-position: 20px 10px;
        }
        img {
          display: inline-block;
          margin-left: 10px;
          margin-right: 0px;
          width: 112px;
          height: 42px;
          line-height: 42px;
          border: 1px solid $border-light;
          border-radius: 20px;
          vertical-align: middle;
        }
        &.item-code {
          input {
            width: 221px;
          }
        }
        input {
          width: 344px;
          height: 42px;
          line-height: 42px;
          border: none;
          border-radius: 20px;
          margin: 10px 0 10px 0;
          font-size: 16px;
          padding-left: 45px;
        }
      }
    }
  }
  button {
    width: 344px;
    height: 42px;
    line-height: 42px;
    background: $green;
    color: $bg;
    font-weight: bold;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin: 10px 0 0 0px;
  }
  .show {
    animation: show .5s;
  }
  @keyframes show {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>

<script>
import Model from "./model.js";
import Validator from "@commons/validator.js";
import config from "../../commons/config";
import { log } from "util";
import { setTimeout } from "timers";
import { Loading } from 'element-ui'
import bgMp4 from '@assets/sign/bg.mp4'
import Mixin from '@mixins'
export default {
  mixins: [Mixin.init],
  data() {
    return {
      rules: {
        tcYhzh: [Validator.required("请输入用户帐户"), Validator.length(1, 50)]
      },
      timestr: new Date().getTime(),
      config: config,
      user: "zengjulin",
      password: "ZENGjulin!#%246789",
      yzm: "",
      userToolTip: "",
      showYzm: false,
      yzmToolTipVisable: false,
      userToolTipVisable: false,
      passwordToolTip: "",
      passwordToolTipVisable: false,
      isActive: false,
      UID: ''
    };
  },
  methods: {
    $init() {
      this.UID = this.$route.query.UID
      if(!!this.UID) {
        this.user = this.$route.query.userName
        this.password = decodeURI(this.$route.query.password)
        this.signin()
      }
    },
    getCode() {
      this.timestr = new Date().getTime();
    },
    async signin() {
      if (this.validation() && !!!this.UID) {
        const params = {
          tcYhzh: this.user,
          tcYhmm: this.password
        };
        if (this.yzm) {
          params.yzm = this.yzm;
        }
        const result = await Model.login(params);
        if (result) {
          this.isActive = true;
          const data = result.loginDataMap;
          window.sessionStorage.sessionId = data.sessionId;
          window.sessionStorage.user = JSON.stringify(data.yhxxDto);
          window.sessionStorage.menu = JSON.stringify(data.cdId);
          window.sessionStorage.menuIds = JSON.stringify(
            this.createMenuTree(data.cdId)
          );
          window.sessionStorage.boardIds = JSON.stringify(data.bkId);
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 500);
        } else {
          this.showYzm = true;
          this.getCode();
        }
      }
      // 第三方登录情况
      if(!!this.UID){
        const params = {
          tcYhzh: this.user,
          tcYhmm: this.password
        };
        let loadingInstance
        loadingInstance = Loading.service({
          lock: true,
          target: '.custom-view',
          text: '正在登陆中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.3)'
        })
        const result = await Model.login(params);
        if (result) {
          loadingInstance && loadingInstance.close()
          this.isActive = true;
          const data = result.loginDataMap;
          window.sessionStorage.sessionId = data.sessionId;
          window.sessionStorage.user = JSON.stringify(data.yhxxDto);
          window.sessionStorage.menu = JSON.stringify(data.cdId);
          window.sessionStorage.menuIds = JSON.stringify(
            this.createMenuTree(data.cdId)
          );
          window.sessionStorage.boardIds = JSON.stringify(data.bkId);
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 500);
        }
      }
    },
    validation() {
      let flag = 1;
      if (this.user == null || this.user == "") {
        this.userToolTip = "请输入用户名!";
        this.userToolTipVisable = true;
        setTimeout(() => {
          this.userToolTipVisable = false;
        }, 2000);
        flag = 0;
      }
      if (this.password == null || this.password == "") {
        this.passwordToolTip = "请输入密码!";
        this.passwordToolTipVisable = true;
        setTimeout(() => {
          this.passwordToolTipVisable = false;
        }, 2000);
        flag = 0;
      }
      if (this.showYzm && (this.yzm == null || this.yzm == "")) {
        this.yzmToolTipVisable = true;
        setTimeout(() => {
          this.yzmToolTipVisable = false;
        }, 2000);
        flag = 0;
      }
      return flag;
    },
    async triggerPost() {
      const result = await Model.triggerPost({});
    },
    // 创建菜单树
    createMenuTree(menu) {
      const levelA = menu.filter(item => item.tnCdjb === 1);
      const levelB = menu.filter(item => item.tnCdjb === 2);
      const levelC = menu.filter(item => item.tnCdjb === 3);

      levelB.forEach(item => {
        if (item.tnSfcdmj === 1) {
          item.children = levelC.filter(
            child => child.tcSjcdid === item.tcCdid
          );
        }
      });

      levelA.forEach(item => {
        if (item.tnSfcdmj === 1) {
          item.children = levelB.filter(
            child => child.tcSjcdid === item.tcCdid
          );
        }
      });

      // 排序
      this.orderArray(levelA);
      return levelA;
    },
    bubbleSort(array) {
      let len = array.length;
      let temp;
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j <= len - 1 - 1; j++) {
          if (array[j].tcCdid > array[j + 1].tcCdid) {
            temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }
      return array;
    },
    orderArray(arr) {
      if (arr.length > 0) {
        arr = this.bubbleSort(arr);
        for (let i = 0; i < arr.length; i++) {
          let child1 = arr[i].children;
          if (
            child1 != undefined &&
            child1 != "undefined" &&
            child1.length > 0
          ) {
            arr[i].children = this.bubbleSort(child1);
            for (let j = 0; j < child1.length; j++) {
              let child2 = child1[j].children;
              if (
                child2 != undefined &&
                child2 != "undefined" &&
                child2.length > 0
              ) {
                child1[j].children = this.bubbleSort(child2);
              }
            }
          }
        }
      }
    }
  },
  watch: {
    user() {
      if (this.user.length >= 50) {
        this.userToolTip = "用户名长度不能超过50!";
        this.userToolTipVisable = true;
        setTimeout(() => {
          this.userToolTipVisable = false;
        }, 2000);
      }
    },
    password() {
      if (this.password.length >= 50) {
        this.passwordToolTip = "密码长度不能超过50!";
        this.passwordToolTipVisable = true;
        setTimeout(() => {
          this.passwordToolTipVisable = false;
        }, 2000);
      }
    }
  },
  mounted() {
    var bv = new Bideo();
    if(!this.UID){
      bv.init({
        // Video element
        videoEl: document.querySelector("#background_video"),
        // Container element
        container: document.querySelector("body"),
        // Resize
        // resize: true,
        src: [
          {
            src: bgMp4,
            type: "video/mp4"
          }
        ]
      })
    }
  }
};
</script>

