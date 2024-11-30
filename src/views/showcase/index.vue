<template>
  <div class="showcase-container">
    <!-- 照片墙部分 -->
    <div class="section photo-section">
      <div class="section-header">
        <h2>照片墙</h2>
        <el-button type="primary" @click="$router.push('/showcase/photo-wall')">
          更多照片
        </el-button>
      </div>
      <photo-wall :preview-mode="true" />
    </div>

    <!-- 好文列表部分 -->
    <div class="section articles-section">
      <div class="section-header">
        <h2>好文推荐</h2>
        <el-button type="primary" @click="$router.push('/showcase/articles')">
          更多文章
        </el-button>
      </div>
      <articles :preview-mode="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PhotoWall from './photo-wall.vue'
import Articles from './articles.vue'
</script>

<style scoped lang="scss">
.showcase-container {
  padding: 20px;

  .section {
    margin-bottom: 40px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        margin: 0;
        font-size: 24px;
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style> 