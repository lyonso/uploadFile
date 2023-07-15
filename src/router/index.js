import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

/** 禁止全局路由错误处理打印 */
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const routes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
        // component: () => import('@/views/homePage/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/homePage',
    children: [
      {
        path: 'homePage',
        name: 'homePage',
        component: () => import('@/views/homePage/index'),
        meta: { title: '首页' }
      },
      {
        path: 'monitor',
        name: 'monitor',
        component: () => import('@/views/monitor/index'),
        meta: { title: '应急指挥' },
        children: [
          {
            path: 'monitorList',
            name: 'monitorList',
            component: () => import('@/views/monitor/monitorList/index'),
            meta: { title: '应急指挥' }
          },
          {
            path: 'monitorExercise',
            name: 'monitorExercise',
            component: () => import('@/views/monitor/exercise/index'),
            meta: { title: '业务场景管理', icon: 'car' }
          },
          {
            path: 'monitorExmap',
            name: 'monitorExmap',
            component: () => import('@/views/monitor/exercise/module/index'),
            meta: { title: '应急演练' }
          },
          {
            path: 'kanban',
            component: () => import('@/views/monitor/exercise/module/kanban'),
            meta: { title: '看板维护', icon: 'nested' },
            hidden: true
          },
          {
            path: 'monitorCommand',
            name: 'monitorCommand',
            component: () => import('@/views/monitor/command/index'),
            meta: { title: '应急监测指挥' }
          },
          {
            path: 'monitorMapCommand',
            component: () => import('@/views/monitor/command/module/mapindex'),
            meta: { title: '应急监测指挥', icon: 'nested' },
            hidden: true
          },
          {
            path: 'system',
            name: 'system',
            component: () => import('@/views/system/index'),
            meta: { title: '系统设置' },
            children: [
              {
                path: 'videoPoints',
                name: 'videoPoints',
                component: () => import('@/views/system/videoPoints/index'),
                meta: { title: '固定视频点位管理' }
              },
              {
                path: 'carManage',
                name: 'carManage',
                component: () => import('@/views/system/vehicle/index'),
                meta: { title: '车辆管理', icon: 'car' }
              },
              {
                path: 'boatsManage',
                name: 'boatsManage',
                component: () => import('@/views/system/watercraft/index'),
                meta: { title: '船舶管理', icon: 'ship' }
              },
              {
                path: 'peopleManage',
                name: 'peopleManage',
                component: () => import('@/views/system/personnel/index'),
                meta: { title: '人员管理', icon: 'person' }
              },
              {
                path: 'unmannedManage',
                name: 'unmannedManage',
                component: () => import('@/views/system/UAS/index'),
                meta: { title: '无人机管理', icon: 'uas' }
              },
              {
                path: 'pointsStation',
                name: 'pointsStation',
                component: () => import('@/views/system/dataCollectionPoints/index'),
                meta: { title: '自动监测站管理', icon: 'sj' }
              },
              {
                path: 'stationManage',
                name: 'stationManage',
                component: () => import('@/views/system/dataCollectionPoints/label'),
                meta: { title: '标签管理', icon: 'sj' }
              },
              {
                path: 'markerManage',
                name: 'markerManage',
                component: () => import('@/views/system/mark/index'),
                meta: { title: '标注管理' }
              }
            ]
          }
        ]
      },
      {
        path: 'blueAlgae',
        name: 'blueAlgae',
        component: () => import('@/views/blueAlgae/index'),
        meta: { title: '蓝藻检测' }
      },
      {
        path: 'DILaboratory',
        name: 'DILaboratory',
        component: () => import('@/views/DILaboratory'),
        meta: { title: '数智实验室' },
        children: [
          {
            path: 'BIMIndex',
            name: 'BIMIndex',
            component: () => import('@/views/DILaboratory/BIMIndex'),
            meta: { title: '实验室全景' }
          },
          {
            path: 'inspect',
            name: 'inspect',
            component: () => import('@/views/DILaboratory/inspect'),
            meta: { title: '监测业务' }
          },
          {
            path: 'IntelligentBuilding',
            name: 'IntelligentBuilding',
            component: () => import('@/views/DILaboratory/IntelligentBuilding'),
            meta: { title: '数智实验室' },
            children: [
              {
                path: 'security',
                name: 'security',
                component: () => import('@/views/DILaboratory/security'),
                meta: { title: '安全监测' }
              },
              {
                path: 'environment',
                name: 'environment',
                component: () => import('@/views/DILaboratory/environment'),
                meta: { title: '环境监测' }
              }
            ]
          }
        ]
      },
      {
        path: 'automaticStation',
        name: 'automaticStation',
        component: () => import('@/views/automaticStation'),
        meta: { title: '应急指挥' },
        children: [
          {
            path: 'automaticStationIntroduce',
            name: 'automaticStationIntroduce',
            component: () => import('@/views/automaticStation/introduce'),
            meta: { title: '自动监测站' }
          },
          {
            path: 'stationDetails',
            name: 'stationDetails',
            component: () => import('@/views/automaticStation/stationDetails'),
            meta: { title: '仪表仪器' }
          },
          {
            path: 'BIMDetails',
            name: 'BIMDetails',
            component: () => import('@/views/automaticStation/BIMDetails'),
            meta: { title: '自动站BIM' }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    meta: { title: '登录' }
  }, {
    path: '/info',
    name: 'info',
    component: () => import('@/views/personInfo/index'),
    meta: { title: '登录' }
  },{
    path: '/test',
    name: 'info',
    component: () => import('@/views/Test/index'),
    meta: { title: '登录' }
  },{
    path: '/ue',
    name: 'info',
    component: () => import('@/views/ueScene/index'),
    meta: { title: 'UE' }
  },{
    path: '/test2',
    name: 'info',
    component: () => import('@/views/threeModelFBX/index'),
    meta: { title: '登录' }
  },{
    path: '/test',
    name: 'info',
    component: () => import('@/views/modelShow/index'),
    meta: { title: '登录' }
  }

]

export const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
