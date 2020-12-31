<template>
  <div class="order">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面板 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" border stripe class="mt15" style="width: 100%">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="200px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==='0'">未付款</el-tag>
            <el-tag v-if="scope.row.pay_status==='1'" type="danger">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              placement="top"
              content="修改地址"
              :enterable="false"
            >
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddress"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              placement="top"
              content="物流进度"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-location" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="mt15"
      ></el-pagination>
    </el-card>
    <!-- 修改地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="30%"
      @close="addressReset"
    >
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px">
        <el-form-item label="省市区选择" prop="address01">
          <!-- <el-input v-model="editForm.address01"></el-input> -->
          <el-cascader
            v-model="editForm.address01"
            :options="options"
            :props="{expandTrigger:'hover'}"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address02">
          <el-input v-model="editForm.address02"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息 -->
    <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      orderList: [],
      total: 0,
      //修改地址隐藏显示属性
      editAddressDialogVisible: false,
      //物流进度显示隐藏
      progressDialogVisible: false,
      //修改地址表单
      editForm: {
        address01: '',
        address02: '',
      },
      editRules: {
        address01: [
          { required: true, message: '请选择省市区', trigger: 'blur' },
        ],
        address02: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      //省市区数据
      options: regionData,
      //props
      cityProps: {
        label: 'name',
        value: '',
      },
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   this.$message.success(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList)
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    //修改地址
    editAddress() {
      this.editAddressDialogVisible = true
    },
    //级联选择地区id
    handleChange() {
      console.log(this.editForm.address01)
    },
    //关闭弹窗重置
    addressReset() {
      this.$refs.editForm.resetFields()
    },
    //物流进度信息--接口异常
    // async progressInfo() {
    //   this.progressDialogVisible = true
    //   const { data: res } = await this.$http.get('/kuaidi/1106975712662')
    //   if(res.meta.status!==200) return this.$message.error('获取物流信息失败')
    //   this.$message.success('获取物流信息成功')
    // }
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>