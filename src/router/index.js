import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: () => import('../views/ArticleView.vue'),
    props: true
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: () => import('../views/admin/LoginView.vue')
  },
  {
    path: '/admin/dashboard',
    component: () => import('../views/admin/DashboardView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('../views/admin/HomeView.vue')
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('../views/admin/ProfileView.vue')
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: () => import('../views/admin/ArticlesView.vue')
      },
      {
        path: 'articles/edit/:id',
        name: 'AdminArticleEdit',
        component: () => import('../views/admin/ArticleEditView.vue'),
        props: true
      },
      {
        path: 'articles/new',
        name: 'AdminArticleNew',
        component: () => import('../views/admin/ArticleEditView.vue')
      },
      {
        path: 'comments',
        name: 'AdminComments',
        component: () => import('../views/admin/CommentsView.vue')
      }
    ]
  },
  {
    path: '/admin/profile',
    redirect: '/admin/dashboard/profile'
  },
  {
    path: '/admin/articles',
    redirect: '/admin/dashboard/articles'
  },
  {
    path: '/admin/comments',
    redirect: '/admin/dashboard/comments'
  },
  {
    path: '/admin/articles/edit/:id',
    redirect: to => {
      return { path: `/admin/dashboard/articles/edit/${to.params.id}` }
    }
  },
  {
    path: '/admin/articles/new',
    redirect: '/admin/dashboard/articles/new'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫，检查管理员登录状态
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查是否已登录
    if (!localStorage.getItem('admin_logged_in')) {
      next({
        path: '/admin',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 