<template>
  <div class="blog-container">
    <div class="blog-header">
      <el-button type="primary" @click="handleCreate">
        写文章
      </el-button>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="blog-filter">
      <el-tag
        v-for="tag in tags"
        :key="tag.value"
        :type="activeTag === tag.value ? 'primary' : 'info'"
        class="filter-tag"
        @click="handleTagClick(tag.value)"
      >
        {{ tag.label }}
      </el-tag>
    </div>

    <div class="blog-list">
      <el-card v-for="blog in filteredBlogs" :key="blog.id" class="blog-item">
        <div class="blog-title" @click="handleViewBlog(blog)">
          {{ blog.title }}
        </div>
        <div class="blog-summary">{{ blog.summary }}</div>
        <div class="blog-meta">
          <div class="meta-left">
            <el-tag size="small" type="info">{{ blog.category }}</el-tag>
            <span class="publish-time">{{ blog.publishTime }}</span>
          </div>
          <div class="meta-right">
            <span class="view-count">
              <el-icon><View /></el-icon>
              {{ blog.viewCount }}
            </span>
            <span class="like-count">
              <el-icon><Star /></el-icon>
              {{ blog.likeCount }}
            </span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 创建/编辑博客对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑文章' : '写文章'"
      width="80%"
      :before-close="handleDialogClose"
    >
      <el-form :model="blogForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="blogForm.title" />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="blogForm.category">
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <Editor
              v-model="blogForm.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onBeforeUnmount } from 'vue'
import { Search, View, Star } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getBlogList, createBlog, updateBlog, deleteBlog } from '@/api/blog'

// 编辑器实例
const editorRef = ref<IDomEditor | null>(null)

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
}

// 编辑器模式
const mode = 'default'

// 标签数据
const tags = [
  { label: '全部', value: 'all' },
  { label: '日常', value: 'daily' },
  { label: '技术', value: 'tech' },
  { label: '生活', value: 'life' },
  { label: '推荐', value: 'recommend' }
]

// 分类数据
const categories = [
  { label: '日常记录', value: 'daily' },
  { label: '技术分享', value: 'tech' },
  { label: '生活感悟', value: 'life' },
  { label: '好物推荐', value: 'recommend' }
]

// 状态
const activeTag = ref('all')
const searchKeyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const blogForm = reactive({
  title: '',
  category: '',
  content: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 3, max: 50, message: '标题长度应在3到50个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
}

// 博客数据
const blogs = ref([])

// 获取博客列表
const fetchBlogs = async () => {
  try {
    const { data } = await getBlogList({
      category: activeTag.value === 'all' ? undefined : activeTag.value,
      keyword: searchKeyword.value
    })
    blogs.value = data.list
  } catch (error: any) {
    ElMessage.error(error.message || '获取博客列表失败')
  }
}

// 计算属性：过滤后的博客列表
const filteredBlogs = computed(() => {
  let result = blogs.value
  
  if (activeTag.value !== 'all') {
    result = result.filter(blog => blog.category === activeTag.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(blog => 
      blog.title.toLowerCase().includes(keyword) ||
      blog.summary.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 方法
const handleTagClick = (tag: string) => {
  activeTag.value = tag
}

const handleCreate = () => {
  isEdit.value = false
  dialogVisible.value = true
}

const handleViewBlog = (blog: any) => {
  // TODO: 实现博客详情页跳转
  console.log('查看博客:', blog)
}

const handleDialogClose = () => {
  dialogVisible.value = false
  blogForm.title = ''
  blogForm.category = ''
  blogForm.content = ''
}

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const params = {
      title: blogForm.title,
      category: blogForm.category,
      content: blogForm.content,
      summary: blogForm.content.substring(0, 200), // 取前200字作为摘要
      status: 'published'
    }
    
    if (isEdit.value) {
      await updateBlog(params)
    } else {
      await createBlog(params)
    }
    
    ElMessage.success('保存成功')
    handleDialogClose()
    fetchBlogs()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

// 组件销毁时销毁编辑器实例
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped lang="scss">
.blog-container {
  padding: 20px;
  
  .blog-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .search-input {
      width: 300px;
    }
  }
  
  .blog-filter {
    margin-bottom: 20px;
    
    .filter-tag {
      margin-right: 10px;
      cursor: pointer;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  .blog-list {
    .blog-item {
      margin-bottom: 20px;
      
      .blog-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        cursor: pointer;
        
        &:hover {
          color: var(--el-color-primary);
        }
      }
      
      .blog-summary {
        color: #666;
        margin-bottom: 10px;
      }
      
      .blog-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .meta-left {
          display: flex;
          align-items: center;
          
          .publish-time {
            margin-left: 10px;
            color: #999;
            font-size: 14px;
          }
        }
        
        .meta-right {
          .view-count,
          .like-count {
            margin-left: 15px;
            color: #999;
            font-size: 14px;
            
            .el-icon {
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
}

.editor-container {
  border: 1px solid #ccc;
  z-index: 100;
  
  :deep(.w-e-text-container) {
    height: 500px !important;
  }
}
</style> 