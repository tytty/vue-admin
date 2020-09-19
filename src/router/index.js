import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/components/Login.vue'
// import Home from '@/components/Home.vue'
// import Welcome from '@/views/Welcome.vue'
// import Users from '@/views/user/Users.vue'
// import Rights from '@/views/power/Rights.vue'
// import Roles from '@/views/power/Roles.vue'
// import Cate from '@/views/goods/Cate.vue'
// import Params from '@/views/goods/Params.vue'
// import List from '@/views/goods/List.vue'
// import Add from '@/views/goods/Add.vue'
// import Order from '@/views/order/Order.vue'
// import Reports from '@/views/report/Reports.vue'
const Login = () => import(/* webpackChunkName: "group-first" */ '@/components/Login.vue')
const Home = () => import(/* webpackChunkName: "group-first" */ '@/components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "group-first" */ '@/views/Welcome.vue')
const Users = () => import(/* webpackChunkName: "group-second" */ '@/views/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "group-second" */ '@/views/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "group-second" */ '@/views/power/Roles.vue')
const Cate = () => import(/* webpackChunkName: "group-third" */ '@/views/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "group-third" */ '@/views/goods/Params.vue')
const List = () => import(/* webpackChunkName: "group-fourth" */ '@/views/goods/List.vue')
const Add = () => import(/* webpackChunkName: "group-fourth" */ '@/views/goods/Add.vue')
const Order = () => import(/* webpackChunkName: "group-fifth" */ '@/views/order/Order.vue')
const Reports = () => import(/* webpackChunkName: "group-fifth" */ '@/views/report/Reports.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        redirect: 'welcome'
      },
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
