<template>
  <el-container class="home_container">
    <el-header class="header_box">
      <div class="font_box">
        <img src="~@/assets/img/login.jpg" alt="管理界面" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" class="btn">退出登录</el-button>
    </el-header>
    <el-container class="container_box">
      <!--侧边栏-->
      <el-aside :width="collapse ? '56px' : '200px'" class="aside_box">
        <div class="toggle" @click="toggle">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eef"
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          router
          :default-active="activeIndex"
        >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="fontList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="activeClick"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体-->
      <el-main class="main_box">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      fontList: {
        125: 'iconfont icon-peoplelist',
        103: 'iconfont icon-similar',
        101: 'iconfont icon-present',
        102: 'iconfont icon-copy',
        145: 'iconfont icon-rank'
      },
      collapse: false,
      activeIndex: ''
    }
  },

  components: {},

  computed: {},

  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$request.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return false
      }
      this.menuList = res.data
    },
    toggle() {
      this.collapse = !this.collapse
    },
    activeClick() {
      this.activeIndex = this.$route.path
      sessionStorage.setItem('activeIndex', this.activeIndex)
    }
  },

  created() {
    this.getMenuList()
    this.activeIndex = sessionStorage.getItem('activeIndex')
  }
}
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;

  .header_box {
    position: relative;
    background-color: salmon;

    .font_box {
      height: 60px;
      width: 200px;
      display: flex;
      align-items: center;
      color: snow;
      font-size: 18px;

      img {
        height: 60px;
        border-radius: 50%;
      }

      span {
        margin-left: 10px;
      }
    }

    .btn {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }

  .aside_box {
    background-color: #545c64;

    .toggle {
      text-align: center;
      color: snow;
      letter-spacing: 3px;
      cursor: pointer;
      background-color: #4a5064;
    }

    .el-menu {
      border: none;
    }

    .iconfont {
      margin-right: 4px;
    }
  }

  .main_box {
    background-color: snow;
  }
}
</style>
