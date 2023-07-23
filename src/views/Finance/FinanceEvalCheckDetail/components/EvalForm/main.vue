<template>
  <div class="eval-form">
    <div class="eval-form-title">评估内容</div>
    <div class="eval-form-table">
      <div class="head">
        <span>评估项</span>
        <span>扣分标准</span>
        <span>问题和原因</span>
      </div>
      <div class="body">
        <!-- 一级分类 -->
        <div class="primary" v-for="(primary, primaryIdx) in config" :key="primaryIdx">
          <div class="item" v-if="primary.tnSfmj === 1">
            <table>
              <tr>
                <td>{{primary.tcPgnr}}</td>
                <td>{{primary.tnKfbz}}(分)</td>
                <td>
                  <el-from disabled>
                    <el-radio-group v-if="primary.tnWtyylx === 0" v-model="formData[primary.tnPgnrszbid]">
                      <el-radio v-for="option in primary.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-radio>
                    </el-radio-group>
                    <el-checkbox-group v-if="primary.tnWtyylx === 1" v-model="formData[primary.tnPgnrszbid]" @change="$forceUpdate()" size="mini">
                      <el-checkbox v-for="option in primary.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-checkbox>
                    </el-checkbox-group>
                    <el-input v-if="primary.tnWtyylx === 2" v-model="formData[primary.tnPgnrszbid]" size="mini" :placeholder="'请输入' + primary.tcXxxmc"></el-input>
                  </el-from>
                  
                </td>
              </tr>
            </table>
          </div>
          <!-- 一级分类标题 -->
          <div class="title" v-else>{{primaryIdx + 1}} - {{primary.tcPgnr}} - {{ primary.tnZf }}分</div>
          <template v-for="(item, itemIdx) in primary.children">
            <!-- 一级评分项目 -->
            <div class="item" v-if="item.tnSfmj === 1" :key="itemIdx">
              <table>
                <tr>
                  <td>{{item.tcPgnr}}</td>
                  <td>{{item.tnKfbz}}(分)</td>
                  <td>
                    <el-form disabled>
                      <el-radio-group v-if="item.tnWtyylx === 0" v-model="formData[item.tnPgnrszbid]">
                        <el-radio v-for="option in item.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-radio>
                      </el-radio-group>
                      <el-checkbox-group v-if="item.tnWtyylx === 1" v-model="formData[item.tnPgnrszbid]" @change="$forceUpdate()" size="mini">
                        <el-checkbox v-for="option in item.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-checkbox>
                      </el-checkbox-group>
                      <el-input v-if="item.tnWtyylx === 2" v-model="formData[item.tnPgnrszbid]" size="mini" :placeholder="'请输入' + item.tcXxxmc"></el-input>
                    </el-form>
                    
                  </td>
                </tr>
              </table>
            </div>
            <!-- 二级分类 -->
            <div class="secondary" v-else :key="itemIdx">
              <!-- 二级分类标题 -->
              <div class="title">{{itemIdx + 1}} - {{item.tcPgnr}} - {{ item.tnZf }}分</div>
              <!-- 二级评分项目 -->
              <div class="item" v-for="(secondary, secondaryIdx) in item.children" :key="secondaryIdx">
                <table>
                  <tr>
                    <td>{{secondary.tcPgnr}}</td>
                    <td>{{secondary.tnKfbz}}(分)</td>
                    <td>
                      <el-form disabled>
                        <el-radio-group v-if="secondary.tnWtyylx === 0" v-model="formData[secondary.tnPgnrszbid]">
                          <el-radio v-for="option in secondary.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-if="secondary.tnWtyylx === 1" v-model="formData[secondary.tnPgnrszbid]" @change="$forceUpdate()" size="mini">
                          <el-checkbox v-for="option in secondary.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-checkbox>
                        </el-checkbox-group>
                        <el-input v-if="secondary.tnWtyylx === 2" v-model="formData[secondary.tnPgnrszbid]" size="mini" :placeholder="'请输入' + secondary.tcXxxmc"></el-input>
                      </el-form>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    config: {
      type: Array,
      default () {
        return []
      }
    },
    content: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  watch: {
    config: {
      handler () {
        this.setContent()
      },
      deep: true
    },
    content: {
      handler () {
        this.$nextTick(() => {
          this.formData = this.content
        })
      },
      deep: true
    },
  },
  data () {
    return {
      formData: this.content,
      options: {},
    }
  },
  methods: {
    setContent() {
      this.config.forEach(primary => {
        primary.tnWtyylx === 1 && (this.formData[primary.tnPgnrszbid] = this.formData[primary.tnPgnrszbid] || [])

        primary.children && primary.children.forEach((child, idx) => {
          child.tnWtyylx === 1 && (this.formData[child.tnPgnrszbid] = this.formData[child.tnPgnrszbid] || [])

          child.children && child.children.forEach((secondary, idx) => {
            secondary.tnWtyylx === 1 && (this.formData[secondary.tnPgnrszbid] = this.formData[secondary.tnPgnrszbid] || [])
          })
        })
      })
    },
  },
}
</script>
