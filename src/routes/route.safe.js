import Welcome from '../views/Welcome/main.vue'

const SafeManagePublish = () => import('../views/Safe/SafeManagePublish/main.vue')
const SafeManagePublishDetail = () => import('../views/Safe/SafeManagePublishDetail/main.vue')
const SafeManageQuery = () => import('../views/Safe/SafeManageQuery/main.vue')
const SafeManageReportContent = () => import('../views/Safe/SafeManageReportContent/main.vue')
const SafeManageQueryDetail = () => import('../views/Safe/SafeManageQueryDetail/main.vue')
const SafeManageQueryForm = () => import('../views/Safe/SafeManageQueryForm/main.vue')
const SafeManageQueryFormDetail = () => import('../views/Safe/SafeManageQueryFormDetail/main.vue')
const SafeManageCheck = () =>import('../views/Safe/SafeManageCheck/main.vue')
const SafeManageCheckDetail = () =>import('../views/Safe/SafeManageCheckDetail/main.vue')

const SafeExecForm = () => import('../views/Safe/SafeExecForm/main.vue')
const SafeExecFormCommit = () => import('../views/Safe/SafeExecFormCommit/main.vue')
const SafeExecReport = () => import('../views/Safe/SafeExecReport/main.vue')
const SafeExecReportDetail = () => import('../views/Safe/SafeExecReportDetail/main.vue')
const SafeExecReportNew = () => import('../views/Safe/SafeExecReportNew/main.vue')
const SafeExecQuery = () => import('../views/Safe/SafeExecQuery/main.vue')
const SafeExecQueryDetail = () => import('../views/Safe/SafeExecQueryDetail/main.vue')
const SafeExecNotice = () => import('../views/Safe/SafeExecNotice/main.vue')
const SafeExecNoticeDetail = () => import('../views/Safe/SafeExecNoticeDetail/main.vue')
const SafeExecOffsite = () => import('../views/Safe/SafeExecOffsite/main.vue')
const SafeExecOffsiteDetail = () => import('../views/Safe/SafeExecOffsiteDetail/main.vue')

const SafeCount = () => import('../views/Safe/SafeCount/main.vue')
const SafeCountDetail = () => import('../views/Safe/SafeCountDetail/main.vue')
//const SafeCheckCount = () => import('../views/Safe/SafeCheckCount/main.vue')
//const SafeCheckCountDetail = () => import('../views/Safe/SafeCheckCountDetail/main.vue')


export default {
  path: '/safe',
  component: Welcome,
  children: [
    {
      path: '/safe/manage',
      component: Welcome,
      children: [
        {
          path: '/safe/manage/publish',
          component: SafeManagePublish,
          meta: {
            title: '安全检查计划发布',
            isMenu: true,
            name: 'SafeManagePublish'
          },
          children: [
            {
              path: '/safe/manage/publish/detail',
              component: SafeManagePublishDetail
            },
          ]
        },
        {
          path: '/safe/manage/query',
          component: SafeManageQuery,
          meta: {
            title: '安全检查结果查询',
            isMenu: true,
            name: 'SafeManageQuery'
          },
          children: [
            {
              path: '/safe/manage/query/detail',
              component: SafeManageQueryDetail
            },
            {
              path: '/safe/manage/query/form',
              component: SafeManageQueryForm,
              children: [
                {
                  path: '/safe/manage/query/form/detail',
                  component: SafeManageQueryFormDetail
                }
              ]
            },
            {
              path: '/safe/manage/report/content',
              component: SafeManageReportContent
            },
          ]
        },
        {
          path:'/safe/manage/check',
          component:SafeManageCheck,
          children: [
            {
              path:'/safe/manage/check/detail',
              component:SafeManageCheckDetail
            }
          ]
        }
      ]
    },
    {
      path: '/safe/exec',
      component: Welcome,
      children: [
        {
          path: '/safe/exec/form',
          component: SafeExecForm,
          meta: {
            title: '安全表录入',
            isMenu: true,
            name: 'SafeExecForm'
          },
          children: [
            {
              path: '/safe/exec/form/commit',
              component: SafeExecFormCommit
            }
          ]
        },
        {
          path: '/safe/exec/report',
          component: SafeExecReport,
          meta: {
            title: '安全报告生成',
            isMenu: true,
            name: 'SafeExecReport'
          },
          children: [
            {
              path: '/safe/exec/report/detail',
              component: SafeExecReportDetail
            },
            {
              path: '/safe/exec/report/new',
              component: SafeExecReportNew
            }
          ]
        },
        {
          path: '/safe/exec/query',
          component: SafeExecQuery,
          meta: {
            title: '安全检查报告查询',
            isMenu: true,
            name: 'SafeExecQuery'
          },
          children: [
            {
              path: '/safe/exec/query/detail',
              component: SafeExecQueryDetail
            }
          ]
        },
        {
          path: '/safe/exec/notice',
          component: SafeExecNotice,
          meta: {
            title: '隐患整改通知',
            isMenu: true,
            name: 'SafeExecNotice'
          },
          children: [
            {
              path: '/safe/exec/notice/detail',
              component: SafeExecNoticeDetail
            }
          ]
        },
        {
          path: '/safe/exec/off-site',
          component: SafeExecOffsite,
          meta: {
            title: '非现场检查结果查询',
            isMenu: true,
            name: 'SafeExecOffsite'
          },
          children: [
            {
              path: '/safe/exec/off-site/detail',
              component: SafeExecOffsiteDetail
            }
          ]
        },
      ]
    },
    {
      path: '/safe/count',
      component: SafeCount,
      meta: {
        title: '安全检查隐患统计',
        isMenu: true,
        name: 'SafeCount'
      },
      children: [
        {
          path: '/safe/count/detail',
          component: SafeCountDetail,
        }
      ]
    }
    // {
    //   path: '/safe/checkcount',
    //   component: SafeCheckCount,
    //   meta: {
    //     title: '安全检查统计',
    //     isMenu: true,
    //     name: 'SafeCheckCount'
    //   },
    //   children: [
    //     {
    //       path: '/safe/checkcount/detail',
    //       component: SafeCheckCountDetail,
    //     }
    //   ]
    // }
  ]
}
