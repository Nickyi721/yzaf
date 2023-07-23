<template>
  <CustomView>
    <!-- 工具栏 -->
    <CustomToolbar slot="top">
      <!-- 内容分类选择 -->
      <div slot="left">
        <el-select v-model="evalType" size="mini" @change="_SelectTypeChange">
          <el-option v-for="option in options['0310']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </div>
      <!-- 操作 -->
      <CustomButton icon="save" text="保存" @click="_ButtonSaveClick"/>
    </CustomToolbar>

    <div class="eval-content">
      <div class="eval-title">
        <span>{{evalTypeText}}内容</span>
        <span>
          <RowControl :buttons="['add', 'class']" @control="_RowContentControl(null, null, null, $event)"/>
        </span>
      </div>
      <div class="eval-body">
        <div class="eval-level-a" v-for="(levelA, levelAIdx) in contentData" :key="levelAIdx">
          <!-- 一级评估内容 -->
          <EvalContent :content="levelA" :index="levelAIdx" v-if="levelA.tnSfmj === 1">
            <RowControl :index="levelAIdx" :max="contentData.length" :buttons="['delete', 'edit', 'arrow-down', 'arrow-up']" @control="_RowContentControl(contentData, levelA, levelAIdx, $event)"/>
          </EvalContent>
          <!-- 一级评估类型 -->
          <template v-else>
            <!-- 类型标题 -->
            <EvalClass :content="levelA" :index="levelAIdx">
              <RowControl :index="levelAIdx" :max="contentData.length" :buttons="['delete', 'edit', 'add', 'class', 'arrow-down', 'arrow-up']" @control="_RowContentControl(contentData, levelA, levelAIdx, $event, 'class')"/>
            </EvalClass>
            <!-- 类型子项 -->
            <div class="eval-level-b" v-for="(levelB, levelBIdx) in levelA.children" :key="levelBIdx">
              <!-- 二级评估内容 -->
              <EvalContent :content="levelB" :index="levelBIdx" v-if="levelB.tnSfmj === 1">
                <RowControl :index="levelBIdx" :max="levelA.children.length" :buttons="['delete', 'edit', 'arrow-down', 'arrow-up']" @control="_RowContentControl(levelA.children, levelB, levelBIdx, $event)"/>
              </EvalContent>
              <!-- 二级评估类型 -->
              <template v-else>
                <!-- 类型标题 -->
                <EvalClass :content="levelB" :index="levelBIdx">
                  <RowControl :index="levelBIdx" :max="levelA.children.length" :buttons="['delete', 'edit', 'add', 'arrow-down', 'arrow-up']" @control="_RowContentControl(levelA.children, levelB, levelBIdx, $event, 'class')"/>
                </EvalClass>
                <!-- 类型子项 -->
                <div class="eval-level-c" v-for="(levelC, levelCIdx) in levelB.children" :key="levelCIdx">
                  <!-- 二级评估内容 -->
                  <EvalContent :content="levelC" :index="levelCIdx">
                    <RowControl :index="levelCIdx" :max="levelB.children.length" :buttons="['delete', 'edit', 'arrow-down', 'arrow-up']" @control="_RowContentControl(levelB.children, levelC, levelCIdx, $event)"/>
                  </EvalContent>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>  
    </div>

    <!-- 设置分类对话框 -->
    <CustomDialog :title="`${controlMode === 'add' ? '添加' : '修改'}分类`" :visible="dlgTypeVisble" @close="dlgTypeVisble = false">
      <el-form ref="typeForm" :rules="typeRules" :model="currentType" label-position="top" class="common-form common-form-dlg">
        <el-form-item label="分类名称" prop="tcPgnr">
          <el-input v-model="currentType['tcPgnr']" size="mini" maxlength="100" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="扣分标准" prop="tnKfbz">
          <el-input v-model="currentType['tnKfbz']" size="mini" type="number" maxlength="5" placeholder="请输入扣分标准"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="_ButtonDlgTypeSaveClick">确定</el-button>
        </el-form-item>
      </el-form>
    </CustomDialog>
    
    <!-- 设置内容对话框 -->
    <CustomDialog :title="`${controlMode === 'add' ? '添加' : '修改'}评分项`" :visible="dlgContentVisble" @close="dlgContentVisble = false">
      <div class="content-form">
        <el-form ref="contentForm" :rules="contentRules" :model="currentContent" label-position="top" class="common-form common-form-dlg">
          <el-form-item label="评分项内容" prop="tcPgnr">
            <el-input type="textarea" :rows="2" v-model="currentContent['tcPgnr']" size="mini" maxlength="100" placeholder="请输入评分项内容"></el-input>
          </el-form-item>
          <el-form-item label="扣分标准" prop="tnKfbz">
            <el-input v-model="currentContent['tnKfbz']" size="mini" type="number" maxlength="5" placeholder="请输入扣分标准"></el-input>
          </el-form-item>
          <el-form-item label="录入类型">
            <el-select v-model="currentContent['tnWtyylx']" size="mini" placeholder="请选择录入类型" @change="_DlgMethodChange">
              <el-option v-for="option in options['tnWtyylx']" :key="option.value" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="currentContent['tnWtyylx'] !== 2">
            <el-form-item label="增加可选值">
              <el-button class="content-form-button" size="mini" @click="_DlgQuestionAddClick">
                <CustomIcon name="add"/>
              </el-button>
            </el-form-item>
            <el-form-item v-for="(item, index) in currentContent.wtfzDto" :key="index" :label="'可选值' + (index + 1)" :prop="'option_' + index">
              <el-input v-model="currentContent['option_' + index]" size="mini" placeholder="请输入可选值" class="content-form-option" @change="_InputOptionInput(index, $event)"></el-input>
              <el-button class="content-form-button" size="mini" @click="_DlgQuestionDeletelick(index)">
                <CustomIcon name="delete"/>
              </el-button>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button type="primary" size="mini" @click="_ButtonDlgContentSaveClick">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </CustomDialog>
  </CustomView>

</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import Validator from '@commons/validator.js'

import EvalContent from './components/EvalContent.vue'
import EvalClass from './components/EvalClass.vue'
import RowControl from './components/RowControl.vue' 

export default {
  name: 'DataFinanceContent',
  mixins: [
    Mixin.init, 
  ],
  components: { 
    EvalContent,
    EvalClass,
    RowControl
   },
  data () {
    return {
      // 加载数据字典
      dict: ['0310'],
      // 下拉选项集合
      options: {
        tnWtyylx: [
          { label: '单选', value: 0 },
          { label: '多选', value: 1 },
          // { label: '录入', value: 2 },
        ]
      },
      // 评估类型
      evalType: null,
      evalTypeText: '',
      // 对话框控制
      dlgTypeVisble: false,
      dlgContentVisble: false,
      // 评估内容
      contentData: [],
      // 操作类型
      controlMode: '',
      controlType: '',
      // 当前类型
      currentType: {},
      // 当前评估项
      currentContent: {},
      // 类型验证规则
      typeRules: {
        tcPgnr: [
          Validator.required('请输入分类名称'),
          Validator.length(1, 100),
        ],
        tnKfbz: [
          Validator.required('请输入扣分标准'),
          Validator.float(3, 1)
        ]
      },
      // 评估项验证规则
      contentRules: {
        tcPgnr: [
          Validator.required('请输入内容名称'),
          Validator.length(1, 100),
        ],
        tnKfbz: [
          Validator.required('请输入扣分标准'),
          Validator.float(3, 1)
        ]
      },
      // 待删除列表
      deleteList: [],
      // 待保存列表
      updateList: [],
      // 当前最大序号
      currentOrderValue: 0,
      isFirstEnter: true
    }
  },
  methods: {
    // 初始化
    $init (options) {
      if (options['0310'] && options['0310'].length) {
        this.options['0310'] = options['0310']
        this.evalType = options['0310'][0].tcSjubm
        this.evalTypeText = options['0310'][0].tcSjnr
        this.getContentData()
        this.getMaxOrderValue()
      }
    },
    // 事件-评估类型选择
    _SelectTypeChange () {
      const idx = this.options['0310'].findIndex(item => item.tcSjubm === this.evalType)
      this.evalTypeText = this.options['0310'][idx].tcSjnr
      this.getContentData()
      this.getMaxOrderValue()
    },
    // 事件-保存评估内容数据
    _ButtonSaveClick () {
      this.saveContentData()
    },
    _DlgMethodChange () {
      if (this.currentContent['tnWtyylx'] === 2) {
        while (this.currentContent.wtfzDto.length) {
          this.currentContent.wtfzDto.pop()
        }
      }
    },
    // 事件-行控制
    _RowContentControl (list, row, index, mode, type) {
      switch (mode) {
        case 'add': 
        case 'class': 
          this.addRow(row, mode)
          break
        case 'edit':
          this.editRow(row, type)
          break
        case 'delete':
          this.deleteRow(list, row, index, type)
          break
        case 'arrow-down':
        case 'arrow-up':
          this.adjustRowOrder(list, row, index, mode)
          break
      }
    },
    // 事件-类型保存按钮点击
    _ButtonDlgTypeSaveClick () {
      this.$refs.typeForm.validate((valid, obj) => {
        if (valid) {
          this.cacheTypeData()
          this.$refs.typeForm.clearValidate()
          this.dlgTypeVisble = false
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 事件-评估项保存按钮点击
    _ButtonDlgContentSaveClick () {
      this.$refs.contentForm.validate((valid, obj) => {
        if (valid) {
          this.cacheContentData()
          this.$refs.contentForm.clearValidate()
          this.dlgContentVisble = false
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 事件-可选值输入
    _InputOptionInput (idx, value) {
      this.currentContent.wtfzDto[idx].tcWtms = value
    },
    // 事件-增加可选值
    _DlgQuestionAddClick () {
      this.currentContent.wtfzDto.push({ tcWtms: '' })
      this.currentContent.wtfzDto.forEach((item, idx) => {
        this.$set(this.currentContent, 'option_' + idx, item.tcWtms)
      })
      this.setContentRules()
    },
    // 事件-删除可选值
    _DlgQuestionDeletelick (index) {
      this.currentContent.wtfzDto.splice(index, 1)
      this.currentContent.wtfzDto.forEach((item, idx) => {
        this.currentContent['option_' + idx] = item.tcWtms
      })
    },
    // 增加数据
    addRow (row, mode) {
      this.controlMode = 'add'
      this.currentParent = row || { children: this.contentData, tnJc: 0 }
      this.currentParent.children = this.currentParent.children || []
      if (mode === 'add') {
        this.currentContent = { 
          wtfzDto: [{ tcWtms: '' }, { tcWtms: '' }],
          option_0: '', 
          option_1: '', 
          tnWtyylx: 0 
        }
        this.setContentRules()
        this.dlgContentVisble = true
      } else {
        this.currentType = {}
        this.dlgTypeVisble = true
      }
    },
    // 编辑数据
    editRow (row, type) {
      this.controlMode = 'update'
      if (type === 'class') {
        this.setReactiveValue(this.currentType, row)
        this.dlgTypeVisble = true
      } else {
        row.wtfzDto.forEach((item, idx) => {
          row['option_' + idx] = item.tcWtms
        })
        this.setReactiveValue(this.currentContent, row)
        this.setContentRules()
        this.dlgContentVisble = true
      }
    },
    // 预存分类数据
    cacheTypeData () {
      if (this.controlMode === 'add') {
        const newType = {
          tcPgnr: this.currentType.tcPgnr,
          tnKfbz: parseFloat(this.currentType.tnKfbz),
          tnPgnrszbid: '',
          tnNrbh: this.currentOrderValue + 1,
          tcPglx: this.evalType,
          tnJc: this.currentParent.tnJc + 1,
          tnZf: parseFloat(this.currentType.tnKfbz),
          tnXssx: this.currentParent.children.length + 1,
          tcSjbm: this.currentParent.tnNrbh,
          tnWtyylx: 2,
          tnWtfzbid: '',
          tcWtms: '',
          tnSfmj: 0,
          children: []
        }
        this.currentParent.children.push(newType)
        this.currentOrderValue++
        this.setUpdateList(newType)
      } else {
        const type = {
          ...this.currentType,
          tnKfbz: parseFloat(this.currentType.tnKfbz),
          tnZf: parseFloat(this.currentType.tnKfbz),
          tnWtfzbid: '',
          tcWtms: '',
        }
        this.setUpdateList(type)
      }
    },
    // 预存内容数据
    cacheContentData () {
      if (this.controlMode === 'add') {
        const newContent = {
          tcPgnr: this.currentContent.tcPgnr,
          tnKfbz: parseFloat(this.currentContent.tnKfbz),
          tnPgnrszbid: '',
          tnNrbh: this.currentOrderValue + 1,
          tcPglx: this.evalType,
          tnJc: this.currentParent.tnJc + 1,
          tnZf: parseFloat(this.currentContent.tnKfbz),
          tnXssx: this.currentParent.children.length + 1,
          tcSjbm: this.currentParent.tnNrbh,
          tnWtyylx: this.currentContent.tnWtyylx,
          tnWtfzbid: '',
          tcWtms: this.currentContent.wtfzDto.map(item => item.tcWtms).join(','),
          tnSfmj: 1,
          wtfzDto: this.currentContent.wtfzDto
        }
        this.currentParent.children.push(newContent)
        this.currentOrderValue++
        this.setUpdateList(newContent)
      } else {
        const content = {
          ...this.currentContent,
          tnKfbz: parseFloat(this.currentContent.tnKfbz),
          tnZf: parseFloat(this.currentContent.tnKfbz),
          tnWtfzbid: this.currentContent.wtfzDto.map(item => item.tnWtfzbid).join(','),
          tcWtms: this.currentContent.wtfzDto.map(item => item.tcWtms).join(','),
        }
        this.setUpdateList(content)
      }
    },
    // 删除数据
    deleteRow (list, row, index, type) {
      this.$confirm('是否删除该项?').then(() => {
        // 加入待删除列表
        this.deleteList.push(row)
        type === 'class' && row.children.forEach(item => {
          this.deleteList.push(item)
        })
        // 从树形数据中剔除
        list.splice(index, 1)
      }).catch(() => {})
    },
    // 调整数据顺序
    adjustRowOrder (list, row, index, type) {
      list.splice(index, 1)
      list.splice(type === 'arrow-down' ? index - 1 : index + 1, 0, row)
      list.forEach((item, index) => {
        item.tnXssx = index

        const row = item.tnSfmj === 0 ? {
          ...item,
          tnWtfzbid: '',
          tcWtms: '',
        } : {
          ...item,
          tnWtfzbid: item.wtfzDto.map(item => item.tnWtfzbid).join(','),
          tcWtms: item.wtfzDto.map(item => item.tcWtms).join(','),
        }

        this.setUpdateList(row)
      })
    },
    // 设置待更新列表
    setUpdateList (row) {
      const idx = this.updateList.findIndex(item => item.tnNrbh === row.tnNrbh)
      if (idx < 0) {
        this.updateList.push(row)
      } else {
        this.updateList[idx] = { ...row }
      }
    },
    // 设置内容验证规则
    setContentRules () {
      this.currentContent.wtfzDto.forEach((item, index) => {
        this.contentRules['option_' + index] = [
          Validator.required('请输入可选值内容'),
          Validator.length(1, 100),
        ]
      })
    },
    setReactiveValue (target, obj) {
      Object.keys(obj).forEach(key => {
        this.$set(target, key, obj[key])
      })
    },
    // 获取评估内容数据
    async getContentData () {
      const result = await Model.getFinanceInContentData(this.evalType)
      if (result.data) {
        this.contentData = result.data
      }
    },
    // 保存评估内容数据
    async saveContentData () {    
      const deleteList = this.deleteList.filter(item => item.tnPgnrszbid).map(item => item.tnPgnrszbid)
      
      const result = await Model.saveFinanceInContentData(deleteList, this.updateList)
      if (result.state === '1') {
        this.deleteList = []
        this.updateList = []
        this.$message({
          message: '配置保存成功',
          duration: 1000,
        })
        this.getContentData()
      }
    },
    // 获取当前数据最大序号
    async getMaxOrderValue () {
      const result = await Model.getFinanceInContentMaxBh()
      this.currentOrderValue = result.data ? result.data : 0
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.evalType && this.getContentData()
      this.getMaxOrderValue()
    }
  },
   deactivated () {
    this.isFirstEnter = false
  }
}
</script>

<style lang="scss" scoped>
@import '~@assets/styles/define.scss';

.eval-content{
  border: 1px solid #bbe2c8;
  min-width: 1000px;
  height: 100%;
  overflow-y: auto;

  .eval-title{
    background: #f8fff3;
    font-size: 14px;
    padding: 5px 10px;
    border-bottom: 1px solid #bbe2c8;
    overflow: hidden;
    line-height: 28px;

    >span{
      display: block;
      float: left;
      &:nth-child(2) {
        float: right;
        font-size: 14px;
        font-weight: normal;
      }
    }
  }

  .eval-body{
    .eval-level-b{
      .eval-class{
        background: #eee;
        padding-left: 24px;
      }
      .eval-row{
        background: #f7f7f7;
        padding-left: 24px;
      }
    }
  }
}

.content-form{
  max-height: 440px;
  overflow-y: auto;

  .content-form-option{
    width: 300px;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
  }

  .content-form-button{
    vertical-align: middle;
    height: 28px;
    line-height: 28px;
    padding: 0 8px;
    background-color: #FFF !important;
    border-color: #ccc !important;

    i{
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
