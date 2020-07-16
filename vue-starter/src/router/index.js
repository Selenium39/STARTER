import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/user/pages/login'
import Home from '@/views/user/pages/home'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '首页',
      redirect: '/login',
    }, {
      path: '/login',
      name: '登录',
      component: Login
    }, {
      path: '/home',
      name: '主页',
      component: Home,
      meta: {
        isLogin: true
      }
    }
  ]
})

//路由前置处理:未登录用户访问登录后页面跳转登录页面
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.isLogin)) { //判断是否需要登录
    if (window.sessionStorage.getItem("token")) {
      next();
    } else {
      if (to.path.includes('admin')) {
        next('/admin/login') //跳转后台登录页面
      } else {
        next('/login') //跳转前台登录页面
      }
    }
  } else {
    next()
  }
});

export default router;