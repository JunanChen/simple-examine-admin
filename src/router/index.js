import Vue from 'vue'
import Router from 'vue-router'
import { Layout,Content }  from "../layout"; // 页面整体布局
import { topRouterMap } from "./topRouter";

process.env.NODE_ENV === "development" ? Vue.use(Router) : null;

function filterTopRouterMap(name){
	let router = topRouterMap.find((item) => {
		return item.parentName === name;
	});
	return router.data; // arr
}

/**
 * 1、roles:后台返回的权限结构;
 * 
 */
//手动跳转的页面白名单
const whiteList = [
	'/'
];
/**
 * path:''与path:'*'的区别：
 * 1、path:'*', 会匹配所有路径
 * 2、path:''，也是会匹配到路由
 * 
 */
//默认不需要权限的页面
export const constantRouterMap = [
	{
    path: '',  
    component: Layout,
		redirect: '/index/index',
		hidden:true
  },
	{ path: '/login',name: 'login',component:() => import('@/page/login'),hidden: true},
	{ path: '/404', component: () => import('@/page/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/page/errorPage/401'), hidden: true },
	{
		path: '/index',
		name: 'index',
		component:Layout,
		meta:{
			title:'首页',
		  	icon: 'el-icon-star-off',
		},
		noDropdown:true,
		children:[ 
			{
				path:'index', 
				meta:{
					title:'首页', 
					icon:'el-icon-star-off',
				  routerType:'leftmenu'
				},
        component: () => import('@/page/index/index'),
			}
		]
	}
]

	//注册路由
export default new Router({
	mode:'history', // 默认为'hash'模式
	base: '/permission/', // 添加跟目录,对应服务器部署子目录
	routes: constantRouterMap
})

  //异步路由（需要权限的页面）
export const asyncRouterMap = [
	{
		path: '/dataManage',
		name: 'dataManage',
		component: Layout,
		meta: {
			title: '数据管理',
			icon: 'el-icon-s-data',
			routerType:'leftMenu'
		},
		children:[
			{
				path:'enter', 
				name: 'dataEnter',
				meta:{
					title:'巡检报告', 
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/dataManage/enter'),
			},
			{
				path:'return', 
				name: 'dataReturn',
				meta:{
					title:'巡检报告项', 
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/dataManage/return'),
			},
			{
				path:'save', 
				name: 'dataSave',
				meta:{
					title:'数据存储', 
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/dataManage/save'),
			}
		]
	},
	{
		path: '/examineManage',
		name: 'examineManage',
		component: Layout,
		meta: {
			title: '巡检管理',
			icon: 'el-icon-thumb',
			routerType:'leftMenu'
		},
		children:[
			{
				path:'plan', 
				name: 'examinePlan',
				meta:{
					title:'巡检计划', 
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/examineManage/plan'),
			},
			{
				path:'area',
				name: 'examineArea', 
				meta:{
					title:'区域管理', 
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/examineManage/area'),
			},
			{
				path:'line',
				name: 'examineLine', 
				meta:{
					title:'线路管理', 		
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/examineManage/line'),
			},
			{
				path:'point',
				name: 'examinePoint', 
				meta:{
					title:'点位管理', 	
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/examineManage/point'),
			},
			{
				path:'equipment',
				name: 'examineEquipment', 
				meta:{
					title:'设备管理', 	
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/examineManage/equipment'),
			}	
		]
	},
	{
		path: '/alarmMonitor',
		name: 'alarmMonitor',
		component: Layout,
		meta: {
			title: '告警监控',
			icon: 'el-icon-warning',
			routerType:'leftMenu'
		},
		children:[
			{
				path:'equipment',
				name: 'alarmMonitorEquipment', 
				meta:{
					title:'设备异常上报', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/alarmMonitor/equipment'),
			},
			{
				path:'equExceStati',
				name: 'equExceStati', 
				meta:{
					title:'设备故障统计', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/alarmMonitor/equExceStati'),
			}
		]
	},
	{
		path: '/system',
		name: 'system',
		component: Layout,
		meta: {
			title: '系统管理',
			icon: 'el-icon-s-platform',
			routerType:'leftMenu'
		},
		children:[
			{
				path: 'admin',
				name: 'admin', 
				meta:{
					title:'系统用户管理', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/system/admin'),
			},
			{
				path:'role',
				name: 'role', 
				meta:{
					title:'角色', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/system/role'),
			},
			{
				path:'permission',
				name: 'permission', 
				meta:{
					title:'权限控制', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/system/permission'),
			},
			{
				path:'setting',
				name: 'systemSetting', 
				meta:{
					title:'系统设置', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/system/setting'),
			},
			{
				path:'logs',
				name: 'systemLogs', 
				meta:{
					title:'系统日志', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/system/logs'),
			},
			{
				path:'druid_monitor',
				name: 'druid_monitor', 
				meta:{
					title:'druid监控', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/system/druid_monitor'),
			},
			{
				path:'swagger_interface',
				name: 'swagger_interface', 
				meta:{
					title:'swagger接口文档', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/system/swagger_interface'),
			}
		]
	},
	{
		path: '/daily',
		name: 'daily',
		component: Layout,
		meta: {
			title: '日常管理',
			icon: 'el-icon-sunny',
			routerType:'leftMenu'
		},
		children:[
			{
				path:'dept',
				name: 'dept', 
				meta:{
					title:'部门管理', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/daily/dept'),
			},
			{
				path:'attendance',
				name: 'attendance', 
				meta:{
					title:'考勤签到', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/daily/attendance'),
			},
			{
				path:'examiner',
				name: 'examiner', 
				meta:{
					title:'人员管理', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/daily/examiner'),
			},
			{
				path:'assessment',
				name: 'assessment', 
				meta:{
					title:'绩效考核', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/daily/assessment'),
			}
		]
	},
	{
		path: '/tidings',
		name: 'tidings',
		component: Layout,
		meta: {
			title: '消息管理',
			icon: 'el-icon-chat-dot-round',
			routerType:'leftMenu'
		},
		children:[
			{
				path:'message',
				name: 'message', 
				meta:{
					title:'留言', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/tidings/message'),
			},
			{
				path:'feedback',
				name: 'feedback', 
				meta:{
					title:'反馈', 					
				  	routerType:'leftmenu'
				},
				component: () => import('@/page/tidings/feedback'),
			}
		]
	},
	{
		path:'/infoManage',
		name: 'infoManage',
		meta: {
			  title:'信息管理',
			  icon: 'el-icon-message',
		},
		component:Layout,
		children:[
		  {
			 path:'infoShow',
			 name:'infoShow',
			 meta: {
				title:'个人信息',
				icon: 'iconinfo',
				routerType:'leftmenu',
					
			},
			component: () => import('@/page/infoManage/infoShow')
		  },
		  {
			  path:'infoModify',
			  name:'infoModify',
			  meta: {
				  title:'修改信息',
				  icon: 'iconinfo',
				  routerType:'leftmenu'
			  },
			  component: () => import('@/page/infoManage/infoModify')
		   }
		]
	},
    {
		path: '/error',
		component: Layout,
		name: 'errorPage',
		meta: {
		title: '错误页面', 
		icon: 'el-icon-error'
		},
		children: [
				{  
					path: '401', 
					name: 'page401', 
					component: () => import('@/page/errorPage/401'), 
					meta: { 
						title: '401', 
						noCache: true 
					}
				},
				{
					path: '404', 
					name: 'page404', 
					component: () => import('@/page/errorPage/404'), 
					meta: { 
						title: '404', 
						noCache: true
					}
				}
    		]
		},
		{
			path: '/other',
			name: 'other',
			component: Layout,
			meta: {
				title: '其他',
				icon: 'el-icon-ice-cream-round',
				routerType:'leftMenu'
			},
			children:[
				{
					path:'about',
					name: 'about', 
					meta:{
						title:'关于', 					
						  routerType:'leftmenu'
					},
					component: () => import('@/page/other/about'),
				}
			]
		},
		{ path: '*', redirect: '/404', hidden: true }
	];
	
	/**
	 *  路由设置要求：
	 * 1、该路由有子菜单,可以设置多层嵌套路由children;如果没有子菜单,不需要设置children;通过item.children.length来判断路由的级数;
	 * 2、登录成功后,定位到系统首页时,需要加载页面整体布局组件Layout并进行子路由定向加载;
	 * 
	 * 按需加载路由组件的2种方法：
	 * 1、component: () => import('@/page/login')
	 * 2、component:resolve => require(['@/page/fundPosition'], resolve)
	 * 
	 * 
	 * 
	 * 什么情况下，路由会定位到404页面?
	 * 路由中redirect:'',不起作用？
	 * 三级子菜单要在顶部展示？
	 * 
	 * 
	 * 
	 */

