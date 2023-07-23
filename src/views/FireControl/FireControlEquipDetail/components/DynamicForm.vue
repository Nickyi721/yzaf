<template>
  <div>
    <el-form ref="form" label-position="top" :model="bindData" :rules="rules" :label-width="labelWidth" class="common-form">
      <el-form-item v-for="(item, idx) in config" :key="idx" :label="item.tcXxxmc" :prop="item.tnRcxjjbxxszid.toString()" v-if="setLinkShow(item, idx)">
        <el-input :disabled="!item.tnXxxldxid"  v-if="item.tnXxxlrfs === 1" v-model="bindData[item.tnRcxjjbxxszid]" size="mini" :type="item.tnXxxsjlx === 1 ? 'text' : 'number'" :placeholder="'请输入' + item.tcXxxmc" :maxlength="Math.floor(item.tnXxxsjcd/3)"></el-input>
        <el-radio-group :disabled="!item.tnXxxldxid"  v-if="item.tnXxxlrfs === 2" v-model="bindData[item.tnRcxjjbxxszid]" @change="_OptionChange(item)">
          <el-radio v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-radio>
        </el-radio-group>

        <el-checkbox-group :disabled="!item.tnXxxldxid"  v-if="item.tnXxxlrfs === 3" v-model="bindData[item.tnRcxjjbxxszid]"  @change="_OptionChange(item)">
          <el-checkbox v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-checkbox>
        </el-checkbox-group>
        <el-select :disabled="!item.tnXxxldxid"  v-if="item.tnXxxlrfs === 4" v-model="bindData[item.tnRcxjjbxxszid]" :placeholder="'请选择' + item.tcXxxmc" size="mini"  @change="_OptionChange(item)">
          <el-option v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
        <el-date-picker :disabled="!item.tnXxxldxid"   v-if="item.tnXxxlrfs === 5" :picker-options="pickerOptions" v-model="bindData[item.tnRcxjjbxxszid]" size="mini" :placeholder="'请选择' + item.tcXxxmc" value-format="yyyy-MM-dd"></el-date-picker>
        <el-switch :disabled="!item.tnXxxldxid"  v-if="item.tnXxxlrfs === 6"
          v-model="switchValue"
          active-text="启用"
          :active-value=0
          inactive-text="停用"
          :inactive-value=1
          @change=" (val) => _SwitchChange(val, 1)"
        >
        </el-switch>

            <!--<el-dialog title="消防控制室设施故障维护录入" :visible.sync="dialogFormVisible"  :modal="false" style="width:80%;margin:0 auto;">
              <el-form :model="formData" >
              <el-form-item label="表头类型" :label-width="formLabelWidth">
                  <el-select v-model="formData['btlx']" placeholder="请选择表头类型">
                    <el-option v-for="option in options['0310']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="表信息类型" :label-width="formLabelWidth">
                  <el-select v-model="formData['bxxlx']" placeholder="请选择表信息类型">
                    <el-option v-for="option in options['0301']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="_ButtonSaveClick_Dialog()">确 定</el-button>
              </div>
            </el-dialog>-->
      
      </el-form-item>

      <div class="common-form-control" >
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Model from '../model.js'
import Mixin from '@mixins'
import Validator from '@commons/validator.js'

export default {
  mixins: [Mixin.dict],
  props: {
    content: {
      type: Object,
      default: () => { }
    },
    config: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      switchValue:'true',
      bindData: this.content,
      rules: {},
      options: {},
      labelWidth: '',
      vehicleList: [],

      input:'',
      textarea2:'',
      value1:'',
      
     
      dialogFormVisible: false,
      formData: {
        name: '',
        bxxlx:'',
        type: [],
      },
      formLabelWidth: '120px',
      radio: '1',
       //bool:true
      // 限制今天之前的时间不能选择
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
    }
  },
  filters: {
    vehicleListLength (data, type) {
      //  ['越野型', '箱式', '皮卡', '其他']
      let list = []
      data.forEach(item => {
        for (let x in item) {
          if (item[x] === type) {
            list.push(item)
          }
        }
      })
      return list.length
    }
  },
  watch: {
    config: {
      handler () {
        // 设置label宽度
        const name = this.config.map(item => item.tcXxxmc).sort((a, b) => b.length - a.length)
        this.labelWidth = name[0].length * 14 + 'px'

        this.setContent()
        this.processContent()

        this.setOptions()
        this.setRules()
        this.$refs.form.clearValidate()
      },
      deep: true
    },
    content: {
      handler () {
        this.processContent()
      },
      deep: true
    }
  },
  created () {
    //this.$route.query.type === 'update' &&  this.getEquipDetail()
  },
  methods: {
    async getEquipDetail () {
      const result = await Model.getEquipData({
        tnDllx: 0,
        tcXxxlx: this.$route.query.detailType,
        tcSsdwdm: this.$route.query.orgId,
        tnDyywpc: this.$route.query.equipOrder
      })
      if (result.data) {
        this.vehicleList = this.processData(result.data)
      }
    },
     _SwitchChange(val, tnYhid) {
       this.$emit('switch-change', val, tnYhid)
       if(val===1){
         this.dialogFormVisible = true
       }
     },
    processData (listData) {
      const data = {}
      listData.forEach(item => {
        data[item.tnYwpc] = data[item.tnYwpc] || []
        data[item.tnYwpc].push(item)
      })
      return Object.keys(data)
        .map(key => data[key])
        .sort((a, b) => b.tnYwpc - a.tnYwpc)
        .map(fields => {
          const data = {}
          fields.forEach(item => {
            let value
            
            if (typeof item.tcZfclxsj !== 'undefined') {
              value = item.tcZfclxsj
            }
            if (typeof item.tnSzzxsj !== 'undefined') {
              value = item.tnSzzxsj
            }
            if (typeof item.tnSzfdsj !== 'undefined') {
              value = item.tnSzfdsj
            }
            
            data[item.tnRcxjjbxxszid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          return data
        })
    },
    _OptionChange (item) {
      // console.log(this.config)
      const links = this.config.filter(field => field.tnXxxldxid === item.tnXh)
      links.forEach(field => {
        const linkValues = field.tcXxxldglz.split(',')
        if (linkValues.indexOf(this.bindData[item.tnRcxjjbxxszid]) < 0) {
          this.$set(this.bindData, field.tnRcxjjbxxszid, field.tnXxxlrfs === 3 ? [] : null)
        }
      })
    },
    // _ButtonSaveClick_Dialog () {
    //   //this.saveListData()
    //   this.dialogFormVisible = false
    // },
    _ButtonSaveClick () {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          const data = Object.keys(this.bindData).map(key => {
            const value = this.bindData[key]

            const id = parseInt(key, 10)
            const itemConfigIdx = this.config.findIndex(item => item.tnRcxjjbxxszid === id)
            const config = this.config[itemConfigIdx]

            if (config) {
              let valueText = ''
              if (config.tnXxxlrfs === 2 || config.tnXxxlrfs === 4) {
                const options = this.options[config.tcXxxxxxnr].filter(item => item.tcSjubm === value)
                valueText = options.length ? options[0].tcSjnr : ''
              } else if (config.tnXxxlrfs === 3) {
                valueText = this.options[config.tcXxxxxxnr].filter(item => value.findIndex(v => v === item.tcSjubm) >= 0).map(item => item.tcSjnr).join(',')
              }
              let dataValue = value
              if (config.tnXxxsjlx === 0) {
                dataValue = parseInt(value)
              }
              if (config.tnXxxsjlx === 2) {
                dataValue = parseFloat(value)
              }
              return {
                tnRcxjjbxxszid: id,
                tnXxxsjlx: config.tnXxxsjlx,
                xjjbxxz: config.tnXxxlrfs === 3 ? dataValue.join(',') : dataValue,
                tcSjmc: valueText
              }
            }
          }).filter(item => item)

          this.config.forEach(config => {
            if (data.findIndex(item => item.tnRcxjjbxxszid === config.tnRcxjjbxxszid) < 0) {
              data.push({
                tnRcxjjbxxszid: config.tnRcxjjbxxszid,
                tnXxxsjlx: config.tnXxxsjlx,
                xjjbxxz: '',
              })
            }
          })
          this.$emit('commit', data)
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    async setOptions () {
      this.options = await this.$getOptions(this.config.filter(item => item.tcXxxxxxnr).map(item => item.tcXxxxxxnr))
    },
    setRules () {
      this.config.map(item => {
        const rule = []
        if (item.tnXxxsjlx === 1) {
          item.tnXxxlrfs === 1 && rule.push(Validator.length(1, Math.floor(item.tnXxxsjcd / 3)))
        }
        if (item.tnXxxsjlx === 0) {
          rule.push(Validator.isNumber(item.tnXxxsjcd))
        }
        if (item.tnXxxsjlx === 2) {
          rule.push(Validator.isFloat(item.tnXxxsjcd))
        }
        item.tnXxxsfbt && rule.push(Validator.required(`请设置${item.tcXxxmc}`))
        this.rules[item.tnRcxjjbxxszid.toString()] = rule
      })
    },
    setContent () {
      this.config.forEach(item => {
        if (item.tnXxxlrfs === 3) {
          this.$set(this.content, item.tnRcxjjbxxszid, this.content[item.tnRcxjjbxxszid] || [])
        }
      })
    },
    processContent () {
      const content = { ...this.content }
      Object.keys(content).forEach(key => {
        const id = parseInt(key, 10)
        const itemConfigIdx = this.config.findIndex(item => item.tnRcxjjbxxszid === id)
        if (itemConfigIdx >= 0) {
          const itemConfig = this.config[itemConfigIdx]
          if (itemConfig.tnXxxlrfs === 3) {
            content[key] = typeof content[key] === 'string' ? content[key].split(',') : []
          }
        }
      })
      this.bindData = content
    },
    setLinkShow (item, idx) {
      let show = true
      if (typeof item.tnXxxldxid !== 'undefined' && item.tnXxxldfs === 1) {
        const idx = this.config.findIndex(field => field.tnXh === item.tnXxxldxid)
        const id = this.config[idx].tnRcxjjbxxszid
        show = typeof this.bindData[id.toString()] === 'undefined'
          ? false
          : (item.tcXxxldglz.split(',').indexOf(this.bindData[id.toString()]) >= 0)
      }
      return show
    }
  }
}
</script>
<style lang="scss" scoped>
.vehicle-ceil {
  padding-right: 10px;
}
</style>
