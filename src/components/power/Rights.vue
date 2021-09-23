<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 权限列表区域 -->
      <el-table :data="rightsList" border="" stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag type="" v-show="scope.row.level==='0'">标签一</el-tag>
            <el-tag type="success" v-show="scope.row.level==='1'">标签二</el-tag>
            <el-tag type="warning" v-show="scope.row.level==='2'">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有权限列表数据
      rightsList: []
    }
  },
  created () {
    this.RightsList()
  },
  methods: {
    // 获取权限列表
    async RightsList () {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status !== 200) return this.$message.console.error('获取权限列表失败')
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
