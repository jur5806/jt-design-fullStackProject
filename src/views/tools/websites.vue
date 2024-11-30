<template>
  <div class="websites-container">
    <div class="header-section">
      <h2>网站导航</h2>
      <el-button type="primary" @click="handleShare">
        <el-icon><Plus /></el-icon>分享网站
      </el-button>
    </div>

    <div class="filter-section">
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
          placeholder="搜索网站"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 推荐网站 -->
    <div v-if="currentCategory === 'all'" class="recommended-section">
      <h3>推荐网站</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="site in recommendedSites" :key="site.id">
          <el-card class="site-card" shadow="hover" @click="handleVisit(site)">
            <div class="site-icon">
              <img :src="site.icon" :alt="site.title">
            </div>
            <h4>{{ site.title }}</h4>
            <p>{{ site.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 网站列表 -->
    <div class="websites-list">
      <div v-for="category in groupedSites" :key="category.value" class="category-section">
        <h3>{{ category.label }}</h3>
        <el-row :gutter="20">
          <el-col :span="8" v-for="site in category.sites" :key="site.id">
            <el-card class="website-card" shadow="hover">
              <div class="website-header" @click="handleVisit(site)">
                <img :src="site.icon" class="website-icon" :alt="site.title">
                <span class="website-title">{{ site.title }}</span>
              </div>
              <div class="website-content">
                <p class="description">{{ site.description }}</p>
                <div class="tags">
                  <el-tag 
                    v-for="tag in site.tags" 
                    :key="tag"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="website-footer">
                <span class="visit-count">访问 {{ site.visitCount }}</span>
                <el-button 
                  text 
                  type="primary" 
                  :class="{ liked: site.isLiked }"
                  @click.stop="handleLike(site)"
                >
                  <el-icon><Star /></el-icon>
                  {{ site.likeCount }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 分享网站对话框 -->
    <el-dialog
      v-model="shareDialogVisible"
      title="分享网站"
      width="500px"
    >
      <el-form
        ref="shareFormRef"
        :model="shareForm"
        :rules="shareRules"
        label-width="80px"
      >
        <el-form-item label="网站名称" prop="title">
          <el-input v-model="shareForm.title" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="shareForm.url" placeholder="请输入网站地址" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="shareForm.category" placeholder="请选择分类">
            <el-option
              v-for="cat in categories.filter(c => c.value !== 'all')"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="shareForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入标签"
          >
            <el-option
              v-for="tag in allTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="shareForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入网站描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shareDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { Plus, Search, Star } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getWebsites, getWebsiteCategories, createWebsite, likeWebsite, visitWebsite } from '@/api/tools'
import type { Website } from '@/api/types/tools'

// 分类数据
const categories = [
  { label: '全部', value: 'all' },
  { label: '开发工具', value: 'dev' },
  { label: '设计资源', value: 'design' },
  { label: '效率工具', value: 'productivity' },
  { label: '学习资源', value: 'learn' },
  { label: '娱乐休闲', value: 'entertainment' }
]

// 状态
const currentCategory = ref('all')
const searchKeyword = ref('')
const shareDialogVisible = ref(false)
const shareFormRef = ref<FormInstance>()
const websites = ref<Website[]>([])
const allTags = ref<string[]>([])

// 表单数据
const shareForm = reactive({
  title: '',
  url: '',
  category: '',
  tags: [] as string[],
  description: ''
})

// 表单验证规则
const shareRules = {
  title: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入网站地址', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入网站描述', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
  ]
}

// 获取网站列表
const fetchWebsites = async () => {
  try {
    const { data } = await getWebsites({
      category: currentCategory.value === 'all' ? undefined : currentCategory.value,
      keyword: searchKeyword.value
    })
    websites.value = data
    // 收集所有标签
    const tags = new Set<string>()
    data.forEach(site => {
      site.tags.forEach(tag => tags.add(tag))
    })
    allTags.value = Array.from(tags)
  } catch (error: any) {
    ElMessage.error(error.message || '获取网站列表失败')
  }
}

// 监听筛选条件变化
watch([currentCategory, searchKeyword], () => {
  fetchWebsites()
})

// 计算属性
const recommendedSites = computed(() => {
  return websites.value.filter(site => site.isRecommended)
})

const groupedSites = computed(() => {
  const groups = categories.filter(cat => cat.value !== 'all').map(cat => ({
    ...cat,
    sites: websites.value.filter(site => site.category === cat.value)
  }))
  return groups.filter(group => group.sites.length > 0)
})

// 方法
const handleShare = () => {
  shareDialogVisible.value = true
}

const handleVisit = async (site: Website) => {
  try {
    await visitWebsite(site.id)
    window.open(site.url, '_blank')
  } catch (error: any) {
    ElMessage.error(error.message || '访问失败')
  }
}

const handleLike = async (site: Website) => {
  try {
    await likeWebsite(site.id)
    site.likeCount++
    site.isLiked = true
    ElMessage.success('点赞成功')
  } catch (error: any) {
    ElMessage.error(error.message || '点赞失败')
  }
}

const handleSubmit = async () => {
  if (!shareFormRef.value) return
  
  try {
    await shareFormRef.value.validate()
    await createWebsite(shareForm)
    ElMessage.success('分享成功')
    shareDialogVisible.value = false
    fetchWebsites()
  } catch (error: any) {
    ElMessage.error(error.message || '分享失败')
  }
}

// 初始化
fetchWebsites()
</script>

<style scoped lang="scss">
.websites-container {
  padding: 20px;

  .header-section {
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

  .filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .search-input {
      width: 300px;
    }
  }

  .recommended-section {
    margin-bottom: 40px;

    h3 {
      margin-bottom: 20px;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    .site-card {
      height: 200px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .site-icon {
        margin: 20px 0;
        
        img {
          width: 48px;
          height: 48px;
        }
      }

      h4 {
        margin: 10px 0;
        font-size: 16px;
      }

      p {
        color: var(--el-text-color-secondary);
        font-size: 14px;
        @include text-overflow(2);
      }
    }
  }

  .category-section {
    margin-bottom: 30px;

    h3 {
      margin-bottom: 20px;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    .website-card {
      margin-bottom: 20px;

      .website-header {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;

        .website-icon {
          width: 24px;
          height: 24px;
        }

        .website-title {
          font-weight: bold;
          color: var(--el-color-primary);

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .website-content {
        margin: 15px 0;

        .description {
          color: #666;
          margin-bottom: 10px;
          @include text-overflow(2);
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
      }

      .website-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;
        font-size: 12px;

        .liked {
          color: var(--el-color-danger);
        }
      }
    }
  }
}

// 文本溢出省略混入
@mixin text-overflow($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style> 