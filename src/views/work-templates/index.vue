<template>
  <div class="work-templates-container">
    <div class="header-section">
      <h2>工作模板</h2>
      <p>前端开发常用组件和资源</p>
    </div>

    <!-- 分类切换 -->
    <div class="category-section">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="组件模板" name="components">
          <div class="filter-bar">
            <div class="left">
              <el-radio-group v-model="currentFramework" class="framework-filter">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="vue">Vue</el-radio-button>
                <el-radio-button label="react">React</el-radio-button>
                <el-radio-button label="angular">Angular</el-radio-button>
              </el-radio-group>
            </div>
            <div class="right">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索组件"
                class="search-input"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </div>

          <!-- 组件列表 -->
          <div class="templates-grid">
            <el-row :gutter="20">
              <el-col :span="8" v-for="template in filteredTemplates" :key="template.id">
                <el-card class="template-card" shadow="hover">
                  <div class="template-preview" @click="handlePreview(template)">
                    <el-image 
                      :src="template.preview" 
                      fit="cover"
                      loading="lazy"
                    >
                      <template #placeholder>
                        <div class="image-placeholder">
                          <el-icon><Picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                    <div class="framework-tag">
                      <el-tag :type="getFrameworkType(template.framework)">
                        {{ template.framework.toUpperCase() }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="template-info">
                    <h3>{{ template.name }}</h3>
                    <p>{{ template.description }}</p>
                    <div class="template-meta">
                      <div class="meta-left">
                        <el-avatar :size="24" :src="template.author.avatar">
                          {{ template.author.name.charAt(0) }}
                        </el-avatar>
                        <span class="author-name">{{ template.author.name }}</span>
                      </div>
                      <div class="meta-right">
                        <el-button text type="primary" @click.stop="handleDownload(template)">
                          <el-icon><Download /></el-icon>
                          {{ template.downloads }}
                        </el-button>
                        <el-button text type="primary" @click.stop="handleLike(template)">
                          <el-icon><Star /></el-icon>
                          {{ template.likes }}
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="图标资源" name="icons">
          <div class="filter-bar">
            <div class="left">
              <el-select v-model="currentCategory" placeholder="选择分类" clearable>
                <el-option
                  v-for="cat in iconCategories"
                  :key="cat.value"
                  :label="cat.label"
                  :value="cat.value"
                />
              </el-select>
            </div>
            <div class="right">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索图标"
                class="search-input"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </div>

          <!-- 图标列表 -->
          <div class="icons-grid">
            <el-row :gutter="16">
              <el-col :span="4" v-for="icon in filteredIcons" :key="icon.id">
                <div class="icon-item" @click="handleIconClick(icon)">
                  <div class="icon-preview" v-html="icon.svg"></div>
                  <div class="icon-name">{{ icon.name }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 组件预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="currentTemplate?.name"
      width="80%"
      top="5vh"
    >
      <div class="preview-container">
        <div class="preview-demo">
          <iframe :src="previewUrl" frameborder="0"></iframe>
        </div>
        <div class="preview-code">
          <el-tabs>
            <el-tab-pane label="代码">
              <pre><code>{{ currentTemplate?.code }}</code></pre>
            </el-tab-pane>
            <el-tab-pane label="依赖">
              <div class="dependencies">
                <el-tag
                  v-for="dep in currentTemplate?.dependencies"
                  :key="dep"
                  class="dependency-item"
                >
                  {{ dep }}
                </el-tag>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>

    <!-- 图标设置对话框 -->
    <el-dialog
      v-model="iconDialogVisible"
      :title="currentIcon?.name"
      width="400px"
    >
      <div class="icon-settings">
        <div class="icon-preview" v-html="currentIcon?.svg"></div>
        <el-form :model="iconForm" label-width="80px">
          <el-form-item label="大小">
            <el-slider v-model="iconForm.size" :min="16" :max="128" />
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="iconForm.color" />
          </el-form-item>
          <el-form-item label="格式">
            <el-radio-group v-model="iconForm.format">
              <el-radio-button label="svg">SVG</el-radio-button>
              <el-radio-button label="png">PNG</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="iconDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleIconDownload">下载</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { 
  Search, 
  Picture, 
  Download, 
  Star 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { 
  getTemplates, 
  getIcons, 
  downloadTemplate, 
  likeTemplate,
  downloadIcon 
} from '@/api/work'
import type { ComponentTemplate, IconResource } from '@/api/types/work'

// 状态
const activeTab = ref('components')
const currentFramework = ref('all')
const currentCategory = ref('')
const searchKeyword = ref('')
const previewDialogVisible = ref(false)
const iconDialogVisible = ref(false)
const templates = ref<ComponentTemplate[]>([])
const icons = ref<IconResource[]>([])
const currentTemplate = ref<ComponentTemplate | null>(null)
const currentIcon = ref<IconResource | null>(null)
const previewUrl = ref('')

// 图标设置表单
const iconForm = ref({
  size: 32,
  color: '#333333',
  format: 'svg'
})

// 图标分类
const iconCategories = [
  { label: '用户界面', value: 'ui' },
  { label: '操作图标', value: 'action' },
  { label: '文件类型', value: 'file' },
  { label: '社交媒体', value: 'social' },
  { label: '天气图标', value: 'weather' }
]

// 获取数据
const fetchTemplates = async () => {
  try {
    const { data } = await getTemplates({
      framework: currentFramework.value === 'all' ? undefined : currentFramework.value,
      keyword: searchKeyword.value
    })
    templates.value = data
  } catch (error: any) {
    ElMessage.error(error.message || '获取模板列表失败')
  }
}

const fetchIcons = async () => {
  try {
    const { data } = await getIcons({
      category: currentCategory.value,
      keyword: searchKeyword.value
    })
    icons.value = data
  } catch (error: any) {
    ElMessage.error(error.message || '获取图标列表失败')
  }
}

// 计算属性
const filteredTemplates = computed(() => templates.value)
const filteredIcons = computed(() => icons.value)

// 方法
const getFrameworkType = (framework: string) => {
  const typeMap: Record<string, string> = {
    vue: 'success',
    react: 'primary',
    angular: 'danger'
  }
  return typeMap[framework] || 'info'
}

const handlePreview = (template: ComponentTemplate) => {
  currentTemplate.value = template
  previewUrl.value = `/preview/${template.id}` // 这里需要实际的预览URL
  previewDialogVisible.value = true
}

const handleDownload = async (template: ComponentTemplate) => {
  try {
    await downloadTemplate(template.id)
    template.downloads++
    ElMessage.success('下载成功')
  } catch (error: any) {
    ElMessage.error(error.message || '下载失败')
  }
}

const handleLike = async (template: ComponentTemplate) => {
  try {
    await likeTemplate(template.id)
    template.likes++
    ElMessage.success('点赞成功')
  } catch (error: any) {
    ElMessage.error(error.message || '点赞失败')
  }
}

const handleIconClick = (icon: IconResource) => {
  currentIcon.value = icon
  iconDialogVisible.value = true
}

const handleIconDownload = async () => {
  if (!currentIcon.value) return
  
  try {
    await downloadIcon(currentIcon.value.id, {
      format: iconForm.value.format,
      size: iconForm.value.size,
      color: iconForm.value.color
    })
    currentIcon.value.downloads++
    iconDialogVisible.value = false
    ElMessage.success('下载成功')
  } catch (error: any) {
    ElMessage.error(error.message || '下载失败')
  }
}

// 监听筛选条件变化
watch([currentFramework, searchKeyword], () => {
  if (activeTab.value === 'components') {
    fetchTemplates()
  }
})

watch([currentCategory, searchKeyword], () => {
  if (activeTab.value === 'icons') {
    fetchIcons()
  }
})

// 初始化
onMounted(() => {
  fetchTemplates()
})

// 切换标签页时加载数据
watch(activeTab, (newTab) => {
  if (newTab === 'icons' && icons.value.length === 0) {
    fetchIcons()
  }
})
</script>

<style scoped lang="scss">
.work-templates-container {
  padding: 20px;

  .header-section {
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

  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .search-input {
      width: 300px;
    }
  }

  .templates-grid {
    .template-card {
      margin-bottom: 20px;

      .template-preview {
        position: relative;
        height: 200px;
        overflow: hidden;
        cursor: pointer;

        .el-image {
          width: 100%;
          height: 100%;
        }

        .framework-tag {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }

      .template-info {
        padding: 15px;

        h3 {
          margin: 0 0 10px;
          font-size: 16px;
          color: var(--el-text-color-primary);
        }

        p {
          margin: 0 0 15px;
          color: var(--el-text-color-secondary);
          font-size: 14px;
          @include text-overflow(2);
        }

        .template-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .meta-left {
            display: flex;
            align-items: center;
            gap: 8px;

            .author-name {
              font-size: 14px;
              color: var(--el-text-color-regular);
            }
          }
        }
      }
    }
  }

  .icons-grid {
    .icon-item {
      text-align: center;
      padding: 20px;
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: var(--el-color-primary);
        transform: translateY(-2px);
      }

      .icon-preview {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;

        svg {
          width: 24px;
          height: 24px;
        }
      }

      .icon-name {
        font-size: 12px;
        color: var(--el-text-color-regular);
        @include text-overflow;
      }
    }
  }
}

.preview-container {
  display: flex;
  gap: 20px;
  height: 600px;

  .preview-demo {
    flex: 1;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .preview-code {
    flex: 1;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: auto;

    pre {
      margin: 0;
      padding: 15px;
    }

    .dependencies {
      padding: 15px;

      .dependency-item {
        margin: 0 10px 10px 0;
      }
    }
  }
}

.icon-settings {
  text-align: center;

  .icon-preview {
    margin-bottom: 20px;

    svg {
      width: 64px;
      height: 64px;
    }
  }
}
</style> 