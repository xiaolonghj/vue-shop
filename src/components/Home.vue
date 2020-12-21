<template>
  <el-container>
    <el-header>
      <a href="##" class="logo">LOGO</a>
      <el-button type="primary" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggleSlider" v-model="isCollapse" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index=" '/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavPath('/' + subitem.path)">
              <template slot>
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: '',
      iconList:{
          '125':'iconfont zfsoft-shenqingrenyonghu',
          '103':'iconfont zfsoft-quanliqingdan',
          '101':'iconfont zfsoft-yaopinxinxichaxun',
          '102':'iconfont zfsoft-fuwuqingdan',
          '145':'iconfont zfsoft-shujuguanli1',

      },
      isCollapse:false,
      activePath:''
    }
  },
  created() {
    this.getMenuList();
    //路由链接赋值到default-active
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 实现退出登录的方法
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //左侧菜单获取数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.menuList = res.data
      // console.log(this.menuList)
    },
    //左侧菜单展开收起
    toggleCollapse(){
        this.isCollapse=!this.isCollapse
    },
    //设置链接路径
    saveNavPath(activePath){
       window.sessionStorage.setItem('activePath', activePath)
    }

  },
}
</script>

<style lang="less" scoped>
.logo {
  font-size: 30px;
  color: #fff;
  float: left;
  text-decoration: none;
}
.el-container {
  height: 100%;
  text-align: left;
}
.el-header {
  background-color: #363d40;
  color: #333;
  text-align: center;
  line-height: 60px;
  text-align: right;
}

.el-aside {
  background-color: #313743;
  color: #333;
  .el-menu{
      border-right: none;
  }
}

.el-main {
  background-color: #ededf1;
  color: #333;
}
.iconfont{
    display: inline-block;
    vertical-align: bottom;
    margin-right: 10px;
}
.toggleSlider{
    width: 100%;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    background-color: #333;
    text-align: center;
    color: #fff;
}
.el-menu-item{
    height: 45px;
    line-height: 45px;
}
.el-menu-item [class^=el-icon-]{
  margin-top: 5px;
}

</style>
