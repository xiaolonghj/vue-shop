<template>
  <div class="home">
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 实现退出登录的方法
    loginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  text-align: left;
  margin: 30px 0 0 30px;
}
</style>
