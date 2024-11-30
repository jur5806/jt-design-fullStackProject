<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <el-menu
        :router="true"
        :default-active="$route.path"
        class="menu"
      >
        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <span>用户中心</span>
        </el-menu-item>
        <el-menu-item index="/tree-hole">
          <el-icon><ChatDotRound /></el-icon>
          <span>树洞</span>
        </el-menu-item>
        <el-menu-item index="/showcase">
          <el-icon><Picture /></el-icon>
          <span>个人展示</span>
        </el-menu-item>
        <el-menu-item index="/blog">
          <el-icon><Document /></el-icon>
          <span>博客</span>
        </el-menu-item>
        <el-menu-item index="/tools">
          <el-icon><Tools /></el-icon>
          <span>工具箱</span>
        </el-menu-item>
        <el-menu-item index="/interaction">
          <el-icon><ChatLineRound /></el-icon>
          <span>互动</span>
        </el-menu-item>
        <el-menu-item index="/work-templates">
          <el-icon><Collection /></el-icon>
          <span>工作模版</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="toggle-sidebar" @click="toggleSidebar">
            <Fold v-if="!collapsed" />
            <Expand v-else />
          </el-icon>
        </div>
        <div class="header-right">
          <el-dropdown v-if="userStore.userInfo">
            <span class="el-dropdown-link">
              <el-avatar 
                :size="32" 
                :src="userStore.userInfo.avatar"
                v-if="userStore.userInfo.avatar"
              />
              <el-avatar :size="32" v-else>
                {{ userStore.userInfo.username?.charAt(0)?.toUpperCase() }}
              </el-avatar>
              <span class="username">{{ userStore.userInfo.username }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/user')">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  User, 
  ChatDotRound, 
  Picture, 
  Document, 
  Tools, 
  ChatLineRound, 
  Collection,
  ArrowDown,
  Fold,
  Expand,
  SwitchButton
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const collapsed = ref(false)

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await userStore.logout()
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  
  .aside {
    background-color: #304156;
    transition: width 0.3s;
    
    .menu {
      height: 100%;
      border-right: none;
      background-color: transparent;
      
      :deep(.el-menu-item) {
        &.is-active {
          background-color: var(--el-color-primary);
          color: white;
        }
        
        .el-icon {
          margin-right: 10px;
        }
      }
    }
  }
  
  .header {
    background-color: white;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .header-left {
      .toggle-sidebar {
        font-size: 20px;
        cursor: pointer;
        
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
    
    .header-right {
      .el-dropdown-link {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        .username {
          margin: 0 8px;
        }
      }
    }
  }
  
  .main {
    background-color: #f0f2f5;
    padding: 20px;
    
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
}
</style> 