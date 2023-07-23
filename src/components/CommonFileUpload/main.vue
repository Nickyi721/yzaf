<template>
  <el-upload
    class="upload-demo"
    action
    :http-request="_uploadFile"
    :auto-upload="true"
    :show-file-list="false"
    :file-list="list"
    :limit="6"
  >
    <el-button size="mini" type="primary">上传</el-button>
    <div slot="tip" class="el-upload__tip">{{`上传文件不能超过${this.limit}M`}}</div>
  </el-upload>
</template>

<script>
export default {
  name: "CommonFileUpload",
  props: {
    list: {
      type: Array,
      default: () => []
    },
    limit: ''
  },
  data() {
    return {}
  },
  methods: {
    _uploadFile(param) {
      if( param.file.size / 1024 / 1024 > this.limit ){
        this.$alert(`上传文件不能超过${this.limit}M`)
        return
      }
      this.$emit("uploadFile", param);
    }
  }
}
</script>

