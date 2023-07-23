<template>
  <CustomView>
    <CustomToolbar slot="top">
      <el-select slot="left" v-model="type" size="mini" @change="_SelectTypeChange">
        <el-option v-for="option in option" :value="option.tcSjubm" :key="option.tcSjubm" :label="option.tcSjnr"></el-option>
      </el-select>
      <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/>
      <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
      <CustomButton icon="save" text="保存" @click="_ButtonSaveClick"/>
    </CustomToolbar>

    <EditableList :list="list" ref="editable" @selection-change="_EditableListChange" @del="getDel"/>
  </CustomView>    
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import EditableList from './components/EditableList.vue'
import { async } from 'q';


export default {
    components: { EditableList },
    mixins: [
        Mixin.init,
    ],    
    data() {
        return{
            dict: ['031102'],
            option: {},
            selection: [],
            type:'',
            list: [],
            tnRcaqjcszidArr: [], //删除时主键ID
            tcXxxlxmc:'',      //信息项名称
            tcLxmc:'',    //类型名称
            del:[]
        }
    },
    methods: {
        $init(options) {
            if(options && options['031102']){
                this.option = options['031102']
                if(this.option){
                    this.type = this.option[0].tcSjubm
                    this.getListData()                
                }                
            }
        },

        // 配置表——新增
        _ButtonAddClick() {
            this.list.push({
                tnXxxsjlx: '03110301',
                tnXxxjtnr: ''
            })
        },
        // 保存
        _ButtonSaveClick() {
            this.saveListData()
        },
        getDel(val) {
            this.del = val
        },
        // 删除
        _ButtonDeleteClick() {
            if (this.selection.length > 0) {
                this.$confirm('是否删除所选数据？').then(() => {
                    this.deleteListData()
                }).catch(err => {})
            }
        },

        _SelectTypeChange() {

        },
        _EditableListChange(selection) {
            this.selection = selection
            this.tnRcaqjcszidArr = this.selection.map(item => item.tnRcaqjcszid)
        },

        // 保存信息
        async saveListData() {
            this.tcXxxlxmc = this.option.filter(item => this.type === item.tcSjubm)[0].tcSjnr
            let options = [...this.$refs.editable.option]
            const updateList = this.list.map((row, index) =>{
                const item = {
                    tcXxxlxbm: this.type,                //信息项类型
                    tcXxxlxmc: this.tcXxxlxmc,           //信息项名称
                    tcLxbm: row.tnXxxsjlx,         //类型编码
                    tcLxmc: (() => {for(let i=0; i< options.length; i++){
                                if(options[i].tcSjubm === row.tnXxxsjlx)
                                    return options[i].tcSjnr
                                }})(),            //类型名称
                    tcJcnr: row.tnXxxjtnr,         //检查内容
                    tnXssx: index+1,        //序号
                    tnRcaqjcszid: row.tnRcaqjcszid               
                }  
                return item                            
            })

            const result = await Model.saveListData({
                isQuery: 0,
                cdId: '0004010405',
                requestData: {
                    delete: this.del,
                    update:updateList
                }
            })
            if(result.state === '1'){
                this.$message({
                    message: '配置保存成功',
                    duration: 1000,
                })                
                this.getListData()
            }
        },
        // 获取信息
        async getListData() {
            const result = await Model.getListData({
                isQuery: 1,
                cdId: '0004010405',
                requestData: {
                    tcXxxlxbm: this.type
                }
            })
            if(result.data){
                this.list = result.data
                for(let i=0;i<this.list.length;i++){
                   this.list[i].tnXxxsjlx = this.list[i].tcLxbm
                   this.list[i].tnXxxjtnr = this.list[i].tcJcnr
                }
            }
        },
        // 删除信息
        async deleteListData() {
            const result =  await Model.saveListData({
                isQuery: 0,
                cdId: '0004010405',
                requestData: {
                    delete: this.tnRcaqjcszidArr
                }
            })
            if(result.state === '1'){
                this.$message({
                    message: '删除成功',
                    duration: 1000,
                    type:'success'
                })                
                this.getListData()
            }
        }
    }
}
</script>

