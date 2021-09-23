<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header_left">
        <img src="../assets/D.png" alt="" />
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isToggleCollapse ? '64px' : '200px'">
        <!-- 折叠菜单栏 -->
        <div class="toggleCollapse" @click="toggleCollapse"><i class="el-icon-s-fold"></i></div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isToggleCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+submenu.path"
              v-for="submenu in item.children"
              :key="submenu.id"
              @click="saveNavState('/'+submenu.path)"
              ><i class="el-icon-menu"></i>
              <span>{{ submenu.authName }}</span></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 获取的菜单列表
      menuList: [],
      // 一级菜单图标
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-setting',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      // 判断菜单是否折叠
      isToggleCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    // 页面加载立即获取栏目列表
    this.getMenuList()
    // 点击栏目时立即把获取到的地址赋值给activePath
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
      // console.log(this.menuList)
    },
    // 折叠左侧菜单
    toggleCollapse () {
      this.isToggleCollapse = !this.isToggleCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header_left {
  display: flex;
  justify-content: center;
  align-items: center;
}
.header_left img {
  width: 40px;
  height: 40px;
}
.header_left h3 {
  color: #eaedf1;
  font-size: 20px;
}
.el-aside {
  background-color: #333744;
  transition: all 0.3s;
  .el-menu {
    border-right: 0;
  }
  .toggleCollapse {
    line-height: 30px;
    background-color: #475163;
    font-size: 20px;
    text-align: center;
    letter-spacing: 0.2rem;
    color: #eaedf1;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
