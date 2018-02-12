import Vue from 'vue'
import Router from 'vue-router'

import Overview from './views/Overview.vue'
import Cashier from './views/Cashier.vue'
import Bar from './views/Bar.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/overview',
            name: 'overview',
            component: Overview
        },
        {
            path: '/cashier',
            name: 'cashier',
            component: Cashier
        },
        {
            path: '/bar',
            name: 'bar',
            component: Bar
        },
    ]
})
