<template>
    <el-form ref="form" :model="formData" label-width="80px" label-position="top" class="common-form common-form-dlg">
        <el-form-item label="营业状态" prop="tcLxbm" width>
            <el-select size="mini" v-model="formData['tcLxbm']" :disabled="disabled" placeholder="请选择">
                <el-option v-for="item in option" :key="item.tcSjubm" :value="item.tcSjubm" :label="item.tcSjnr"></el-option>
            </el-select>      
        </el-form-item>
        <el-form-item label="检查时间">
            <el-time-picker
                is-range
                size="mini"
                v-model="setTime"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
            </el-time-picker>      
        </el-form-item>   
        <p class="attention">日常安全巡检录入将只可以在您设置的时间段内进行填写及修改</p>
        <el-button type="primary" size="mini" @click="saveTimeSet">提 交</el-button>   
    </el-form>   
</template>

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "../model.js";
import Moment from "moment";

export default {
    mixins: [Mixin.init],
    data() {
        return{
            dict: ['031103'], 
            option: [],
            formData: {
                tcLxbm:''
            },
            setTime:'',
            disabled: false
        }
    },
    props: {
      row: {
        type: Object,
        default: () => {}
      }      
    },    
    methods: {
        $init(options) {
            this.option = options['031103']
            this.option.splice(-1,1)
        },
        saveTimeSet() {
            if(this.formData.tcLxbm){
                this.formData.tcLxmc = this.option.filter(item => item.tcSjubm === this.formData.tcLxbm)[0].tcSjnr
            }else{
                this.$alert('请选择营业状态')
                return
            }               
            if(this.setTime){
                this.formData.tdKssj = Moment(this.setTime[0]).format('HH:mm:ss')
                this.formData.tdJssj = Moment(this.setTime[1]).format('HH:mm:ss')
            }else{
                this.$alert('请选择时间').catch(() => {})
                return
            }         
            this.$emit('query',this.formData)
        },
        clearSet() {
            this.setTime = ''
            this.formData.tcLxbm = '' 
            if(this.disabled === true){
                this.disabled = false
            }
        },
        updata() {
           this.formData.tcLxbm = this.row.tcLxbm
           this.disabled = true
        },
    },
}
</script>

<style scoped>
    .attention{
        margin-bottom: 15px;
        font-weight: 600;
    }
</style>


