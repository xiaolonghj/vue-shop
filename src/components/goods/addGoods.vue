<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面板 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="商品添加列表" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="stepActive-0" finish-status="success" align-center class="mt30">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab切换栏 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="stepActive"
          :before-leave="beforeLeave"
          class="mt30"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="addProps"
                @change="handleChange"
                :clearable="true"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
            <!-- 添加商品 -->
            <el-button type="primary" class="mt15" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="picPreviewDialogVisible" width="30%">
      <img :src="picPreviewPath" class="previewImg" alt />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      stepActive: '0',
      tabPosition: 'left',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_cat: [],
        goods_number: 0,
        pics: [],
        goods_introduce: '',
      },
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
        ],
      },
      //商品分类数据
      cateList: [],
      //props
      addProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
      },
      //上传图片请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //图片预览弹窗显示隐藏
      picPreviewDialogVisible: false,
      //图片预览地址
      picPreviewPath: '',
    }
  },
  created() {
    this.getGoodsCate()
  },
  computed: {
    createdId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
    },
  },
  methods: {
    async getGoodsCate() {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    handleChange(value) {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    //切换标签之前钩子函数
    beforeLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3 && oldActiveName == '0') {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    //tabs切换
    async tabClicked() {
      if (this.stepActive === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.createdId}/attributes`,
          {
            params: { sel: 'many' },
          }
        )
        console.log(res.data) //商品参数接口异常无法实现商品属性和商品参数功能
      }
    },
    //上传成功后回调
    handleSuccess(response) {
      const picInf0 = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInf0)
      console.log(this.addForm)
    },
    //删除图片
    handleRemove(file) {
      //1.获取删除图片得路径
      const filePath = file.response.data.tmp_path
      //2.在pics数组中找到对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      //3.通过数组splice方法移除图片
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    //图片预览
    handlePreview(file) {
      console.log(file)
      this.picPreviewPath = file.response.data.url
      this.picPreviewDialogVisible = true
    },
    //添加商品
    add() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入必填项')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        //发起请求添加商品
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.info(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.previewImg {
  width: 100%;
}
</style>