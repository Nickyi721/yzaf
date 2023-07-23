import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ElCalendar from '../components/calendar'

Vue.use(ElementUI)
Vue.use(ElCalendar)

const components = [
    // 功能组件
    'CommonOrgTree',
    'CommonOrgSelect',
    'CommonMultiSelect',
    'CommonFileDownload',
    'CommonFileUpload',
    // UI组件
    'CustomIcon',
    'CustomButton',
    'CustomDialog',
    'CustomPage',
    'CustomView',
    'CustomTitle',
    'CustomControlBar',
    'CustomToolbar'
]

components.forEach(name => {
    const component = require(`@components/${name}/main.vue`).default
    Vue.component(component.name, component)
})