<template>
  <div>
    <h3>{{config.tcSbmc}}</h3>
    <span class='item bp' v-if="config.tcPbztbm==='000101'">必配</span>
    <span class='item xp' v-if="config.tcPbztbm!=='000101'">选配</span>
    <div class="item-top-right">
      <span>是否配备此设备</span>
      <el-radio-group v-model="tnSfpb" @change="_change" :disabled="disabled">
        <el-radio :label=1>是</el-radio>
        <el-radio :label=0>否</el-radio>
      </el-radio-group>
      <el-button size="small" type="primary" @click="_viewItmeDetail" v-if="config.tnSfgjxfxxszb">查看关联此设备</el-button>
    </div>
    <div class="item-content">
        <span>场所或车辆： </span><span>{{config.tcEwmdlmc}}</span><br>
        <span>安全生产设备类型或车辆类型： </span><span>{{config.tcEwmxlmc}}</span><br>
        <span>安装区域： </span><span>{{config.tcAzqy}}</span><br>
    </div>
  </div>
</template>
<style lang="scss" scoped>
    h3{
        line-height: 45px;
        float: left;
    }
    .item{
      margin: 10px 0 0 10px;
      float: left;
      height: 25px;
      color: white;
      border-radius: 5px;
      line-height: 25px;
      width:40px;
      text-align: center;
    }
    .bp{
      background: #17AF49;
    }
    .xp{
     background: #00A2FF;
    }
    .item-top-right{
      margin-left: 600px;
      line-height: 50px;
      span{
        margin-right: 20px
      }
      button{
        border-color: #006a45!important;
        color: #006a45!important;
        background-color: white!important;
        padding: 8px;
        margin-top: 10px;
        float: right;
        &:hover{
          color: #006a45!important;
          border-color: #65d38c!important;
        }
      }
    }
    .item-content{
      border: solid 1px #eeeeee;
      font-size: 14px;
      line-height: 30px;
      padding: 10px
    }

</style>
<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: () => true
    }
  },
  data(){
    return{
      tnSfpb: ''
    }
  },
  methods: {
    _viewItmeDetail(){
      this.$emit('viewItmeDetail', this.config.aqscSbssgjDto)
    },
    _change(val){
      this.config.tnSfpb = this.tnSfpb
    },
  },
  watch: {
    config: {
      deep: true,
      handler(val){
        this.tnSfpb = val.tnSfpb
      }
    }
  }
}
</script>