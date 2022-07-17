export default [
    { path: '/login', component: () => import('@/pages/Login') },
    { path: '/', redirect: '/home' },
    {
        path: '/home', component: () => import('@/pages/Home'),
        redirect: '/welcome',
        children: [
            {
                path: '/welcome', component: () => import('@/pages/Home/Welcome'),
            },
            {
                path: '/users', component: () => import('@/pages/User'),
            },
            {
                path: '/rights', component: () => import('@/pages/Power'),
            },
            {
                path: '/roles', component: () => import('@/pages/Role'),
            },
            {
                path: '/categories', component: () => import('@/pages/Goods/Cate'),
            },
            {
                path: '/params', component: () => import('@/pages/Goods/Params'),
            },
            {
                path: '/goods', component: () => import('@/pages/Goods/CateList'),
            },
            { path: '/goods/add', component: () => import('@/pages/Goods/AddGoods') },
            { path: '/orders', component: () => import('@/pages/Order') },
            { path: '/reports', component: () => import('@/pages/Echars') },

        ]
    }
]

