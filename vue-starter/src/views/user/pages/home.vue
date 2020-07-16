<template>
  <div>
    <Navcon />
    <h1 class="main">主页面</h1>
  </div>
</template>

<script>
import Navcon from "@/components/user/common/navcon";
export default {
  components: {
    Navcon
  }
};
</script>

<style scoped>
.main{
    margin-left: 50%;
    margin-top:400px;
}
</style>