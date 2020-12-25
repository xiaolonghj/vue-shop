<template>
  <div class="categories">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addGoodsCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        border
        :show-row-hover="false"
        class="mt15"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted===false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-circle-close" v-if="scope.row.cat_deleted===true" style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level===1" size="mini">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level===2" size="mini">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="handle" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editCate(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deletaCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="mt15"
      ></el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addCatedialogVisible" width="30%" @close="addCateReset">
      <el-form :model="addCateForm" :rules="addCaterules" ref="addCateForm" label-width="100px">
        <el-form-item label="商品名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="value"
            :options="getCateList"
            :props="cascaderProps"
            style="width:100%"
            @change="handleChange"
            :clearable="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑修改 -->
    <el-dialog
      title="编辑修改"
      :visible.sync="editCatedialogVisible"
      width="30%"
      @close="editCateReset"
    >
      <el-form :model="editCateForm" :rules="editCaterules" ref="editCateForm" label-width="100px">
        <el-form-item label="商品名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //添加分类弹窗显示隐藏属性
      addCatedialogVisible: false,
      //编辑修改弹窗显示隐藏属性
      editCatedialogVisible: false,
      //添加分类表单内容
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      //添加分类表单验证
      addCaterules: {
        cat_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
      },
      //添加分类选择框默认value
      value: [],
      //父级分类数据
      getCateList: [],
      //动态配置props
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover',
      },

      //商品分类数据
      cateList: [],
      //分页初始化参数
      queryInfo: {
        type: 3,
        pagenum: 0,
        pagesize: 5,
      },
      //分页总页数
      total: 0,
      //指定列定义
      columns: [
        {
          label: '大家电',
          prop: 'cat_name',
          width: '300px',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
          width: '300px',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
          width: '300px',
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle',
        },
      ],
      //编辑修改
      editCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      //编辑修改id
      cat_id: '',
      //添加分类表单验证
      editCaterules: {
        cat_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    //获取商品分类数据
    this.getCatList()
  },
  methods: {
    async getCatList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
      //   console.log(res.data)
    },
    //每页显示条数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCatList()
    },
    //当前页码数
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCatList()
    },
    //添加分类弹窗
    addGoodsCateDialog() {
      this.addCatedialogVisible = true
      //获取二级及以上商品分类数据
      this.getCateTypeList()
    },
    //获取二级及以上数据
    async getCateTypeList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.getCateList = res.data
      console.log(res.data)
    },
    //级联选择监听
    handleChange(value) {
      console.log(this.value)
      if (this.value.length > 0) {
        //父级id
        this.addCateForm.cat_pid = this.value[this.value.length - 1]
        //当前等级
        this.addCateForm.cat_level = this.value.length
        return
      } else {
        //父级id
        this.addCateForm.cat_pid = 0
        //当前等级
        this.addCateForm.cat_level = 0
      }
    },
    //更新添加分类
    saveAddCate() {
      this.$refs.addCateForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addCatedialogVisible = false
        this.getCatList()
      })
    },
    //重置表单数据
    addCateReset() {
      this.$refs.addCateForm.resetFields()
      this.value = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //点击编辑操作
    editCate(id) {
      this.editCatedialogVisible = true
      this.cat_id = id
    },
    //保存编辑操作
    saveEditCate() {
      this.$refs.editCateForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.cat_id,
          {
            cat_name: this.editCateForm.cat_name,
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCatList()
        this.editCatedialogVisible = false
      })
    },
    //编辑操作表单重置
    editCateReset() {
      this.$refs.editCateForm.resetFields()
    },
    //删除操作
    async deletaCate(id) {
     const confirmResult =await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(error=>error)
      if(confirmResult==='cancel') return this.$message.info('取消删除')
      const {data:res}=await this.$http.delete('categories/'+id)
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getCatList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>