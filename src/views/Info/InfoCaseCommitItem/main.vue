<template>
  <CustomView :location="[{ text: $route.query.type === 'continue' ? '新增续报信息' : '续报信息详情' }]">
    <!-- 以往初报、续报信息 -->
    <div class="detail">
      <Detail type="初报" :content="formData" @check="_ButtonCheckClick($event, 'cb')"/>
      <Detail type="续报" :expand="false" :content="list" :idx="index + 1" @check="_ButtonCheckClick($event, 'xb')" v-for="(list, index) in xxxbList" :key="index" />
      <End :content="wjList" v-if="Object.keys(wjList).length !== 0" />
    </div>

    <el-form :model="editData" ref="ruleFormAdd" :rules="rules" v-if="$route.query.type === 'detail' || $route.query.type === 'continue'" label-position="top" class="common-form">
      <el-form-item label="信息标题" prop="tcXxbt">
        <el-input v-model="editData['tcXxbt']" maxlength='60' size="mini" placeholder="请输入信息标题"></el-input>
      </el-form-item>
      <el-form-item label="案发单位" prop="tcSbdwmc">
        <el-input v-model="editData['tcSbdwmc']" size="mini" placeholder="请选择案发单位" @focus="_DataFilterChoose"></el-input>
      </el-form-item>
      <el-form-item label="案件类型" prop="tcXxlx">
        <el-select v-model="editData['tcXxlx']" @change="_XxlxChange" size="mini" placeholder="请选择案件类型">
          <el-option v-for="option in optionsInfoType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="案发单位所属" prop="tcAfbwss">
        <el-select v-model="editData['tcAfbwss']" size="mini" @change="_PlaceParentChange" placeholder="请选择案发单位所属">
          <el-option v-for="option in optionsCrimePlaceParent" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="案发部位" prop="tcAfbw">
        <el-select v-model="editData['tcAfbw']" size="mini" @change="_PlaceChange" placeholder="请选择案发部位">
          <el-option v-for="option in optionsCrimePlace" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="案发时间" prop="tdAfrq">
        <el-date-picker v-model="editData['tdAfrq']" size="mini" type="date" placeholder="选择案发时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="涉案金额区间" v-show="sajeControl" prop="tcSajeqj">
        <el-select v-model="editData['tcSajeqj']" @visible-change="$forceUpdate()" size="mini" placeholder="请选择涉案金额区间">
          <el-option  v-for="option in optionsCrimeMoney" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="涉案金额" v-show="sajeControl" prop="tcSaje">
        <el-input v-model="editData['tcSaje']" size="mini" maxlength='200' placeholder="请输入涉案金额"></el-input>
      </el-form-item>
      
      <el-form-item label="人员伤亡区间" v-show="ryswControl" prop="tcRyswqj">
        <el-select v-model="editData['tcRyswqj']" @visible-change="$forceUpdate()" size="mini" placeholder="请选择人员伤亡区间">
          <el-option  v-for="option in optionsPeople" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员伤亡" v-show="ryswControl" prop="tcRysw">
        <el-input v-model="editData['tcRysw']" size="mini" maxlength='600' placeholder="请输入人员伤亡"></el-input>
      </el-form-item>
      
      <el-form-item label="邮件损失情况" v-show="yjssControl" prop="tcYjssqk">
        <el-input v-model="editData['tcYjssqk']" type="textarea" :rows="5" size="mini" placeholder="请输入邮件损失情况"></el-input>
      </el-form-item>
      <el-form-item label="作案人类型" prop="tcZalx">
        <el-select v-model="editData['tcZalx']" size="mini" placeholder="请选择作案人类型">
          <el-option v-for="option in optionsCulpritType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上报时间" prop="tdSbsj"> 
        <el-date-picker v-model="editData['tdSbsj']" size="mini" type="date" placeholder="选择上报时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="续报情况说明" prop="tcQksm">
        <el-input v-model="editData['tcQksm']" type="textarea" :rows="5" size="mini" placeholder="请输入情况说明"></el-input>
      </el-form-item>

      <el-form-item label="附件"> 
        <el-upload class="upload-demo" 
          action='' 
          :http-request="(param) => _requestFile(param)"
          :auto-upload="true"
          :on-preview="_FileDownload"
          :file-list="editData.fileList.map(item => {item.name = item.tcYwjmc; return item})"
          :on-remove="_FileRemove"
          :show-file-list='true'>
          <el-button size="mini" type="default">上传</el-button>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item v-if="$route.query.type !== 'continue'" label="过往事件" prop="tnGwsj">
        <el-select v-model="editData['tnGwsj']" size="mini" placeholder="请选择是否为过往事件">
          <el-option v-for="option in optionGwsj" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick()">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择案发单位 -->
    <CustomDialog title=" 选择区域" :visible="dlgVisble" @close="_DlgCloseHandle">
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

import Detail from './components/Detail.vue'
import End from './components/End.vue'

export default {
  mixins: [
    Mixin.init, 
  ],
  components: {
    Detail,
    End
  },
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
      editData: {},
      formData: {},
      xxxbList: [],
      wjList: {},
      optionsReportType: [],
      optionsInfoType: [],
      optionsCrimePlace: [],
      optionsCrimePlaceParent: [],
      optionsCulpritType: [],
      optionsInfoState: [],
      optionsCrimeMoney: [],
      optionsSbdw: [],
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
      rules: {
        tcXxbt: [
          Validator.required('请输入信息标题'),
        ],
        tcXxlx: [
          Validator.required('请选择案件类型'),
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
        tcZalx: [
          Validator.required('请选择作案人类型'),
        ],
        tcRysw: [
          Validator.length(1, 500)
        ],
        tcYjssqk: [
          Validator.length(1, 500)
        ],
        tcQksm: [
          Validator.required('请输入情况说明'),
          Validator.length(1, 500)
        ],
        tnGwsj: [
          Validator.required('请选择是否过往事件'),
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      dlgVisble: false,
      curRegion: {},
      xtFjList: [],
      src: '',
      picVisible: false,
      optionsPeople: [],
      ryswControl: false,
      sajeControl: false,
      yjssControl: false,
      curXxxlx: '',
      curPlaceParent: '',
      sjzdOptions: {},
      noSelect: {
        tcSjubm: '',
        tcSjnr: '无'
      },
      tempXxxbId: '',
      tempXxxbList: []
    }
  },
  methods: {
    $init(options) {
      this.sjzdOptions = options
      this.optionsInfoType = options['04020201']
      this.optionsCrimePlace = options['04020202']
      this.optionsCrimePlaceParent = options['04020203']
      this.optionsCulpritType = options['0402020404']
      this.getOrg()
      this.getDetail()
    },
    _DlgCloseHandle() {
      this.dlgVisble = false
      if(Object.keys(this.curRegion).length !== 0) {
        this.$refs.ruleFormAdd.clearValidate(['tcSbdwmc'])
      }
      this.$forceUpdate()
    },
    _DlgButtonClick() {
      this.formData.tcSbdwbm = this.curRegion.id
      this.formData.tcSbdwmc = this.curRegion.name

      this.editData.tcSbdwbm = this.curRegion.id
      this.editData.tcSbdwmc = this.curRegion.name

      this.dlgVisble = false
      if(Object.keys(this.curRegion).length !== 0) {
        this.$refs.ruleFormAdd.clearValidate(['tcSbdwmc'])
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
        if(this.$route.query.type === 'continue') {
          this.curPlaceParent = this.editData.tcAfbwss
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
        this.optionsCrimeMoney && this.optionsCrimeMoney.unshift(this.noSelect)
        this.optionsPeople && this.optionsPeople.unshift(this.noSelect)
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
        if(this.$route.query.type === 'continue') {
          this.curXxxlx = this.editData.tcXxlx
        }
        switch(this.curPlaceParent) {
          case '0402020301': //省分公司
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
        this.optionsCrimeMoney && this.optionsCrimeMoney.unshift(this.noSelect)
        this.optionsPeople && this.optionsPeople.unshift(this.noSelect)
        this.formData.tcSajeqj = this.optionsCrimeMoney[0].tcSjubm
        this.formData.tcRyswqj = this.optionsPeople[0].tcSjubm
        this.$forceUpdate
      // }
    },
    // 事件-选择区域-点击树节点
    _OrgTreeRegionClick(node) {
      this.curRegion = node
      if(Object.keys(this.curRegion).length !== 0) {
        this.$refs.ruleFormAdd.clearValidate(['tcSbdwmc'])
      }
    },
    // 事件-保存
    _ButtonSaveClick() {
      if(this.$route.query.type === 'detail') {
        this.$refs.ruleFormAdd.validate((valid, obj) => {
          if (valid) {
            this.updateXxxb(this.$route.query.id, this.tempXxxbId)
            this.$refs.ruleFormAdd.clearValidate()
            this.dlgTypeVisble = false
          } else {
            const firstKey = Object.keys(obj)[0]
            this.$alert(obj[firstKey][0].message)
          }
        })
      } else {
        this.$refs.ruleFormAdd.validate((valid, obj) => {
          if (valid) {
            this.addXxxb(this.$route.query.id)
            this.$refs.ruleFormAdd.clearValidate()
          } else {
            const firstKey = Object.keys(obj)[0]
            this.$alert(obj[firstKey][0].message)
          }
        })
      }
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
            tcWjm: file.tcXwjmc
          }
        }
      }).then((res) => { // 处理返回的文件流 
        if(res == undefined ){
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
    // 移除文件
    _FileRemove(file, fileList) {
      if(this.$route.query.type === 'continue') {
        this.xtFjList = this.editData.xtFjList.filter(el => {
          return el.tcYwjmc !== file.tcYwjmc
        })
      } else {
        this.xxxbList.sort(this.Compare('tnXxxbid'))
        this.xtFjList = this.xxxbList[this.xxxbList.length - 1].xtFjList.filter(el => {
          return el.tcYwjmc !== file.tcYwjmc
        })
      }
    },
    closeHandle(){
      this.picVisible = false
    },
    // 新增-续报
    async addXxxb(cbId) {
      if(this.editData.tcXxlx !== undefined) {
        let objInfoType = this.optionsInfoType.find(item=>{
          return item.tcSjubm === this.editData.tcXxlx  
        })
        if(typeof objInfoType != "undefined") {
          this.editData.tcXxlxmc = objInfoType.tcSjnr
        } 
      }

      if(this.editData.tcAfbw !== undefined) {
        let objCrimePlace = this.optionsCrimePlace.find(item=>{
          return item.tcSjubm === this.editData.tcAfbw
        })
        if(typeof objCrimePlace != "undefined") {
          this.editData.tcAfbwmc = objCrimePlace.tcSjnr
        }
      }
      
      if(this.editData.tcAfbwss !== undefined) {
        let objCrimePlaceParent = this.optionsCrimePlaceParent.find(item=>{
          return item.tcSjubm === this.editData.tcAfbwss
        })
        if(typeof objCrimePlaceParent != "undefined") {
          this.editData.tcAfbwssmc = objCrimePlaceParent.tcSjnr
        }
      }
      
      if(this.editData.tcZalx !== undefined) {
        let objCulpritType = this.optionsCulpritType.find(item=>{
          return item.tcSjubm === this.editData.tcZalx
        })
        if(typeof objCulpritType != "undefined") {
          this.editData.tcZalxmc = objCulpritType.tcSjnr
        }
      }
      
      if(this.editData.tcSajeqj !== undefined) {
        let objCrimeMoney = this.optionsCrimeMoney.find(item=>{
          return item.tcSjubm === this.editData.tcSajeqj
        })
        if(typeof objCrimeMoney != "undefined") {
          this.editData.tcSajeqjmc = objCrimeMoney.tcSjnr
        } 
      }

      if(this.editData.tcRyswqj !== undefined) {
        let objPeople = this.optionsPeople.find(item=>{
          return item.tcSjubm === this.editData.tcRyswqj
        })
        if(typeof objPeople != "undefined") {
          this.editData.tcRyswqjmc = objPeople.tcSjnr
        }
      }

      const result = await Model.addContinueList({
        isQuery: 0,  //是否是查询类 0-否 1-是
        cdId: '0004030201',
        requestData: {
          tcXxbt: this.editData.tcXxbt || '',
          tcXxlx: this.editData.tcXxlx || '',
          tcXxlxmc: this.editData.tcXxlxmc || '',
          tdAfrq: this.editData.tdAfrq || '',
          tcAfbw: this.editData.tcAfbw || '',
          tcAfbwmc: this.editData.tcAfbwmc || '',
          tcAfbwss: this.editData.tcAfbwss || '',
          tcAfbwssmc: this.editData.tcAfbwssmc || '',
          tcSbdwbm: this.editData.tcSbdwbm || '',
          tcSbdwmc: this.editData.tcSbdwmc || '',
          tdSbsj: this.editData.tdSbsj || '',
          tcSaje: this.editData.tcSaje !== undefined ? this.editData.tcSaje : '',
          // 2019年5月20日新增 涉案金额区间以及名称
          tcSajeqj: this.editData.tcSajeqj !== undefined ? this.editData.tcSajeqj : '',
          tcSajeqjmc: this.editData.tcSajeqjmc !== undefined ? this.editData.tcSajeqjmc : '',
          tcRysw: this.editData.tcRysw !== undefined ? this.editData.tcRysw : '',
          tcRyswqj: this.editData.tcRyswqj !== undefined ? this.editData.tcRyswqj : '',
          tcRyswqjmc: this.editData.tcRyswqjmc !== undefined ? this.editData.tcRyswqjmc : '',
          tcYjssqk: this.editData.tcYjssqk || '',
          tcZalx: this.editData.tcZalx || '',
          tcZalxmc: this.editData.tcZalxmc || '',
          tcQksm: this.editData.tcQksm || '',
          tnGwsj: 0,
          tcDwmc:this.editData.tcDwmc || '',
          tnZt: 0,
          tnSjzt: 0,
          tnSfscbgs: (this.xtFjList.length !==0)?1:0,
          tnXxcbid: cbId,
          xtFjList: this.xtFjList
        }
      })
      if (result && result.state === '1') {
        this.$message({
          message: '保存成功！',
          type: 'success',
          customClass: "middle",
        })
        this.$router.push({ path: '/info/case/commit' })
      }
    },
    // 编辑续报
    async updateXxxb(cbId, xbId) {
      // 原来的写法
      // const list = this.xxxbList.find(item =>{
      //   return item.tnXxxbid === xbId
      // })
      // let objInfoType = this.optionsInfoType.find(item=>{
      //   return item.tcSjubm === list.tcXxlx  
      // })
      // list.tcXxlxmc = objInfoType.tcSjnr

      // let objCrimePlace = this.optionsCrimePlace.find(item=>{
      //   return item.tcSjubm === list.tcAfbw
      // })
      // list.tcAfbwmc = objCrimePlace.tcSjnr

      // let objCrimePlaceParent = this.optionsCrimePlaceParent.find(item=>{
      //   return item.tcSjubm === list.tcAfbwss
      // })
      // list.tcAfbwssmc = objCrimePlaceParent.tcSjnr

      // let objCulpritType = this.optionsCulpritType.find(item=>{
      //   return item.tcSjubm === list.tcZalx
      // })
      // list.tcZalxmc = objCulpritType.tcSjnr

      // if(list.tcSajeqj !== undefined) {
      //   let objCrimeMoney = this.optionsCrimeMoney.find(item=>{
      //     return item.tcSjubm === list.tcSajeqj
      //   })
      //   list.tcSajeqjmc = objCrimeMoney.tcSjnr
      // }

      // if(list.tcRyswqj !== undefined) {
      //   let objPeople = this.optionsPeople.find(item=>{
      //     return item.tcSjubm === list.tcRyswqj
      //   })
      //   list.tcRyswqjmc = objPeople.tcSjnr
      // }

      // if(list.tcSbdwbm !== undefined) {
      //   let objOrg = this.optionsSbdw.find(item=>{
      //     return item.tcDwbm === list.tcSbdwbm
      //   })
      //   list.tcSbdwmc = objOrg.tcDwmc
      // }


      // 2019年5月13日晚上  所有的都新加判断
      // 2019年5月9日下午新
      // 案件类型-名称
      if(this.editData.tcXxlx !== undefined) {
        let objInfoType = this.optionsInfoType.find(item=>{
          return item.tcSjubm === this.editData.tcXxlx  
        })
        if(typeof objInfoType != "undefined") {
          this.editData.tcXxlxmc = objInfoType.tcSjnr
        }
      }

      // 案发部位-名称
      if(this.editData.tcAfbw !== undefined) {
        let objCrimePlace = this.optionsCrimePlace.find(item=>{
          return item.tcSjubm === this.editData.tcAfbw
        })
        if(typeof objCrimePlace != "undefined") {
          this.editData.tcAfbwmc = objCrimePlace.tcSjnr
        }
      }

      // 案发单位所属-名称
      if(this.editData.tcAfbwss !== undefined) {
        let objCrimePlaceParent = this.optionsCrimePlaceParent.find(item=>{
          return item.tcSjubm === this.editData.tcAfbwss
        })
        if(typeof objCrimePlaceParent != "undefined") {
          this.editData.tcAfbwssmc = objCrimePlaceParent.tcSjnr
        }
      }

      // 作案类型-名称
      if(this.editData.tcZalx !== undefined) {
        let objCulpritType = this.optionsCulpritType.find(item=>{
          return item.tcSjubm === this.editData.tcZalx
        })
        if(typeof objCulpritType != "undefined") {
          this.editData.tcZalxmc = objCulpritType.tcSjnr
        }
      }

      // 涉案金额-名称
      if(this.editData.tcSajeqj !== undefined) {
        let objCrimeMoney = this.optionsCrimeMoney.find(item=>{
          return item.tcSjubm === this.editData.tcSajeqj
        })
        if(typeof objCrimeMoney != "undefined") {
          this.editData.tcSajeqjmc = objCrimeMoney.tcSjnr
        }
      }
      
      // 人员伤亡-名称
      if(this.editData.tcRyswqj !== undefined) {
        let objPeople = this.optionsPeople.find(item=>{
          return item.tcSjubm === this.editData.tcRyswqj
        })
        if(typeof objPeople != "undefined") {
          this.editData.tcRyswqjmc = objPeople.tcSjnr
        }
      }
      // 案发单位
      if(this.editData.tcSbdwbm !== undefined) {
        let objOrg = this.optionsSbdw.find(item=>{
          return item.tcDwbm === this.editData.tcSbdwbm
        })
        if(typeof objOrg != "undefined") {
          this.editData.tcSbdwmc = objOrg.tcDwmc
        }
      }

      const result = await Model.updateContinueList({
        isQuery: 0,  //是否是查询类 0-否 1-是
        cdId: '0004030201',
        requestData: {
          // tcXxbt: list.tcXxbt || '',
          // tcXxlx: list.tcXxlx || '',
          // tcXxlxmc: list.tcXxlxmc || '',
          // tdAfrq: list.tdAfrq || '',
          // tcAfbw: list.tcAfbw || '',
          // tcAfbwmc: list.tcAfbwmc || '',
          // tcAfbwss: list.tcAfbwss || '',
          // tcAfbwssmc: list.tcAfbwssmc || '',
          // tcSbdwbm: list.tcSbdwbm || '',
          // tcSbdwmc: list.tcSbdwmc || '',
          // tcSaje: list.tcSaje !== undefined ? list.tcSaje : '',
          // tcRysw: list.tcRysw !== undefined ? list.tcRysw : '',
          // tcYjssqk: list.tcYjssqk || '',
          // tcZalx: list.tcZalx || '',
          // tcZalxmc: list.tcZalxmc || '',
          // tcQksm: list.tcQksm || '',
          // tnZt: list.tnZt,
          // tnSfscbgs: 0,
          // tnXxcbid: cbId,
          // tnXxxbid: xbId,
          // xtFjList: this.xtFjList
          tcXxbt: this.editData.tcXxbt || '',
          tcXxlx: this.editData.tcXxlx || '',
          tcXxlxmc: this.editData.tcXxlxmc || '',
          tdAfrq: this.editData.tdAfrq || '',
          tcAfbw: this.editData.tcAfbw || '',
          tcAfbwmc: this.editData.tcAfbwmc || '',
          tcAfbwss: this.editData.tcAfbwss || '',
          tcAfbwssmc: this.editData.tcAfbwssmc || '',
          tcSbdwbm: this.editData.tcSbdwbm || '',
          tcSbdwmc: this.editData.tcSbdwmc || '',
          tcSaje: this.editData.tcSaje !== undefined ? this.editData.tcSaje : '',
          tcSajeqj: this.editData.tcSajeqj !== undefined ? this.editData.tcSajeqj : '',
          tcSajeqjmc: this.editData.tcSajeqjmc !== undefined ? this.editData.tcSajeqjmc : '',
          tcRysw: this.editData.tcRysw !== undefined ? this.editData.tcRysw : '',
          tcRyswqj: this.editData.tcRyswqj !== undefined ? this.editData.tcRyswqj : '',
          tcRyswqjmc: this.editData.tcRyswqjmc !== undefined ? this.editData.tcRyswqjmc : '',
          tcYjssqk: this.editData.tcYjssqk || '',
          tcZalx: this.editData.tcZalx || '',
          tcZalxmc: this.editData.tcZalxmc || '',
          tcQksm: this.editData.tcQksm || '',
          tnZt: this.editData.tnZt,
          tnSjzt:this.editData.tnSjzt || '',
          tnSfscbgs: (this.xtFjList.length !==0)?1:0,
          tnXxcbid: cbId,
          tnXxxbid: xbId,
          xtFjList: this.xtFjList
        }
      })
      if (result && result.state === '1') {
        this.$message({
          message: '保存成功！',
          type: 'success',
          customClass: "middle",
        })
        this.$router.push({ path: '/info/case/commit' })
      }
    },
    // 获取下级单位
    async getOrg() {
      const result = await Model.getOrg({
        isQuery: 1,  //是否是查询类 0-否 1-是
        cdId: '0004030201',
        requestData: {}
      })
      if (result && result.data) {
        this.optionsSbdw = result.data;
      }
    },
    // 对象数组排序
    Compare(property){
      return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
    // 获取详情
    async getDetail() {
      const result = await Model.getDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
        cdId: '0004030201',
        requestData:{
          tnXxcbid: this.$route.query.id
        }
      })
      if (result && result.data) {
        // 判断是否有续报
        if(result.data.xxxblist && result.data.xxxblist.length !== 0) {
          let data = result.data.xxxblist; 
          data.sort(this.Compare('tnXxxbid'))
          data[data.length - 1].tdAfrq =  Moment(data[data.length - 1].tdAfrq).format('YYYY-MM-DD')
          data[data.length - 1].tdSbsj =  Moment(data[data.length - 1].tdSbsj).format('YYYY-MM-DD')
          this.editData = data[data.length - 1]
        } else {
          this.editData = result.data.xxglXxcbDto
        }
        if(this.editData.tcRyswqj !== undefined) {
          this.ryswControl = true
          let temp = this.editData.tcRyswqj.substring(0, this.editData.tcRyswqj.length-2)
          this.optionsPeople = this.sjzdOptions[temp]
        }
        if(this.editData.tcSajeqj !== undefined) {
          this.sajeControl = true
          let temp = this.editData.tcSajeqj.substring(0, this.editData.tcSajeqj.length-2)
          this.optionsCrimeMoney = this.sjzdOptions[temp]
        }
        if(this.editData.tcAfbw === '0402020204' || this.editData.tcAfbw === '0402020205' || this.editData.tcAfbw === '0402020206' || this.editData.tcAfbw === '0402020207' || this.editData.tcAfbw === '0402020208' || this.editData.tcAfbw === '0402020211' || this.editData.tcAfbw === '0402020212') {
          this.yjssControl = true
        } else {
          this.yjssControl = false
        }
        this.optionsPeople && this.optionsPeople.unshift(this.noSelect)
        this.optionsCrimeMoney && this.optionsCrimeMoney.unshift(this.noSelect)
        // 新增续报-附件
        this.editData.fileList = []
        this.editData.xtFjList.forEach(file => {
          let obj = {
            tcYwjmc: file.tcYwjmc,
            tcXwjmc: file.tcXwjmc,
            url: ''
          }
          this.editData.fileList.push(obj)
        })

        // 初报-附件
        this.formData = result.data.xxglXxcbDto
        this.formData.tdSbsj = Moment(this.formData.tdSbsj).format('YYYY-MM-DD')
        this.formData.tdAfrq = Moment(this.formData.tdAfrq).format('YYYY-MM-DD') 
        if(this.formData.xtFjList && this.formData.xtFjList.length !==0) {
          this.formData.fileList = []
          this.formData.xtFjList.forEach(file => {
            let obj = {
              tcYwjmc: file.tcYwjmc,
              tcXwjmc: file.tcXwjmc,
              url: ''
            }
            this.formData.fileList.push(obj)
          })
        }

        // 完结附件
        if(result.data.xxglXxcbwjDto) {
          this.wjList = result.data.xxglXxcbwjDto
          this.wjList.xtFjList.forEach(file => {
            let obj = {
              tcYwjmc: file.tcYwjmc,
              tcXwjmc: file.tcXwjmc,
              url: '',
              tcYwjmc: file.tcYwjmc,
              tcXwjmc: file.tcXwjmc,
            }
            this.wjList.fileList = []
            this.wjList.fileList.push(obj)
          });
        }
        // 区分编辑和续报的情况
        if(this.$route.query.type === 'detail') {
          this.tempXxxbId = result.data.xxxblist[result.data.xxxblist.length-1].tnXxxbid
          // this.tempXxxbList = result.data.xxxblist.slice(0,result.data.xxxblist.length-1)
          // result.data.xxxblist.pop()
          this.xxxbList = result.data.xxxblist
        } else {
          this.xxxbList = result.data.xxxblist
        }
        
        for(let i in this.xxxbList) {
          this.xxxbList[i].tdSbsj = Moment(this.xxxbList[i].tdSbsj).format('YYYY-MM-DD')
          this.xxxbList[i].tdAfrq = Moment(this.xxxbList[i].tdAfrq).format('YYYY-MM-DD')
          // 以前续报记录 附件
          if(this.xxxbList[i].xtFjList && this.xxxbList[i].xtFjList.length !==0) {
            this.xxxbList[i].fileList = []
            this.xxxbList[i].xtFjList.forEach(file => {
              let obj = {
                tcYwjmc: file.tcYwjmc,
                tcXwjmc: file.tcXwjmc,
                url: ''
              }
              this.xxxbList[i].fileList.push(obj)
            })
          }
        }
        if(this.$route.query.type === 'continue') {
          this.xtFjList = this.editData.xtFjList
        } else {
          if(this.xxxbList.length !== 0) {
            this.xxxbList.sort(this.Compare('tnXxxbid'))
            this.xtFjList = this.xxxbList[this.xxxbList.length - 1].xtFjList
          }
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  .detail {
    padding-top: 20px;
    .infoType {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      color: #04b74d;
      font-weight: bold;
      margin: 0 60px;
    }
  }
</style>
