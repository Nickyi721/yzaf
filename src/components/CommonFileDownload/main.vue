<template>
  <div class="compose-content-attachment">
    <div v-for="(attachment, index) in list" :key="index" class="attachments">
      <img v-if="attachment.isPic" src="../../assets/image/img-icon.png" alt>
      <img v-if="attachment.isVideo" src="../../assets/image/video-icon.png" alt>
      <img v-if="!attachment.isPic&&!attachment.isVideo" src="../../assets/image/zip-icon.png" alt>
      <span :title="attachment.tcYwjmc">{{attachment.tcYwjmc.length>11?attachment.tcYwjmc.substring(0,11)+'...':attachment.tcYwjmc}}</span>
      <button v-if="attachment.isPic" class="download" @click="_buttonClick(attachment.tcXwjmc, attachment.tcYwjmc, 'view', $event)">预览</button>
      <button class="download" @click="_buttonClick(attachment.tcXwjmc, attachment.tcYwjmc, $event)">下载</button>
      <button class="download" @click="_remove(attachment, $event)" :disabled="disabled" :style='style'>移除</button>
    </div>
    <div class="preview-box" v-if="visible">
      <!-- <i class="el-icon-close"></i> -->
      <div>
        <!-- <span class="app-tab-close" @click="_CloseImageBox"><CustomIcon name="close" /></span> -->
        <img :src="src" @click="_CloseImageBox" style='height:400px'/>
      </div>
    </div>
    <!-- <CustomDialog title="图片内容" :visible="picVisible" @close="closeHandle">
      <img :src="src" style="height:300px;">
    </CustomDialog> -->
  </div>
</template>
<style lang="scss" scoped>
.preview-box{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height: 100%;
  justify-content: center;
  align-items:center;
  background-color:rgba(0,0,0,.3);
  display: flex;
  z-index: 9999;
  >div{
    background-color:#fff;
    overflow: auto;
  }
  
}

.download {
  margin: 5px;
  background: none;
  text-decoration: underline;
  cursor: pointer;
  color: #006a45!important;
  border: 0;
  background: none!important;
  &:hover{
    color: #65d38c!important;
  }
}
.compose-content-attachment {
  font-size: 12px;
}
.attachments {
  float: left;
  margin-right: 10px;
  min-width: 150px;
}
span {
  position: absolute;
  margin-left: 5px;
  line-height: 20px;
}
</style>

<script>
import request from "@commons/request.js";
import CommonModel from "@commons/model.js";
export default {
  name: "CommonFileDownload",
  props: {
    list: {
      type: Array,
      default: () => []
    },
    id: '',
    disabled: {
      type: Boolean,
      default: false
    },
    picVisible: {
      type: Boolean,
      // default: true
    }
  },
  data() {
    return {
      src: "",
      visible: false,
      ywId: '',//业务id
      style:{}
    };
  },
  methods: {
    closeHandle() {
      this.visible = false;
    },
    _buttonClick(tcXwjmc, tcYwjmc, type, event) {
      window.event.preventDefault(event)
      this.downloadFile(tcXwjmc, tcYwjmc, type);
    },
    _remove(attachment, event) {
      window.event.preventDefault(event)
      this.$emit('remove', attachment, this.ywId)
    },
    async downloadFile(tcXwjmc, tcYwjmc, type) {
      const result = await CommonModel.downloadFile({
        tcWjm: tcXwjmc
      });
      if(result){
        console.log(result)
        const content = result;
        const blob = new Blob([content]);
        const fileName = tcYwjmc;
        const fileTag = fileName.split(".")[1];
        if (type === "view") {
          let src = URL.createObjectURL(blob);
          this.src = src;
          this.visible = true;
          // let tempPage=window.open(src, '_blank', '', '')
          // tempPage.location = src
        } else {
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        }
      }
    },
    _CloseImageBox() {
      this.visible = false;
    },
  },
  beforeMount() {
    this.list.forEach(element => {
      let fileTag = element.tcYwjmc.split(".")[1];
      element["isPic"] = fileTag == "png" || fileTag == "jpg" || fileTag == "jpeg" || false;
      element["isVideo"] = fileTag == "mpeg" || fileTag == "rmvb" || fileTag == "rm" || fileTag == "wmv" || fileTag == "avi" || fileTag == "3gp" || fileTag == "flv" || fileTag == "mp4" || fileTag == "swf" || fileTag == "mov" || false
    });
    this.ywId = this.id
  },
  mounted() {
    if(this.disabled){
      this.style = {
        color: '#dddddd',
        textDecoration: 'none',
        cursor: 'default'
      }
    }
  },
  watch: {
    list: {
      handler(val) {
        if (val) {
          val.forEach(element => {
            let fileTag = element.tcYwjmc.split(".")[1];
            element["isPic"] = fileTag == "png" || fileTag == "jpg" || fileTag == "jpeg" || false
            element["isVideo"] = fileTag == "mpeg" || fileTag == "rmvb" || fileTag == "rm" || fileTag == "wmv" || fileTag == "avi" || fileTag == "3gp" || fileTag == "flv" || fileTag == "mp4" || fileTag == "swf" || fileTag == "mov" || false            
          })
          // console.log('val:',val)
        }
      },
      deep: true,
    },
    id: {
      handler(val) {
        this.ywId = val
      },
      deep: true
    },
    picVisible: {
      handler(val) {
        if(!val){
          this.visible = val
        }
      }
    }
  }
};
</script>

