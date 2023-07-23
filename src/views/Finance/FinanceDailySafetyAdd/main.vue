<template>
    <CustomView :location="[{ text: '新增日常安全检查录入'}]">
        <!-- el-form -->
        <el-button size="mini">点击选择</el-button>
        <p></p>
        检查人<el-input></el-input>
        检查时间<el-date-picker
        v-model="sj"
        type="datetime"
        placeholder="请选择日期"
        format="yyyy-MM-dd HH-mm"
        value-format="yyyy-MM-dd HH-mm"
      ></el-date-picker>
      检查结果<el-select v-model="result" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
          备注
      </el-select>
    </CustomView>

</template>

<script>
//共用模块
import Mixin from '@mixins'
import Model from './model.js'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],

    data() {
        return{
            options:[{value:'',label:'通过'},{value:'',label:'不通过'}]
        }
    }
}
</script>

