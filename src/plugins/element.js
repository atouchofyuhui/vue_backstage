import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
// import { Button } from 'element-ui'
// eslint-disable-next-line import/no-duplicates
import {
  Button, Form, FormItem,
  Input, Message, Container, Header, Aside, Main,
  Menu, Submenu, MenuItem, Breadcrumb,
  BreadcrumbItem,
  Card,
  Row, Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
// Message消息提示框需全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
