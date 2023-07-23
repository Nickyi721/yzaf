<template>
  <CustomView :location="[{ text: '安全评估计分表' }]">
    <div class="g-content">
      <div class="head">
        <h2>{{ JSON.parse(this.$route.query.curOrg).tcDwmc }}</h2>
        <span>评估人：{{ JSON.parse(this.$route.query.curOrg).tcPgrmc }}</span>
        <span style="float: right">评估日期：{{ JSON.parse(this.$route.query.curOrg).tdKspgsj }}</span>
      </div>
      <div class="table_body">
        <el-table
          :data="listCopy"
          stripe 
          border 
          size="mini" 
          show-summary
          sum-text="合计得分"
          :summary-method="summaryMethod"
          class="grid-table"
          :span-method="mergeMethod"
        >
          <el-table-column label="评估内容及评估标准" fixed>
            <template slot-scope="scope">
              <span class="first" v-if="scope.row.tnJc === 0">{{ scope.row.tcPgnr }}</span>
              <span v-else>{{ _writeTableFirst(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="扣分项目">
            <template slot-scope="scope">
              {{ _writeTableSecond(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="存在问题" width="150px">
            <template slot-scope="scope">
              {{ _writeTableThird(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="实际分值" width="80px" prop="tcZf">
            <template slot-scope="scope">
              {{ _writeTableForth(scope.row) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </CustomView>
  
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import Moment from 'moment'
export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data() {
    return {
      list: [],
      listCopy: [],
      score: ''
    }
  },
  methods: {
    $init(options) {
      
    },
    mergeMethod({ row, column, rowIndex, columnIndex }) {
      // if(row.tnJc !== 0) {
      //   if(columnIndex === 0) {
      //     if(rowIndex % 2 === 0) {
      //       return {
      //         rowspan: 2,
      //         colspan: 1
      //       };
      //     } else {
      //        return {
      //         rowspan: 0,
      //         colspan: 0
      //       };
      //     }
      //   }
      // }
    },
    summaryMethod(param) {
      const { columns, data } = param
      let sums = []
      let sum = 0
      data.forEach(item => {
        if(item.tnJc === 0) {
          if(item.tnPgdf !== undefined) {
            sum += item.tnPgdf
          }
        }
      })
      return sums = ['合计得分（100分）', '', '', this.score]
    },
    async getFinSecEvaScoreTable() {
      const result = await Model.getFinSecEvaScoreTable({
        isQuery: 1,  //是否是查询类 0-否 1-是
        cdId: '0004050203', 
        // lylx: '1',
        requestData: {
          tnPgnrzbid: JSON.parse(this.$route.query.curOrg).tnPgnrzbid,
        }
      });
      if(result.data && result.state === '1') {
        this.score = result.data.JraqPgnrzDto.tnPgdf
        this.list = result.data.jfbList
        let firstLevel = this.list.filter(el => el.tnJc === 1)
        let secondLevel = this.list.filter(el => el.tnJc === 2)
        let thirdLevel = this.list.filter(el => el.tnJc === 3)
        this.listCopy = [{
          tcPgnr: this.list[0].tcXxxlxmc,
          tcPglx: this.list[0].tcPglx,
          tnJc: 0,
          tnPgdf: this.list[0].tnPgdf,
          wtfzDto: [],
          tnKfxm: ''
        }]
        // 构造第一级
        for(let j = 0; j < firstLevel.length; j++){
          if( j<firstLevel.length-1 && firstLevel[j].tcPglx != firstLevel[j+1].tcPglx){
            const obj = {
              tcPglx: firstLevel[j+1].tcPglx,
              tcPgnr: firstLevel[j+1].tcXxxlxmc,
              tnJc: 0,
              tnPgdf: firstLevel[j+1].tnPgdf,
              wtfzDto: [],
              tnKfxm: ''
            }
            this.listCopy.push(obj)
          }
        }
        // 三级往二级拼
        if(thirdLevel.length > 0){
          for(let m = 0; m < secondLevel.length; m++){
            let arr = thirdLevel.filter(a => a.tcPglx === secondLevel[m].tcPglx && a.tcSjbm == secondLevel[m].tnNrbh)
            secondLevel.splice(m, 1, [secondLevel[m], ...arr])
          }
        }
        // 二级往一级拼
        if(secondLevel.length > 0){
          for(let m = 0; m < firstLevel.length; m++){
            let arr = []
            secondLevel.forEach(el => {
              if(el.length && el.length>0){
                if(el[0].tcPglx === firstLevel[m].tcPglx && el[0].tcSjbm == firstLevel[m].tnNrbh){
                  arr = [...arr, ...el]
                }
              }
              else{
                if(el.tcPglx === firstLevel[m].tcPglx && el.tcSjbm == firstLevel[m].tnNrbh){
                  arr = [...arr,el]
                }
              }
            })
            firstLevel.splice(m, 1 ,[firstLevel[m], ...arr])
          }
        }
        // 一级往0级拼
        if(firstLevel.length > 0){
          for(let m = 0; m < this.listCopy.length; m++){
            let arr = []
            firstLevel.forEach(el => {
              if(el.length && el.length>0){
                if(el[0].tcPglx === this.listCopy[m].tcPglx){
                  arr = [...arr, ...el]
                }
              }
              else{
                if(el.tcPglx === this.listCopy[m].tcPglx){
                  arr = [...arr, el]
                }
              }
            })
            this.listCopy.splice(m, 1 ,[this.listCopy[m], ...arr])
          }
        }
        let finalArr = []
        this.listCopy.forEach(el => {
          finalArr = [...finalArr, ...el]
        })
        this.listCopy = finalArr
        // console.log(this.listCopy)
      }
    },
    _writeTableFirst(data) {
      if(data.tnSfmj === 1) {
        return data.tnSjmc
      } else {
        return data.tcPgnr
      }
    },
    _writeTableSecond(data) {
      if((data.tnJc === 2 || data.tnJc === 3) && data.tnSfmj === 1) {
        return data.tcPgnr
      }
      // if(data.tnSfmj === 1) {
      //   return data.tnSjmc
      // } else {
      //   return data.tcPgnr
      // }
    },
    _writeTableThird(data) {
      // if(data.tnJc === 2) {
        let question = ''
        for(let i in data.wtfzDto) {
          question += data.wtfzDto[i].tcWtms + ';'
        }
        return question
      // }
    },
    _writeTableForth(data) {
      if(data.tnJc === 0) {
        return data.tnPgdf
      } else if(data.tnJc === 1){
        if(data.tcZf !== undefined) {
          return data.tcZf
        } else {
          return data.tnZf
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
  mounted() {
    this.getFinSecEvaScoreTable()
  }
}
</script>


<style lang="scss" scoped>
  .g-content {
    .head {
      h2 {
        text-align: center;
        color: rgba(102,187,106,1);
        font-size: 18px;
      }
      span {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
      }
    }
    .table_body .first {
      font-size: 14px;
      color: rgba(102,187,106,1);
      font-weight: bold;
    }
  }
</style>