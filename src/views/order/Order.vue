<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="1000"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="40%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in addressInfo"
          :key="index"
          :timestamp="activity.time"
          type="primary"
          color="#0bbd87"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      addressVisible: false,
      addressInfo: []
    }
  },

  components: {},

  computed: {},

  methods: {
    async getOrderList() {
      const { data: res } = await this.$request.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
        return false
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newValue) {
      this.queryInfo.pagesize = newValue
      this.getOrderList()
    },
    handleCurrentChange(newValue) {
      this.queryInfo.pagenum = newValue
      this.getOrderList()
    },
    async showBox() {
      const { data: res } = await this.$request.get('kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        this.$message.error('获取物流信息失败')
        return false
      }
      this.addressInfo = res.data
      this.addressVisible = true
    }
  },

  created() {
    this.getOrderList()
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

  .el-table {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
