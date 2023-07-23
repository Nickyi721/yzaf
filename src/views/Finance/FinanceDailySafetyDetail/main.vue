<template>
  <CustomView :location="[{ text: '日常安全检查详情' }]">
    <CustomButton style="float:right;margin:15px 150px 0 0" v-if="$route.query.tnJczt===1" icon="export" text="导出" @click="_ButtonExportClick"/>
    <el-form v-if="this.tnCkbz === 1" ref="form" :model="bindData" label-position="top" class="common-form">
      <h4>营业前</h4>
      <el-form-item v-for="item in bindData.beforeWork" :disabled="item.tnSfkbjbz === 1? false:true" :label="item.tcJcnr">
        <el-radio-group v-model="item['tcJcjgbm']" size="small">
          <el-radio v-for="radio in option" :disabled="item.tnSfkbjbz === 0? true : false" :label="radio.tcSjubm" :key="radio.tcSjubm">{{radio.tcSjnr}}</el-radio>
        </el-radio-group>                
      </el-form-item>
      <h4>营业中</h4>
      <el-form-item v-for="item in bindData.working" :disabled="item.tnSfkbjbz === 1? false:true" :label="item.tcJcnr">
        <el-radio-group v-model="item['tcJcjgbm']" size="small">
          <el-radio v-for="radio in option" :disabled="item.tnSfkbjbz === 0? true : false" :label="radio.tcSjubm" :key="radio.tcSjubm">{{radio.tcSjnr}}</el-radio>
        </el-radio-group>                
      </el-form-item>
      <h4>营业终了</h4>
      <el-form-item v-for="item in bindData.afterWork" :disabled="item.tnSfkbjbz === 1? false:true" :label="item.tcJcnr">
        <el-radio-group v-model="item['tcJcjgbm']" size="small">
          <el-radio v-for="radio in option" :disabled="item.tnSfkbjbz === 0? true : false" :label="radio.tcSjubm" :key="radio.tcSjubm">{{radio.tcSjnr}}</el-radio>
        </el-radio-group>                
      </el-form-item>      
      <el-form-item label="检查人" prop="tcJcrmc">
        <el-input :readonly=true :value="this.$route.query.tcJcrmc" size="mini" maxlength="24"></el-input>
      </el-form-item>
      <el-form-item label="值班负责人" prop="tcZbfzr">
        <el-input v-model="formData['tcZbfzr']" size="mini" maxlength="24"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="tcBz">
        <el-input v-model="formData['tcBz']" type="textarea" size="mini" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
      </el-form-item>
    </el-form>

    <el-form v-if="this.tnCkbz === 0" :model="formData" label-position="left" class="common-form">
      <h4>营业前</h4>
      <el-form-item v-for="item in bindData.beforeWork"  :label="item.tcJcnr">
        <el-radio-group v-model="item['tcJcjgbm']" size="small">
          <el-radio v-for="radio in option" disabled :label="radio.tcSjubm" :key="radio.tcSjubm">{{radio.tcSjnr}}</el-radio>
        </el-radio-group>                
      </el-form-item>
      <h4>营业中</h4>
      <el-form-item v-for="item in bindData.working" :label="item.tcJcnr">
        <el-radio-group v-model="item['tcJcjgbm']" size="small">
          <el-radio v-for="radio in option" disabled :label="radio.tcSjubm" :key="radio.tcSjubm">{{radio.tcSjnr}}</el-radio>
        </el-radio-group>                
      </el-form-item>
      <h4>营业终了</h4>
      <el-form-item v-for="item in bindData.afterWork" :label="item.tcJcnr">
        <el-radio-group v-model="item['tcJcjgbm']" size="small">
          <el-radio v-for="radio in option" disabled :label="radio.tcSjubm" :key="radio.tcSjubm">{{radio.tcSjnr}}</el-radio>
        </el-radio-group>                
      </el-form-item>      
      <el-form-item label="检查人">
        <el-input :value="this.$route.query.tcJcrmc" disabled size="mini" ></el-input>
      </el-form-item>      
      <el-form-item label="值班负责人">
        <el-input :value="this.$route.query.tcZbfzr" size="mini" disabled ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input :value="this.$route.query.tcBz" type="textarea" size="mini" disabled></el-input>
      </el-form-item>            

    </el-form>
  </CustomView> 
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

export default {
    mixins: [
        Mixin.init, 
        Mixin.page
    ],
    components: {

    },   
    data() {
        return{
          dict: ['031101'],
          bindData: {
            beforeWork: [],   //营业前  
            working: [],      //营业中
            afterWork: [],    //营业终了
          },
          formData: {
            update:[]
          },
          option:[],
          tnCkbz:''         //页面是否查看编辑
        }
    },
    methods: {
      $init(options) {
        this.option = options['031101']
        this.formData.tcZbfzr = this.$route.query.tcZbfzr
        this.formData.tcBz = this.$route.query.tcBz
        this.getDetail()
      },
      _ButtonSaveClick() {
        // 筛选可编辑的数据
        const beforeEditable = this.bindData.beforeWork.filter(item => item.tnSfkbjbz === 1)
        const workingEditable = this.bindData.working.filter(item => item.tnSfkbjbz === 1)
        const afterEditable = this.bindData.afterWork.filter(item => item.tnSfkbjbz === 1)
        console.log(afterEditable)
        this.formData.tnRcaqjctoid = this.$route.query.tnRcaqjctoid
        this.formData.tcJcrmc = this.$route.query.tcJcrmc
        if(beforeEditable.length>0){
          // this.formData.update.push({beforeEditable})
          beforeEditable.forEach(item => this.formData.update.push(
            {tcJcjgbm:item.tcJcjgbm, tcJcjgmc:item.tcJcjgmc?item.tcJcjgmc:'',
             tnRcaqjcszid:item.tnRcaqjcszid,  tnRcaqjctiid:item.tnRcaqjctiid,
             tnRcaqjctoid:this.$route.query.tnRcaqjctoid}
            ))
        }
        if(workingEditable.length>0){
          // this.formData.update.push({workingEditable})
          workingEditable.forEach(item => this.formData.update.push(
            {tcJcjgbm:item.tcJcjgbm, tcJcjgmc:item.tcJcjgmc?item.tcJcjgmc:'',
             tnRcaqjcszid:item.tnRcaqjcszid, tnRcaqjctiid:item.tnRcaqjctiid,
             tnRcaqjctoid:this.$route.query.tnRcaqjctoid}
            )) 
        }
        if(afterEditable.length>0){
          // this.formData.update.push(afterEditable[0])
          afterEditable.forEach(item => this.formData.update.push(
             {tcJcjgbm:item.tcJcjgbm, tcJcjgmc:item.tcJcjgmc?item.tcJcjgmc:'', 
             tnRcaqjcszid:item.tnRcaqjcszid, tnRcaqjctiid:item.tnRcaqjctiid,
             tnRcaqjctoid:this.$route.query.tnRcaqjctoid}
            ))
        }
        this.formData.update.forEach(item => {
          if(item.tcJcjgbm === '03110101'){
            item.tcJcjgmc = '正常'
          }
          if(item.tcJcjgbm === '03110102'){
            item.tcJcjgmc = '不正常'
          }
        })         
        this.saveList()        
      },
      _ButtonExportClick() {
        this.exportTable()
      },
      async exportTable() {
        const result = await Model.exportTable({
          isQuery: 0,
          cdID:'0004050301',
          requestData: {
            tnRcaqjctoid: this.$route.query.tnRcaqjctoid
          }
        })
        if(result){
          this.$message({
            message: '导出成功',
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true,
          })
          const content = result
          const blob = new Blob([content])
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = `营业场所日常安全检查登记簿.xls`
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
      },
      // 获取配置表数据
      async getDetail() {
        const result = await Model.getDetail({
          isQuery: 1,
          cdID:'0004050301',
          requestData: {
            tnRcaqjctoid: this.$route.query.tnRcaqjctoid
          }
        })
        if(result.data){
          this.tnCkbz = result.data[0].tnCkbz
          result.data.forEach(item => {
            if(item.tcLxbm === '03110301'){
              this.bindData.beforeWork.push(item)
            }
            if(item.tcLxbm === '03110302'){
              this.bindData.working.push(item)
            }
            if(item.tcLxbm === '03110303'){
              this.bindData.afterWork.push(item)
            }
          })
        }
      },
      // 修改保存数据
      async saveList() {
        const result = await Model.saveList({
          isQuery: 0,
          cdID:'0004050301',
          requestData: this.formData
            
        })
        if(result.state === '1'){
          this.$message({
            message: "保存成功!",
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true
          });        
          this.getDetail()  
          this.$router.go(-1)
        }
      }
    }     
}
</script>

