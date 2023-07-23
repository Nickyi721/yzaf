import Welcome from '../views/Welcome/main.vue'

const DataDict = () => import('../views/Data/DataDict/main.vue')
const DataOrg = () => import('../views/Data/DataOrg/main.vue')
const DataFnOrg = () => import('../views/Data/DataFnOrg/main.vue')
const DataOrgDetail = () => import('../views/Data/DataOrgDetail/main.vue')
const DataFinanceItem = () => import('../views/Data/DataFinanceItem/main.vue')
const DataFinanceInfo = () => import('../views/Data/DataFinanceInfo/main.vue')
const DataFinanceContent = () => import('../views/Data/DataFinanceContent/main.vue')
const DataFinanceLink = () => import('../views/Data/DataFinanceLink/main.vue')
const DataFinanceDaily = () => import('../views/Data/DataFinanceDaily/main.vue')
const DataSafeDanger = () => import('../views/Data/DataSafeDanger/main.vue')
const DataSafeDangerAdd = () => import('../views/Data/DataSafeDangerAdd/main.vue')
const DataSafeDangerDetail = () => import('../views/Data/DataSafeDangerDetail/main.vue')
const DataSafeForm = () => import('../views/Data/DataSafeForm/main.vue')
const DataSafeFormDetail = () => import('../views/Data/DataSafeFormDetail/main.vue')
const DataRisk = () => import('../views/Data/DataRisk/main.vue')

const DataFireInfo = () => import('../views/Data/DataFireInfo/main.vue')
const DataFireEquip = () => import('../views/Data/DataFireEquip/main.vue')
const DataFireLinkDetail = () => import('../views/Data/DataFireLinkDetail/main.vue')
const DataFireLink= () => import('../views/Data/DataFireLink/main.vue')
const DataFireInfoLink= () => import('../views/Data/DataFireInfoLink/main.vue')

const DataSafeProduce= () => import('../views/Data/DataSafeProduce/main.vue')
const DataSafeProduceDetail= () => import('../views/Data/DataSafeProduceDetail/main.vue')

export default {
  path: '/data',
  component: Welcome,
  children: [
    // 数据字典
    {
      path: '/data/dict',
      component: DataDict,
      meta: {
        title: '数据字典',
        isMenu: true,
        name: 'DataDict'
      },
    },
    // 单位基础数据
    {
      path: '/data/org',
      component: DataOrg,
      meta: {
        title: '单位基础数据',
        isMenu: true,
        name: 'DataOrg'
      },
      children: [
        // 单位信息详情
        {
          path: '/data/org/detail',
          component: DataOrgDetail
        }
      ]
    },
    // 业务功能机构树管理
    {
      path: '/data/fn-org',
      component: DataFnOrg,
      meta: {
        title: '业务功能机构数管理',
        isMenu: true,
        name: 'DataFnOrg'
      },
    },
    // 金融安全设置
    {
      path: '/data/finance',
      component: Welcome,
      children: [
        // 安防设施信息项设置
        {
          path: '/data/finance/item',
          component: DataFinanceItem,
          meta: {
            title: '安防设施信息设置',
            isMenu: true,
            name: 'DataFinanceItem'
          },
        },
        // 安全评估基础信息项设置
        {
          path: '/data/finance/info',
          component: DataFinanceInfo,
          meta: {
            title: '安全评估信息设置',
            isMenu: true,
            name: 'DataFinanceInfo'
          },
        },
        // 安全评估内容项设置
        {
          path: '/data/finance/content',
          component: DataFinanceContent,
          meta: {
            title: '安全评估内容设置',
            isMenu: true,
            name: 'DataFinanceContent'
          },
        },
        // 设施与评估关联设置
        {
          path: '/data/finance/link',
          component: DataFinanceLink,
          meta: {
            title: '设施与评估关联设置',
            isMenu: true,
            name: 'DataFinanceLink'
          },
        },
        // 日常安全管理设置
        {
          path: '/data/finance/daily',
          component: DataFinanceDaily,
          meta: {
            title: '日常安全管理设置',
            isMenu: true,
            name: 'DataFinanceDaily'
          }
        }
      ]
    },
    // 安全检查设置
    {
      path: '/data/safe',
      component: Welcome,
      children: [
        //  隐患词条
        {
          path: '/data/safe/danger',
          component: DataSafeDanger,
          meta: {
            title: '隐患词条',
            isMenu: true,
            name: 'DataSafeDanger'
          },
          children: [
            // 新增隐患词条
            {
              path: '/data/safe/danger/add',
              component: DataSafeDangerAdd
            },
            // 隐患词条详情
            {
              path: '/data/safe/danger/detail',
              component: DataSafeDangerDetail
            },
          ]
        },
        // 安全检查表
        {
          path: '/data/safe/form',
          component: DataSafeForm,
          meta: {
            title: '安全检查表',
            isMenu: true,
            name: 'DataSafeForm'
          },
          children: [
            // 安全检查表详情
            {
              path: '/data/safe/form/detail',
              component: DataSafeFormDetail
            },
          ]
        }
      ]
    },
    // 风险管控设置
    {
      path: '/data/risk',
      component: DataRisk
    },
    // 消防管理设置
    {
      path: '/data/fire',
      component: Welcome,
      children: [
        // 消防信息配置
        {
          path: '/data/fire/info',
          component: DataFireInfo,
          meta: {
            title: '消防信息配置',
            isMenu: true,
            name: 'DataFireInfo'
          },
        },
        // 设备及故障信息配置
        {
          path: '/data/fire/equip',
          component: DataFireEquip,
          meta: {
            title: '设备及故障信息配置',
            isMenu: true,
            name: 'DataFireEquip'
          },
        },
        // 设备及故障信息关联设置
        {
          path: '/data/fire/linkdetail',
          component: DataFireLinkDetail,
          name: 'DataFireLinkDetail'
        },
         // 设备及故障信息关联设置
         {
          path: '/data/fire/link',
          component: DataFireLink,
          meta: {
            title: '设备及故障信息关联设置',
            isMenu: true,
            name: 'DataFireLink'
          },
        },
        // 功能检查关联设置
        {
          path: '/data/fire/infolink',
          component: DataFireInfoLink,
          meta: {
            title: '功能检查关联设置',
            isMenu: true,
            name: 'DataFireLink'
          },
        },
      ]
    },
    // 安全生产设置
    {
      path: '/data/safe-prod',
      component: DataSafeProduce,
      meta: {
        title: '安全生产配置',
        isMenu: true,
        name: 'DataSafeProduce'
      },
      children: [
        {
          path: '/data/safe-prod/detail',
          component: DataSafeProduceDetail,
        }
      ]
    },
  ]
}
