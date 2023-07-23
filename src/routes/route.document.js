import Welcome from '../views/Welcome/main.vue'

const DocumentUpload = () => import('../views/Document/DocumentUpload/main.vue')
const DocumentDownload = () => import('../views/Document/DocumentDownload/main.vue')
const DocumentCheck = () => import('../views/Document/DocumentCheck/main.vue')

export default {
  path: '/document',
  component: Welcome,
  children: [
    // 资料上传
    {
      path: '/document/upload',
      component: DocumentUpload,
      meta: {
        title: '资料上传',
        isMenu: true,
        name: 'DocumentUpload'
      },
    },
    // 资料下载
    {
      path: '/document/download',
      component: DocumentDownload,
      meta: {
        title: '资料下载',
        isMenu: true,
        name: 'DocumentDownload'
      },
    },
    {
      path: '/document/check',
      component: DocumentCheck,
      meta: {
        title: '资料审批',
        isMenu: true,
        name: 'DocumentCheck'
      },
    },
  ]
}
