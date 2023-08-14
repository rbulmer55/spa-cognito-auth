import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {
  generatePKCETokens,
  getAccesstoken,
  getAuthorizationCode,
  getLogoutUrl
} from '../services/login-service'

import { useUserStore } from '../stores/user'

async function requireAuth(to: any, from: any, next: any) {
  const userStore = useUserStore()
  if (!userStore.loggedIn || !userStore.cognitoInfo.access_token) {
    userStore.setLoggedOut()
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  next()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      beforeEnter: requireAuth,
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter(to, from, next) {
        const userStore = useUserStore()
        // get PKCE challenge and verifier for SPA
        generatePKCETokens().then((res) => {
          userStore.setPKCETokens(res.code_challenge, res.code_verifier)
          // redirect to cognito authorise endpoint
          const url = getAuthorizationCode(userStore.pkceChallenge)
          window.location.href = `${url}`
        })
        next('/login')
      },
      component: HomeView
    },
    {
      path: '/login/oauth2/code/cognito',
      beforeEnter(to, from, next) {
        const userStore = useUserStore()

        // store authorisation code from caller
        if (!to.query.code?.toString()) {
          next('/login')
        }
        const code = to.query.code?.toString() || ''

        // call cognito to retieve users
        getAccesstoken(code, userStore.pkceVerifier).then((res) => {
          if (res) {
            userStore.setCognitoInfo(res.data)
          }
        })

        next('/')
      },
      component: HomeView
    },
    {
      path: '/logout',
      component: HomeView,
      beforeEnter(to, from, next) {
        const userStore = useUserStore()

        // clear user store
        userStore.setLoggedOut()

        //redirect to sign out of cognito
        const url = getLogoutUrl()
        window.location.href = `${url}`
        next('/logout')
      }
    }
  ]
})

export default router
