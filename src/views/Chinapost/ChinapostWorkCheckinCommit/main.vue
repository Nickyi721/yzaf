<template>
  <CustomView  :location="[{ text: '年度工作登记' }]">
    <CustomTitle>
      {{params.year + '年度工作登记'}}
    </CustomTitle>

    <div class="year">
      <div class="block-toolbar">
        <div class="block-toolbar-left">年度重点工作</div>
        <div class="block-toolbar-right">
          <el-button :disabled="isDisabled" v-if="!editable" @click="_ButtonYearUpdate" type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button v-if="editable" @click="_ButtonYearSave" type="primary" size="mini" icon="el-icon-check">保存</el-button>
          <el-button v-if="editable" @click="_ButtonYearCancal" type="primary" size="mini" icon="el-icon-close">取消</el-button>
        </div>
      </div>

      <el-form :disabled="!editable" :model="yearData" ref="year" :rules="yearRules" label-position="top" class="common-form-dlg">
        <el-form-item label="重点工作说明" prop="tcGznr">
          <el-input v-model="yearData['tcGznr']" rows="3" type="textarea" size="mini" placeholder="年度重点工作说明"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <CommonFileDownload v-if="!editable" :list="yearData.fileList" :disabled=true></CommonFileDownload>
          <el-upload v-else class="upload-demo" action='' :auto-upload="true" :show-file-list="true"
            :http-request="param => _RequestFile(param, 'year')"
            :file-list="yearData.fileList"
            :on-remove="(file, fileList) => _FileRemove(file, fileList, 'year')"
            >
            <el-button size="mini" type="default">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>


    <div class="season">
      <div class="block-toolbar">
        <div class="block-toolbar-left">季度工作进展说明</div>
        <div class="block-toolbar-right">
          <el-button :disabled="isDisabled" @click="_ButtonClickAdd" type="primary" size="mini" icon="el-icon-plus">新增</el-button>
        </div>
      </div>

      <div class="season-block" v-for="(season, index) in seasonList" :key="index">
        <div class="season-toolbar">
          <div class="season-toolbar-left">
            <span class="season-title">{{season.tcZq}}</span>
            <CustomIcon name="person"/>
            <span>{{season['tdCjsj']}}</span>
            <CustomIcon name="time"/>
            <span>{{season['tcCjrmc']}}</span>
          </div>
          <div class="season-toolbar-right">
            <el-button :disabled="isDisabled" v-if="!season.editable" @click="_ButtonSeasonUpdate(season.tnNdzdgzid)" size="mini" icon="el-icon-edit">修改</el-button>
            <el-button v-if="season.editable" @click="_ButtonSeasonSave(season.tnNdzdgzid, season)" size="mini" icon="el-icon-check">保存</el-button>
            <el-button v-if="season.editable" @click="_ButtonSeasonCancel(season.tnNdzdgzid)" size="mini" icon="el-icon-close">取消</el-button>
          </div>
        </div>
        
        <el-form :disabled="!season.editable" :model="season" :ref="season.tnNdzdgzid" :rules="seasonRules" label-position="top" class="common-form-dlg season-form">
          <el-form-item label="工作进展说明" prop="tcGznr">
            <el-input v-model="season['tcGznr']" rows="3" type="textarea" size="mini" placeholder="季度工作进展说明"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <CommonFileDownload v-if="!season.editable" :list="season.fileList" :disabled=true></CommonFileDownload>
            <el-upload v-else class="upload-demo" action='' :auto-upload="true" :show-file-list="true"
              :http-request="param => _RequestFile(param, 'season', 'edit', season)"
              :file-list="season.fileList"
              :on-remove="(file, fileList) => _FileRemove(file, fileList, 'season', 'edit', season, season.tnNdzdgzid)"
              >
              <el-button size="mini" type="default">上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 设置季度工作进展 -->
    <CustomDialog title="新增季度重点工作" :visible="dlgVisble" @close="dlgVisble = false">
      <el-form ref="typeForm" :rules="seasonRules" :model="newSeason" label-position="top" class="common-form common-form-dlg">
        <el-form-item label="季度" prop="tcZq">
          <el-select clearable v-model="newSeason['tcZq']" size="mini" placeholder="请选择季度">
        <el-option v-for="option in optionsSeason" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
        </el-form-item>
        <el-form-item label="工作说明" prop="tcGznr">
          <el-input type="textarea" rows="3" v-model="newSeason['tcGznr']" size="mini" placeholder="请输入工作进展"></el-input>
        </el-form-item>
        <el-form-item label="附件"> 
          <el-upload class="upload-demo" action='' :auto-upload="true" :show-file-list="true"
            :http-request="param => _RequestFile(param, 'season', 'add')"
            :file-list="newSeason.fileList"
            :on-remove="(file, fileList) => _FileRemove(file, fileList, 'season', 'add')"
            >
            <el-button size="mini" type="default">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="_ButtonDlgSaveClick">确定</el-button>
        </el-form-item>
      </el-form>
    </CustomDialog>

    <CustomDialog :config="{ title: '图片内容' }" :visible="picVisible" @close="picVisible = false">
      <img :src="src" style="height: 300px">
    </CustomDialog>

    <CustomControlBar slot="bottom" v-if="yearData.tnZt !== 1">
      <el-button type="primary" size="mini" @click="_ButtonCloseClick">完结</el-button>
    </CustomControlBar>
  </CustomView>
</template>

<script>
import Moment from 'moment'
import Mixin from '@mixins'
import Validator from '@commons/validator.js'
import request from '@commons/request.js'

import Model from './model.js'
import { log } from 'util';
export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      list: [],
      seasonList: [],
      yearData: {},
      newSeason: {},
      dlgVisble: false,
      seasonRules: {
        tcZq: [
          Validator.required('请选择季度'),
        ],
        tcGznr: [
          Validator.required('请输入工作进展'),
          Validator.length(5, 600)
        ]
      },
      yearRules: {
        tcGznr: [
          Validator.required('请输入年度重点工作说明'),
          Validator.length(5, 600)
        ]
      },
      optionsSeason: [
        {
          tcSjubm: '第一季度',
          tcSjnr: '第一季度'
        },
        {
          tcSjubm: '第二季度',
          tcSjnr: '第二季度'
        },
        {
          tcSjubm: '第三季度',
          tcSjnr: '第三季度'
        },
        {
          tcSjubm: '第四季度',
          tcSjnr: '第四季度'
        },
      ],
      editable: false,
      dlgVisble: false,
      picVisible: false,

      curSeasonId: 0,
      src: '',
      seasonFjList: [],
      addSeasonFjList: [],
      isDisabled: false,
      isFinishedAble: false
    }
  },
  methods: {
    $init () {
      this.getDetail()
    },
    _ButtonCloseClick () {
      if(this.isFinishedAble) {
        this.$confirm('是否完结登记?').then(async () => {
          const result = await Model.closeWork(this.params.year)
          if (result.state === '1') {
            this.$message({
              message: '登记已完结',
              duration: 1000,
            })
            this.getDetail()
          }
        }).catch(() => {})
      } else {
        this.$message({
          message: '年度工作登记完整后才能进行完结！',
          type: 'warning',
          duration: 2000,
          customClass: "middle",
          showClose: true
        })
      }
      
    },
    // 年度-修改
    _ButtonYearUpdate() {
      this.editable = true
    },
    // 年度-取消修改
    _ButtonYearCancal () {
      this.editable = false
      this.getDetail()
    },
    // 年度-保存
    async _ButtonYearSave() {
      this.$refs.year.validate(async (valid, obj) => {
        if (valid) {
          const result = await Model.addYearWork({
            requestData: {
              tnNdzdgzid: this.yearData.tnNdzdgzid,
              tcNd: this.yearData.tcNd,
              tcGznr: this.yearData.tcGznr,
              xtFjList: this.yearData.fileList
            }
          })
          if(result.state === '1') {
            this.editable = false
            this.$message({
              message: '保存成功！',
              type: 'success',
              customClass: "middle",
            })
            this.getDetail()
          }
          this.$refs.year.clearValidate()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    
    // 季度-修改
    _ButtonSeasonUpdate(id) {
      this.curSeasonId = id
      this.seasonList.forEach(item => {
        if (item.tnNdzdgzid === id) {
          item.editable = true
          this.$forceUpdate()
        }
      })
    },
    // 季度-取消修改
    _ButtonSeasonCancel (id) {
      this.getDetail()
      this.seasonList.forEach(item => {
        if (item.tnNdzdgzid === id) {
          item.editable = true
          this.$forceUpdate()
        }
      })
    },
    // 季度-保存
    _ButtonSeasonSave(id, item) {
      this.$refs[id][0].validate(async (valid, obj) => {
        if (valid) {
          const result = await Model.addYearWorkPast({
            requestData: {
              tnNdzdgzid: item.tnNdzdgzid,
              tcNd: item.year,
              tcZq: item.tcZq,
              tcGznr: item.tcGznr,
              xtFjList: item.fileList
            }
          })
          if (result.state === '1') {
            this.$message({
              message: '保存成功！',
              type: 'success',
              customClass: "middle",
            })
            this.seasonList.forEach((season) => {
              if (season.tnNdzdgzid === id) {
                season.editable = false
              }
            })
            this.getDetail()
          }
          this.$refs[id][0].clearValidate()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 新增按钮
    _ButtonClickAdd() {
      this.newSeason = {}
      this.dlgVisble = true
      this.$nextTick(() => {
        this.$refs.typeForm.clearValidate()
      })
    },
    // 新增 确定
    _ButtonDlgSaveClick() {
      this.$refs.typeForm.validate(async (valid, obj) => {
        if (valid) {
          const result = await Model.addYearWorkPast({
            requestData: {
              tcNd: this.params.year,
              tcZq: this.newSeason.tcZq,
              tcGznr: this.newSeason.tcGznr,
              xtFjList: this.newSeason.fileList
            }
          })
          if (result.state === '1') {
            this.dlgVisble = false
            this.$message({
              message: '保存成功！',
              type: 'success',
              customClass: "middle",
            })
            this.isAddSeason = 0
            this.fileList = []
            this.seasonList = []
            this.getDetail()
          }
          this.dlgVisble = false
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 上传文件
    _RequestFile (param, type, mode, seasonData) {
      const fileObj = param.file
      this.file = fileObj
      const fileData = new FormData()    
      fileData.append('file', fileObj)
      fileData.append('sessionId', window.sessionStorage.sessionId)
      fileData.append('lylx', 0),
      fileData.append('cdId', '0004090102')
      fileData.append('isQuery', 0)
      fileData.append('isVideo', 0)
      const isLt2M = param.file.size / 1024 / 1024 < 200;
      if(isLt2M) {
        this.uploadFile(fileData, fileObj.name, type, mode, seasonData)
      } else{
        this.$msgbox({
          message: '上传附件大小不能超过 200MB!',
          type: 'warning'
        })
      }
      
    },
    async uploadFile(data, name, type, mode, seasonData) {
      const result = await Model.uploadFile(data);
      if (result.state === '1') {
        this.$message({
          message: '上传成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle'
        })
        const wjmc = result.data.split(",")
        const fileObj = {
          name: wjmc[0],
          url: '',
          tcYwjmc: wjmc[0],
          tcXwjmc: wjmc[1]
        }
        if (type === 'year') {
          this.yearData.fileList.push(fileObj)
        } 
        if (type === 'season') {
          if (mode === 'add') {
            this.newSeason.fileList = this.newSeason.fileList || []
            this.newSeason.fileList.push(fileObj)
          } 
          if (mode === 'edit') {
            seasonData.fileList.push(fileObj)
          }
        }
      } else {
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
    _FileRemove(file, fileList, type, mode, seas, tnNdzdgzid) {
      if(type === 'year') {
        this.yearData.fileList = this.yearData.fileList.filter(el => el.tcYwjmc !== file.name)
      } else {
        if (mode === 'add') {
          this.newSeason = this.newSeason.filter(el => el.tcYwjmc !== file.name)
        }
        if (mode === 'edit') {
          // 2019年5月12日晚上修改
          this.seasonList.forEach(item => {
            if(item.tnNdzdgzid === tnNdzdgzid) {
              item.xtFjList = item.xtFjList.filter(el => el.tcYwjmc !== file.name)
              item.fileList = item.fileList.filter(el => el.tcYwjmc !== file.name)
            }
          })
          // seasonData = seasonData.filter(el => el.tcYwjmc !== file.name)
        }
      }
    },
    // 获取详情
    async getDetail (cancel) {
      const result = await Model.getDetail(this.params.year)
      if (result.data && result.data.length) {
        // 判断是否可以进行完结
        if(result.data.length === 5) {
          this.isFinishedAble = true
        }
        // 判断是否完结，从而修改按钮可否点击
        if(result.data[0].tnZt === 1) {
          this.isDisabled = true
        }
        // 年度重点工作登记信息
        this.yearData = result.data.filter(item => item.tnLx === 0).map(item => ({
          ...item,
          fileList: item.xtFjList.map(file => ({
            ...file,
            name: file.tcYwjmc,
            newName: file.tcXwjmc,
          }))
        }))[0]

        // 季度工作信息列表
        this.seasonList = result.data.filter(item => item.tnLx === 1).map(item => ({
          ...item,
          editable: false,
          tdCjsj: Moment(item.tdCjsj).format('YYYY-MM-DD'),
          fileList: item.xtFjList.map(file => ({
            ...file,
            name: file.tcYwjmc,
            newName: file.tcXwjmc,
          }))
        }))
      }
    }
  },
}
</script>

<style lang="scss">
@import "~@assets/styles/define.scss";

.block-toolbar{
  overflow: hidden;
  margin-bottom: 10px;
  .block-toolbar-left{
    float: left;
    line-height: 28px;
    color: $text-dark;
    font-size: 15px;
    font-weight: bold;
  }
  .block-toolbar-right{
    float: right;
    text-align: right;
  }
}



  .year {
    border: 1px solid #ededed;
    border-radius: 4px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    margin: 0 40px;
    margin-bottom: 20px;
    padding: 10px 20px;
  }
  .season {
    border: 1px solid #ededed;
    border-radius: 4px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    margin: 0 40px;
    margin-bottom: 20px;
    padding: 10px 20px;

    .season-block{
      position: relative;

      &::before{
        content: '';
        display: block;
        position: absolute;
        width: 5px;
        height: 5px;
        border: 3px solid $green;
        border-radius: 100%;
        background: #fff;
        top: 30px;
        left: 20px;
        z-index: 2;
      }

      &::after{
        content: '';
        display: block;
        position: absolute;
        width: 2px;
        height: calc(100% + 20px);
        top: 33px;
        left: 25px;
        z-index: 1;
        background: #ededed;
      }

      &:last-child{
        &::after{
          display: none;
        }
      }


      .season-toolbar{
        overflow: hidden;
        margin-bottom: 10px;
        border-top: 1px dotted $border;
        padding-top: 20px;
        padding-left: 60px;

        .season-toolbar-left{
          vertical-align: middle;
          float: left;
          line-height: 28px;
          color: $text-light;
          font-size: 12px;
          >i{
            margin-right: 5px;
            font-size: 12px;
          }
          >span{
            margin-right: 20px;
            &.season-title{
              font-size: 14px;
              color: $orange;
            }
          }
        }
        .season-toolbar-right{
          float: right;
          text-align: right;
        }
      }
      .season-form{
        padding-left: 60px;
      }      
    }
  }
  
</style>
