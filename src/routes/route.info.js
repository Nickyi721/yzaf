import Welcome from '../views/Welcome/main.vue'

const InfoNewsQuery = () => import('../views/Info/InfoNewsQuery/main.vue')
const InfoNewsQueryDetail = () => import('../views/Info/InfoNewsQueryDetail/main.vue')
const InfoNewsCheck = () => import('../views/Info/InfoNewsCheck/main.vue')
const InfoNewsCheckDetail = () => import('../views/Info/InfoNewsCheckDetail/main.vue')
const InfoNewsPublish = () => import('../views/Info/InfoNewsPublish/main.vue')
const InfoNewsPublishAdd = () => import('../views/Info/InfoNewsPublishAdd/main.vue')
const InfoNewsPublishDetail = () => import('../views/Info/InfoNewsPublishDetail/main.vue')
const InfoNewsPublishDetailView = () => import('../views/Info/InfoNewsPublishDetailView/main.vue')
const InfoNewsPublishDetailUser = () => import('../views/Info/InfoNewsPublishDetailUser/main.vue')
const InfoCaseQuery = () => import('../views/Info/InfoCaseQuery/main.vue')
const InfoCaseQueryDetail = () => import('../views/Info/InfoCaseQueryDetail/main.vue')
const InfoCaseCommit = () => import('../views/Info/InfoCaseCommit/main.vue')
const InfoCaseCommitDetail = () => import('../views/Info/InfoCaseCommitDetail/main.vue')
const InfoCaseCommitItem = () => import('../views/Info/InfoCaseCommitItem/main.vue')
const InfoCaseCommitEnd = () => import('../views/Info/InfoCaseCommitEnd/main.vue')
const InfoCaseCount = () => import('../views/Info/InfoCaseCount/main.vue')
const InfoCaseCountDetail = () => import('../views/Info/InfoCaseCountDetail/main.vue')
const InfoReportTaskQuery = () => import('../views/Info/InfoReportTaskQuery/main.vue')
const InfoReportTaskQueryDetail = () => import('../views/Info/InfoReportTaskQueryDetail/main.vue')
const InfoReportTaskQueryBaseForm = () => import('../views/Info/InfoReportTaskQueryBaseForm/main.vue')
const InfoReportTaskQueryBaseFormDetail = () => import('../views/Info/InfoReportTaskQueryBaseFormDetail/main.vue')
const InfoReportTaskPublish = () => import('../views/Info/InfoReportTaskPublish/main.vue')
const InfoReportTaskPublishPreview = () => import('../views/Info/InfoReportTaskPublishPreview/main.vue')
const InfoReportTaskPublishDetail = () => import('../views/Info/InfoReportTaskPublishDetail/main.vue')
const InfoReportQuery = () => import('../views/Info/InfoReportQuery/main.vue')
const InfoReportQueryBaseForm = () => import('../views/Info/InfoReportQueryBaseForm/main.vue')
const InfoReportQueryDetail = () => import('../views/Info/InfoReportQueryDetail/main.vue')
const InfoReportCustomize = () => import('../views/Info/InfoReportCustomize/main.vue')
const InfoReportCustomizeDetail = () => import('../views/Info/InfoReportCustomizeDetail/main.vue')
const InfoReportCustomizePreview = () => import('../views/Info/InfoReportCustomizePreview/main.vue')
const InfoReportCount = () => import('../views/Info/InfoReportCount/main.vue')
const InfoReportCountDetail = () => import('../views/Info/InfoReportCountDetail/main.vue')
const InfoReportCountDailyDetail = () => import('../views/Info/InfoReportCountDailyDetail/main.vue')

export default {
  path: '/info',
  component: Welcome,
  children: [
    {
      path: '/info/news',
      component: Welcome,
      children: [
        {
          path: '/info/news/query',
          component: InfoNewsQuery,
          meta: {
            title: '信息查询',
            isMenu: true,
            name: 'InfoNewsQuery'
          },
          children: [
            {
              path: '/info/news/query/detail/:tnXxid/:tnBlbz/:sffsdw',
              name: 'infoNewsQueryDetail',
              component: InfoNewsQueryDetail
            }
          ]
        },
        {
          path: '/info/news/check',
          component: InfoNewsCheck,
          meta: {
            title: '信息审批',
            isMenu: true,
            name: 'InfoNewsCheck'
          },
          children: [
            {
              path: '/info/news/check/detail',
              component: InfoNewsCheckDetail
            }
          ]
        },
        {
          path: '/info/news/publish',
          component: InfoNewsPublish,
          meta: {
            title: '发布信息',
            isMenu: true,
            name: 'InfoNewsPublish'
          },
          children: [
            {
              path: '/info/news/publish/add',
              component: InfoNewsPublishAdd
            },
            {
              path: '/info/news/publish/detail/:tnXxid/:sfdxx/:tcSpzt',
              name: 'infoNewsPublishDetail',
              component: InfoNewsPublishDetail
            },
            {
              path: '/info/news/publish/detail/view/:tnXxid/:sfdxx/:tcSpzt/:tnYxj/:whfNum/:yhfNum/:tcLx',
              name: 'infoNewsPublishDetailView',
              component: InfoNewsPublishDetailView
            },
            {
              path: '/info/news/publish/detail/user/:tnXxfsid/:tcDwdm/:tnXxid',
              name: 'infoNewsPublishDetailUser',
              component: InfoNewsPublishDetailUser
            }
          ]
        }
      ]
    },
    {
      path: '/info/case',
      component: Welcome,
      children: [
        {
          path: '/info/case/query',
          component: InfoCaseQuery,
          meta: {
            title: '上报信息查询',
            isMenu: true,
            name: 'InfoCaseQuery'
          },
          children: [
            {
              path: '/info/case/query/detail',
              component: InfoCaseQueryDetail
            }
          ]
        },
        {
          path: '/info/case/commit',
          component: InfoCaseCommit,
          meta: {
            title: '上报信息管理',
            isMenu: true,
            name: 'InfoCaseCommit'
          },
          children: [
            {
              path: '/info/case/commit/detail',
              component: InfoCaseCommitDetail
            },
            {
              path: '/info/case/commit/detail_update',
              component: InfoCaseCommitItem
            },
            {
              path: '/info/case/commit/end',
              component: InfoCaseCommitEnd
            }
          ]
        },
        {
          path: '/info/case/count',
          component: InfoCaseCount,
          meta: {
            title: '统计分析',
            isMenu: true,
            name: 'InfoCaseCount'
          },
          children: [
            {
              path: '/info/case/count/detail',
              component: InfoCaseCountDetail
            }
          ]
        }
      ]
    },
    {
      path: '/info/report',
      component: Welcome,
      children: [
        {
          path: '/info/report/task-query',
          component: InfoReportTaskQuery,
          meta: {
            title: '报表任务查询及填报',
            isMenu: true,
            name: 'InfoReportTaskQuery'
          },
          children: [
            {
              path: '/info/report/task-query/detail',
              component: InfoReportTaskQueryDetail
            },
            {
              path: '/info/report/task-query/base-form',
              component: InfoReportTaskQueryBaseForm
            },
            {
              path: '/info/report/task-query/base-form/detail',
              component: InfoReportTaskQueryBaseFormDetail
            }
          ]
        },
        {
          path: '/info/report/task-publish',
          component: InfoReportTaskPublish,
          meta: {
            title: '报表任务发布',
            isMenu: true,
            name: 'InfoReportTaskPublish'
          },
          children: [
            {
              path: '/info/report/task-publish/detail',
              component: InfoReportTaskPublishDetail
            },
            {
              path: '/info/report/task-publish/preview',
              component: InfoReportTaskPublishPreview
            },
          ]
        },
        {
          path: '/info/report/query',
          component: InfoReportQuery,
          meta: {
            title: '上报报表查询',
            isMenu: true,
            name: 'InfoReportQuery'
          },
          children: [
            {
              path: '/info/report/query/detail',
              component: InfoReportQueryDetail
            },
            {
              path: '/info/report/query/base-form',
              component: InfoReportQueryBaseForm
            }
          ]
        },
        {
          path: '/info/report/customize',
          component: InfoReportCustomize,
          meta: {
            title: '自定义报表',
            isMenu: true,
            name: 'InfoReportCustomize'
          },
          children: [
            {
              path: '/info/report/customize/detail',
              component: InfoReportCustomizeDetail
            },
            {
              path: '/info/report/customize/preview',
              component: InfoReportCustomizePreview
            }
          ]
        },
        {
          path: '/info/report/count',
          component: InfoReportCount,
          meta: {
            title: '统计报表',
            isMenu: true,
            name: 'InfoReportCount'
          },
          children: [
            {
              path: '/info/report/count/detail',
              component: InfoReportCountDetail
            },
            {
              path:'/info/report/count/dailyDetail',
              component: InfoReportCountDailyDetail,
            }
          ]
        },
      ]
    }
  ]
}