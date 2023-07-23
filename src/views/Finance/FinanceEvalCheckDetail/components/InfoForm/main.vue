<template>
  <div class="common-grid-form">
    <div class="common-grid-title">基本信息</div>
    <el-form class="common-grid-body" :model="formData" disabled label-position="top" inline-message ref="form">
      <el-form-item class="item" v-for="(item, idx) in config" :key="idx" :label="item.tcXxxmc" :prop="item.tnPgjbxxbid.toString()" v-if="setLinkShow(item, idx)">
        <el-input v-if="item.tnXxxlrfs === 1" :type="item.tnXxxsjlx === 1 ? 'text' : 'number'" v-model="formData[item.tnPgjbxxbid.toString()]" size="mini" :placeholder="'请输入' + item.tcXxxmc"></el-input>
        <el-select v-if="item.tnXxxlrfs === 4" v-model="formData[item.tnPgjbxxbid.toString()]" :placeholder="'请选择' + item.tcXxxmc" size="mini">
          <el-option v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
        <el-checkbox-group v-if="item.tnXxxlrfs === 3" v-model="formData[item.tnPgjbxxbid.toString()]">
          <el-checkbox v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="item.tnXxxlrfs === 2" v-model="formData[item.tnPgjbxxbid.toString()]">
          <el-radio v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
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
        this.setContent()
        this.processContent()

        this.setOptions()
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
      formData: this.content,
      options: {},
    }
  },
  methods: {
    setLinkShow (item, idx) {
      let show = true
      if (typeof item.tnXxxldxid !== 'undefined' && item.tnXxxldfs === 1) {
        const idx = this.config.findIndex(field => field.tnXh === item.tnXxxldxid)
        const id = this.config[idx].tnPgjbxxbid
        
        show = typeof this.formData[id.toString()] === 'undefined'
          ? false
          : (item.tcXxxldglz.split(',').indexOf(this.formData[id.toString()]) >= 0)
      }
      return show
    },
    setContent () {
      this.config.forEach(item => {
        if (item.tnXxxlrfs === 3) {
          this.$set(this.content, item.tnPgjbxxbid, this.content[item.tnPgjbxxbid] || [])
        }
      })
    },
    processContent () {
      const content = { ...this.content }
      Object.keys(content).forEach(key => {
        const id = parseInt(key, 10)
        const itemConfigIdx = this.config.findIndex(item => item.tnPgjbxxbid === id)
        if (itemConfigIdx >= 0) {
          const itemConfig = this.config[itemConfigIdx]
          if (itemConfig.tnXxxlrfs === 3) {
            content[key] = typeof content[key] === 'string' ? content[key].split(',') : []
          }
        }
      })
      this.formData = content
    },
    async setOptions () {
      this.options = await this.$getOptions(this.config.filter(item => item.tcXxxxxxnr).map(item => item.tcXxxxxxnr))
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
