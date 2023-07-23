<template>
  <div class="common-grid-form">
    <div class="common-grid-title"></div>
    <div class="item_select" v-for="(item, idx) in config" :key="idx" v-if="item.tnXxxlrfs === 2 || item.tnXxxlrfs === 4">
      <el-select style="width: 240px" :placeholder=" '请选择' + item.tcXxxmc" @change="(val) => _SelectChange(val, item)" v-if="item.tnXxxlrfs === 4 || item.tnXxxlrfs === 2" v-model="bindData[item.tnXfaqjbxxszid]" size="mini">
        <el-option v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
    </div>
    
    <div class="common-grid-title"></div>
    <div class="item_input" v-for="(item, idx) in config" :key="idx" v-if="item.tnXxxlrfs === 1">
      <el-input size="mini" v-if="item.tnXxxsjlx === 1" type="text" :maxlength="Math.floor(item.tnXxxsjcd/3)" :placeholder=" '请输入' + item.tcXxxmc" v-model="bindData[item.tnXfaqjbxxszid]" @input="(val) => _InputTypeChange(val, item)"></el-input>
      <el-input size="mini" v-if="item.tnXxxsjlx !== 1" type="number" oninput="if(value.length>11) value=value.slice(0,11)" :placeholder=" '请输入' + item.tcXxxmc" v-model="bindData[item.tnXfaqjbxxszid]" @input="(val) => _InputTypeChange(val, item)"></el-input>
    </div>

    <div class="common-grid-title"></div>
    <div class="item_checkbox" v-for="(item, idx) in config" :key="idx" v-if="item.tnXxxlrfs === 3">
      <span class="title">{{ item.tcXxxmc }}</span>
      <el-checkbox-group v-model="bindData[item.tnXfaqjbxxszid]">
        <el-checkbox v-for="option in options[item.tcXxxxxxnr]" @change="(val) => _CheckboxChange(val, item, option.tcSjubm)" :key="option.tcSjubm" :label="option.tcSjnr">{{option.tcSjnr}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.dict
  ],
  props: {
    config: {
      type: Array,
      default () {
        return []
      }
    },
    content: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  watch: {
    config: {
      handler () {
        this.setOptions()
        this.setContent()
        this.processContent()
      },
      deep: true
    },
    content: {
      handler () {
        this.processContent()
      },
      deep: true
    },
  },
  data () {
    return {
      bindData: {},
      options: {},
      inputOptions: {}
    }
  },
  methods: {
    // 单选-change事件
    _SelectChange(value, item) {
      let name = ''
      this.options[item.tcXxxxxxnr].forEach(item => {
        if(item.tcSjubm === value) {
          name = item.tcSjnr
        }
      })
      this.$emit('select-change', item, value, name)
    },
    // 多选-change事件
    _CheckboxChange(state, item, value) {
      this.$emit('checkbox-change', state, item, value, this.bindData)
    },
    // 输入类型
    _InputTypeChange(value, item) {
      this.$emit('input-type-change', value, item)
    },
    // 数据字典
    async setOptions () {
      this.options = await this.$getOptions(this.config.filter(item => item.tcXxxxxxnr).map(item => item.tcXxxxxxnr))
    },
    setContent () {
      this.config.forEach(item => {
        if (item.tnXxxlrfs === 3) {
          this.$set(this.content, item.tnXfaqjbxxszid, this.content[item.tnXfaqjbxxszid] || [])
        }
      })
    },
    processContent () {
      const content = { ...this.content }
      Object.keys(content).forEach(key => {
        const id = parseInt(key, 10)
        const itemConfigIdx = this.config.findIndex(item => item.tnXfaqjbxxszid === id)
        if (itemConfigIdx >= 0) {
          const itemConfig = this.config[itemConfigIdx]
          if (itemConfig.tnXxxlrfs === 3) {
            content[key] = typeof content[key] === 'string' ? content[key].split(',') : []
          }
        }
      })
      this.bindData = content
    },
  }
}
</script>
<style lang="scss" scoped>
  .common-grid-form {
    .common-head-grid-title {
      font-weight: bold !important;
      color: #04b74d !important;
      font-size: 16px !important;
      padding: 5px 0 !important;
    }
    .common-grid-title {
      clear: both !important;
      padding: 0 !important;
    }
  }
  
  .item_select {
    font-size: 14px;
    display: inline-block;
    margin-right: 10px;
    width: 240px;
    height: 50px;
    float: left;
    .el-select {
      >.el-input--mini {
        
      }
    }
  }
  .item_checkbox {
    font-size: 14px;
    display: inline-block;
    margin-right: 10px;
    width: 240px;
    height: 80px;
    float: left;
    .title {
      display: inline-block;
      margin: 5px 0;
      font-weight: bold;
    }
    .el-checkbox-group {
      .el-checkbox {
        margin-right: 30px;
        margin-left: 0;
      }
    }
  }
  .item_input {
    font-size: 14px;
    display: inline-block;
    width: 240px;
    height: 50px;
    margin-right: 10px;
  }
</style>
