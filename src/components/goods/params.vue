<template>
  <div class="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面板 -->
    <el-card>
      <el-alert title="注意：展示三级菜单设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <el-row>
        <el-col>
          <div class="cascader mt15">
            <label>选择商品分类：</label>
            <el-cascader
              v-model="value"
              :options="CateList"
              :props="propsCate"
              clearable
              @change="handleChange"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="paramsHandleClick" class="mt15">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isDisabled">添加参数</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isDisabled">添加属性</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      activeName: 'many',
      CateList: [],
      value: [],
      propsCate: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover',
      },
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isDisabled() {
      if (this.value.length !== 3) return true
      return false
    },
    //参数id
    createdId() {
      if (this.value.length === 3) return this.value[2]
      return null
    },
  },
  methods: {
    //获取商品数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.CateList = res.data
      console.log(this.CateList)
    },
    //级联选择方法
    handleChange() {
      this.getParamsData()
    },
    //发起参数分类请求
    async getParamsData() {
      if (this.value.length !== 3) return this.value = []
      const { data: res } = await this.$http.get(
        `categories/${this.createdId}/attributes`,
        {
          params: { sel : this.activeName }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      console.log(res.data)
    },
    //tabs切换
    paramsHandleClick() {
      this.getParamsData()
    },
  },
}
</script>

<style lang="less" scoped>
</style>