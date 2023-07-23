import Welcome from '../views/Welcome/main.vue'

const SystemGroup = () => import('../views/System/SystemGroup/main.vue')
const SystemGroupDetail = () => import('../views/System/SystemGroupDetail/main.vue')
const SystemUser = () => import('../views/System/SystemUser/main.vue')
const SystemUserDetail = () => import('../views/System/SystemUserDetail/main.vue')
const SystemRole = () => import('../views/System/SystemRole/main.vue')
const SystemRoleAdd = () => import('../views/System/SystemRoleAdd/main.vue')
const SystemRoleDetail = () => import('../views/System/SystemRoleDetail/main.vue')
const SystemInfoGroup = () => import('../views/System/SystemInfoGroup/main.vue')
const SystemInfoGroupAdd = () => import('../views/System/SystemInfoGroupAdd/main.vue')
const SystemInfoGroupDetail = () => import('../views/System/SystemInfoGroupDetail/main.vue')
const SystemFinanceTime = () => import('../views/System/SystemFinanceTime/main.vue')

const SystemLog = () => import('../views/System/SystemLog/main.vue')
const SystemLogDetail = () => import('../views/System/SystemLogDetail/main.vue')
const SystemLogSjscdetail = () => import('../views/System/SystemLogSjscdetail/main.vue')
const SystemLogFwqyxdetail = () => import('../views/System/SystemLogFwqyxdetail/main.vue')
const SystemDailyTime = () => import('../views/System/SystemDailyTime/main.vue')

export default {
  path: '/system',
  component: Welcome,
  children: [
    // 工作组管理
    {
      path: '/system/group',
      component: SystemGroup,
      meta: {
        title: '工作组管理',
        isMenu: true,
        name: 'SystemGroup'
      },
      children: [
        // 工作组详情
        {
          path: '/system/group/detail',
          component: SystemGroupDetail
        },
      ]
    },
    {
      path: '/system/user',
      component: SystemUser,
      meta: {
        title: '用户管理',
        isMenu: true,
        name: 'SystemUser'
      },
      children: [
        {
          path: '/system/user/detail',
          component: SystemUserDetail
        },
      ]
    },
    {
      path: '/system/role',
      component: SystemRole,
      meta: {
        title: '角色管理',
        isMenu: true,
        name: 'SystemRole'
      },
      children: [
        {
          path: '/system/role/add',
          component: SystemRoleAdd
        },
        {
          path: '/system/role/detail',
          component: SystemRoleDetail
        },
      ]
    },
    {
      path: '/system/info-group',
      component: SystemInfoGroup,
      meta: {
        title: '群组管理',
        isMenu: true,
        name: 'SystemInfoGroup'
      },
      children: [
        {
          path: '/system/info-group/add',
          component: SystemInfoGroupAdd,
        },
        {
          path: '/system/info-group/detail',
          component: SystemInfoGroupDetail,
        },
      ]
    },
    {
      path: '/system/finance-time',
      component: SystemFinanceTime,
      meta: {
        title: '金融安全评估时间设置',
        isMenu: true,
        name: 'SystemFinanceTime'
      },
    },
    {
      path: '/system/log',
      component: SystemLog,
      meta: {
        title: '日志管理',
        isMenu: true,
        name: 'SystemLog'
      },
      children: [
        {
          path: '/system/log/detail',
          component: SystemLogDetail
        },
        {
          path: '/system/log/sjscdetail',
          component: SystemLogSjscdetail
        },
        {
          path: '/system/log/fwqyxdetail',
          component: SystemLogFwqyxdetail
        }
      ]
    },
    {
      path: '/system/daily-time',
      component: SystemDailyTime,
      meta: {
        title: '日常安全管理时间设置',
        isMenu: true,
        name: 'SystemDailyTime'
      }
    }
  ]
}
