<template>
  <div class="eval-form">
    <div class="eval-form-head-title">评估内容</div>

    <div class="eval-form-table">
      <div class="head">
        <span style="width: 60%">评估项</span>
        <span style="width: 40%">问题和原因</span>
      </div>
      <div class="body">
        <!-- 一级分类 -->
        <div class="primary" v-for="(primary, primaryIdx) in config" :key="primaryIdx">
          <div class="item" v-if="primary.tnSfmj === 1">
            <table>
              <tr>
                <template v-if="primary.tnWtyylx === 2">
                  <!-- <el-input v-model="formData[primary.tnPgnrszbid]" size="mini"></el-input> -->
                  <el-button @click="_EvalInputClick(primary.tnPgnrszbid, primary.tcPgnr)" type="text">{{ primary.tcPgnr }}</el-button>
                </template>
                <template v-else>
                  <td>{{primary.tcPgnr}}</td>
                  <td>
                    <el-from>
                      <el-radio-group v-if="primary.tnWtyylx === 0" v-model="formData[primary.tnPgnrszbid]">
                        <el-radio @change="(val) => _EvalRadioChange(val, primary.tcPgnr, primary.tnPgnrszbid, option.tcWtms, primary)" v-for="option in primary.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-radio>
                      </el-radio-group>
                      <el-checkbox-group v-if="primary.tnWtyylx === 1" v-model="formData[primary.tnPgnrszbid]" @change="$forceUpdate()" size="mini">
                        <el-checkbox @change="(val) => _EvalCheckboxChange(val, primary.tnPgnrszbid, primary.tcPgnr, formData[primary.tnPgnrszbid], option.tcWtms, primary)" v-for="option in primary.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-checkbox>
                      </el-checkbox-group>
                    </el-from>
                  </td>
                </template>
              </tr>
            </table>
          </div>
          <!-- <div class="title">类型</div> -->
          <template v-for="(item, itemIdx) in primary.children">
            <!-- 一级评分项目 -->
            <div class="item" v-if="item.tnSfmj === 1" :key="itemIdx">
              <table>
                <tr>
                  <template v-if="item.tnWtyylx === 2">
                    <td>
                      <!-- <el-input v-model="formData[item.tnPgnrszbid]" size="mini"></el-input> -->
                      <el-button @click="_EvalInputClick(item.tnPgnrszbid, item.tcPgnr)" type="text">{{ item.tcPgnr }}</el-button>
                    </td>
                  </template>
                  <template v-else>
                    <td>{{item.tcPgnr}}</td>
                    <td>
                      <el-form>
                        <el-radio-group v-if="item.tnWtyylx === 0" v-model="formData[item.tnPgnrszbid]">
                          <el-radio v-for="option in item.wtfzDto" @change="(val) => _EvalRadioChange(val, item.tcPgnr, item.tnPgnrszbid, option.tcWtms, item)" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-if="item.tnWtyylx === 1" v-model="formData[item.tnPgnrszbid]" @change="$forceUpdate()" size="mini">
                          <el-checkbox @change="(val) => _EvalCheckboxChange(val, item.tnPgnrszbid, item.tcPgnr, formData[item.tnPgnrszbid], option.tcWtms, item)" v-for="option in item.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-checkbox>
                        </el-checkbox-group>
                      </el-form>
                    </td>
                  </template>
                </tr>
              </table>
            </div>
            <!-- 二级分类 -->
            <div class="secondary" v-else :key="itemIdx">
              <!-- <div class="title">类型</div> -->
              <!-- 二级评分项目 -->
              <div class="item" v-for="(secondary, secondaryIdx) in item.children" :key="secondaryIdx">
                <table>
                  <tr>
                    <template v-if="secondary.tnWtyylx === 2">
                      <!-- <el-input v-model="formData[secondary.tnPgnrszbid]" size="mini"></el-input> -->
                      <el-button @click="_EvalInputClick(secondary.tnPgnrszbid, secondary.tcPgnr)" type="text">{{ secondary.tcPgnr }}</el-button>
                    </template>
                    <template v-else>
                      <td>{{secondary.tcPgnr}}</td>
                      <td>
                        <el-form>
                          <el-radio-group v-if="secondary.tnWtyylx === 0" v-model="formData[secondary.tnPgnrszbid]">
                            <el-radio v-for="option in secondary.wtfzDto" @change="(val) => _EvalRadioChange(val, secondary.tcPgnr, secondary.tnPgnrszbid, option.tcWtms, secondary)" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-radio>
                          </el-radio-group>
                          <el-checkbox-group v-if="secondary.tnWtyylx === 1" v-model="formData[secondary.tnPgnrszbid]" @change="$forceUpdate()" size="mini">
                            <el-checkbox @change="(val) => _EvalCheckboxChange(val, secondary.tnPgnrszbid, secondary.tcPgnr, formData[secondary.tnPgnrszbid], option.tcWtms, secondary)" v-for="option in secondary.wtfzDto" :key="option.tnWtfzbid" :label="option.tnWtfzbid">{{option.tcWtms}}</el-checkbox>
                          </el-checkbox-group>
                        </el-form>
                      </td>
                    </template>
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
  },
  watch: {
    config: {
      handler () {
        this.setContent()
      },
      deep: true
    },
  },
  data () {
    return {
      formData: {},
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
    // 单选-change事件
    _EvalRadioChange(val, type, id, name, item) {
      this.$emit('eval-radio-change', id, type, val, name, item)
    },
    // 多选-change事件
    _EvalCheckboxChange(state, id, type, value, name, item) {
      this.$emit('eval-checkbox-change', state, id, type, value, name, item)
    },
    _EvalInputClick(id, name) {
      this.$emit('eval-input-click', id, name)
    }
  },
}
</script>

<style lang="scss" scoped>
  .eval-form {
    .eval-form-head-title {
      font-size: 16px;
      font-weight: bold !important;
      padding: 10px 0;
    }
    .eval-form-table {
      >.body {
        >.primary {
          .item{
            >table {
              td{
                &:nth-child(1){
                  width: 60% !important;
                }
                &:nth-child(2){
                  width: 40% !important;
                }
              }
            }
          }
          .secondary{
            >table {
              td{
                &:nth-child(1){
                  width: 60% !important;
                }
                &:nth-child(2){
                  width: 40% !important;
                }
              }
            }
          }
        }
      }
    }
  }
  
</style>

