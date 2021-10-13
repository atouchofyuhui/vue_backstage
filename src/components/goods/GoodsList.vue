<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20" class="goods_search">
        <el-col :span="7">
          <el-input
          v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getgoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getgoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="moveAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border="" stripe="">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="110px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="100px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px">
          <template slot-scope="scope">{{
            scope.row.add_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
            @click="deleteGoods(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
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
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 获取的商品列表
      goodsList: [],
      // 总数据条数
      total: 1
    }
  },
  created () {
    // 页面加载立即请求商品列表
    this.getgoodsList()
  },
  methods: {
    // 获取商品列表
    async getgoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
    },
    // 换页时触发
    handleCurrentChange (newsPageNum) {
      this.queryInfo.pagenum = newsPageNum
      this.getgoodsList()
    },
    // 每页显示条数
    handleSizeChange (newsPageSize) {
      this.queryInfo.pagesize = newsPageSize
    },
    // 跳转到添加商品页
    moveAddGoods () {
      this.$router.push('/addGoods')
    },
    // 删除商品
    async deleteGoods (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      // 判断用户是否点了确定删除
      if (confirmResult !== 'confirm') {
        return this.$message.error('您已取消了删除')
      }
      // 发起真正的删除请求
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getgoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
