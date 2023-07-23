<template lang="html">
  <div class="common-card">
    <div class="card-title">
      <span>{{title}}</span>
    </div>
    <div v-if="infoCardShow" class="card-content">
      <span>单位简称：</span><span class="value">{{ info.dwjc }}</span> 
      <span>单位类别：</span><span class="value">{{ info.dwlxmc }}</span> 
      <span>网点类别：</span><span class="value">{{ info.wdlbmc }}</span> 
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    info: {
      type: Object,
      default: () => ({})
    },
    infoCardShow: {
      type: Boolean,
      default: () => true
    }
  }
}
</script>
