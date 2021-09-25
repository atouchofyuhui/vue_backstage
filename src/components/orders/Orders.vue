<template>
  <div class="oreders">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20" class="orders_search">
        <el-col>
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    this.getOrders()
  },
  methods: {
    getOrders () {}
  }
}
</script>

<style lang="less" scoped>
</style>
