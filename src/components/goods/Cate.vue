<template>
  <div class="cate">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        @close="addCateDialogClosed"
        width="50%"
      >
        <!-- 添加分类的表单 -->
        <el-form
          ref="addCateFormRef"
          :model="addCateForm"
          :rules="addCateFormRules"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- option表示对应的数据源 -->
            <el-cascader
              v-model="selectKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              expand-trigger="hover"
              clearable=""
              change-on-select=""
            ></el-cascader>
          </el-form-item>
        </el-form>
        <!-- 添加分类对话框底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary"
            ><i class="el-icon-edit"></i>编辑</el-button
          >
          <el-button size="mini" type="danger"
            ><i class="el-icon-delete"></i> 删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="querInfo.pagesize"
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
    return {
      // 查询条件
      querInfo: {
        type: 3,
        // 当前位于第几页
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      // 商品分类列表，默认为空
      cateList: [],
      // 商品总条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 当前这一列的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 当前这一列的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 当前这一列的模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类等级,默认要添加的是一级分类
        cat_level: 0
      },
      // 添加分类的表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类id数组
      selectKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 发起请求并获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      // 将获取到的data数据保存到categories
      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog () {
      // 在打开对话框前获取父级分类数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    // 选择项发生变化触发这个函数
    parentCateChange () {
      // console.log(this.selectKeys)
      // 如果selectKeys的数组中的length值大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 确定添加分类
    addCate () {
      // console.log(this.addCateForm)
      // 先通过查询表单里面是否选择了分类的名字，没选就return，选了就发起请求
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.getCateList()
        this.addCateDialogVisible = false
        this.$message.success('添加分类成功')
      })
    },
    // 关闭添加分类对话框后，清空表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 20px;
}
// .el-table__cell{
//   color: #333 !important;
//   font-size: 13px;
//   font-weight: 500 !important;
//   text-align: center !important;
// }
</style>
