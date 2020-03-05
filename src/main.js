import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';             // 引入 Element-UI
import 'element-ui/lib/theme-chalk/index.css'; // 引入 Element-UI 的样式

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'



import './assets/css/global.css'       // 导入全局样式表
import './assets/fonts/iconfont.css'    //  引入字体图标样式
import TreeTable from 'vue-table-with-tree-grid'  // 导入表格树

import MyHttpServer from './plugins/http';     

Vue.use(ElementUI);             // 全局注册 ElementUI
Vue.use(MyHttpServer)              // 可以通过 `this.$http` 发送请求  
Vue.component('tree-table', TreeTable)      // 全局注册 表格树
Vue.use(VueQuillEditor)              // 全局注册富文本编辑器

Vue.filter('dateFormat', function (originVal) {               // 全局定义 时间格式化
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
