import Login from './views/Login.vue'
import Register from './views/Register.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/',
        component: Main,
        name: '',
        hidden: true,        
        // a meta field
        meta: { requiresAuth: false }
    },    
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true,        
        // a meta field
        meta: { requiresAuth: false }
    },
    {
        path: '/registe',
        component: Register,
        name: '',
        hidden: true,        
        // a meta field
        meta: { requiresAuth: false }
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true,
        // a meta field
        meta: { requiresAuth: false }
    },
    //{ path: '/main', component: Main },    
    {
        path: '/home',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [           
            { path: '/table', component: Table, name: 'Table', meta: { requiresAuth: true } },
            { path: '/form', component: Form, name: 'Form', meta: { requiresAuth: true } },
            { path: '/user', component: user, name: '列表', meta: { requiresAuth: true } },
        ],
        // a meta field
        meta: { requiresAuth: true }
    },
    {
        path: '/home',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4',  meta: { requiresAuth: true } },
            { path: '/page5', component: Page5, name: '页面5', meta: { requiresAuth: true } }
        ],
        // a meta field
        meta: { requiresAuth: true }
    },
    {
        path: '/home',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三', meta: { requiresAuth: true } }
        ],
        // a meta field
        meta: { requiresAuth: true }
    },
    {
        path: '/home',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts', meta: { requiresAuth: true } }
        ],
        // a meta field
        meta: { requiresAuth: true }
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404', meta: { requiresAuth: false } }
    }
];

export default routes;