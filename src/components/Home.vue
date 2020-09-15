<template>
  <div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  components: {},

  computed: {},

  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped></style>
