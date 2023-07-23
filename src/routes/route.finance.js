import Welcome from '../views/Welcome/main.vue'

const FinanceEquipTotal = () => import('../views/Finance/FinanceEquipTotal/main.vue')
const FinanceEquipList = () => import('../views/Finance/FinanceEquipList/main.vue')
const FinanceEquipDetail = () => import('../views/Finance/FinanceEquipDetail/main.vue')
const FinanceEquipScore = () => import('../views/Finance/FinanceEquipScore/main.vue')
const FinanceEquipCount = () => import('../views/Finance/FinanceEquipCount/main.vue')
const FinanceEvalCommit = () => import('../views/Finance/FinanceEvalCommit/main.vue')
const FinanceEvalCommitType = () => import('../views/Finance/FinanceEvalCommitType/main.vue')
const FinanceEvalForm = () => import('../views/Finance/FinanceEvalForm/main.vue')
const FinanceEvalDetail = () => import('../views/Finance/FinanceEvalDetail/main.vue')
const FinanceEvalCheck = () => import('../views/Finance/FinanceEvalCheck/main.vue')
const FinanceEvalCheckDetail = () => import('../views/Finance/FinanceEvalCheckDetail/main.vue')
const FinanceEvalCheckSheet = () => import('../views/Finance/FinanceEvalCheckSheet/main.vue')
const FinanceEvalQuery = () => import('../views/Finance/FinanceEvalQuery/main.vue')
const FinanceEvalQueryDetail = () => import('../views/Finance/FinanceEvalQueryDetail/main.vue')
const FinanceEvalQuerySheet = () => import('../views/Finance/FinanceEvalQuerySheet/main.vue')
const FinanceEvalCount = () => import('../views/Finance/FinanceEvalCount/main.vue')
const FinanceEvalMultipleCount = () => import('../views/Finance/FinanceEvalMultipleCount/main.vue')

const FinanceEquipAllCount = () => import('../views/Finance/FinanceEquipAllCount/main.vue')
const FinanceEquipCheckCount = () => import('../views/Finance/FinanceEquipCheckCount/main.vue')

const FinanceDailySafety = () => import('../views/Finance/FinanceDailySafety/main.vue')
// const FinanceDailySafetyAdd = () => import('../views/Finance/FinanceDailySafetyAdd/main.vue')
const FinanceDailySafetyDetail = () => import('../views/Finance/FinanceDailySafetyDetail/main.vue')
const FinanceDailyTrain = () => import('../views/Finance/FinanceDailyTrain/main.vue')
const FinanceDailyTrainDetail = () => import('../views/Finance/FinanceDailyTrainDetail/main.vue')
const FinanceDailyTrainList = () => import('../views/Finance/FinanceDailyTrainList/main.vue')
const FinanceDevicerrorReport = () => import('../views/Finance/FinanceDevicerrorReport/main.vue')
const FinanceDevicerrorDetail = () => import('../views/Finance/FinanceDevicerrorDetail/main.vue')

const FinanceDevicerrorAdd = () => import('../views/Finance/FinanceDevicerrorAdd/main.vue')
const FinanceDailyCount = () => import('../views/Finance/FinanceDailyCount/main.vue')
const FinanceDailyTrainCount = () => import('../views/Finance/FinanceDailyTrainCount/main.vue')
const FinanceDevicerrorCount = () => import('../views/Finance/FinanceDevicerrorCount/main.vue')
export default {
  path: '/finance',
  component: Welcome,
  children: [
    // 金融安防设施管理
    {
      path: '/finance/equip',
      component: Welcome,
      children: [
        {
          path: '/finance/equip/total',
          component: FinanceEquipTotal,
          meta: {
            title: '金融安防设施信息',
            isMenu: true,
            name: 'FinanceEquipTotal'
          }
        },
        {
          path: '/finance/equip/list',
          component: FinanceEquipList
        },
        {
          path: '/finance/equip/detail',
          component: FinanceEquipDetail
        },
        {
          path: '/finance/equip/score',
          component: FinanceEquipScore,
          meta: {
            title: '安防设施分类统计',
            isMenu: true,
            name: 'FinanceEquipScore'
          }
        },
        {
          path: '/finance/equip/count',
          component: FinanceEquipCount,
          meta: {
            title: '安防设施信息统计',
            isMenu: true,
            name: 'FinanceEquipCount'
          }
        },
        {
          path: '/finance/equip/checkcount',
          component: FinanceEquipCheckCount,
          meta: {
            title: '安全检查统计',
            isMenu: true,
            name: 'FinanceEquipCheckCount'
          }
        },
        {
          path: '/finance/equip/allcount',
          component: FinanceEquipAllCount,
          meta: {
            title: '安防设施汇总统计',
            isMenu: true,
            name: 'FinanceEquipAllCount'
          }
        }
      ]
    },
    // 金融安全评估
    {
      path: '/finance/eval',
      component: Welcome,
      children: [
        {
          path: '/finance/eval/commit',
          component: FinanceEvalCommit,
          meta: {
            title: '安全评估',
            isMenu: true,
            name: 'FinanceEvalCommit'
          },
          children: [
            {
              path: '/finance/eval/commit/type',
              component: FinanceEvalCommitType
            }
          ]
        },
        {
          path: '/finance/eval/form',
          component: FinanceEvalForm
        },
        {
          path: '/finance/eval/detail',
          component: FinanceEvalDetail
        },
        {
          path: '/finance/eval/check',
          component: FinanceEvalCheck,
          meta: {
            title: '安全评估审核',
            isMenu: true,
            name: 'FinanceEvalCheck'
          },
          children: [
            {
              path: '/finance/eval/check/detail',
              component: FinanceEvalCheckDetail
            },
            {
              path: '/finance/eval/check/sheet',
              component: FinanceEvalCheckSheet
            }
          ]
        },
        {
          path: '/finance/eval/query',
          component: FinanceEvalQuery,
          meta: {
            title: '安全评估查询',
            isMenu: true,
            name: 'FinanceEvalQuery'
          },
          children: [
            {
              path: '/finance/eval/query/detail',
              component: FinanceEvalQueryDetail
            },
            {
              path: '/finance/eval/query/sheet',
              component: FinanceEvalQuerySheet
            }
          ]
        },
        {
          path: '/finance/eval/count',
          component: FinanceEvalCount,
          meta: {
            title: '安全评估统计',
            isMenu: true,
            name: 'FinanceEvalCount'
          }
        },
        {
          path: '/finance/eval/multiple-count',
          component: FinanceEvalMultipleCount,
          meta: {
            title: '安全评估组合统计',
            isMenu: true,
            name: 'FinanceEvalMultipleCount'
          }
        }
      ]
    },
    // 金融日常管理
    {
      path: '/finance/daily',
      component: Welcome,
      children: [
        {
          path: '/finance/daily/safety',
          component: FinanceDailySafety,
          meta: {
            title: '日常安全管理',
            isMenu: true,
            name: 'FinanceDailySafety'
          },
          children: [
            // {
            //   path: '/finance/daily/safety/add',
            //   component: FinanceDailySafetyAdd
            // },
            {
              path: '/finance/daily/safety/detail',
              component: FinanceDailySafetyDetail
            }
          ]
        },
        {
          path: '/finance/daily/count',
          component: FinanceDailyCount,
          meta: {
            title: '日常管理统计',
            isMenu: true,
            name: 'FinanceDailyCount'
          },
        },
        {
          path: '/finance/daily/train',
          component: FinanceDailyTrain,
          meta: {
            title: '教育培训及演练',
            isMenu: true,
            name: 'FinanceDailyTrain'
          },
          children: [
            {
              path: '/finance/daily/train/detail',
              component: FinanceDailyTrainDetail
            },
            {
              path: '/finance/daily/train/list',
              component: FinanceDailyTrainList
            }
          ]
        },
        {
          path: '/finance/dail/train-count',
          component: FinanceDailyTrainCount,
          meta: {
            title: '培训及演练统计',
            isMenu: true,
            name: 'FinanceDailyTrainCount'
          },
        },
      ]
    },
    // 设施故障报送
    {
      path: '/finance/devicerror',
      component: Welcome,
      children: [
        {
          path: '/finance/devicerror/report',
          component: FinanceDevicerrorReport,
          meta: {
            title: '上报故障信息',
            isMenu: true,
            name: 'FinanceDevicerrorReport'
          },
          children: []
        },
        {
          path: '/finance/devicerror/detail',
          component: FinanceDevicerrorDetail,
          meta: {
            title: '故障上报详情',
            isMenu: true,
            name: 'FinanceDevicerrorDetail'
          },
          children: []
        },
        {
          path: '/finance/devicerror/add',
          component: FinanceDevicerrorAdd,
          meta: {
            title: '故障上报',
            isMenu: true,
            name: 'FinanceDevicerrorAdd'
          },
          children: []
        },
        {
          path: '/finance/devicerror/count',
          component: FinanceDevicerrorCount,
          meta: {
            title: '故障报送统计',
            isMenu: true,
            name: 'FinanceDevicerrorCount'
          },
          children: []
        }
      ]
    }
  ]
}
