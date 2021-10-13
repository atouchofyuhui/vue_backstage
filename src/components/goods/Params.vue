<template>
  <div class="goods_params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        :closable="false"
        show-icon
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            expand-trigger="hover"
            clearable=""
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table border="" stripe="" :data="manyTableData">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable=""
                  @close="hanleClosed(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showdeleteDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 静态属性表格 -->
          <el-table border="" stripe="" :data="onlyTableData">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable=""
                  @close="hanleClosed(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showdeleteDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + TitleText"
      :visible.sync="addDialogVisible"
      @close="addDialogVisibleClosed"
      width="50%"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'编辑' + TitleText"
      :visible.sync="editDialogVisible"
      @close="editDialogVisibleClosed"
      width="50%"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取到的分类列表
      cateList: [],
      // 级联选择框双向绑定到的数组
      selectKeys: [],
      // 级联选择器的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // tab 页签 默认显示的列
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      // 验证规则对象
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 控制编辑参数对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {},
      // 验证规则对象
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 控制按钮与文本框的切换显示
      inputVisible: false,
      // 添加tag按钮里的文本
      inputValue: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data
      // console.log(res)
    },
    // 选择项发生变化触发这个函数
    handleChange () {
      this.getParamsData()
      console.log(this.selectKeys)
    },
    // 切换tab页签
    handleClick () {
      this.getParamsData()
      // console.log(this.activeName)
    },
    // 获取参数的列表数据
    async getParamsData () {
      // 证明选中的不是三级分类
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 证明选中的是三级分类
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$http.error('获取参数列表失败')
      }
      // 不明白 split('') 的区别 split(' ')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 控制添加参数对话框的显示与隐藏
    showParamsDialog () {
      this.addDialogVisible = true
    },
    // 关闭对话框后重置输入框
    addDialogVisibleClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定添加参数
    addParams () {
      // 进行请求前的表单预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 正式发起请求
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 关闭对话框后重置输入框
    editDialogVisibleClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 展示修改参数框
    // eslint-disable-next-line camelcase
    async showEditDialog (attr_id) {
      // 通过id查询当前所要修改的参数信息
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.get(
        // eslint-disable-next-line camelcase
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('未查询到当前参数信息')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击确定修改参数
    editParams () {
      // 进行请求前的表单预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 正式发起修改请求
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 通过查询id删除参数
    // eslint-disable-next-line camelcase
    async showdeleteDialog (attr_id) {
      // 删除前提示
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      // 判断用户是否确认删除
      if (confirmResult !== 'confirm') {
        return this.$message.info('您已取消删除')
      }
      // 正式发起删除请求
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
      this.editDialogVisible = false
    },
    // 对attr_vals的操作，保存到数据库
    async saveAttrVals (row) {
      // 发起请求添加到远程数据库中
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数错误')
      }
      this.$message.success('修改参数成功')
    },
    // 添加的tag失去焦点或按下enter键，都会触发这个函数
    handleInputConfirm (row) {
      // 判断用户是否真正输入了内容
      // 去掉两边空格后还是没内容就重置为空并且切换为添加按钮
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 否则就是用户输入了真正的内容,push到原数组中
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 调用发起请求的函数
      this.saveAttrVals(row)
    },
    // 点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // $nextTick： 当前页面被重新渲染后，才会调用回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag参数 i是当前选中的tag，row是当前选中的tag所有信息
    hanleClosed (i, row) {
      // 调用发起请求的函数
      this.saveAttrVals(row)
      row.attr_vals.splice(i, 1)
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的ID
    cateId () {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    // 动态改变添加参数的文字
    TitleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 20px;
}
.el-cascader {
  margin-left: 20px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
