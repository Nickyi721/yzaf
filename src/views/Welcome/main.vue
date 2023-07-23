<template>
  <div class="welcome">
    <CustomIcon name="msg-smile"/>
    <p>欢迎使用中国邮政安全保卫管理信息系统</p>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/define.scss";

.welcome{
  padding: 80px 0;
  text-align: center;
  i{
    font-size: 96px;
    color: #e5e5e5;
  }
  p{
    font-size: 16px;
    color: #aaa;
    margin: 24px;
  }
}
</style>
