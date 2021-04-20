import Vue from 'vue'
import Router from 'vue-router'
import huya from '../pages/huya'
import index from '../pages/index'
import login from '../pages/login'
import loginBefore from '../pages/loginBefore'
import ksList from '../pages/ksList'
import stentil from '../pages/stentil'
// 用户
import memberList from '../pages/memberList'
import memberEdit from '../pages/memberEdit'
// 病历
import medEdit from '../pages/medEdit'
import medList from '../pages/medList'
// 医院
import hospitalList from '../pages/hospital/hospitalList.vue'
import hospitalEdit from '../pages/hospital/hospitalEdit.vue'
// 患者
import patientIndex from '../pages/patient/patientIndex.vue'
import register from '../pages/patient/register.vue'
import hospitalDetail from '../pages/patient/hospitalDetail.vue'
import patientMsg from '../pages/patient/patientMsg.vue'

import test from '../pages/test.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'nav1',
      component: index,
      children: [
        {
          path: '/huya',
          name: 'huya',
          component: huya
        },
        {
          path: '/ksList',
          name: 'ksList',
          component: ksList
        },
        {
          path: '/medEdit',
          name: 'medEdit',
          component: medEdit
        },
        {
          path: '/medList',
          name: 'medList',
          component: medList
        },
        {
          path: '/memberList',
          name: 'memberList',
          component: memberList
        },
        {
          path: '/memberEdit',
          name: 'memberEdit',
          component: memberEdit
        },
        {
          path: '/stentil',
          name: 'stentil',
          component: stentil
        }
      ]
    },
    {
      path: '/hospital',
      name: 'hospital',
      component: index,
      children: [
        {
          path: 'hospitalEdit',
          name: 'hospitalEdit',
          component: hospitalEdit
        },
        {
          path: 'hospitalList',
          name: 'hospitalList',
          component: hospitalList
        }
      ]
    },
    {
      path: '/patient',
      name: 'patient',
      component: patientIndex,
      children: [
        {
          path: 'register',
          name: 'register',
          component: register
        },
        {
          path: 'hospitalDetail',
          name: 'hospitalDetail',
          component: hospitalDetail
        },
        {
          path: 'patientMsg',
          name: 'patientMsg',
          component: patientMsg
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/loginBefore',
      name: 'loginBefore',
      component: loginBefore
    }
  ]
})
