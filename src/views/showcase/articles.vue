<template>
  <div class="articles-container">
    <div class="header-section" :style="{ backgroundImage: `url(${headerBgImage})` }">
      <div class="header-content">
        <h1>精选好文</h1>
        <p>分享值得阅读的文章</p>
      </div>
    </div>

    <div class="control-panel">
      <div class="left">
        <el-radio-group v-model="currentCategory" class="category-filter">
          <el-radio-button v-for="cat in categories" :key="cat.value" :label="cat.value">
            {{ cat.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleShare">
          <el-icon><Plus /></el-icon>分享文章
        </el-button>
      </div>
    </div>

    <div class="articles-list">
      <el-row :gutter="20">
        <el-col :span="8" v-for="article in filteredArticles" :key="article.id">
          <el-card class="article-card" shadow="hover">
            <div class="article-cover" @click="handleView(article)">
              <el-image 
                :src="article.cover" 
                fit="cover"
                loading="lazy"
              >
                <template #placeholder>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="article-category">
                <el-tag :type="getCategoryType(article.category)" size="small">
                  {{ article.category }}
                </el-tag>
              </div>
            </div>
            <div class="article-content">
              <h3 class="article-title" @click="handleView(article)">
                {{ article.title }}
              </h3>
              <p class="article-desc">{{ article.description }}</p>
              <div class="article-meta">
                <div class="meta-left">
                  <el-avatar :size="24" :src="article.author.avatar" />
                  <span class="author-name">{{ article.author.name }}</span>
                </div>
                <div class="meta-right">
                  <span class="publish-time">{{ article.publishTime }}</span>
                </div>
              </div>
              <div class="article-stats">
                <span class="stat-item">
                  <el-icon><View /></el-icon>
                  {{ article.views }}
                </span>
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ article.likes }}
                </span>
                <span class="stat-item">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ article.comments }}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 分享文章对话框 -->
    <el-dialog
      v-model="shareDialogVisible"
      title="分享文章"
      width="600px"
    >
      <el-form
        ref="shareFormRef"
        :model="shareForm"
        :rules="shareRules"
        label-width="80px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="shareForm.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章链接" prop="url">
          <el-input v-model="shareForm.url" placeholder="请输入文章链接" />
        </el-form-item>
        <el-form-item label="文章封面" prop="cover">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :before-upload="beforeCoverUpload"
            :on-success="handleCoverSuccess"
          >
            <img v-if="shareForm.cover" :src="shareForm.cover" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章分类" prop="category">
          <el-select v-model="shareForm.category" placeholder="请选择分类">
            <el-option
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章描述" prop="description">
          <el-input
            v-model="shareForm.description"
            type="textarea"
            :rows="3"
            placeholder="请简要描述文章内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shareDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitShare">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { Plus, Picture, View, Star, ChatDotRound, Search } from '@element-plus/icons-vue'
import type { FormInstance, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getArticles, uploadPhoto, like } from '@/api/showcase'

// 分类数据
const categories = [
  { label: '全部', value: 'all' },
  { label: '技术', value: 'tech' },
  { label: '设计', value: 'design' },
  { label: '产品', value: 'product' },
  { label: '思考', value: 'thinking' },
  { label: '生活', value: 'life' }
]

// 状态
const currentCategory = ref('all')
const searchKeyword = ref('')
const shareDialogVisible = ref(false)
const shareFormRef = ref<FormInstance>()
const headerBgImage = ref('https://picsum.photos/1920/400') // 随机背景图

// 分享表单
const shareForm = reactive({
  title: '',
  url: '',
  cover: '',
  category: '',
  description: ''
})

// 表单验证规则
const shareRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入文章链接', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入文章描述', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
  ]
}

// 文章数据
const articles = ref([])

// 获取文章列表
const fetchArticles = async () => {
  try {
    const { data } = await getArticles({
      category: currentCategory.value === 'all' ? '' : currentCategory.value,
      keyword: searchKeyword.value
    })
    console.log(data)
    articles.value = data
  } catch (error: any) {
    ElMessage.error(error.message || '获取文章列表失败')
  }
}

// 监听筛选条件变化
watch([currentCategory, searchKeyword], () => {
  fetchArticles()
})

// 计算属性：过滤后的文章列表
const filteredArticles = computed(() => {
  let result = articles.value
  
  if (currentCategory.value !== 'all') {
    result = result.filter(article => article.category === currentCategory.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(keyword) ||
      article.description.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 方法
const handleShare = () => {
  shareDialogVisible.value = true
}

const handleView = (article: any) => {
  window.open(article.url, '_blank')
}

const getCategoryType = (category: string): '' | 'success' | 'warning' | 'info' | 'danger' => {
  const typeMap: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    tech: 'primary',
    design: 'success',
    product: 'warning',
    thinking: 'info',
    life: 'danger'
  }
  return typeMap[category] || ''
}

const beforeCoverUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleCoverSuccess = async (response: any) => {
  shareForm.cover = response.data.url
  ElMessage.success('上传成功')
}

const submitShare = async () => {
  if (!shareFormRef.value) return
  
  try {
    await shareFormRef.value.validate()
    const formData = new FormData()
    formData.append('title', shareForm.title)
    formData.append('url', shareForm.url)
    formData.append('cover', shareForm.cover)
    formData.append('category', shareForm.category)
    formData.append('description', shareForm.description)
    
    await uploadPhoto(formData)
    ElMessage.success('分享成功')
    shareDialogVisible.value = false
    fetchArticles() // 重新获取文章列表
  } catch (error: any) {
    ElMessage.error(error.message || '分享失败')
  }
}

// 生命周期钩子
onMounted(() => {
  fetchArticles()
})
</script>

<style scoped lang="scss">
.articles-container {
  .header-section {
    height: 300px;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    position: relative;
    margin-bottom: 30px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
    }

    .header-content {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      text-align: center;

      h1 {
        font-size: 3em;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }

      p {
        font-size: 1.2em;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }

  .control-panel {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    .right {
      display: flex;
      gap: 10px;

      .search-input {
        width: 300px;
      }
    }
  }

  .articles-list {
    padding: 20px;

    .article-card {
      margin-bottom: 20px;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .article-cover {
        position: relative;
        height: 200px;
        overflow: hidden;
        cursor: pointer;

        .el-image {
          width: 100%;
          height: 100%;
        }

        .article-category {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }

      .article-content {
        padding: 15px;

        .article-title {
          margin: 0 0 10px;
          font-size: 1.2em;
          cursor: pointer;
          
          &:hover {
            color: var(--el-color-primary);
          }
        }

        .article-desc {
          color: #666;
          margin: 0 0 15px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .article-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          .meta-left {
            display: flex;
            align-items: center;
            gap: 8px;

            .author-name {
              color: #666;
              font-size: 14px;
            }
          }

          .publish-time {
            color: #999;
            font-size: 12px;
          }
        }

        .article-stats {
          display: flex;
          gap: 15px;
          color: #999;
          font-size: 14px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }
}

.cover-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .cover {
    width: 200px;
    height: 120px;
    object-fit: cover;
  }

  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 120px;
    text-align: center;
    line-height: 120px;
  }
}
</style>