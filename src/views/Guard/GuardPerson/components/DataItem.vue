<template lang="html">
  <div class="guard" slot="info">
    <div class="guard-info">
      <div class="guard-title">
        <CustomIcon name="org-guard"/> 
        {{itemInfo.tcAbjgmc}}
      </div>
      <div class="guard-list">
        <CustomIcon name="afiliate"/> 
        <span>{{itemInfo.tcDwmc}}</span>
        <CustomIcon name="address"/> 
        <span>{{itemInfo.tcDz}}</span>
        <CustomIcon name="specially-designed"/> 
        <span v-if="itemInfo.tcAbjgxz === '05010101'">专设</span>
        <span v-if="itemInfo.tcAbjgxz === '05010102'">合设</span>
        <CustomIcon name="zip-code"/> 
        <span>{{itemInfo.tcYzbm}}</span>
        <CustomIcon name="telephone"/> 
        <span>{{itemInfo.tcCzdh}}</span>
      </div>
    </div>
    

    <div class="guard-main">
      <div class="guard-main-title">选择查看人员类型</div>
      <ul>
        <li>
          <div class="guard-main-block">
            <div class="guard-main-block-img">
              <img src="../../../../assets/managestaff.png" @click = '_viewManageStaff'>
            </div>
            <!-- <div class="guard-main-block-des">
              <img src="../../../../assets/postlogo.png">
              <span>安全保卫管理人员</span>
              <el-button type="primary" size="mini" class="button" @click = '_viewManageStaff'>查看</el-button>
            </div> -->
          </div>
        </li>
        <li>
          <div class="guard-main-block">
            <div class="guard-main-block-img">
              <img src="../../../../assets/workstaff.png" @click = '_viewWorkStaff'>
            </div>
              <!-- <div class="guard-main-block-des">
                <img src="../../../../assets/postlogo.png">
                <span>安全保卫工作人员</span>
                <el-button type="primary" size="mini" class="button" @click = '_viewWorkStaff'>查看</el-button>
              </div> -->
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Mixin from '@mixins'

export default {
  props: {
    item: ''
  },
  data () {
    return {
      itemInfo: {}
    }
  },
  methods: {
    _viewManageStaff () {
      this.$emit ('viewManageStaff', this.itemInfo.tnAbjgid, this.itemInfo.tcAbjgmc)
    },
    _viewWorkStaff () {
      this.$emit ('viewWorkStaff', this.itemInfo.tnAbjgid, this.itemInfo.tcAbjgmc)
    }
  },
  watch: {
    item: {
      immediate: true,
      handler (value) {
        if (typeof(value) != "object") {
          this.itemInfo = JSON.parse(value)
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/styles/define.scss';

  .guard {

    .guard-info{
      .guard-title{
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        padding: 0 10px;
        color: $green;

        i{
          font-weight: normal;
          color: $orange;
          font-size: 17px;
        }
      }
      .guard-list{
        padding: 0 10px;
        height: 48px;
        line-height: 48px;
        border-top: 1px solid $border;
        border-bottom: 1px solid $border;
        background: $bg;
        i{
          display: inline-block;
          width: 18px;
          color: $green;
          margin-right: 5px;
        }
        span{
          display: inline-block;
          font-size: 14px;
          margin-right: 20px;
        }
      }
    }
    .guard-main{
      .guard-main-title{
        text-align: center;
        margin: 40px auto;
        font-size: 16px;
        color: $text-light;
      }
      ul{
        text-align: center;
        list-style: none;
        >li{
          display: inline-block;
          box-shadow:0px 3px 12px rgba(238,238,238,1);
          width: 202px;
          margin: 0 20px;
          >.guard-main-block{
            background: #fff;
            padding: 20px;
            overflow: hidden;
            border: 1px solid #ededed;
            border-radius: 4px;
            >*{
              float: left;

              &.guard-main-block-img{
                // width: 112px;
                // height: 136px;
                // margin-right: 20px;
                img{
                  display: block;
                  cursor: pointer;
                }
              }
              &.guard-main-block-des{
                text-align: left;
                >img{
                  display: block;
                  margin-bottom: 50px;
                }
                >span{
                  display: block;
                  margin-bottom: 10px;
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
    }
  }

  
</style>