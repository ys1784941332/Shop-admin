import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('components/Login')
const Home = () => import('components/Home')
const Welcome = () => import('components/Welcome')
const Users = () => import('components/user/Users')
const Rights = () => import('components/power/Rights')
const Roles = () => import('components/power/Roles')
const Cate = () => import('components/goods/Cate')
const Params = () => import('components/goods/Params')
const GoodsList = () => import('components/goods/List')
const Add = () => import('components/goods/Add')
const Order = () => import('components/order/Order')
const Report = () => import('components/report/Report')

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '',
      redirect: '/login' // 重定向到 登录页面
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome', // 重定向到 welcome 子页面
      children: [{
        path: '/welcome',
        component: Welcome
      }, {
        path: '/users',
        component: Users
      }, {
        path: '/rights',
        component: Rights
      }, {
        path: '/roles',
        component: Roles
      }, {
        path: '/categories',
        component: Cate
      }, {
        path: '/params',
        component: Params
      }, {
        path: '/goods',
        component: GoodsList
      }, {
        path: '/goods/add',
        component: Add
      }, {
        path: '/orders',
        component: Order
      }, {
        path: '/reports',
        component: Report
      }]
    },
  ],
  mode: 'history'
})

// 挂载 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径   from 从哪个路径跳转来   next 是一个函数，表示放行
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
