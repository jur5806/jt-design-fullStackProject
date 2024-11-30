<template>
  <div class="tools-container">
    <div class="tools-header">
      <h2>工具箱</h2>
      <p>实用工具集合</p>
    </div>

    <div class="tools-grid">
      <el-row :gutter="20">
        <el-col :span="6" v-for="tool in tools" :key="tool.path">
          <el-card 
            class="tool-card" 
            shadow="hover" 
            @click="$router.push(`/tools/${tool.path}`)"
          >
            <div class="tool-icon">
              <el-icon :size="32">
                <component :is="tool.icon" />
              </el-icon>
            </div>
            <div class="tool-info">
              <h3>{{ tool.name }}</h3>
              <p>{{ tool.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { 
  Collection, 
  Folder, 
  Platform, 
  Link
} from '@element-plus/icons-vue'

const tools = [
  {
    name: '收藏夹',
    path: 'bookmarks',
    icon: Collection,
    description: '收藏和整理有价值的网页内容'
  },
  {
    name: '文件库',
    path: 'files',
    icon: Folder,
    description: '管理和分享各类文件资源'
  },
  {
    name: '小游戏',
    path: 'games',
    icon: Platform,
    description: '休闲放松的小游戏集合'
  },
  {
    name: '网站导航',
    path: 'websites',
    icon: Link,
    description: '发现和分享有趣的网站'
  }
]
</script>

<style scoped lang="scss">
.tools-container {
  padding: 20px;

  .tools-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      font-size: 28px;
      color: var(--el-text-color-primary);
      margin-bottom: 10px;
    }

    p {
      color: var(--el-text-color-secondary);
      font-size: 16px;
    }
  }

  .tools-grid {
    .tool-card {
      height: 180px;
      margin-bottom: 20px;
      cursor: pointer;
      transition: transform 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;

      &:hover {
        transform: translateY(-5px);
      }

      .tool-icon {
        margin-bottom: 15px;
        color: var(--el-color-primary);
      }

      .tool-info {
        h3 {
          margin: 0 0 10px;
          font-size: 18px;
          color: var(--el-text-color-primary);
        }

        p {
          margin: 0;
          font-size: 14px;
          color: var(--el-text-color-secondary);
          line-height: 1.5;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 