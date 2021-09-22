<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20" class="users_search">
        <el-col :span="7">
          <el-input
            placeholder="请输入搜索的内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 添加用户的提示框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 主体内容区域 -->
        <el-form
          :model="addUserForm"
          :rules="addUserFormRules"
          ref="addUserFromRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogCloseReset"
      >
        <!-- 修改用户信息的主体内容区域 -->
        <el-form
          :model="editForm"
          ref="editFormRef"
          :rules="editFormRules"
          label-width="80px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 修改用户信息的底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" border="" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽改变状态栏 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              placement="top"
              content="修改"
              effect="dark"
              :enterable="false"
            >
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              placement="top"
              content="删除"
              effect="dark"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              placement="top"
              content="设置"
              effect="dark"
              :enterable="false"
            >
              <!-- 设置按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义验证规则
    // 自定义验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      // 非法的邮箱
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      // 非法的手机号
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页码
        pagenum: 1,
        // 每页显示的多少条数据
        pagesize: 10
      },
      usersList: [],
      total: 0,
      // 控制添加用户提示框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单数据验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户的对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {},
      // 修改用户表单的校验规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表错误')
      this.usersList = res.data.users
      this.total = res.data.total
      // console.log(res)
      // console.log(this.usersList)
      // console.log(this.total)
    },
    // 下拉选中的页数监听事件
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      // 页码发生了变化，所以需要重新发起数据请求
      this.getUserList()
    },
    // 当前页数的监听事件
    handleCurrentChange (newsPage) {
      // console.log(newsPage)
      this.queryInfo.pagenum = newsPage
      this.getUserList()
    },
    // 监听用户状态的改变
    async userStateChange (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新状态失败！')
      }
      this.$message.success('更新状态成功！')
    },
    // 关闭添加用户的提示框后，重置表单
    addDialogClosed () {
      this.$refs.addUserFromRef.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.addUserFromRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addUserForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 添加成功后隐藏用户的添加表单框
        this.addDialogVisible = false
        // 因为添加了用户，所以需要重新获取用户列表
        this.getUserList()
      })
    },
    // 展示修改用户的对话框
    async showEditDialog (id) {
      // 获取到所要修改的用户的数据
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('未查询到该用户')
      // 将获取到所要修改的用户信息保存起来
      this.editForm = res.data
      this.editDialogVisible = true
      console.log(this.editForm)
    },
    // 关闭修改对话框后重置表单
    editDialogCloseReset () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        // 点击确定发送修改数据的网络请求
        if (!valid) return
        // 发起修改用户信息的请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email, mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        // 关闭对话框
        this.editDialogVisible = false
        // 更新用户列表
        this.getUserList()
        // 提示更新成功
        this.$message.success('用户信息更新成功')
        console.log(res)
      })
    },
    // 删除用户
    async deleteUserById (id) {
      // 弹框询问用户是否确认删除
      const confirmResult = await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') return this.$message.info('已经取消了删除')
      // 发起删除用户的请求
      console.log('确认删除')
      const { data: res } = await this.$http.delete('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      // 更新用户列表
      this.getUserList()
      // 提示用户删除成功
      this.$message.success('删除用户成功')
    }
  }
}
</script>

<style lang="less" scoped>
.users_search {
  margin-bottom: 20px;
}
</style>
