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
      <!-- 搜索区域 -->
      <el-row :gutter="20" class="orders_search">
        <el-col>
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- tab区域 -->
      <el-table :data="orderList" border="" stripe="">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.order_pay === '1'"
              type="primary"
              size="mini"
              >已付款</el-tag
            >
            <el-tag v-else type="danger" size="mini">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{
            scope.row.create_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="150px">
          <template slot-scope="">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditOrders"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="watchLocation"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editOrderDialogVisible"
      width="50%"
      @close="editOrderDialogClosed"
    >
      <el-form
        :model="editOrdersRuleForm"
        :rules="editOrdersFormRules"
        ref="editOrdersRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="adreess1">
          <el-cascader
            v-model="editOrdersRuleForm.adreess1"
            :options="citydata"
            expand-trigger="hover"
          ></el-cascader> </el-form-item
        ><el-form-item label="" prop="adreess2">
          <el-input
            v-model="editOrdersRuleForm.adreess2"
          ></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流的对话框 -->
    <el-dialog
      title="物流详情"
      :visible.sync="logisticsDialogVisible"
      width="50%"
    >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressLocation"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata'
export default {
  data () {
    return {
      queryInfo: {
        // 查询条件
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表
      orderList: [],
      // 总显示条数
      total: 0,
      // 控制修改地址对话框的显示与隐藏
      editOrderDialogVisible: false,
      // 表单验证对象
      editOrdersRuleForm: {
        adreess1: '',
        adreess2: ''
      },
      // 表单验证规则
      editOrdersFormRules: {
        adreess1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        adreess2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 城市数据
      citydata: citydata,
      // 控制物流详情对话框的显示与隐藏
      logisticsDialogVisible: false,
      // 物流详情
      progressLocation: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 展示修改地址对话框
    showEditOrders () {
      this.editOrderDialogVisible = true
    },
    // 关闭编辑对话框清空表单
    editOrderDialogClosed () {
      this.$refs.editOrdersRuleFormRef.resetFields()
    },
    // 查看物流
    async watchLocation () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.logisticsDialogVisible = true
      this.progressLocation = res.data
      console.log(res)
      console.log(this.progressLocation)
    },
    // 当前页显示条数发生改变时触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 页码发生改变时触发
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>
