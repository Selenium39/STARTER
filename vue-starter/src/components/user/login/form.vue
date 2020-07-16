<template>
  <div>
    <el-form
      :model="user"
      :rules="rules"
      label-position="left"
      label-width="0px"
      class="login-container"
      ref="loginForm"
    >
      <el-form-item prop="username">
        <el-input type="text" auto-complete="off" placeholder="用户名" v-model.trim="user.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="off" placeholder="密码" v-model.trim="user.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="doLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, setLoginedUser } from "@/http/axios";
export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    doLogin() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          login(this.user.username, this.user.password)
            .then(result => {
              switch (result.data.status) {
                case 200:
                  setLoginedUser(this.user.username, result.data.data.token);
                  this.$message({
                    message: "登录成功",
                    type: "success"
                  });
                  this.$router.push("/home");
                  break;
                case -1:
                  this.$message({
                    message: "用户名或者密码错误",
                    type: "error"
                  });
                  break;
                default:
                  this.$message({
                    message: "登录失败",
                    type: "error"
                  });
                  break;
              }
            })
            .catch(err => {});
        } else {
          console.log("error submit");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  border-radius: 10px;
  margin: 300px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
.login-btn {
  margin-left: 120px;
}
</style>