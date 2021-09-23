<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 点击添加角色后的弹出框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addRolesDialogVisible"
        width="50%"
        @close="addRolesDialogClosed"
      >
        <!-- 添加角色主体区域 -->
        <el-form
          :model="addRolesForm"
          :rules="addRolesFormRules"
          ref="addRolesFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加角色底部区域 -->
        <span slot="footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改角色的弹出框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogCloseReset"
      >
        <!-- 修改角色的主体区域 -->
        <el-form
          :model="editRolesForm"
          :rules="editRolesRules"
          ref="editRolesRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 修改角色的底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除角色 -->
      <!-- 权限列表区域 -->
      <el-table :data="rolesList" border="" stripe="">
        <!--  扩展列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="8">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="16">
                    <el-tag
                      closable
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="el-icon-edit"
              @click="EditRolesById(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              class="el-icon-delete"
              @click="deleteRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              class="el-icon-edit"
              @click="showSetRightDiolag(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        @close="setRightDialogVisibleClosed"
        width="50%"
      >
        <!-- 树形图 -->
        <el-tree
          node-key="id"
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treesRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 添加的角色表单数据
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的表单数据验证
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在3~15个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在3~15个字符', trigger: 'blur' }
        ]
      },
      // 修改角色的表单验证
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在3~15个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在3~15个字符', trigger: 'blur' }
        ]
      },
      // 控制添加角色表单的显示与隐藏
      addRolesDialogVisible: false,
      // 保存所需修改角色的数据
      editRolesForm: {},
      // 控制修改角色表单的显示与隐藏
      editDialogVisible: false,
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 所有角色列表数据
      rolesList: [],
      // 树形空间的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中节点的ID值
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$messages.error('获取角色列表失败')
      }
      this.rolesList = res.data
      // console.log(res.data)
    },
    // 添加角色
    addRoles () {
      this.$refs.addRolesFormRef.validate(async valid => {
        // console.log(valid)
        // 判断格式对不对，不对直接return
        if (!valid) return
        // 对的话就发起添加角色的请求
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        console.log(res)
        // 判断返回的状态码是不是201，不是就是添加失败
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        // 提示角色成功
        this.$message.success('添加角色成功')
        // 隐藏对话框
        this.addRolesDialogVisible = false
        // 重新获取角色列表
        this.getRolesList()
      })
    },
    // 关闭对话框后重置添加角色表单
    addRolesDialogClosed () {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 关闭对话框后重置修改角色表单
    editDialogCloseReset () {
      this.$refs.editRolesRef.resetFields()
    },
    // 获取所需修改角色的数据
    async EditRolesById (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取所需修改的角色信息失败')
      }
      this.editRolesForm = res.data
      this.editDialogVisible = true
    },
    // 提交修改角色的数据
    editRolesInfo () {
      this.$refs.editRolesRef.validate(async valid => {
        // console.log(valid)
        // 本地表单验证失败就return
        if (!valid) return
        // 验证成功就发起请求
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId,
          { roleName: this.editRolesForm.roleName, roleDesc: this.editRolesForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败')
        }
        // 提示用户成功
        this.$message.success('修改角色信息成功')
        // 关闭修改框
        this.editDialogVisible = false
        // 重新获取角色列表
        this.getRolesList()
      })
    },
    // 根据id删除角色
    async deleteRolesById (id) {
      // 弹框询问角色是否确认删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已经取消了删除')
      // 发起删除角色的请求
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      // 提示角色删除成功
      this.$message.success('删除角色成功')
      // 更新角色列表
      this.getRolesList()
      console.log(this.getRolesList)
    },
    // 根据ID删除权限
    async removeRightById (role, rightId) {
      // 弹框提示用户是否确认删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('您已经取消了删除')
      }
      console.log('您已确认删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDiolag (role) {
      this.roleId = role.id
      //  获取所有权限
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有权限失败')
      }
      // 把获取到的权限保存到rightList
      this.rightsList = res.data
      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的 id，并保存到 defKeys数组中
    // 参数1：是否是三级节点，参数2：用数组保存
    getLeafKeys (node, arr) {
      // 判断，如果该节点有children，那么就不是三级节点，取非，就是三级节点
      // 如果当前node 节点不包含 children属性，则是三级节点
      if (!node.children) {
        // 将三级节点的id push到arr数组中
        return arr.push(node.id)
      }
      // 如果不是三级节点，那么就调用递归
      node.children.forEach(item =>
        this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogVisibleClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treesRef.getCheckedKeys(),
        ...this.$refs.treesRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      // 将拿到的id数组，改为带逗号的字符串
      const idStr = keys.join(',')
      // 发起授权的请求
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      // 分配权限成功后刷新权限列表
      this.getRolesList()
      // 关闭分配权限对话框
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
