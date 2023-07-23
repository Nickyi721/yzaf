<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增上报' : '上报详情' }]">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-position="top" class="common-form">
      <el-form-item v-if="$route.query.type === 'add'" label="过往事件" prop="tnGwsj">
        <el-radio-group v-model="formData['tnGwsj']">
          <el-radio v-for="option in optionGwsj" :key="option.tcSjubm" :label="option.tcSjubm">{{ option.tcSjnr }}</el-radio>
        </el-radio-group>
        <!-- <el-select v-model="formData['tnGwsj']" size="mini" placeholder="请选择是否为过往事件">
          <el-option v-for="option in optionGwsj" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="信息标题" prop="tcXxbt">
        <el-input v-model="formData['tcXxbt']" size="mini" maxlength='60' placeholder="请输入信息标题"></el-input>
      </el-form-item>

      <el-form-item label="案发单位" prop="tcSbdwmc">
        <el-input v-model="formData['tcSbdwmc']" size="mini" placeholder="请选择案发单位" @focus="_DataFilterChoose"></el-input>
      </el-form-item>

      <el-form-item label="案件类型" prop="tcXxlx">
        <el-select v-model="formData['tcXxlx']" @change="_XxlxChange" size="mini" placeholder="请选择信息类型">
          <el-option v-for="option in optionsInfoType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="案发单位所属" prop="tcAfbwss">
        <el-select v-model="formData['tcAfbwss']" size="mini" @change="_PlaceParentChange" placeholder="请选择案发单位所属">
          <el-option v-for="option in optionsCrimePlaceParent" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="案发部位" prop="tcAfbw">
        <el-select v-model="formData['tcAfbw']" size="mini" @change="_PlaceChange" placeholder="请选择案发部位">
          <el-option v-for="option in optionsCrimePlace" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="案发时间" prop="tdAfrq">
        <el-date-picker v-model="formData['tdAfrq']" 
          size="mini" type="date" 
          placeholder="选择案发时间"
          :picker-options="pickerOptions" 
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>    

      <el-form-item label="涉案金额区间" v-show="sajeControl" prop="tcSajeqj">
        <el-select class="special" v-model="formData['tcSajeqj']" @visible-change="$forceUpdate()" size="mini" placeholder="请选择涉案金额区间">
          <el-option  v-for="option in optionsCrimeMoney" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="涉案金额" v-show="sajeControl" prop="tcSaje">
        <el-input v-model="formData['tcSaje']" size="mini" maxlength='200' placeholder="请输入涉案金额"></el-input>
      </el-form-item>

      <el-form-item label="人员伤亡区间" v-show="ryswControl" prop="tcRyswqj">
        <el-select class="special" v-model="formData['tcRyswqj']" @visible-change="$forceUpdate()" size="mini" placeholder="请选择人员伤亡区间">
          <el-option  v-for="option in optionsPeople" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="人员伤亡" v-show="ryswControl" prop="tcRysw">
        <el-input v-model="formData['tcRysw']" size="mini" maxlength='600' placeholder="请输入人员伤亡"></el-input>
      </el-form-item>

      <el-form-item label="邮件损失情况" v-show="yjssControl" prop="tcYjssqk">
        <el-input v-model="formData['tcYjssqk']" type="textarea" :rows="3" maxlength='600' size="mini" placeholder="请输入邮件损失情况"></el-input>
      </el-form-item>
      <el-form-item label="作案人类型" prop="tcZalx">
        <el-select v-model="formData['tcZalx']" size="mini" placeholder="请选择作案人类型">
          <el-option v-for="option in optionsCulpritType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上报时间" prop="tdSbsj"> 
        <el-date-picker v-model="formData['tdSbsj']" size="mini" type="date" placeholder="选择上报时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$route.query.type === 'continue' ? '续报情况说明' : '情况说明'" prop="tcQksm">
        <el-input v-model="formData['tcQksm']" type="textarea" :rows="3" maxlength='600' size="mini" placeholder="请输入情况说明"></el-input>
      </el-form-item>

      <el-form-item v-if="$route.query.type !== 'add'" label="阅签意见">
        <el-input disabled v-model="formData['tcYqyj']" type="textarea" :rows="3" size="mini" placeholder="请输入阅签意见"></el-input>
      </el-form-item>

      <el-form-item label="附件"> 
        <el-upload class="upload-demo" 
          action='' 
          :http-request="(param) => _requestFile(param)"
          :auto-upload="true"
          :on-preview="_FileDownload"
          :on-remove="_FileRemove"
          :file-list="fileList"
          :show-file-list='true'>
          <el-button size="mini" type="default">上传</el-button>
        </el-upload>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择案发单位 -->
    <CustomDialog title=" 选择案发单位" :visible="dlgVisble" @close="_DlgCloseHandle">
      <CommonOrgTree ref="orgTree" check-strictly content fnCode="000403" style="height: 400px" @click="_OrgTreeRegionClick" />
      <div class="filter-btn" style="text-align:right;padding: 10px;">
        <el-button type="primary" size="mini" @click="_DlgButtonClick">确定</el-button>
      </div>
    </CustomDialog>

    <CustomDialog title=" 图片详情" :visible="picVisible" @close="closeHandle">
      <img :src="src" style="height: 300px">
    </CustomDialog>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Moment from 'moment'

import Model from './model.js'
import Validator from '@commons/validator.js'
import CommonModel from '@commons/model.js'

// 文件上传
import request from '@commons/request.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      dict: ['04020201', '04020202', '04020203', '0402020404', '090301010201', 
        '090301020101', '090301010301', '090301010101', '090301010102', '090301040101',
        '090301030101', '090301030102', '090201010201', '090201020101', '090201010301', '090201010101',
        '090201010102', '090201040101', '090201030101', '090201030102', '090401010101', '090401010102',
        '090401040101', '090401010201', '090401020101', '090401030101', '090401030102', '090501010301',
        '090501010101', '090501010102', '090501040101', '090501030101', '090501030102', '090501020101',
        '090501010201', '090101010301', '090101010101', '090101010102', '090101040101', '090101030101',
        '090101030102', '090101010201', '090101020101'
      ],
      rules: {
        tcXxbt: [
          Validator.required('请输入信息标题'),
          Validator.length(1, 60)
        ],
        tcXxlx: [
          Validator.required('请选择信息类型'),
        ],
        tdAfrq: [
          Validator.required('请选择案发时间'),
        ],
        tcAfbw: [
          Validator.required('请选择案发部位'),
        ],
        tcAfbwss: [
          Validator.required('请选择案发单位所属'),
        ],
        tcSbdwmc: [
          Validator.required('请选择案发单位'),
        ],
        tdSbsj: [
          Validator.required('请选择上报时间'),
        ],
        tcRysw: [
          Validator.length(1, 500)
        ],
        tcZalx: [
          Validator.required('请选择作案人类型'),
        ],
        tcQksm: [
          Validator.required('请输入情况说明'),
          Validator.length(1, 500)
        ],
        tnGwsj: [
          Validator.required('请选择是否过往事件'),
        ],
       },
      formData: {},
      optionsReportType: [],
      optionsInfoType: {},
      optionsCrimePlace: {},
      optionsCrimePlaceParent: {},
      optionsCulpritType: {},
      optionsCrimeMoney: [],
      optionsSbdw: [],
      optionsPeople: [],
      optionGwsj: [
        {
          tcSjubm: 0,
          tcSjnr: '否'
        },
        {
          tcSjubm: 1,
          tcSjnr: '是'
        }
      ],
      dlgVisble: false,
      curRegion: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      xtFjList: [],
      fileList: [],
      src: '',
      picVisible: false,
      ryswControl: false,
      sajeControl: false,
      yjssControl: false,
      curXxxlx: '',
      curPlaceParent: '',
      sjzdOptions: {},
      noSelect: {
        tcSjubm: '',
        tcSjnr: '无'
      }
    }
  },
  methods: {
    $init(options) {
      this.sjzdOptions = options
      this.optionsInfoType = options['04020201']
      this.optionsCrimePlace = options['04020202']
      this.optionsCrimePlaceParent = options['04020203']
      this.optionsCulpritType = options['0402020404']
      
      if(this.$route.query.type !== 'add') {
        this.getDetail()
      }
    },
    _DlgCloseHandle() {
      this.dlgVisble = false
      if(Object.keys(this.curRegion).length !== 0) {
        this.$refs.ruleForm.clearValidate(['tcSbdwmc'])
      }
      this.$forceUpdate()
    },
    _DlgButtonClick() {
      this.formData.tcSbdwbm = this.curRegion.id
      this.formData.tcSbdwmc = this.curRegion.name
      this.dlgVisble = false
      if(Object.keys(this.curRegion).length !== 0) {
        this.$refs.ruleForm.clearValidate(['tcSbdwmc'])
      }
    },
    _DataFilterChoose() {
      this.dlgVisble = true
    },
    // 事件-案件类型change
    async _XxlxChange(val) {
      this.optionsCrimeMoney = []
      this.optionsPeople = []
      this.curXxxlx = val
      // 控制涉案金额显示
      if(val === '0402020102' || val === '0402020103' || val === '0402020106' || val === '0402020107' || val === '0402020108' || val === '0402020110') {
        this.sajeControl = true
      } else {
        this.sajeControl = false
      }
      // 控制人员伤亡显示
      if(val === '0402020103' || val === '0402020104' || val === '0402020105' || val === '0402020106' || val === '0402020107' || val === '0402020108' || val === '0402020110') {
        this.ryswControl = true
      } else {
        this.ryswControl = false
      }
      // if(this.curXxxlx !== '' && this.curPlaceParent !== '') {
        if(this.$route.query.type === 'cb_update') {
          this.curPlaceParent = this.formData.tcAfbwss
        }
        switch(this.curXxxlx) {
          case '0402020102': // 贪污案件
            if(this.curPlaceParent === '0402020301') { //省分公司
              this.optionsCrimeMoney = this.sjzdOptions['090301010301']
            } else if(this.curPlaceParent === '0402020302') { //邮储银行
              this.optionsCrimeMoney = this.sjzdOptions['090201010301']
            } else if(this.curPlaceParent === '0402020303') { //速递物流公司
              this.optionsCrimeMoney = this.sjzdOptions['090201010301']
            } else if(this.curPlaceParent === '0402020304') { //其他控股子公司
              this.optionsCrimeMoney = this.sjzdOptions['090501010301']
            } else { //集团直属单位
              this.optionsCrimeMoney = this.sjzdOptions['090101010301']
            }
            break;
          case '0402020103' || '0402020104': // 盗窃、抢劫案件
            if(this.curPlaceParent === '0402020301') { //省分公司
              this.optionsCrimeMoney = this.sjzdOptions['090301010101']
              this.optionsPeople = this.sjzdOptions['090301010102']
            } else if(this.curPlaceParent === '0402020302') { //邮储银行
              this.optionsCrimeMoney = this.sjzdOptions['090201010101']
              this.optionsPeople = this.sjzdOptions['090201010102']
            } else if(this.curPlaceParent === '0402020303') { //速递物流公司
              this.optionsCrimeMoney = this.sjzdOptions['090401010101']
              this.optionsPeople = this.sjzdOptions['090401010102']
            } else if(this.curPlaceParent === '0402020304') { //其他控股子公司
              this.optionsCrimeMoney = this.sjzdOptions['090501010101']
              this.optionsPeople = this.sjzdOptions['090501010102']
            } else { //集团直属单位
              this.optionsCrimeMoney = this.sjzdOptions['090101010101']
              this.optionsPeople = this.sjzdOptions['090101010102']
            }
            break;
          case '0402020105': // 交通事故
            if(this.curPlaceParent === '0402020301') { //省分公司
              this.optionsPeople = this.sjzdOptions['090301040101']
            } else if(this.curPlaceParent === '0402020302') { //邮储银行
              this.optionsPeople = this.sjzdOptions['090201040101']
            } else if(this.curPlaceParent === '0402020303') { //速递物流公司
              this.optionsPeople = this.sjzdOptions['090401040101']
            } else if(this.curPlaceParent === '0402020304') { //其他控股子公司
              this.optionsPeople = this.sjzdOptions['090501040101']
            } else { //集团直属单位
              this.optionsPeople = this.sjzdOptions['090101040101']
            }
            break;
          case '0402020106': // 火灾事故
            if(this.curPlaceParent === '0402020301') { //省分公司
              this.optionsCrimeMoney = this.sjzdOptions['090301010201']
              this.optionsPeople = this.sjzdOptions['090301030101']
            } else if(this.curPlaceParent === '0402020302') { //邮储银行
              this.optionsCrimeMoney = this.sjzdOptions['090201030102']
              this.optionsPeople = this.sjzdOptions['090201030101']
            } else if(this.curPlaceParent === '0402020303') { //速递物流公司
              this.optionsCrimeMoney = this.sjzdOptions['090401030102']
              this.optionsPeople = this.sjzdOptions['090401030101']
            } else if(this.curPlaceParent === '0402020304') { //其他控股子公司
              this.optionsCrimeMoney = this.sjzdOptions['090501030102']
              this.optionsPeople = this.sjzdOptions['090501030101']
            } else { //集团直属单位
              this.optionsCrimeMoney = this.sjzdOptions['090101030102']
              this.optionsPeople = this.sjzdOptions['090101030101']
            }
            break;
          case '0402020107' || '0402020108' || '0402020110': // 其他人员伤亡事故，邮寄爆炸物，刑事案件
            if(this.curPlaceParent === '0402020301') { //省分公司
              this.optionsCrimeMoney = this.sjzdOptions['090301010201']
              this.optionsPeople = this.sjzdOptions['090301020101']
            } else if(this.curPlaceParent === '0402020302') { //邮储银行
              this.optionsCrimeMoney = this.sjzdOptions['090201010201']
              this.optionsPeople = this.sjzdOptions['090201020101']
            } else if(this.curPlaceParent === '0402020303') { //速递物流公司
              this.optionsCrimeMoney = this.sjzdOptions['090401010201']
              this.optionsPeople = this.sjzdOptions['090401020101']
            } else if(this.curPlaceParent === '0402020304') { //其他控股子公司
              this.optionsCrimeMoney = this.sjzdOptions['090501010201']
              this.optionsPeople = this.sjzdOptions['090501020101']
            } else { //集团直属单位
              this.optionsCrimeMoney = this.sjzdOptions['090101010201']
              this.optionsPeople = this.sjzdOptions['090101020101']
            }
            break;
        }
        this.optionsCrimeMoney.unshift(this.noSelect)
        this.optionsPeople.unshift(this.noSelect)
        this.formData.tcSajeqj = this.optionsCrimeMoney[0].tcSjubm
        this.formData.tcRyswqj = this.optionsPeople[0].tcSjubm
        this.$forceUpdate
      // }
    },
    // 案发部位-change
    _PlaceChange(val) {
      // 控制邮件损失显示
      if(val === '0402020204' || val === '0402020205' || val === '0402020206' || val === '0402020207' || val === '0402020208' || val === '0402020211' || val === '0402020212') {
        this.yjssControl = true
      } else {
        this.yjssControl = false
      }
    },
    // 事件-案发单位所属-下拉框change事件
    _PlaceParentChange(val) {
      this.optionsCrimeMoney = []
      this.optionsPeople = []
      this.curPlaceParent = val
      
      // if(this.curXxxlx !== '' && this.curPlaceParent !== '') {
        if(this.$route.query.type === 'cb_update') {
          this.curXxxlx = this.formData.tcXxlx
        }
        switch(this.curPlaceParent) {
          case '0402020301': //省分公司
            this.optionsCrimeMoney = []
            this.optionsPeople = []
            if(this.curXxxlx === '0402020102') { //贪污案件
              this.optionsCrimeMoney = this.sjzdOptions['090301010301']
            }else if(this.curXxxlx === '0402020103' || this.curXxxlx === '0402020104') { //盗窃、抢劫案件
              this.optionsCrimeMoney = this.sjzdOptions['090301010101']
              this.optionsPeople = this.sjzdOptions['090301010102']
            }else if(this.curXxxlx === '0402020105') { //交通事故
              this.optionsPeople = this.sjzdOptions['090301040101']
            }else if(this.curXxxlx === '0402020106') { //火灾事故
              this.optionsCrimeMoney = this.sjzdOptions['090301010201']
              this.optionsPeople = this.sjzdOptions['090301030101']
            }else if(this.curXxxlx === '0402020107' || this.curXxxlx === '0402020108' || this.curXxxlx === '0402020110') { //其他人员伤亡事故，邮寄爆炸物，刑事案件
              this.optionsCrimeMoney = this.sjzdOptions['090301010201']
              this.optionsPeople = this.sjzdOptions['090301020101']
            }
            break;
          case '0402020302': //邮储银行
            this.optionsCrimeMoney = []
            this.optionsPeople = []
            if(this.curXxxlx === '0402020102') { //贪污案件
              this.optionsCrimeMoney = this.sjzdOptions['090201010301']
            }else if(this.curXxxlx === '0402020103' || this.curXxxlx === '0402020104') { //盗窃、抢劫案件
              this.optionsCrimeMoney = this.sjzdOptions['090201010101']
              this.optionsPeople = this.sjzdOptions['090201010102']
            }else if(this.curXxxlx === '0402020105') { //交通事故
              this.optionsPeople = this.sjzdOptions['090201040101']
            }else if(this.curXxxlx === '0402020106') { //火灾事故
              this.optionsCrimeMoney = this.sjzdOptions['090201030102']
              this.optionsPeople = this.sjzdOptions['090201030101']
            }else if(this.curXxxlx === '0402020107' || this.curXxxlx === '0402020108' || this.curXxxlx === '0402020110') { //其他人员伤亡事故，邮寄爆炸物，刑事案件
              this.optionsCrimeMoney = this.sjzdOptions['090201010201']
              this.optionsPeople = this.sjzdOptions['090201020101']
            }
            break;
          case '0402020303': //速递物流公司
            this.optionsCrimeMoney = []
            this.optionsPeople = []
            if(this.curXxxlx === '0402020102') { //贪污案件
              this.optionsCrimeMoney = this.sjzdOptions['090201010301']
            }else if(this.curXxxlx === '0402020103' || this.curXxxlx === '0402020104') { //盗窃、抢劫案件
              this.optionsCrimeMoney = this.sjzdOptions['090401010101']
              this.optionsPeople = this.sjzdOptions['090401010102']
            }else if(this.curXxxlx === '0402020105') { //交通事故
              this.optionsPeople = this.sjzdOptions['090401040101']
            }else if(this.curXxxlx === '0402020106') { //火灾事故
              this.optionsCrimeMoney = this.sjzdOptions['090401030102']
              this.optionsPeople = this.sjzdOptions['090401030101']
            }else if(this.curXxxlx === '0402020107' || this.curXxxlx === '0402020108' || this.curXxxlx === '0402020110') { //其他人员伤亡事故，邮寄爆炸物，刑事案件
              this.optionsCrimeMoney = this.sjzdOptions['090401010201']
              this.optionsPeople = this.sjzdOptions['090401020101']
            }
            break;
          case '0402020304': //其他控股子公司
            this.optionsCrimeMoney = []
            this.optionsPeople = []
            if(this.curXxxlx === '0402020102') { //贪污案件
              this.optionsCrimeMoney = this.sjzdOptions['090501010301']
            }else if(this.curXxxlx === '0402020103' || this.curXxxlx === '0402020104') { //盗窃、抢劫案件
              this.optionsCrimeMoney = this.sjzdOptions['090501010101']
              this.optionsPeople = this.sjzdOptions['090501010102']
            }else if(this.curXxxlx === '0402020105') { //交通事故
              this.optionsPeople = this.sjzdOptions['090501040101']
            }else if(this.curXxxlx === '0402020106') { //火灾事故
              this.optionsCrimeMoney = this.sjzdOptions['090501030102']
              this.optionsPeople = this.sjzdOptions['090501030101']
            }else if(this.curXxxlx === '0402020107' || this.curXxxlx === '0402020108' || this.curXxxlx === '0402020110') { //其他人员伤亡事故，邮寄爆炸物，刑事案件
              this.optionsCrimeMoney = this.sjzdOptions['090501010201']
              this.optionsPeople = this.sjzdOptions['090501020101']
            }
            break;
          case '0402020305': //集团直属单位
            this.optionsCrimeMoney = []
            this.optionsPeople = []
            if(this.curXxxlx === '0402020102') { //贪污案件
              this.optionsCrimeMoney = this.sjzdOptions['090101010301']
            }else if(this.curXxxlx === '0402020103' || this.curXxxlx === '0402020104') { //盗窃、抢劫案件
              this.optionsCrimeMoney = this.sjzdOptions['090101010101']
              this.optionsPeople = this.sjzdOptions['090101010102']
            }else if(this.curXxxlx === '0402020105') { //交通事故
              this.optionsPeople = this.sjzdOptions['090101040101']
            }else if(this.curXxxlx === '0402020106') { //火灾事故
              this.optionsCrimeMoney = this.sjzdOptions['090101030102']
              this.optionsPeople = this.sjzdOptions['090101030101']
            }else if(this.curXxxlx === '0402020107' || this.curXxxlx === '0402020108' || this.curXxxlx === '0402020110') { //其他人员伤亡事故，邮寄爆炸物，刑事案件
              this.optionsCrimeMoney = this.sjzdOptions['090101010201']
              this.optionsPeople = this.sjzdOptions['090101020101']
            }
            break;
        }
        this.optionsCrimeMoney.unshift(this.noSelect)
        this.optionsPeople.unshift(this.noSelect)
        this.formData.tcSajeqj = this.optionsCrimeMoney[0].tcSjubm
        this.formData.tcRyswqj = this.optionsPeople[0].tcSjubm
        this.$forceUpdate
      // }
    },
    // 事件-选择区域-点击树节点
    _OrgTreeRegionClick(node) {
      this.curRegion = node
      if(Object.keys(this.curRegion).length !== 0) {
        this.$refs.ruleForm.clearValidate(['tcSbdwmc'])
      }
    },
    // 事件-保存
    _ButtonSaveClick() {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          if(this.$route.query.type === 'add') {
            this.addInfoData()
          } else {
            this.updateInfoData()
          }
          this.$refs.ruleForm.clearValidate()
          this.dlgTypeVisble = false
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 文件上传
    _requestFile(param) {
      let fileObj = param.file
      this.file = fileObj
      let form = new FormData()    // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId',window.sessionStorage.sessionId)
      form.append('lylx',0),
      form.append('cdId','0004030201')
      form.append('isQuery', 0)
      form.append('isVideo', 0)
      const isLt2M = param.file.size / 1024 / 1024 < 200;
      if(isLt2M) {
        this.uploadFile(form, fileObj.name)
      } else{
        this.$msgbox({
          message: '上传附件大小不能超过 200MB!',
          type: 'warning'
        })
      }
    },
    async uploadFile(data, name) {
      const result = await Model.uploadFile(data);
      if (result.state === "1") {
        this.$message({
          message:'上传成功!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
        const wjmc = result.data.split(",")
        let fileObj = {
          tcYwjmc: wjmc[0],
          tcXwjmc: wjmc[1]
        }
        Object.assign(fileObj, this.file)
        this.xtFjList.push(fileObj)
      }else{
        this.$message({
          message:'上传失败!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
      }
    },
    // 点击文件下载
    _FileDownload(file) {
      request({
        url: '/zlk/zlkDownload',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          requestData:{
            tcWjm: file.newName||this.xtFjList.find(el => el.uid === file.uid).tcXwjmc
          }
        }
      }).then((res) => { // 处理返回的文件流
        if(res == undefined){
          this.$message({
            message:'下载失败,请联系管理员!',
            type:"fail",
            duration:1000,
            customClass: "middle"
          })
        }else{      
          const content = res
          const blob = new Blob([content])
          const fileName = file.name
          const fileTag = fileName.split(".")[1]
          if(fileTag==="png"||fileTag==="jpg"||fileTag==="jpeg"){
            let src = URL.createObjectURL(blob)
            this.src = src
            this.picVisible = true
          }else{
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
          }
        }
      })
    },
    closeHandle(){
      this.picVisible = false
    },
    // 移除文件
    _FileRemove(file, fileList) {
      this.xtFjList = this.xtFjList.filter(el => {
        return el.tcYwjmc !== file.name
      })
    },
    // 初报-新增
    async addInfoData() {
      
      // 案件类型-名称
      if(this.formData.tcXxlx !== undefined) {
        let objInfoType = this.optionsInfoType.find(item=>{
          return item.tcSjubm === this.formData.tcXxlx  
        })
        if(typeof objInfoType != "undefined") {
          this.formData.tcXxlxmc = objInfoType.tcSjnr
        }
      }

      // 案发部位-名称
      if(this.formData.tcAfbw !== undefined) {
        let objCrimePlace = this.optionsCrimePlace.find(item=>{
          return item.tcSjubm === this.formData.tcAfbw
        })
        if(typeof objCrimePlace != "undefined") {
          this.formData.tcAfbwmc = objCrimePlace.tcSjnr
        }
      }

      // 案发单位所属-名称
      if(this.formData.tcAfbwss !== undefined) {
        let objCrimePlaceParent = this.optionsCrimePlaceParent.find(item=>{
          return item.tcSjubm === this.formData.tcAfbwss
        })
        if(typeof objCrimePlaceParent != "undefined") {
          this.formData.tcAfbwssmc = objCrimePlaceParent.tcSjnr
        }
      }
      
      // 作案类型-名称
      if(this.formData.tcZalx !== undefined) {
        let objCulpritType = this.optionsCulpritType.find(item=>{
          return item.tcSjubm === this.formData.tcZalx
        })
        if(typeof objCulpritType != "undefined") {
          this.formData.tcZalxmc = objCulpritType.tcSjnr
        }
      }
      
      // 涉案金额-名称
      if(this.formData.tcSajeqj !== undefined) {
        let objCrimeMoney = this.optionsCrimeMoney.find(item=>{
          return item.tcSjubm === this.formData.tcSajeqj
        })
        if(typeof objCrimeMoney != "undefined") {
          this.formData.tcSajeqjmc = objCrimeMoney.tcSjnr
        }
      }
      
      // 人员伤亡-名称
      if(this.formData.tcRyswqj !== undefined) {
        let objPeople = this.optionsPeople.find(item=>{
          return item.tcSjubm === this.formData.tcRyswqj
        })
        if(typeof objPeople != "undefined") {
          this.formData.tcRyswqjmc = objPeople.tcSjnr
        }
      }
      
      const result = await Model.saveAddList({
        isQuery: 0,  //是否是查询类 0-否 1-是
        cdId: '0004030201',
        requestData: {
          tcSblx: this.formData.tcSblx || '',
          tcXxbt: this.formData.tcXxbt || '',
          tcXxlx: this.formData.tcXxlx || '',
          tcXxlxmc: this.formData.tcXxlxmc || '',
          tdAfrq: this.formData.tdAfrq || '',
          tcAfbw: this.formData.tcAfbw || '',
          tcAfbwmc: this.formData.tcAfbwmc || '',
          tcAfbwss: this.formData.tcAfbwss || '',
          tcAfbwssmc: this.formData.tcAfbwssmc || '',
          tcSbdwbm: this.formData.tcSbdwbm || '',
          tcSbdwmc: this.formData.tcSbdwmc || '',
          tdSbsj: this.formData.tdSbsj || '',
          tcSaje: this.formData.tcSaje !== undefined ? this.formData.tcSaje : '',
          tcSajeqj: this.formData.tcSajeqj !== undefined ? this.formData.tcSajeqj : '',
          tcSajeqjmc: this.formData.tcSajeqjmc !== undefined ? this.formData.tcSajeqjmc : '',
          tcRysw: this.formData.tcRysw !== undefined ? this.formData.tcRysw : '',
          tcRyswqj: this.formData.tcRyswqj !== undefined ? this.formData.tcRyswqj : '',
          tcRyswqjmc: this.formData.tcRyswqjmc !== undefined ? this.formData.tcRyswqjmc : '',
          tcYjssqk: this.formData.tcYjssqk || '',
          tcZalx: this.formData.tcZalx || '',
          tcZalxmc: this.formData.tcZalxmc || '',
          tcQksm: this.formData.tcQksm || '',
          tnGwsj: this.formData.tnGwsj !== undefined ? this.formData.tnGwsj : '',
          // tcDwmc:this.formData.tcDwmc || '',
          tnZt: 0,
          tnSjzt: 0,
          tnSfscbgs: (this.xtFjList.length !==0)?1:0,
          tcZzjgdm: this.formData.tcZzjgdm || '',
          tcSjjgdm: this.formData.tcSjjgdm || '',
          xtFjList: this.xtFjList
        }
      })
      if (result.data && result.state === '1') {
        this.$message({
          message: '保存成功！',
          type: 'success',
          customClass: "middle",
        })
        this.fileList = []
        if(this.formData.tnGwsj === 0) {
          this.$router.push({ 
            path: '/info/case/commit'
          })
        } else {
          this.$router.push({ 
            path: '/info/case/commit/end',
            query: {
              id: result.data.tnXxcbid,
              tnGwsj: 1
            }
          })
        }
      }
    },
    // 初报-修改
    async updateInfoData() {
      
      if(this.formData.tcXxlx !== undefined) {
        let objInfoType = this.optionsInfoType.find(item=>{
          return item.tcSjubm === this.formData.tcXxlx  
        })
        if(typeof objInfoType != "undefined") {
          this.formData.tcXxlxmc = objInfoType.tcSjnr
        }
      }
      
      if(this.formData.tcAfbw !== undefined) {
        let objCrimePlace = this.optionsCrimePlace.find(item=>{
          return item.tcSjubm === this.formData.tcAfbw
        })
        if(typeof objCrimePlace != "undefined") {
          this.formData.tcAfbwmc = objCrimePlace.tcSjnr
        }
      }

      if(this.formData.tcAfbwss !== undefined) {
        let objCrimePlaceParent = this.optionsCrimePlaceParent.find(item=>{
          return item.tcSjubm === this.formData.tcAfbwss
        })
        if(typeof objCrimePlaceParent != "undefined") {
          this.formData.tcAfbwssmc = objCrimePlaceParent.tcSjnr
        }
      }
      
      if(this.formData.tcZalx !== undefined) {
        let objCulpritType = this.optionsCulpritType.find(item=>{
          return item.tcSjubm === this.formData.tcZalx
        })
        if(typeof objCulpritType != "undefined") {
          this.formData.tcZalxmc = objCulpritType.tcSjnr
        }
      }

      // 涉案金额-名称
      if(this.formData.tcSajeqj !== undefined) {
        let objCrimeMoney = this.optionsCrimeMoney.find(item=>{
          return item.tcSjubm === this.formData.tcSajeqj
        })
        if(typeof objCrimeMoney != "undefined") {
          this.formData.tcSajeqjmc = objCrimeMoney.tcSjnr
        }
      }
      
      // 人员伤亡-名称
      if(this.formData.tcRyswqj !== undefined) {
        let objPeople = this.optionsPeople.find(item=>{
          return item.tcSjubm === this.formData.tcRyswqj
        })
        if(typeof objPeople != "undefined") {
          this.formData.tcRyswqjmc = objPeople.tcSjnr
        }
      }

      const result = await Model.updateCbList({
        isQuery: 0,  //是否是查询类 0-否 1-是
        cdId: '0004030201',
        requestData: {
          tcSblx:this.formData.tcSblx || '',
          tcXxbt:this.formData.tcXxbt || '',
          tcXxlx:this.formData.tcXxlx || '',
          tcXxlxmc:this.formData.tcXxlxmc || '',
          tdAfrq:this.formData.tdAfrq || '',
          tcAfbw:this.formData.tcAfbw || '',
          tcAfbwmc:this.formData.tcAfbwmc || '',
          tcAfbwss:this.formData.tcAfbwss || '',
          tcAfbwssmc:this.formData.tcAfbwssmc || '',
          tcSbdwbm:this.formData.tcSbdwbm || '',
          tcSbdwmc:this.formData.tcSbdwmc || '',
          tdSbsj:this.formData.tdSbsj || '',
          tcSaje:this.formData.tcSaje !== undefined ? this.formData.tcSaje : '',
          tcSajeqj: this.formData.tcSajeqj !== undefined ? this.formData.tcSajeqj : '',
          tcSajeqjmc: this.formData.tcSajeqjmc !== undefined ? this.formData.tcSajeqjmc : '',
          tcRysw: this.formData.tcRysw || '',
          tcRyswqj: this.formData.tcRyswqj !== undefined ? this.formData.tcRyswqj : '',
          tcRyswqjmc: this.formData.tcRyswqjmc !== undefined ? this.formData.tcRyswqjmc : '',
          tcYjssqk: this.formData.tcYjssqk || '',
          tcZalx:this.formData.tcZalx || '',
          tcZalxmc:this.formData.tcZalxmc || '',
          tcQksm:this.formData.tcQksm || '',
          tnGwsj:this.formData.tnGwsj || '',
          tcDwmc:this.formData.tcDwmc || '',
          tnZt:0,
          tnSjzt:this.formData.tnSjzt || '',
          tnSfscbgs: (this.xtFjList.length !==0)?1:0,
          tcZzjgdm: this.formData.tcZzjgdm || '',
          tcSjjgdm: this.formData.tcSjjgdm || '',
          tnXxcbid: this.$route.query.id,
          xtFjList: this.xtFjList
        }
      })
      if (result && result.state === '1') {
        this.$message({
          message: '保存成功！',
          type: 'success',
          customClass: "middle",
        })
        this.fileList = []
        this.$router.push({ path: '/info/case/commit' })
      }
    },
    // 初报详情
    async getDetail() {
      const result = await Model.getDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
        cdId: '0004030201',
        requestData: { 
          tnXxcbid: this.$route.query.id
        }
      })
      if (result && result.data) {
        this.formData = result.data.xxglXxcbDto
        this.xtFjList = result.data.xxglXxcbDto.xtFjList
        this.formData.tdSbsj=Moment(this.formData.tdSbsj).format('YYYY-MM-DD')
        this.formData.tdAfrq=Moment(this.formData.tdAfrq).format('YYYY-MM-DD')  
        if(this.formData.xtFjList && this.formData.xtFjList.length != 0) {
          this.formData.xtFjList.forEach((item) => {
            let obj = {
              name: item.tcYwjmc,
              newName: item.tcXwjmc,
              url: ''
            }
            this.fileList.push(obj)
          })
        }
        // this.optionsPeople = []
        // this.optionsCrimeMoney = []
        if(this.formData.tcRyswqj !== undefined) {
          this.ryswControl = true
          let temp = this.formData.tcRyswqj.substring(0, this.formData.tcRyswqj.length-2)
          this.optionsPeople = this.sjzdOptions[temp]
        }
        if(this.formData.tcSajeqj !== undefined) {
          this.sajeControl = true
          let temp = this.formData.tcSajeqj.substring(0, this.formData.tcSajeqj.length-2)
          this.optionsCrimeMoney = this.sjzdOptions[temp]
        }
        if(this.formData.tcAfbw === '0402020204' || this.formData.tcAfbw === '0402020205' || this.formData.tcAfbw === '0402020206' || this.formData.tcAfbw === '0402020207' || this.formData.tcAfbw === '0402020208' || this.formData.tcAfbw === '0402020211' || this.formData.tcAfbw === '0402020212') {
          this.yjssControl = true
        } else {
          this.yjssControl = false
        }
        this.optionsPeople.unshift(this.noSelect)
        this.optionsCrimeMoney.unshift(this.noSelect)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .special {
    width: 350px;
  }
</style>

