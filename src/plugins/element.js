import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
// import { Button } from 'element-ui'
// eslint-disable-next-line import/no-duplicates
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message消息提示框需全局挂载
Vue.prototype.$message = Message
