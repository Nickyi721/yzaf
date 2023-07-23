import Welcome from '../views/Welcome/main.vue'

const ChinapostWorkList = () => import('../views/Chinapost/ChinapostWorkList/main.vue')
const ChinapostWorkListDetail = () => import('../views/Chinapost/ChinapostWorkListDetail/main.vue')
const ChinapostWorkCheckin = () => import('../views/Chinapost/ChinapostWorkCheckin/main.vue')
const ChinapostWorkCheckinCommit = () => import('../views/Chinapost/ChinapostWorkCheckinCommit/main.vue')

const ChinapostSelfList = () => import('../views/Chinapost/ChinapostSelfList/main.vue')
const ChinapostSelfListDetail = () => import('../views/Chinapost/ChinapostSelfListDetail/main.vue')
const ChinapostSelfListInfo = () => import('../views/Chinapost/ChinapostSelfListInfo/main.vue')
const ChinapostSelfCheck = () => import('../views/Chinapost/ChinapostSelfCheck/main.vue')
const ChinapostSelfCheckDetail = () => import('../views/Chinapost/ChinapostSelfCheckDetail/main.vue')
const ChinapostSelfCheckInfo = () => import('../views/Chinapost/ChinapostSelfCheckInfo/main.vue')

const ChinapostGroupList = () => import('../views/Chinapost/ChinapostGroupList/main.vue')
const ChinapostGroupListDetail = () => import('../views/Chinapost/ChinapostGroupListDetail/main.vue')
const ChinapostGroupListInfo = () => import('../views/Chinapost/ChinapostGroupListInfo/main.vue')
const ChinapostGroupCount = () => import('../views/Chinapost/ChinapostGroupCount/main.vue')

export default {
  path: '/chinapost',
  component: Welcome,
  children: [
    {
      path: '/chinapost/work',
      component: Welcome,
      children: [
        {
          path: '/chinapost/work/list',
          component: ChinapostWorkList,
          meta: {
            title: '日常工作查询',
            isMenu: true,
            name: 'ChinapostWorkList'
          },
          children: [
            {
              path: '/chinapost/work/list/detail',
              component: ChinapostWorkListDetail
            }
          ]
        },
        {
          path: '/chinapost/work/checkin',
          component: ChinapostWorkCheckin,
          meta: {
            title: '日常工作登记',
            isMenu: true,
            name: 'ChinapostWorkCheckin'
          },
          children: [
            {
              path: '/chinapost/work/checkin/commit',
              component: ChinapostWorkCheckinCommit
            }
          ]
        }
      ]
    },
    {
      path: '/chinapost/self',
      component: Welcome,
      children: [
        {
          path: '/chinapost/self/list',
          component: ChinapostSelfList,
          meta: {
            title: '年终自评打分',
            isMenu: true,
            name: 'ChinapostSelfList'
          },
          children: [
            {
              path: '/chinapost/self/list/detail',
              component: ChinapostSelfListDetail
            },
            {
              path: '/chinapost/self/list/info',
              component: ChinapostSelfListInfo
            }
          ]
        },
        {
          path: '/chinapost/self/check',
          component: ChinapostSelfCheck,
          meta: {
            title: '年终自评审核',
            isMenu: true,
            name: 'ChinapostSelfCheck'
          },
          children: [
            {
              path: '/chinapost/self/check/detail',
              component: ChinapostSelfCheckDetail
            },
            {
              path: '/chinapost/self/check/info',
              component: ChinapostSelfCheckInfo
            }
          ]
        }
      ]
    },
    {
      path: '/chinapost/group',
      component: Welcome,
      children: [
        {
          path: '/chinapost/group/list',
          component: ChinapostGroupList,
          meta: {
            title: '集团考评查询',
            isMenu: true,
            name: 'ChinapostGroupList'
          },
          children: [
            {
              path: '/chinapost/group/list/detail',
              component: ChinapostGroupListDetail
            },
            {
              path: '/chinapost/group/list/info',
              component: ChinapostGroupListInfo
            }
          ]
        },
        {
          path: '/chinapost/group/count',
          component: ChinapostGroupCount,
          meta: {
            title: '集团考评统计',
            isMenu: true,
            name: 'ChinapostGroupCount'
          },
        }
      ]
    }
  ]
}
