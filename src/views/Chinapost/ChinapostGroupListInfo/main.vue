<template lang="html">
  <CustomView :location="[{ text: '案件详情' }]">
    <div class="detail">
      <Detail type="初报" :content="form" @check="_ButtonCheckClick($event, 'cb')"/>
      <Detail type="续报" :expand="false" :content="list" :idx="index + 1" @check="_ButtonCheckClick($event, 'xb')" v-for="(list, index) in xxxbList" :key="index" />
      <End :content="wjList" v-if="Object.keys(wjList).length !== 0" />
    </div>
  </CustomView>
</template>

<script>
import Moment from 'moment'
import Mixin from '@mixins'
import Model from './model.js'

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
      form: {},
      xxxbList: [],
      wjList: {}
    }
  },
  methods: {
    $init(options) {
      this.getDetail()
    },
    // 获取详情
    async getDetail() {
      const result = await Model.getDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
        cdId: '0004090201',
        requestData:{
          tnXxcbid: this.$route.query.tnXxcbid
        }
      })
      // 初报
      if (result && result.data) {
        this.form = result.data.xxglXxcbDto
        this.form.tdAfrq = Moment(this.form.tdAfrq).format('YYYY-MM-DD')
        this.form.tdSbsj = Moment(this.form.tdSbsj).format('YYYY-MM-DD')
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
    },
    // 对象数组排序
    Compare(property){
      return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
  }
}
</script>
