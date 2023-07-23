<template>
  <CustomView :location="[{ text: $route.query.type === 'continue' ? '继续上报' : '上报详情' }]">
    <CustomTitle slot="top">
      {{formData['tcXxbtShow']}}
    </CustomTitle>

    <!-- 展示以往继续上报信息 -->
    <!-- <div class="detail" v-if="$route.query.type === 'continue' && Object.keys(jxsbdto).length !==0 ">
      <Detail type="继续上报-初报" :expand="false" :content="jxsbdto" @check="_ButtonCheckClick($event, 'cb')"/>
      <Detail type="继续上报-续报" :expand="false" :content="list" :idx="index + 1" @check="_ButtonCheckClick($event, 'xb')" v-for="(list, index) in jxsbxbdtoList" :key="index" />
    </div> -->

    <!-- 继续上报展示初报、续报信息  双击查看初报、续报 -->
    <div class="detail" v-if="$route.query.type === 'detail'|| $route.query.type === 'continue'">
      <Detail type="下级上报-初报" :content="formData" @check="_ButtonCheckClick($event, 'cb')"/>
      <Detail type="下级上报-续报" :expand="false" :content="list" :idx="index + 1" @check="_ButtonCheckClick($event, 'xb')" v-for="(list, index) in xxxbList" :key="index" />
      <End :content="wjList" v-if="Object.keys(wjList).length !== 0" />
    </div>

    <el-form v-if="$route.query.type === 'continue'" :rules="rules" :model="editData" ref="ruleForm" label-width="120px" class="compose-form">
      <el-form-item label="过往事件" prop="tnGwsj">
        <!-- <el-select v-model="editData['tnGwsj']" size="mini" placeholder="请选择是否为过往事件">
          <el-option v-for="option in optionGwsj" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select> -->
        <el-radio-group v-model="editData['tnGwsj']" size="mini">
          <el-radio v-for="option in optionGwsj" :key="option.tcSjubm" :label="option.tcSjubm">{{ option.tcSjnr }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="信息标题" prop="tcXxbt">
        <el-input v-model="editData['tcXxbt']" size="mini" style="width:350px" placeholder="请输入信息标题"></el-input>
      </el-form-item>

      <el-form-item label="案发单位">
        <el-input disabled v-model="editData['tcSbdwmc']" style="width:350px" size="mini" placeholder="请输入上报单位"></el-input>
      </el-form-item>

      <el-form-item label="案件类型" prop="tcXxlx">
        <el-select v-model="editData['tcXxlx']" @change="_XxlxChange" style="width:350px" size="mini" placeholder="请选择信息类型">
          <el-option v-for="option in optionsInfoType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="案发单位所属" prop="tcAfbwss">
        <el-select v-model="editData['tcAfbwss']" size="mini" style="width:350px" placeholder="请选择案发单位所属">
          <el-option v-for="option in optionsCrimePlaceParent" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="案发部位" prop="tcAfbw">
        <el-select v-model="editData['tcAfbw']" size="mini" style="width:350px" placeholder="请选择案发部位">
          <el-option v-for="option in optionsCrimePlace" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="案发时间" prop="tdAfrq">
        <el-date-picker v-model="editData['tdAfrq']" size="mini" type="date" placeholder="选择案发时间" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>

      <el-form-item label="涉案金额" v-if="sajeControl" prop="tcSaje">
        <el-input v-model="editData['tcSaje']" size="mini" style="width:350px" placeholder="请输入涉案金额"></el-input>
      </el-form-item>

      <el-form-item label="涉案金额区间" v-if="sajeControl" prop="tcSajeqj">
        <el-select v-model="editData['tcSajeqj']" style="width:350px" @visible-change="$forceUpdate()" size="mini" placeholder="请选择涉案金额区间">
          <el-option  v-for="option in optionsCrimeMoney" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="人员伤亡" v-if="ryswControl" prop="tcRysw">
        <el-input v-model="editData['tcRysw']" style="width:350px" size="mini" placeholder="请输入人员伤亡"></el-input>
      </el-form-item>

      <el-form-item label="人员伤亡区间" v-if="ryswControl" prop="tcRyswqj">
        <el-select v-model="editData['tcRyswqj']" style="width:350px" @visible-change="$forceUpdate()" size="mini" placeholder="请选择人员伤亡区间">
          <el-option  v-for="option in optionsPeople" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="邮件损失情况" v-if="yjssControl" prop="tcYjssqk">
        <el-input v-model="editData['tcYjssqk']" style="width:350px" size="mini" placeholder="请输入邮件损失情况"></el-input>
      </el-form-item>
      
      <el-form-item label="作案人类型" prop="tcZalx">
        <el-select v-model="editData['tcZalx']" style="width:350px" size="mini" placeholder="请选择作案人类型">
          <el-option v-for="option in optionsCulpritType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上报时间" prop="tdSbsj">
        <el-date-picker v-model="editData['tdSbsj']" size="mini" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="选择上报时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="情况说明" prop="tcQksm">
        <el-input v-model="editData['tcQksm']" style="width:350px" type="textarea" :rows="6" size="mini" placeholder="请输入情况说明"></el-input>
      </el-form-item>

      <el-form-item label="附件"> 
        <el-upload class="upload-demo" 
          action='' 
          :http-request="(param) => _requestFile(param)"
          :auto-upload="true"
          :on-preview="_FileDownload"
          :file-list="editData.fileList"
          :on-remove="_FileRemove"
          :show-file-list='true'>
          <el-button size="mini" type="default">上传</el-button>
        </el-upload>
      </el-form-item>
      
      <!-- <el-form-item label="事件状态" prop="tnSjzt">
        <el-select disabled v-model="editData['tnSjzt']" size="mini" placeholder="请选择状态">
          <el-option v-for="option in optionsInfoState" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item> -->
      
      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
      </el-form-item>
    </el-form>
    

    <!-- 阅签弹框 -->
    <CustomDialog title=" 阅签意见" :visible="dlgReadVisble" @close="dlgReadVisble = false">
      <el-form :model="formData" label-position="top" class="common-form common-form-dlg">
        <el-form-item label="阅签意见">
          <el-input type="textarea" :rows="3" maxlength='600' v-model="formData['tcYqyj']" size="mini" placeholder="请输入阅签意见"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="_ButtonReadClick(formData)">确定</el-button>
        </el-form-item>
      </el-form>
    </CustomDialog>

    <CustomDialog title=" 图片详情" :visible="picVisible" @close="closeHandle">
      <img :src="src" style="height: 300px">
    </CustomDialog>
    
  </CustomView>
  
</template>

<script>
import Model from './model.js'

// 共用模块
import Moment from 'moment'
import Mixin from '@mixins'
import Validator from '@commons/validator.js'
import CommonModel from '@commons/model.js'

import Detail from './components/Detail.vue'
import End from './components/End.vue'

// 文件上传
import request from '@commons/request.js'

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
      dict: ['040204', '04020201', '04020202', '04020203', '0402020404', '090301010201', 
        '090301020101', '090301010301', '090301010101', '090301010102', '090301040101',
        '090301030101', '090301030102', '090201010201', '090201020101', '090201010301', '090201010101',
        '090201010102', '090201040101', '090201030101', '090201030102', '090401010101', '090401010102',
        '090401040101', '090401010201', '090401020101', '090401030101', '090401030102', '090501010301',
        '090501010101', '090501010102', '090501040101', '090501030101', '090501030102', '090501020101',
        '090501010201', '090101010301', '090101010101', '090101010102', '090101040101', '090101030101',
        '090101030102', '090101010201', '090101020101'
      ],
      formData: {},
      editData: {},
      xxxbList: [],
      // 继续上报
      jxsbdto: {},
      jxsbxbdtoList: [],
      // 文件列表
      wjList: {},
      // 下拉列表
      optionsInfoType: [],
      optionsCrimePlace: [],
      optionsCrimePlaceParent: [],
      optionsCulpritType: [],
      optionsInfoState: [],
      optionsCrimeMoney: [],
      optionsPeople: [],
      dlgReadVisble: false,
      infoId: '',
      type: '',
      curXxlx: '',
      hasXbList: 0,
      tnSfscbgs: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      rules: {
        tnGwsj: [
          Validator.required('请选择是否为过往事件'),
        ],
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
          Validator.required('请选择案发部位所属'),
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
        tcQksm: [
          Validator.required('请输入情况说明'),
        ],
      },
      fileList: [],
      xtFjList: [],
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
      src: '',
      picVisible: false,
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
      this.optionsInfoState = options['040204']
      this.optionsInfoType = options['04020201']
      this.optionsCrimePlace = options['04020202']
      this.optionsCrimePlaceParent = options['04020203']
      this.optionsCulpritType = options['0402020404']

      this.getDetail()
    },
    // 事件-保存
    async _ButtonSaveClick() {
      this.$refs.ruleForm.validate(async (valid, obj) => {
        if (valid) {
          // 案件类型
          let objInfoType = this.optionsInfoType.find((item) => {
            return item.tcSjubm === this.editData.tcXxlx;
          });
          this.editData.tcXxlxmc = objInfoType.tcSjnr;
          
          // 涉案金额
          if(this.editData.tcSajeqj !== undefined) {
            let objCrimeMoney = this.optionsCrimeMoney.find(item=>{
              return item.tcSjubm === this.editData.tcSajeqj
            })
            this.editData.tcSajeqjmc = objCrimeMoney.tcSjnr
          }

          // 案发部位
          if(this.editData.tcAfbw !== undefined) {
            let objCrimePlace = this.optionsCrimePlace.find((item) => {
              return item.tcSjubm === this.editData.tcAfbw;
            });
            this.editData.tcAfbwmc = objCrimePlace.tcSjnr;
          }

          // 案发单位所属
          if(this.editData.tcAfbwss !== undefined) {
            let objCrimePlaceParent = this.optionsCrimePlaceParent.find((item) => {
              return item.tcSjubm === this.editData.tcAfbwss;
            });
            this.editData.tcAfbwssmc = objCrimePlaceParent.tcSjnr;
          }

          // 作案类型
          if(this.editData.tcZalx !== undefined) {
            let objCulpritType = this.optionsCulpritType.find((item) => {
              return item.tcSjubm === this.editData.tcZalx;
            });
            this.editData.tcZalxmc = objCulpritType.tcSjnr;
          }
          
          // 人员伤亡
          if(this.editData.tcRyswqj !== undefined) {
            let objPeople = this.optionsPeople.find(item=>{
              return item.tcSjubm === this.editData.tcRyswqj
            })
            this.editData.tcRyswqjmc = objPeople.tcSjnr
          }

          this.editData.xtFjList = this.xtFjList
          if(this.hasXbList === 1) {
            this.editData.tnGlxxcbid = this.editData.tnXxcbid
            this.editData.tnSfscbgs = this.tnSfscbgs
          }
          delete this.editData.tnSjzt
          delete this.editData.tnSjztmc
          delete this.editData.tnGlxxcbid
          const result = await Model.addJxxxcb({
            isQuery: 0,
            cdId: '0004030202',
            requestData: this.editData
          })
          if(result.state === '1') {
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
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 事件-阅签按钮点击
    _ButtonCheckClick(infoId, type) {
      this.dlgReadVisble = true
      this.infoId = infoId
      this.type = type
    },
    // 事件-阅签确定
    async _ButtonReadClick(formData) {
      if(this.type === 'cb') {
        const result = await Model.updateXxcb({
          isQuery: 0,
          cdId: '0004030202',
          requestData: {
            tnXxcbid: formData.tnXxcbid,
            tnYqzt: '1',
            tcYqyj: formData.tcYqyj || ''
          }
        })
        if(result.state === '1') {
          this.$message({
            message:"阅签成功!",
            type: 'success',
            showClose: true,
            duration: 1000,
            customClass: "middle",
          })
          this.dlgReadVisble = false
          this.getDetail()
        }
      } else {
        const result = await Model.updateXxxb({
          isQuery: 0,
          cdId: '0004030202',
          requestData: {
            tnXxxbid: this.infoId.tnXxxbid,
            tnYqzt: '1',
            tcYqyj: formData.tcYqyj || ''
          }
        })
        if(result.state === '1') {
          this.$message({
            message: "阅签成功!",
            type: 'success',
            showClose: true,
            duration: 1000,
            customClass: "middle",
          })
          this.dlgReadVisble = false
          this.getDetail()
        }
      }
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
    closeHandle(){
      this.picVisible = false
    },
    // 文件上传
    _requestFile(param) {
      let fileObj = param.file
      this.file = fileObj
      let form = new FormData()    // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId',window.sessionStorage.sessionId)
      form.append('lylx',0),
      form.append('cdId','0004030202')
      form.append('isQuery', 0)
      form.append('isVideo', 0)
      this.uploadFile(form,fileObj.name)
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
            tcWjm: file.newName
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
    // 移除文件
    _FileRemove(file, fileList) {
      this.xtFjList = this.xtFjList.filter(el => {
        return el.tcYwjmc !== file.name
      })
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
        isQuery: 1,
        requestData: {
          tnXxcbid: this.$route.query.tnXxcbid
        }
      })
      if(result.data) {
        this.tnSfscbgs = result.data.xxglXxcbDto.tnSfscbgs
        // 完结-附件
        if(result.data.xxglXxcbwjDto) {
          this.wjList = result.data.xxglXxcbwjDto
          this.wjList.xtFjList.forEach(file => {
            let obj = {
              name: file.tcYwjmc,
              newName: file.tcXwjmc,
              tcYwjmc: file.tcYwjmc,
              tcXwjmc: file.tcXwjmc,
              url: ''
            }
            this.wjList.fileList = []
            this.wjList.fileList.push(obj)
          });
        }
        // 双击查看
        if(this.$route.query.type === 'detail') {
          // 初报-信息
          if(result.data.xxglXxcbDto) {
            this.formData = result.data.xxglXxcbDto
            this.formData.tdAfrq = Moment(this.formData.tdAfrq).format('YYYY-MM-DD')
            this.formData.tdSbsj = Moment(this.formData.tdSbsj).format('YYYY-MM-DD')
            
            this.curXxxlx = this.formData.tcXxlx
            this.curPlaceParent = this.formData.tcAfbwss
            this.optionsPeople.unshift(this.noSelect)
            this.optionsCrimeMoney.unshift(this.noSelect)
            // 初报-附件
            this.formData.fileList = []
            this.formData.xtFjList.forEach(file => {
              let obj = {
                name: file.tcYwjmc,
                newName: file.tcXwjmc,
                tcYwjmc: file.tcYwjmc,
                tcXwjmc: file.tcXwjmc,
                url: ''
              }
              this.formData.fileList.push(obj)
            })
          }
          // 续报信息
          if(result.data.xxxblist.length !== 0) {
            let data = result.data.xxxblist
            data.sort(this.Compare('tnXxxbid'))
            data[data.length - 1].tdAfrq =  Moment(data[data.length - 1].tdAfrq).format('YYYY-MM-DD')
            data[data.length - 1].tdSbsj =  Moment(data[data.length - 1].tdSbsj).format('YYYY-MM-DD')
            this.xxxbList = data
            // 续报附件
            this.xxxbList.forEach(item => {
              if(item.xtFjList && item.xtFjList.length !== 0) {
                item.fileList = []
                item.xtFjList.forEach(file => {
                  let obj = {
                    name: file.tcYwjmc,
                    newName: file.tcXwjmc,
                    tcYwjmc: file.tcYwjmc,
                    tcXwjmc: file.tcXwjmc,
                    url: ''
                  }
                  item.fileList.push(obj)
                })
              }
            })
          }
        } 
        // 勾选-点击继续上报查看
        else {
          if(result.data.xxxblist.length !== 0) {
            this.hasXbList = 1
            let data = result.data.xxxblist; 
            data.sort(this.Compare('tnXxxbid'))
            data[data.length - 1].tdAfrq =  Moment(data[data.length - 1].tdAfrq).format('YYYY-MM-DD')
            data[data.length - 1].tdSbsj =  Moment(data[data.length - 1].tdSbsj).format('YYYY-MM-DD')
            this.xxxbList = data
            // this.formData = data[data.length - 1]
            this.formData = result.data.xxglXxcbDto
            this.formData.tdAfrq = Moment(this.formData.tdAfrq).format('YYYY-MM-DD')
            this.formData.tdSbsj = Moment(this.formData.tdSbsj).format('YYYY-MM-DD')
            // 继续上报预填信息
            this.editData = data[data.length - 1]
            this.editData.tcXxbtShow = this.editData.tcXxbt
            this.editData.tdAfrq = Moment(this.editData.tdAfrq).format('YYYY-MM-DD')
            this.editData.tdSbsj = Moment(this.editData.tdSbsj).format('YYYY-MM-DD')
            if(this.editData.tcRyswqj !== undefined) {
              this.ryswControl = true
              let temp = this.editData.tcRyswqj.substring(0, this.editData.tcRyswqj.length-2)
              this.optionsPeople = this.sjzdOptions[temp]
            }
            if(this.formData.tcSajeqj !== undefined) {
              this.sajeControl = true
              let temp = this.editData.tcSajeqj.substring(0, this.editData.tcSajeqj.length-2)
              this.optionsCrimeMoney = this.sjzdOptions[temp]
            }
            if(this.editData.tcAfbw === '0402020204' || this.editData.tcAfbw === '0402020205' || this.editData.tcAfbw === '0402020206' || this.editData.tcAfbw === '0402020207' || this.editData.tcAfbw === '0402020208' || this.editData.tcAfbw === '0402020211' || this.editData.tcAfbw === '0402020212') {
              this.yjssControl = true
            }
            
            this.curXxxlx = this.editData.tcXxlx
            this.curPlaceParent = this.editData.tcAfbwss
            this.optionsPeople.unshift(this.noSelect)
            this.optionsCrimeMoney.unshift(this.noSelect)
            this.xtFjList = this.editData.xtFjList

          } else {
            this.formData = result.data.xxglXxcbDto
            this.formData.tdAfrq = Moment(this.formData.tdAfrq).format('YYYY-MM-DD')
            this.formData.tdSbsj = Moment(this.formData.tdSbsj).format('YYYY-MM-DD')
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
            }
            this.curXxxlx = this.formData.tcXxlx
            this.curPlaceParent = this.formData.tcAfbwss
            this.optionsPeople.unshift(this.noSelect)
            this.optionsCrimeMoney.unshift(this.noSelect)
            // 初报-附件
            if(this.formData.xtFjList && this.formData.xtFjList.length != 0) {
              this.formData.xtFjList.forEach((item) => {
                let obj = {
                  name: item.tcYwjmc,
                  newName: item.tcXwjmc,
                  tcYwjmc: item.tcYwjmc,
                  tcXwjmc: item.tcXwjmc,
                  url: ''
                }
                this.formData.fileList = []
                this.formData.fileList.push(obj)
              })
            }
            this.editData = result.data.xxglXxcbDto
            this.editData.tcXxbtShow = this.editData.tcXxbt
            this.editData.tdAfrq = Moment(this.editData.tdAfrq).format('YYYY-MM-DD')
            this.editData.tdSbsj = Moment(this.editData.tdAfrq).format('YYYY-MM-DD')
            
            if(this.editData.tcRyswqj !== undefined) {
              this.ryswControl = true
              let temp = this.editData.tcRyswqj.substring(0, this.editData.tcRyswqj.length-2)
              this.optionsPeople = this.sjzdOptions[temp]
            }
            if(this.formData.tcSajeqj !== undefined) {
              this.sajeControl = true
              let temp = this.editData.tcSajeqj.substring(0, this.editData.tcSajeqj.length-2)
              this.optionsCrimeMoney = this.sjzdOptions[temp]
            }
            if(this.editData.tcAfbw === '0402020204' || this.editData.tcAfbw === '0402020205' || this.editData.tcAfbw === '0402020206' || this.editData.tcAfbw === '0402020207' || this.editData.tcAfbw === '0402020208' || this.editData.tcAfbw === '0402020211' || this.editData.tcAfbw === '0402020212') {
              this.yjssControl = true
            }
            this.curXxxlx = this.editData.tcXxlx
            this.curPlaceParent = this.editData.tcAfbwss
            this.optionsPeople.unshift(this.noSelect)
            this.optionsCrimeMoney.unshift(this.noSelect)

            this.xtFjList = this.editData.xtFjList
            if(this.editData.xtFjList && this.editData.xtFjList.length != 0) {
              // 继续上报-附件
              this.editData.fileList = []
              this.editData.xtFjList.forEach((item) => {
                let obj = {
                  name: item.tcYwjmc,
                  newName: item.tcXwjmc,
                  tcYwjmc: item.tcYwjmc,
                  tcXwjmc: item.tcXwjmc,
                  url: ''
                }
                this.editData.fileList.push(obj)
              })
            }
            this.curXxlx = result.data.xxglXxcbDto.tcXxlx
          }
        }
      }
    } 
  },
}
</script>

<style lang="scss" scoped>

  .detail{
    margin: 20px 60px;
  }

  .continue {
    .infoType {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      color: #04b74d;
      font-weight: bold
    }
  }
  
</style>

