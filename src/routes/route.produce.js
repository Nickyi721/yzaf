import Welcome from '../views/Welcome/main.vue'
import ProduceDeviceManage from '../views/Produce/DeviceManage/main.vue'
import ProduceDeviceManageDetail from '../views/Produce/DeviceManageDetail/main.vue'
import ProduceCaseManage from '../views/Produce/CaseManage/main.vue'
import ProduceCaseManageDetail from '../views/Produce/CaseManageDetail/main.vue'
import ProduceDeviceCount from '../views/Produce/ProduceDeviceCount/main.vue'

export default {
  path: '/produce',
  component: Welcome,
  children: [
    {
      path: '/produce/device/manage',
      component: ProduceDeviceManage,
      meta: {
        title: '安全生产设备',
        isMenu: true,
        name: 'ProduceDeviceManage'
      },
      children: [
        {
          path: '/produce/device/manage/detail',
          component: ProduceDeviceManageDetail,
        },
      ]
    },
    {
      path: '/produce/case/manage',
      component: ProduceCaseManage,
      meta: {
        title: '安全生产事故管理',
        isMenu: true,
        name: 'ProduceCaseManage'
      },
      children: [
        {
          path: '/produce/case/manage/detail',
          component: ProduceCaseManageDetail,
        },
      ]
    },
    {
      path: '/produce/device/count',
      component: ProduceDeviceCount,
      meta: {
        title: '安全生产设备统计',
        isMenu: true,
        name: 'ProduceDeviceCount'
      },
    }
  ]
}
