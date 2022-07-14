export default [
    { path: '/login', component: () => import('@/pages/Login') },
    { path: '/', redirect: '/home' },
    { path: '/home', component: () => import('@/pages/Home') }
]

