<template>
  <el-form ref="form" :model="formData" :rules="rules" label-position="top" class="common-form">
    <el-form-item label="文件分类" prop="tcLxid">
      <el-select v-model="formData['tcLxid']" placeholder="请选择文件分类" size="mini" style="width:300px">
        <el-option
          v-for="zlkwjType in zlkwjTypes"
          :key="zlkwjType.tcSjubm"
          :label="zlkwjType.tcSjnr"
          :value="zlkwjType.tcSjubm"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择文件" prop="file">
      <el-upload
        class="upload-demo"
        action
        :limit="1"
        :on-change=" _handleChange"
        :auto-upload="true"
        :file-list="formData['file']"
        :show-file-list="true"
        :on-remove="_onRemove"
      >
        <el-button size="mini" type="primary">点击上传</el-button>
        <div
          slot="tip"
          class="el-upload__tip"
        >请上传.png .jpg .jpeg .pdf .doc .docx .xls .xlsx .txt等格式文件</div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="_SubmitButtonClick()">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import Validator from "@commons/validator.js";

export default {
  props: ["zlkwjTypes"],
  data() {
    return {
      rules: {
        tcLxid: [Validator.required("请选择文件分类")],
        file: [Validator.required("请选择文件")]
      },
      formData: {
        tcLxid: "11010101",
        tcLxmc: "",
        file: []
      }
    };
  },
  methods: {
    _SubmitButtonClick() {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          let obj = this.zlkwjTypes.find(item => {
            return item.tcSjubm === this.formData.tcLxid;
          });
          this.formData.tcLxmc = obj.tcSjnr;
          this.$emit("upload", this.formData);
        } else {
          const firstKey = Object.keys(obj)[0];
          this.$alert(obj[firstKey][0].message);
        }
      });
    },
    _handleChange(file) {
      this.formData.file.splice(0, this.formData.file.length);
      this.formData.file.push(file);
    },
    _onRemove(file, fileList) {
      // //移除文件显示列表数据
      this.formData.file.splice(0, this.formData.file.length);
    }
  }
};
</script>

