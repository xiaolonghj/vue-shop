<template>
  <div class="userList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryList.query"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <div class="mt15">
        <el-table :data="usersList" border stripe>
          <el-table-column type="index" label="序号" width="80px"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template v-slot="scope">
              <!-- {{scope.row}} -->
              <el-switch v-model="scope.row.mg_state" @change="switchStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="180">
            <template v-slot="scope">
              <!-- {{scope.row}} -->
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deletDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="mt15">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryList.pagenum"
            :page-sizes="[1, 2, 4, 10]"
            :page-size="queryList.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <!-- 添加用户弹窗 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="closeDialogReset">
        <el-form :model="addRuleForm" :rules="addFormRules" ref="addRuleForm" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addRuleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addRuleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮件" prop="email">
            <el-input v-model="addRuleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addRuleForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户弹窗 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogReset"
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除用户数据弹窗 -->

      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%">
        <div class="role-item">
          <p>当前用户名：{{userInfo.username}}</p>
          <p>当前角色：{{userInfo.role_name}}</p>
          <p>
            分配角色：
            <el-select v-model="roleValue" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮件规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
      if (regEmail.test(value)) {
        callback()
      }
      callback(new Error('邮箱格式错误'))
    }
    //验证电话号码
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^(((13[0-9]{1})|(14[57]{1})|(15[012356789]{1})|(17[03678]{1})|(18[0-9]{1})|(19[89]{1})|(16[6]{1}))+\d{8})$/
      if (regPhone.test(value)) {
        callback()
      }
      callback(new Error('手机号码格式错误'))
    }
    return {
      queryList: {
        query: '',
        //当前页数
        pagenum: 1,
        //每页显示多少条
        pagesize: 2,
      },
      pagenum: 0,
      total: 0,
      usersList: [],
      dialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      userInfo: [],
      roleList: [],
      roleValue: '',
      //添加表单
      addRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮件', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
      //编辑表单
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮件', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    //获取用户数据
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryList,
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.pagenum = res.data.pagenum
      this.total = res.data.total
      this.usersList = res.data.users
      //console.log(this.total)
    },
    //绑定每页显示页数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryList.pagesize = val
      this.getUsersList()
    },
    //绑定当前页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryList.pagenum = val
      this.getUsersList()
    },
    //更新用户状态
    async switchStatus(userInf) {
      const { data: res } = await this.$http.put(
        `users/${userInf.id}/state/${userInf.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新状态失败')
        userInf.mg_state = !userInf.mg_state
      }
      this.$message.success('更新状态成功')
    },
    //弹窗关闭表单重置
    closeDialogReset() {
      this.$refs.addRuleForm.resetFields()
    },
    //添加用户
    addUser() {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (!valid) return
        //发送添加用户请求
        const { data: res } = await this.$http.post('users', this.addRuleForm)
        //console.log(res.data)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getUsersList()
      })
    },
    //修改用户弹窗
    async showEditDialog(id) {
      // console.log(id);
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },
    //重置修改表单数据
    editDialogReset() {
      this.$refs.editForm.resetFields()
    },
    //提交修改数据
    editUser() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据
        this.getUsersList()
        //提示修改成功
        this.$message.success(res.meta.msg)
      })
    },
    //删除用户数据提示弹窗
    async deletDialog(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      //如果用户取消了删除返回的为字符串"cancle"
      //如果用户确认了删除返回的字符串为"confirm"
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUsersList()
    },
    //分配角色对话框
    async setRole(userInfo) {
      this.setRoleDialogVisible = true
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res, meta.msg)
      this.$message.success(res.meta.msg)
      this.roleList = res.data
      console.log(this.roleList)
    },
    //保存修改角色
    async saveRole() {
      if (!this.roleValue) return this.$message.error('请选择角色分配')
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.roleValue,
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRoleDialogVisible = false
      this.getUsersList()
    }
  },
}
</script>

<style lang="less" scoped>
</style>