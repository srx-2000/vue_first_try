// 路由器模块
import Vue from 'vue'
import VueRouter from 'vue-router'
import todoForm from "../pages/todoForm";
import search from "../pages/search";
Vue.use(VueRouter)
export default new VueRouter({
  routes:[
    {
      path:'/todo',
      component:todoForm
    },
    {
      path:'/search',
      component:search
    },
    {
      path:'/',
      redirect:"/todoForm"
    }
  ]
})
