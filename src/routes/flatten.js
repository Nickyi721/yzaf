import HeaderAsideLayout from '../layouts/HeaderAsideLayout/main.vue'

const routes = []
const flatten = (config = []) => {
  config.forEach((item) => {
    const route = {
      path: item.path,
      component: item.layout || HeaderAsideLayout,
      children: [
        {
          path: '',
          name: item.name,
          component: item.component,
          redirect: item.redirect,
          meta: item.meta
        }
      ]
    }
    if (Array.isArray(item.children)) {
      flatten(item.children)
    }
    routes.push(route)
  })
  return routes
}

export default flatten
