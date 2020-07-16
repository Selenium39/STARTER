<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#334157"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <el-submenu index="2" class="choose">
        <template slot="title">
          <el-avatar>
            <div
              id="nameImage"
              style="margin:0 auto;position:relative;top:5%;font-size: 17px;"
            >{{username.slice(0,1).toUpperCase()}}</div>
          </el-avatar>
        </template>
        <el-menu-item @click="exit">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import { logoutUser } from "@/http/axios";
export default {
  name: "navcon",
  data() {
    return {
      collapsed: true,
      username: ""
    };
  },
  methods: {
    exit() {
      logoutUser();
      this.$router.push("/login");
    }
  },
  created() {
    this.username = window.sessionStorage.getItem("name");
  }
};
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.choose {
  float: right;
}
.buttonimg {
  background-color: transparent;
  border: none;
  line-height: 40px;
  color: white;
  font-size: 30px;
  text-align: center;
  margin-top: -5px;
  font-family: fantasy;
}
</style>