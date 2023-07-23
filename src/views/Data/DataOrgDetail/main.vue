<template>
  <CustomView :location="[{ text: '单位详情'}]">
    <h3>{{formData.tcDwjc}}</h3>
    <div class="common-info">
      <div class="common-info-unit">
        <span class="common-info-label">单位编码：</span>
        <span class="common-info-content">{{formData['tcDwbm']}}</span>
        <span class="common-info-label">组织结构代码：</span>
        <span class="common-info-content">{{formData['tcZzjgdm']}}</span>
      </div>
      <div class="common-info-unit">
        <span class="common-info-label">单位类型：</span>
        <span class="common-info-content">{{formData.tcDwlxmc}}</span>
        <span class="common-info-label">网点类别：</span>
        <span class="common-info-content">{{formData.tcWdlb === '00050204' ? '非网点': '网点'}}</span>
      </div>
      <div class="common-info-unit">
        <span class="common-info-label">上级单位：</span>
        <span class="common-info-content">{{formData['sjdwmc']}}</span>
      </div>
      <div class="common-info-unit">
        <span class="common-info-label textleft">地区：</span>
        <span class="common-info-content">{{formData['tcSheng']}} {{formData['tcShi']}} {{formData['tcXian']}}</span>
      </div>
    </div>
    <el-form :inline="true"  :model="formData" :rules="rules" ref="ruleForm" label-position="top" class="common-form">
      <el-form-item label="单位简称">
        <el-input v-model="formData['tcDwmc']" maxlength="16" size="mini" placeholder="请输入单位简称"></el-input>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="formData['tcFzr']" maxlength="16" size="mini" placeholder="请输入负责人"></el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="tcYzbm" inline-message="true">
        <el-input v-model="formData['tcYzbm']" size="mini" placeholder="请输入邮政编码"></el-input>
      </el-form-item>
      <el-form-item label="金融许可证" prop="tcJrxkz">
        <el-input v-model="formData['tcJrxkz']" size="mini" placeholder="请输入金融许可证"></el-input>
      </el-form-item>
      <el-form-item label="网点状态">
        <el-select v-model="formData['tnWdzt']" size="mini" placeholder="请选择网点状态">
          <el-option v-for="option in optionsNetStatus" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地理坐标(经纬度)" class="localtion-label">
        <el-input class="location-content" type="number" oninput="if(value.length>6) value=value.slice(0,7)" v-model="formData['tcJd']" size="mini" placeholder="请输入经度"></el-input> -
        <el-input class="location-content" type="number" oninput="if(value.length>5) value=value.slice(0,6)" v-model="formData['tcWd']" size="mini" placeholder="请输入纬度"></el-input>
      </el-form-item>
      <el-form-item label="证上地址" class="address">
        <el-input class="address-content" v-model="formData['tcZsdz']" maxlength="66" size="mini" placeholder="请输入证上地址"></el-input>
      </el-form-item>
      <el-form-item label="实际地址" class="address">
        <el-input class="address-content" v-model="formData['tcSjdz']" maxlength="66" size="mini" placeholder="请输入实际地址"></el-input>
      </el-form-item>
      <el-form-item label="网点联系方式" prop="tcWdlxfs" class="address">
        <el-input class="address-content" v-model="formData['tcWdlxfs']" size="mini" placeholder="请输入网点联系方式"></el-input>
      </el-form-item>
      <el-form-item label="负责人联系方式" prop="tcFzrlxfs" inline-message="true" class="address">
        <el-input class="address-content" v-model="formData['tcFzrlxfs']" size="mini" placeholder="请输入负责人联系方式"></el-input>
      </el-form-item>
      <el-form-item label="所属板块" class="board-label">
      <el-checkbox-group v-model="tcBkbm" class="checkBoard">
        <el-checkbox v-for="board in boards" :label="board.tcSjubm" :key="board.tcSjubm">{{board.tcSjnr}}</el-checkbox>
      </el-checkbox-group>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" size="mini" @click="_ButtonClick">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>
<style lang="scss" scoped>
  form {
    max-width: 1366px;
  }
  h3 {
    height: 50px;
    line-height: 50px;
    margin-left: 60px;
  }

  .el-input {
    width: 300px;
    margin-right: 67px;
  }

  .location-label {
    margin-left: 100px;
  }
  .location-content {
      width: 140px;
      margin-right: 0px;
  }

  .el-select {
    width: 300px;
    margin-right: 67px;
  }

  .address {
    width: 550px;
  }

  .address-content {
    width: 500px;
  }

  .board-label {
    width: 100%;
  }

  .textleft {
    padding-right: 29px;
  }

</style>


<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import CommonModel from '@commons/model.js'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      tcBkbm:[],
      formData: {},
      optionsOrgType: [],
      optionsNetType: [],
      optionsAreaSheng: [],
      optionsAreaShi: [],
      optionsAreaXian: [],
      boards: [],
      curAreaSheng: "",
      curAreaShi: "",
      optionsNetStatus: [
        {
          tcSjubm: 0,
          tcSjnr: '正常'
        },
        {
          tcSjubm: 1,
          tcSjnr: '无效'
        }
      ],
      rules: {
        tcYzbm: [
          Validator.isNumber(6),
          Validator.length(6, 6),
        ],
        tcFzrlxfs: [
          Validator.isPhoneOrFamilyNumber(),
        ],
        tcWdlxfs: [
          Validator.isPhoneOrFamilyNumber(),
        ],
        tcJrxkz: [
          Validator.length(1, 15),
          Validator.special()
        ],
        tcJd: [
          Validator.float(3, 2)
        ],
        tcWd: [
          Validator.float(3, 2)
        ]
      },
    }
  },
  methods: {
    $init(options) {
      this.boards = JSON.parse(window.sessionStorage.boardIds) 
      this.getOrgDetail()
      this.getOptions()
      this.getOrgOptions()
    },
    _ButtonClick () {
      this.editOrgData()
    },
    //校验经纬度的格式是否符合规范
    verifylonglat(longitude, latitude){
       //经度，整数部分为0-180小数部分为0到6位
       var longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,3})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
       if (!longreg.test(longitude)) {
         this.$alert('经度整数部分为0-180,小数部分为0到3位!'); 
         return false;
       }
       //纬度,整数部分为0-90小数部分为0到6位
       var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,3}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
       if (!latreg.test(latitude)) {
         this.$alert('纬度整数部分为0-90,小数部分为0到3位!'); 
         return false;
       }
       return true;
    },
    // 省改变事件
    async _ChangeAreaSheng(curArea) {
      let obj = {};
      obj = this.optionsAreaSheng.find((item) => {
        return item.tcXzqhbm === curArea;
      });
      this.formData.tcSheng = obj.tcXzqhmc;

      this.curAreaSheng = curArea
      const result = await Model.getAreaShi({
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '00040102',
        requestData: {
          tcXzqhbm: this.curAreaSheng,
        }
      })
      if (result && result.data) {
        this.optionsAreaShi = result.data;
        this.formData['shiDm'] = this.optionsAreaShi[0].tcXzqhbm
        this.curAreaShi = this.optionsAreaShi[0].tcXzqhbm;
        const resultXian = await Model.getAreaXian({
          isQuery: 1,  //是否是查询类 0-否 1-是
	        cdId: '00040102',
          requestData: {
            tcXzqhbm: this.curAreaShi,
          }
        })
        if (resultXian && resultXian.data) {
          this.optionsAreaXian = resultXian.data;
          this.formData['xianDm'] = this.optionsAreaXian[0].tcXzqhbm
        }
      }
    },
    // 市改变事件
    async _ChangeAreaShi(curArea) {

      let obj = {};
      obj = this.optionsAreaShi.find((item) => {
        return item.tcXzqhbm === curArea;
      });
      this.formData.tcShi = obj.tcXzqhmc;

      this.curAreaShi = curArea
      const resultXian = await Model.getAreaXian({
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '00040102',
          requestData: {
            tcXzqhbm: this.curAreaShi,
          }
        })
        if (resultXian && resultXian.data) {
          this.optionsAreaXian = resultXian.data;
          this.formData['xianDm'] = this.optionsAreaXian[0].tcXzqhbm
        }
    },
    // 县改变事件
    _ChangeAreaXian(curArea) {
      let obj = {};
      obj = this.optionsAreaXian.find((item) => {
        return item.tcXzqhbm === curArea;
      });
      this.formData.tcXian = obj.tcXzqhmc;
      this.$forceUpdate()
    },
    // 获取网点类别
    async getOptions () {
      const result = await CommonModel.getDictData(['000502'])
      if (result && result.data) {
        this.optionsNetType = result.data;
      }
    },
    // 获取单位类型
    async getOrgOptions() {
      const result = await CommonModel.getDictData(['000501'])
      if (result && result.data) {
        this.optionsOrgType = result.data;
      }
    },
    // 获取 省份信息
    async getAreaSheng () {
      const result = await Model.getAreaSheng()
      if (result && result.data) {
        this.optionsAreaSheng = result.data;
        if(this.formData.shengDm) {
          this.curAreaSheng = this.formData.shengDm
        } else {
          this.curAreaSheng = result.data[0].tcXzqhbm
        }
        this.getAreaShi()
      }
    },
    // 获取 市信息
    async getAreaShi() {
      const result = await Model.getAreaShi({
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '00040102',
        requestData: {
          tcXzqhbm: this.curAreaSheng,
        }
      })
      if (result && result.data) {
        this.optionsAreaShi = result.data;
        if(this.formData.shiDm) {
          this.curAreaShi = this.formData.shiDm
        } else {
          this.curAreaShi = result.data[0].tcXzqhbm
        }
        this.getAreaXian()
      }
    },
    // 获取 县信息
    async getAreaXian() {
      const result = await Model.getAreaXian({
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '00040102',
        requestData: {
          tcXzqhbm: this.curAreaShi,
        }
      })
      if (result && result.data) {
        this.optionsAreaXian = result.data;
      }
    },
    // 修改后保存
    async editOrgData () {
      this.$refs.ruleForm.validate(async (valid, obj) => {
        if (valid) {
          console.log(this.formData)
          if( (this.formData.tcJd === '' || this.formData.tcJd === undefined) && this.formData.tcWd !== '' && this.formData.tcWd !== undefined) {
            this.$alert('必须填写完整的地理坐标！'); 
          }
          if( (this.formData.tcWd === '' || this.formData.tcWd === undefined) && this.formData.tcJd !== '' && this.formData.tcJd !== undefined) {
            this.$alert('必须填写完整的地理坐标！'); 
          }
          if(this.formData.tcWd !== '' && this.formData.tcWd !== undefined && this.formData.tcJd !== '' && this.formData.tcJd !== undefined) {
            const tip = this.verifylonglat(this.formData.tcJd, this.formData.tcWd)
            if(tip) {
              delete this.formData.tcBkbmList
              this.formData.bkbmList = this.tcBkbm
              if(this.optionsAreaSheng.length != 0 && this.formData.shengDm) {
                let obj = {};
                obj = this.optionsAreaSheng.find((item) => {
                  return item.tcXzqhbm === this.formData.shengDm
                });
                this.formData.tcSheng = obj.tcXzqhmc
              }
              if(this.optionsAreaShi.length != 0 && this.formData.shiDm) {
                let obj = {};
                obj = this.optionsAreaShi.find((item) => {
                  return item.tcXzqhbm === this.formData.shiDm
                });
                this.formData.tcShi = obj.tcXzqhmc
              }
              if(this.optionsAreaXian.length != 0 && this.formData.xianDm) {
                let obj = {};
                obj = this.optionsAreaXian.find((item) => {
                  return item.tcXzqhbm === this.formData.xianDm
                });
                this.formData.tcXian = obj.tcXzqhmc
              }      
              const result = await Model.editOrgData(this.formData)
              if(result && result.state === '1') {
                this.$message({
                  message: '保存成功！',
                  type: 'success',
                  customClass: "middle",
                })
                this.$router.push({path: '/data/org'})
              }
            }
          }
          if( (this.formData.tcWd === '' || this.formData.tcWd === undefined) && (this.formData.tcJd === '' || this.formData.tcJd === undefined) ) {
            delete this.formData.tcBkbmList
            this.formData.bkbmList = this.tcBkbm
            if(this.optionsAreaSheng.length != 0 && this.formData.shengDm) {
              let obj = {};
              obj = this.optionsAreaSheng.find((item) => {
                return item.tcXzqhbm === this.formData.shengDm
              });
              this.formData.tcSheng = obj.tcXzqhmc
            }
            if(this.optionsAreaShi.length != 0 && this.formData.shiDm) {
              let obj = {};
              obj = this.optionsAreaShi.find((item) => {
                return item.tcXzqhbm === this.formData.shiDm
              });
              this.formData.tcShi = obj.tcXzqhmc
            }
            if(this.optionsAreaXian.length != 0 && this.formData.xianDm) {
              let obj = {};
              obj = this.optionsAreaXian.find((item) => {
                return item.tcXzqhbm === this.formData.xianDm
              });
              this.formData.tcXian = obj.tcXzqhmc
            }      
            const result = await Model.editOrgData(this.formData)
            if(result && result.state === '1') {
              this.$message({
                message: '保存成功！',
                type: 'success',
                customClass: "middle",
              })
              this.$router.push({path: '/data/org'})
            }
          }
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      });
    },
    // 页面跳转加载详细信息
    async getOrgDetail() {
      const result = await Model.getOrgDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '00040102',
        requestData: {
          tcDwbm: this.$route.query.curOrg
        }
      })
      if(result && result.data) {
        this.formData = result.data;
        this.curAreaSheng = this.formData.shengDm
        this.getAreaSheng()
        if(this.formData.tcBkbmList.length !== 0) {
          this.tcBkbm = this.formData.tcBkbmList.map(item => item.tcBkbm)
        }
        this.pageTotal = result.total
      }
    }
  },
}
</script>