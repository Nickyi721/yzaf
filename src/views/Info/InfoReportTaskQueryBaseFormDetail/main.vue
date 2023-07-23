<template>
  <CustomView title="企业信息安全日报表">
    <div :model="formData" class="background-color">
      <div class="title">
        <span class="org">中国邮政集团公司</span>
        <span class="date">任务名称：{{formData.tcRwmc}}</span>
      </div>
      <div class="type">
        <span class="type-title">企业全国范围查处的违禁品数量</span>
        <div class="type-item">
          <div class="img">
            <img src="../../../assets/image/qzdy.png" alt="类型图片">
          </div>
          <p class="text">枪支弹药
            <br>
            <b>{{formData.tnQzdy}}</b>
          </p>
        </div>
        <div class="type-item">
          <div class="img">
            <img src="../../../assets/image/yrybp.png" alt="类型图片">
          </div>
          <p class="text">易燃易爆品
            <br>
            <b>{{formData.tnYrybp}}</b>
          </p>
        </div>
        <div class="type-item">
          <div class="img">
            <img src="../../../assets/image/jdwp.png" alt="类型图片">
          </div>
          <p class="text">剧毒物品
            <br>
            <b>{{formData.tnJdwp}}</b>
          </p>
        </div>
        <div class="type-item">
          <div class="img">
            <img src="../../../assets/image/gzdj.png" alt="类型图片">
          </div>
          <p class="text">管制刀具
            <br>
            <b>{{formData.tnGzdj}}</b>
          </p>
        </div>
        <div class="type-item">
          <div class="img">
            <img src="../../../assets/image/zzxfdkw.png" alt="类型图片">
          </div>
          <p class="text">政治性反动刊物
            <br>
            <b>{{formData.tnZzxfdkw}}</b>
          </p>
        </div>
        <div class="type-item">
          <div class="img">
            <img src="../../../assets/image/dmxhkq.png" alt="类型图片">
          </div>
          <p class="text">"低慢小"航空器
            <br>
            <b>{{formData.tnDmxhkq}}</b>
          </p>
        </div>
        <div class="type-item">
          <div class="img">
            <img src="../../../assets/image/qt.png" alt="类型图片">
          </div>
          <p class="text">其他
            <br>
            <b>{{formData.tnQtwjp}}</b>
          </p>
        </div>
      </div>

      <div class="type clf">
        <h5>二次安检执行情况</h5>
        <p>
          安检业务量:
          <span>{{formData.tnAjywl}}</span>
        </p>
        <p>
          发现违禁品数量:
          <span>{{formData.tnWjpsl}}</span>
        </p>
        <div class="clf">
          <span class="type-input">安检业务/违禁品详情:</span>
          <span class="type-content">
           {{formData.tcWjpsm}}
          </span>
        </div>
      </div>

      <div class="type clf">
        <h5>单位安全检查情况</h5>
        <p>
          每日组织安全检查人次:
          <span>{{formData.tnAqjcrc}}</span>
        </p>
        <div class="clf">
          <span class="type-input">主要问题及整改措施:</span>
          <span class="type-content">
           {{formData.tcWtjzgcs}}
          </span>
        </div>
      </div>

      <div class="type clf">
        <h5>二次安检执行情况邮件、快件积压爆仓延误情况</h5>
        <div style="clear: both">
          <span class="type-content">
            {{formData.tcYjqksm}}
          </span>
        </div>
      </div>

      <div class="type clf">
        <h5>单位安全生产事件事故</h5>
        <div class="clf">
          <span class="type-content">
            {{formData.tcSgqksm}}
          </span>
        </div>
      </div>
    </div>
  </CustomView>
</template>

<script>
import Moment from "moment";
import Mixin from "@mixins";

export default {
  mixins: [Mixin.init],
  data() {
    return {
      formData: {
        tcRwmc:''
      }
    }
  },
  methods: {
    $init(options) {
      // 填充数据
      const data = JSON.parse(this.$route.query.row);
      this.formData.tcRwmc = data.tcRwmc
      if(data.xxglTbsjList && data.xxglTbsjList.length !== 0) {
        data.xxglTbsjList.forEach(item => {
          if(item[0].tnHh < data.xxglTbsjList.length) {
            if(item[0].tnHh === 0) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnQzdy = item[0].tnSzzxsj
              } else {
                this.formData.tnQzdy = ''
              }
            } else if(item[0].tnHh === 1) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnYrybp = item[0].tnSzzxsj
              } else {
                this.formData.tnYrybp = ''
              }
            } else if(item[0].tnHh === 2) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnJdwp = item[0].tnSzzxsj
              } else {
                this.formData.tnJdwp = ''
              }
            } else if(item[0].tnHh === 3) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnGzdj = item[0].tnSzzxsj
              } else {
                this.formData.tnGzdj = ''
              }
            } else if(item[0].tnHh === 4) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnZzxfdkw = item[0].tnSzzxsj
              } else {
                this.formData.tnZzxfdkw = ''
              }
            } else if(item[0].tnHh === 5) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnDmxhkq = item[0].tnSzzxsj
              } else {
                this.formData.tnDmxhkq = ''
              }
            } else if(item[0].tnHh === 6) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnQtwjp = item[0].tnSzzxsj
              } else {
                this.formData.tnQtwjp = ''
              }
            } else if(item[0].tnHh === 7) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnAjywl = item[0].tnSzzxsj
              } else {
                this.formData.tnAjywl = ''
              }
            } else if(item[0].tnHh === 8) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnWjpsl = item[0].tnSzzxsj
              } else {
                this.formData.tnWjpsl = ''
              }
            } else if(item[0].tnHh === 9) {
              if(item[0].tcZfclxsj !== 0) {
                this.formData.tcWjpsm = item[0].tcZfclxsj
              } else {
                this.formData.tcWjpsm = ''
              }
            } else if(item[0].tnHh === 10) {
              if(item[0].tnSzzxsj !== 0) {
                this.formData.tnAqjcrc = item[0].tnSzzxsj
              } else {
                this.formData.tnAqjcrc = ''
              }
            } else if(item[0].tnHh === 11) {
              if(item[0].tcZfclxsj !== 0) {
                this.formData.tcWtjzgcs = item[0].tcZfclxsj
              } else {
                this.formData.tcWtjzgcs = ''
              }
            } else if(item[0].tnHh === 12) {
              if(item[0].tcZfclxsj !== 0) {
                this.formData.tcYjqksm = item[0].tcZfclxsj
              } else {
                this.formData.tcYjqksm = ''
              }
            } else {
              if(item[0].tcZfclxsj !== 0) {
                this.formData.tcSgqksm = item[0].tcZfclxsj
              } else {
                this.formData.tcSgqksm = ''
              }
            }
          }
        })
      } 
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-view {
  background: #f8f8f8 !important;
}

h4,
h5 {
  height: 35px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}

.clf {
  clear: both;
  zoom: 1;
}

.background-color {
  background: #FFFFFF;
  width: 99.8%;
  margin: 0 auto;
  .title {
    height: 48px;
    padding: 10px;
    .org {
      width: 160px;
      height: 26px;
      font-size: 20px;
      font-weight: bold;
      line-height: 26px;
      color: rgba(51, 51, 51, 1);
    }
    .date {
      position: relative;
      height: 19px;
      float: right;
      font-size: 14px;
      font-weight: 400;
      line-height: 28px;
      color: #666;
    }
  }
  .type {
    margin-bottom: 30px;
    padding: 10px;
    p {
      float: left;
      width: 160px;
      height: 33px;
      font-size: 13px;
      font-weight: 400;
      line-height: 19px;
      color: rgba(102, 102, 102, 1);
      span {
        color: red;
      }
    }
    .type-title {
      display: block;
      height: 19px;
      font-size: 14px;
      font-weight: bold;
      line-height: 19px;
      color: rgba(51, 51, 51, 1);
    }
    .type-input {
      display: block;
      width: 100%;
      height: 35px;
      font-size: 13px;
      font-weight: 400;
      line-height: 35px;
      color: rgba(102, 102, 102, 1);
    }
    .type-content {
      display: block;
      width: 100%;
      font-size: 13px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .type-item {
      float: left;
      width: 14.2%;
      height: 60px;
      margin: 10px 0 20px 0;
      .img {
        float: left;
        width: 58px;
        height: 58px;
      }
      .text {
        float: left;
        width: 102px;
        height: 19px;
        font-size: 14px;
        margin-top: 11px;
        font-weight: 400;
        line-height: 19px;
        color: rgba(102, 102, 102, 1);
      }
      .num {
        width: 35px;
        height: 19px;
        font-size: 14px;
        font-weight: bold;
        line-height: 19px;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
</style>

