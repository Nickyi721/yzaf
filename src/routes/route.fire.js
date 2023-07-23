import Welcome from '../views/Welcome/main.vue'

const FireControlInfoDeploy = () => import('../views/FireControl/FireControlInfoDeploy/main.vue')
const FireControlInfoQuery = () => import('../views/FireControl/FireControlInfoQuery/main.vue')
const FireControlInfoDetail = () => import('../views/FireControl/FireControlInfoDetail/main.vue')
const FireControlInfoList = () => import('../views/FireControl/FireControlInfoList/main.vue')
const FireControlInfoMx = () => import('../views/FireControl/FireControlInfoMx/main.vue')
const FireControlInfoMultipleCount = () => import('../views/FireControl/FireControlInfoMultipleCount/main.vue')

const FireControlRoomPerson = () => import('../views/FireControl/FireControlRoomPerson/main.vue')
const FireControlRoomPlan = () => import('../views/FireControl/FireControlRoomPlan/main.vue')

const FireControlCodeDeploy = () => import('../views/FireControl/FireControlCodeDeploy/main.vue')
const FireControlCodeQuery = () => import('../views/FireControl/FireControlCodeQuery/main.vue')
const FireControlCodeDeployAdd = () => import('../views/FireControl/FireControlCodeDeployAdd/main.vue')

const FireControlEquipDeploy = () => import('../views/FireControl/FireControlEquipDeploy/main.vue')
const FireControlEquipQuery = () => import('../views/FireControl/FireControlEquipQuery/main.vue')

const FireControlEquipDetail = () => import('../views/FireControl/FireControlEquipDetail/main.vue')
const FireControlEquipQueryDetail = () => import('../views/FireControl/FireControlEquipQueryDetail/main.vue')

const FireControlRoomPlanDetail = () => import('../views/FireControl/FireControlRoomPlanDetail/main.vue')

export default {
  path: '/firecontrol',
  component: Welcome,
  children: [
    // 消防信息管理
    {
      path: '/firecontrol/info',
      component: Welcome,
      children: [
        {
          path: '/firecontrol/info/deploy',
          component: FireControlInfoDeploy,
          meta: {
            title: '消防信息录入',
            isMenu: true,
            name: 'FireControlInfoDeploy'
          },
          children: [
            {
              path: '/firecontrol/info/detail',
              component: FireControlInfoDetail
            },
            {
              path: '/firecontrol/info/list',
              component: FireControlInfoList
            },
            {
              path: '/firecontrol/info/mx',
              component: FireControlInfoMx
            }
          ]
        },
        {
          path: '/firecontrol/info/query',
          component: FireControlInfoQuery,
          meta: {
            title: '消防信息查看',
            isMenu: true,
            name: 'FireControlInfoQuery'
          }
        },
        {
          path: '/firecontrol/info/multiple-count',
          component: FireControlInfoMultipleCount,
          meta: {
            title: '消防信息组合统计',
            isMenu: true,
            name: 'FireControlInfoMultipleCount'
          }
        }
      ]
    },
    // 消防控制室设置
    {
      path: '/firecontrol/room',
      component: Welcome,
      children: [
        {
          path: '/firecontrol/room/person',
          component: FireControlRoomPerson,
          meta: {
            title: '人员信息管理',
            isMenu: true,
            name: 'FireControlRoomPerson'
          }
          // children: [
          //   {
          //     path: '/firecontrol/info/deploy/detail',
          //     component: InfoNewsCheckDetail
          //   }
          // ]
        },
        {
          path: '/firecontrol/room/plan',
          component: FireControlRoomPlan,
          children: [
            {
              path: '/firecontrol/room/plan/detail',
              component: FireControlRoomPlanDetail
            }
          ],
          meta: {
            title: '人员排班信息',
            isMenu: true,
            name: 'FireControlRoomPlan'
          }
        }
      ]
    },
    // 二维码管理
    {
      path: '/firecontrol/code',
      component: Welcome,
      children: [
        {
          path: '/firecontrol/code/deploy',
          component: FireControlCodeDeploy,
          meta: {
            title: '二维码信息录入',
            isMenu: true,
            name: 'FireControlCodeDeploy'
          },
          name: 'fireControlCodeDeploy',
          children: [
            {
              path: '/firecontrol/code/deploy/add/:tnEwmid/:type',
              component: FireControlCodeDeployAdd,
              name: 'fireControlCodeDeployAdd'
            }
          ]
        },
        {
          path: '/firecontrol/code/query',
          component: FireControlCodeQuery,
          meta: {
            title: '二维码信息查看',
            isMenu: true,
            name: 'FireControlCodeQuery'
          }
        }
      ]
    },
    // 设备运行及故障
    {
      path: '/firecontrol/equip',
      component: Welcome,
      children: [
        {
          path: '/firecontrol/equip/deploy',
          component: FireControlEquipDeploy,
          meta: {
            title: '设备运行及故障录入',
            isMenu: true,
            name: 'FireControlEquipDeploy'
          }
          
          // children: [
          //   {
          //     path: '/firecontrol/info/deploy/detail',
          //     component: InfoNewsCheckDetail
          //   }
          // ]
        },
        {
          path: '/firecontrol/equip/detail',
            component: FireControlEquipDetail,
            meta: {
              title: '设备运行及故障录入详情',
              isMenu: true,
              name: 'FireControlEquipDetail'
            },
        },
        {
          path: '/firecontrol/equip/querydetail',
            component: FireControlEquipQueryDetail,
            meta: {
              title: '设备运行及故障查询详情',
              isMenu: true,
              name: 'FireControlEquipQueryDetail'
            },
        },
        {
          path: '/firecontrol/equip/query',
          component: FireControlEquipQuery,
          meta: {
            title: '设备运行及故障查看',
            isMenu: true,
            name: 'FireControlEquipQuery'
          }
        }
      ]
    }
  ]
}
