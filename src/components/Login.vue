<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar">
        <img src="../assets/images/logo.png" alt srcset />
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item class="login-group">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: ' ',
        password: ' '
      },
      loginRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    // 表单重置
    resetForm () {
      this.$refs.loginForm.resetFields()
    },
    // 登录请求->验证->状态提示
    login () {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 登录成功过后的token，保存到客户端的sessionStorage里面
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后台页面，地址为"/Home"
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
  font-size: 18px;
  color: #333;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -225px;
  border-radius: 5px;
  padding: 0 20px;
  box-sizing: border-box;
}
.avatar {
  width: 100px;
  height: 100px;
  margin: auto;
  margin-top: -50px;
  border-radius: 100%;
  background-color: #fff;
  border: 5px solid #fff;
  box-shadow: 1px 2px 10px #ddd;
  margin-bottom: 20px;
  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    background-color: #eee;
  }
}
.login-group {
  text-align: right;
}
</style>
