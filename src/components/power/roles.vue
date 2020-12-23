<template>
  <div class="role">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe class="mt15">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="item in scope.row.children"
              :key="item.id"
              class="bottom vcenter demo-block"
            >
              <el-col :span="6">
                <el-tag closable @close="removeRoleId(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row v-for="item02 in item.children" :key="item02.id" class="vcenter">
                  <el-col :span="12">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRoleId(scope.row,item02.id)"
                    >{{item02.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="12">
                    <el-tag
                      type="warning"
                      v-for="item03 in item02.children"
                      :key="item03.id"
                      closable
                      @close="removeRoleId(scope.row,item03.id)"
                    >{{item03.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="children">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRole(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="setRolesDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRolesdialogVisible" width="30%" @close="resetFields">
      <el-form :model="addrRuleForm" :rules="addRules" ref="addrRuleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addrRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addrRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色列表 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesdialogVisible" width="30%">
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editRuleForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限" :visible.sync="setRolesdialogVisible" @close="setRolesDialogClose">
      <el-tree
        :data="treeList"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="treeId"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      setRolesdialogVisible: false,
      addRolesdialogVisible: false,
      editRolesdialogVisible: false,
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      //权限列表默认选中id数组
      treeId: [],
      //角色权限id
      roleId: '',
      addrRuleForm: {
        roleName: '',
        roleDesc: '',
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      //编辑角色
      editRuleForm: {
        roleName: '',
        roleDesc: '',
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      userId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    //根据id删除对应的权限
    async removeRoleId(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      role.children = res.data
    },
    //分配权限弹窗
    async setRolesDialog(role) {
      this.setRolesdialogVisible = true
      //获取用户权限列表
      const { data: res } = await this.$http.get('rights/tree')
      this.treeList = res.data
      //递归获取三级id
      this.getKeys(role, this.treeId)
      //角色权限id赋值
      this.roleId = role.id
    },
    //通过递归的形式获取三级权限的id并且保存到数组中
    getKeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach((item) => {
        this.getKeys(item, arr)
      })
    },
    //分配权限对话框关闭清空数组id
    setRolesDialogClose() {
      this.treeId = []
    },
    //分配角色权限
    async allRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      //确定分配权限
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      //更新列表
      this.getRolesList()
      //刷新保存
      this.setRolesdialogVisible = false
    },
    //添加角色
    addRoleDialog() {
      this.addRolesdialogVisible = true
    },
    //保存添加角色信息
    saveRole() {
      this.$refs.addrRuleForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addrRuleForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        //关闭弹窗
        this.addRolesdialogVisible = false
        //更新数据
        this.getRolesList()
      })
    },
    //添加角色信息重置
    resetFields() {
      this.$refs.addrRuleForm.resetFields()
    },
    //编辑角色信息
    async editRole(roleId) {
      this.editRolesdialogVisible = true
      const { data: res } = await this.$http.get('roles/' + roleId)
      this.editRuleForm = res.data
      this.userId = roleId
    },
    //保存修改角色
    saveEditRole() {
      this.$refs.editRuleForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.userId, {
          roleName: this.editRuleForm.roleName,
          roleDesc: this.editRuleForm.roleDesc,
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.editRolesdialogVisible = false
      })
    },
    //删除角色
   async deleteRole(roleId) {
     const confirmResult =await this.$confirm('此操作将删除该角色列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(error=>error)
      if(confirmResult!=='confirm') return this.$message.info('取消删除')
      const{data:res} = await this.$http.delete('roles/' + roleId)
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>