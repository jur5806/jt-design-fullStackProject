<template>
  <div class="bookmarks-container">
    <div class="header-section">
      <h2>我的收藏夹</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加收藏
      </el-button>
    </div>

    <div class="filter-section">
      <el-select v-model="currentCategory" placeholder="选择分类" clearable>
        <el-option
          v-for="cat in categories"
          :key="cat.value"
          :label="cat.label"
          :value="cat.value"
        />
      </el-select>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索收藏"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="bookmarks-list">
      <el-row :gutter="20">
        <el-col :span="8" v-for="bookmark in filteredBookmarks" :key="bookmark.id">
          <el-card class="bookmark-card" shadow="hover">
            <div class="bookmark-header">
              <div class="site-info" @click="handleVisit(bookmark)">
                <img :src="bookmark.icon" class="site-icon" alt="icon" />
                <span class="site-title">{{ bookmark.title }}</span>
              </div>
              <div class="actions">
                <el-dropdown trigger="click">
                  <el-icon><More /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleEdit(bookmark)">
                        <el-icon><Edit /></el-icon>编辑
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleDelete(bookmark)" divided>
                        <el-icon><Delete /></el-icon>删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <div class="bookmark-content">
              <p class="description">{{ bookmark.description || '暂无描述' }}</p>
              <div class="tags">
                <el-tag 
                  v-for="tag in bookmark.tags" 
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="bookmark-footer">
              <span class="category">{{ getCategoryLabel(bookmark.category) }}</span>
              <span class="visit-count">访问次数：{{ bookmark.visitCount }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 添加/编辑收藏对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑收藏' : '添加收藏'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入网址" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
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
            v-model="form.tags"
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
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { Plus, Search, More, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBookmarks, createBookmark, updateBookmark, deleteBookmark, visitBookmark } from '@/api/tools'

// 分类数据
const categories = [
  { label: '全部', value: 'all' },
  { label: '开发工具', value: 'dev' },
  { label: '技术社区', value: 'community' },
  { label: '学习资源', value: 'learn' },
  { label: '工具网站', value: 'tools' },
  { label: '娱乐休闲', value: 'entertainment' }
]

// 所有标签
const allTags = ref<string[]>([])

// 状态
const currentCategory = ref('')
const searchKeyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const bookmarks = ref([])

// 表单数据
const form = reactive({
  id: 0,
  title: '',
  url: '',
  category: '',
  tags: [] as string[],
  description: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入URL', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

// 获取收藏列表
const fetchBookmarks = async () => {
  try {
    const { data } = await getBookmarks({
      category: currentCategory.value,
      keyword: searchKeyword.value
    })
    bookmarks.value = data
    // 收集所有标签
    const tags = new Set<string>()
    data.forEach((bookmark: any) => {
      bookmark.tags.forEach((tag: string) => tags.add(tag))
    })
    allTags.value = Array.from(tags)
  } catch (error: any) {
    ElMessage.error(error.message || '获取收藏列表失败')
  }
}

// 监听筛选条件变化
watch([currentCategory, searchKeyword], () => {
  fetchBookmarks()
})

// 计算属性：过滤后的收藏列表
const filteredBookmarks = computed(() => bookmarks.value)

// 方法
const handleAdd = () => {
  isEdit.value = false
  form.id = 0
  form.title = ''
  form.url = ''
  form.category = ''
  form.tags = []
  form.description = ''
  dialogVisible.value = true
}

const handleEdit = (bookmark: any) => {
  isEdit.value = true
  form.id = bookmark.id
  form.title = bookmark.title
  form.url = bookmark.url
  form.category = bookmark.category
  form.tags = [...bookmark.tags]
  form.description = bookmark.description || ''
  dialogVisible.value = true
}

const handleDelete = (bookmark: any) => {
  ElMessageBox.confirm(
    '确定要删除这个收藏吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteBookmark(bookmark.id)
      ElMessage.success('删除成功')
      fetchBookmarks()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  }).catch(() => {})
}

const handleVisit = async (bookmark: any) => {
  try {
    await visitBookmark(bookmark.id)
    window.open(bookmark.url, '_blank')
  } catch (error: any) {
    ElMessage.error(error.message || '访问失败')
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      await updateBookmark({ id: form.id, ...form })
    } else {
      await createBookmark(form)
    }
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    dialogVisible.value = false
    fetchBookmarks()
  } catch (error: any) {
    ElMessage.error(error.message || (isEdit.value ? '更新失败' : '添加失败'))
  }
}

const getCategoryLabel = (value: string) => {
  return categories.find(cat => cat.value === value)?.label || value
}

// 初始化
fetchBookmarks()
</script>

<style scoped lang="scss">
.bookmarks-container {
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
    gap: 20px;
    margin-bottom: 20px;

    .search-input {
      width: 300px;
    }
  }

  .bookmarks-list {
    .bookmark-card {
      margin-bottom: 20px;
      
      .bookmark-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .site-info {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;

          .site-icon {
            width: 24px;
            height: 24px;
          }

          .site-title {
            font-weight: bold;
            color: var(--el-color-primary);

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .actions {
          .el-icon {
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;

            &:hover {
              background-color: var(--el-fill-color-light);
            }
          }
        }
      }

      .bookmark-content {
        .description {
          color: #666;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
      }

      .bookmark-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;
        font-size: 12px;

        .category {
          background-color: var(--el-fill-color-light);
          padding: 2px 8px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style> 