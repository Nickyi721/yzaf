<template>
  <CustomView :location="[{ text: '上报信息完结' }]">
    <div class="detail">
      <div class="detail">
      <Detail type="初报" :content="form" @check="_ButtonCheckClick($event, 'cb')"/>
      <Detail type="续报" :expand="false" :content="list" :idx="index + 1" @check="_ButtonCheckClick($event, 'xb')" v-for="(list, index) in xxxbList" :key="index" />
    </div>

    <div>
      <div class="infoType">完结信息</div>
        <el-form :model="formData" ref="ruleForm" label-position="top" class="common-form"> 
          <el-form-item label="事故报告书"> 
            <el-upload class="upload-demo" 
              action='' 
              :http-request="(param) => _requestFile(param)"
              :auto-upload="true"
              :on-preview="_FileDownload"
              :show-file-list='true'>
              <el-button size="mini" type="default">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="完结情况说明">
            <el-input v-model="formData['tcWjsm']" type="textarea" maxlength='600' :rows="2" size="mini" placeholder="请输入完结情况说明"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
  </CustomView>
</template>

<script>
import Mixin from '@mixins'

import Moment from 'moment'
import Model from './model.js'
import CommonModel from '@commons/model.js'

import Detail from './components/Detail.vue'

// 文件上传
import request from '@commons/request.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  components: {
    Detail,
  },
  data () {
    return {
      dict: ['04020201', '04020202', '04020203', '0402020404', '090101010101', '090101010201'],
      formData: {},
      xtFjList: [],
      form: {},
      xxxbList: [],
      optionsInfoType: [],
      optionsCrimeMoney: [],
      optionsCrimePlace: [],
      optionsCrimePlaceParent: [],
      optionsCulpritType: [],
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
    }
  },
  methods: {
    $init(options) {
      this.formData.tnXxcbid = this.$route.query.id
      this.optionsInfoType = options['04020201']
      this.optionsCrimePlace = options['04020202']
      this.optionsCrimePlaceParent = options['04020203']
      this.optionsCulpritType = options['0402020404']
      if(this.$route.query.tnGwsj && this.$route.query.tnGwsj === 1) {
        this.$message({
          message: '上次操作事件为过往事件，请填写完结信息并保存',
          type: 'success',
          showClose: true,
          duration: 1000,
          customClass: "middle",
        })
      }
      this.getDetail(options)        
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
      
    },
    // 事件-保存
    _ButtonSaveClick() {
      this.endInfoData()
    },
    // 上报信息-完结
    async endInfoData() {
      if(this.xtFjList.length !== 0) {
        const result = await Model.saveEndList({
          requestData: {
            tnXxcbid: this.formData.tnXxcbid || '',
            tcWjsm: this.formData.tcWjsm || '',
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
      } else {
        this.$message({
          message: "必须上传事故报告书!",
          type: 'warning',
          showClose: true,
          duration: 1000,
          customClass: "middle",
        })
      }
    },
    // 获取信息类型
    async getInfoTypeOptions () {
      const result = await CommonModel.getDictData(['04020201'])
      if (result && result.data) {
        this.optionsInfoType = result.data;
      }
    },
     // 获取详情
    async getDetail(options) {
      const result = await Model.getDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
        cdId: '0004030201',
        requestData:{
          tnXxcbid: this.$route.query.id
        }
      })
      if (result && result.data) {
        // 初报
        if(result.data.xxglXxcbDto) {
          this.form = result.data.xxglXxcbDto
          this.form.tdAfrq = Moment(this.form.tdAfrq).format('YYYY-MM-DD')
          this.form.tdSbsj = Moment(this.form.tdSbsj).format('YYYY-MM-DD')
          if(this.form.tcXxlx === '0402020103' || this.form.tcXxlx === '0402020104') {
            this.optionsCrimeMoney = options['090101010101']
          } else {
            this.optionsCrimeMoney = options['090101010201']
          }
          this.form.fileList = []
          this.form.xtFjList.forEach(file => {
            let obj = {
              name: file.tcYwjmc,
              newName: file.tcXwjmc,
              url: '',
              tcYwjmc: file.tcYwjmc,
              tcXwjmc: file.tcXwjmc,
            }
            this.form.fileList.push(obj)
          })
        }
        // 续报
        if(result.data.xxxblist.length !== 0) {
          let data = result.data.xxxblist; 
          data.sort(this.Compare('tnXxxbid'))
          data.forEach(list => {
            list.tdAfrq = Moment(list.tdAfrq).format('YYYY-MM-DD')
            list.tdSbsj = Moment(list.tdSbsj).format('YYYY-MM-DD')
          })
          this.xxxbList = data
          this.xxxbList.forEach(item => {
            if(item['tcXxlx'] === '0402020103' || item['tcXxlx'] === '0402020104') {
              this.optionsCrimeMoney = options['090101010101']
            } else {
              this.optionsCrimeMoney = options['090101010201']
            }
          })
          // 以前续报记录 附件
          for(let i in this.xxxbList) {
            this.xxxbList[i].tdSbsj = Moment(this.xxxbList[i].tdSbsj).format('YYYY-MM-DD')
            this.xxxbList[i].tdAfrq = Moment(this.xxxbList[i].tdAfrq).format('YYYY-MM-DD')
            // 以前续报记录 附件
            if(this.xxxbList[i].xtFjList && this.xxxbList[i].xtFjList.length !==0) {
              this.xxxbList[i].fileList = []
              this.xxxbList[i].xtFjList.forEach(file => {
                let obj = {
                  name: file.tcYwjmc,
                  newName: file.tcXwjmc,
                  url: '',
                  tcYwjmc: file.tcYwjmc,
                  tcXwjmc: file.tcXwjmc,
                }
                this.xxxbList[i].fileList.push(obj)
              })
            }
          }
        }
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
  },
}
</script>
<style lang="scss" scoped>
  .detail {
    padding-top: 10px;
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
