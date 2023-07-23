import Welcome from '../views/Welcome/main.vue'

const GuardOrg = () => import('../views/Guard/GuardOrg/main.vue')
const GuardOrgAdd = () => import('../views/Guard/GuardOrgAdd/main.vue')
const GuardOrgDetail = () => import('../views/Guard/GuardOrgDetail/main.vue')
const GuardPerson = () => import('../views/Guard/GuardPerson/main.vue')
const GuardPersonManager = () => import('../views/Guard/GuardPersonManager/main.vue')
const GuardPersonManagerAdd = () => import('../views/Guard/GuardPersonManagerAdd/main.vue')
// const GuardPersonManagerDetail = () => import('../views/Guard/GuardPersonManagerDetail/main.vue')
const GuardPersonWorker = () => import('../views/Guard/GuardPersonWorker/main.vue')
const GuardPersonWorkerAdd = () => import('../views/Guard/GuardPersonWorkerAdd/main.vue')
// const GuardPersonWorkerDetail = () => import('../views/Guard/GuardPersonWorkerDetail/main.vue')
const GuardCount = () => import('../views/Guard/GuardCount/main.vue')
const GuardDepAndMemCount = () => import('../views/Guard/GuardDepAndMemCount/main.vue')

export default {
  path: '/guard',
  component: Welcome,
  children: [
    {
      path: '/guard/org',
      name: 'guardOrg',
      component: GuardOrg,
      meta: {
        title: '安全保卫机构管理',
        isMenu: true,
        name: 'GuardOrg'
      },
      children: [
        {
          path: '/guard/org/add',
          name: 'guardOrgAdd',
          component: GuardOrgAdd,
        },
        {
          path: '/guard/org/detail/:tnAbjgid/:dwbm',
          name: 'guardOrgDetail',
          component: GuardOrgDetail,
        },
      ]
    },
    {
      path: '/guard/person',
      name: 'guardPerson',
      component: GuardPerson,
      meta: {
        title: '安全保卫人员管理',
        isMenu: true,
        name: 'GuardPerson'
      },
      children: [
        {
          path: '/guard/person/manager/:id/:tcSsdwbm',
          name: 'guardPersonManager',
          component: GuardPersonManager,
          children: [
            {
              path: '/guard/person/manager/add/:tnAbjgid/:tnAbglryid/:type/:tcSsdwbm',
              name: 'guardPersonManagerAdd',
              component: GuardPersonManagerAdd,
            },
          ]
        },
        {
          path: '/guard/person/worker/:id/:tcSsdwbm',
          name: 'guardPersonWorker',
          component: GuardPersonWorker,
          children: [
            {
              path: '/guard/person/worker/add/:tnAbjgid/:tnAbgzryid/:type/:tcSsdwbm',
              name: 'guardPersonWorkerAdd',
              component: GuardPersonWorkerAdd,
            },
          ]
        },
      ]
    },
    {
      path: '/guard/count',
      name: 'guardCount',
      component: GuardCount,
      meta: {
        title: '安保机构信息统计',
        isMenu: true,
        name: 'GuardCount'
      },
    },
    {
      path: '/guard/depAndmemcount',
      name: 'guardDepAndMemCount',
      component: GuardDepAndMemCount,
      meta: {
        title: '安保部门设置及人员统计',
        isMenu: true,
        name: 'GuardDepAndMemCount'
      },
    }
  ]
}
