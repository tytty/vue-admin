<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~@/assets/img/login.jpg" alt="登录图标" />
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login_form">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-people"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="loginForm.password" show-password>
            <i slot="prefix" class="iconfont icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="login_btns">
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  components: {},

  computed: {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$request.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            this.$message.error('登录失败')
            return false
          }
          this.$message.success('登陆成功')
          sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  background-color: aqua;
  height: 100%;
  position: relative;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 7px;

    .avatar_box {
      width: 100px;
      height: 100px;
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translate(-50%, 0);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .login_form {
      width: 400px;
      margin: 100px auto 0;

      .iconfont {
        margin-left: 4px;
      }

      .login_btns {
        width: 300px;
        display: flex;
        justify-content: center;
        margin: 0 auto;
      }
    }
  }
}
</style>
