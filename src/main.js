import Vue from 'vue'
import * as VueFire from 'vuefire';
import App from './App.vue'
import router from './router'
import store from './store'

require('./assets/sass/app.scss');

Vue.use(require('vue-moment'));
Vue.use(VueFire);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
