import Vue from 'vue'
import Router from 'vue-router'

import Cashier from './views/Cashier.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/cashier',
            name: 'cashier',
            component: Cashier
        }
    ]
})
