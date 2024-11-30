<template>
  <div class="photo-wall-container">
    <div class="header-section" :style="{ backgroundImage: `url(${headerBgImage})` }">
      <div class="header-content">
        <h1>我的照片墙</h1>
        <p>记录生活中的美好瞬间</p>
      </div>
    </div>

    <div class="control-panel">
      <el-button type="primary" @click="handleUpload">
        <el-icon><Plus /></el-icon>上传照片
      </el-button>
      <el-radio-group v-model="currentCategory" class="category-filter">
        <el-radio-button v-for="cat in categories" :key="cat.value" :label="cat.value">
          {{ cat.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="waterfall-container">
      <div v-masonry transition-duration="0.3s" item-selector=".photo-item" class="waterfall">
        <div v-masonry-tile class="photo-item" v-for="photo in filteredPhotos" :key="photo.id">
          <div class="photo-card" @click="handlePreview(photo)">
            <el-image 
              :src="photo.url" 
              :alt="photo.title"
              fit="cover"
              loading="lazy"
              :preview-src-list="[photo.url]"
            >
              <template #placeholder>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="photo-info">
              <h3>{{ photo.title }}</h3>
              <p>{{ photo.description }}</p>
              <div class="photo-meta">
                <span>{{ photo.date }}</span>
                <div class="photo-actions">
                  <el-button text type="primary" @click.stop="handleLike(photo)">
                    <el-icon><Star /></el-icon>
                    {{ photo.likes }}
                  </el-button>
                  <el-button text type="primary" @click.stop="handleShare(photo)">
                    <el-icon><Share /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传照片" width="500px">
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="uploadForm.title" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="uploadForm.description" rows="3" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="uploadForm.category">
            <el-option 
              v-for="cat in categories" 
              :key="cat.value" 
              :label="cat.label" 
              :value="cat.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="照片" prop="photo">
          <el-upload
            class="photo-uploader"
            action="/api/upload"
            :show-file-list="false"
            :before-upload="beforePhotoUpload"
            :on-success="handlePhotoSuccess"
          >
            <img v-if="uploadForm.photoUrl" :src="uploadForm.photoUrl" class="preview-photo" />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { Plus, Picture, Star, Share } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getPhotos, uploadPhoto, like } from '@/api/showcase'

// 分类数据
const categories = [
  { label: '全部', value: 'all' },
  { label: '风景', value: 'landscape' },
  { label: '美食', value: 'food' },
  { label: '人物', value: 'people' },
  { label: '宠物', value: 'pets' },
  { label: '旅行', value: 'travel' }
]

// 状态
const currentCategory = ref('all')
const uploadDialogVisible = ref(false)
const uploadFormRef = ref<FormInstance>()
const headerBgImage = ref('https://picsum.photos/1920/400') // 随机背景图

// 上传表单
const uploadForm = reactive({
  title: '',
  description: '',
  category: '',
  photoUrl: ''
})

// 表单验证规则
const uploadRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

// 照片数据
const photos = ref([])

// 获取照片列表
const fetchPhotos = async () => {
  try {
    const { data } = await getPhotos({ category: currentCategory.value === 'all' ? '' : currentCategory.value })
    photos.value = data
  } catch (error: any) {
    ElMessage.error(error.message || '获取照片列表失败')
  }
}

// 监听分类变化
watch(currentCategory, () => {
  fetchPhotos()
})

// 过滤后的照片列表
const filteredPhotos = computed(() => {
  if (currentCategory.value === 'all') {
    return photos.value
  }
  return photos.value.filter(photo => photo.category === currentCategory.value)
})

// 方法
const handleUpload = () => {
  uploadDialogVisible.value = true
}

const handlePreview = (photo: any) => {
  // 预览逻辑
}

const handleLike = async (photo: any) => {
  try {
    await like({ id: photo.id, type: 'photo' })
    photo.likes++
    ElMessage.success('点赞成功')
  } catch (error: any) {
    ElMessage.error(error.message || '点赞失败')
  }
}

const handleShare = (photo: any) => {
  ElMessage.success('分享功能开发中...')
}

const beforePhotoUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handlePhotoSuccess = async (response: any) => {
  uploadForm.photoUrl = response.data.url
  ElMessage.success('上传成功')
}

const submitUpload = async () => {
  if (!uploadFormRef.value) return
  
  try {
    await uploadFormRef.value.validate()
    const formData = new FormData()
    formData.append('title', uploadForm.title)
    formData.append('description', uploadForm.description)
    formData.append('category', uploadForm.category)
    formData.append('photo', uploadForm.photoUrl)
    
    await uploadPhoto(formData)
    ElMessage.success('发布成功')
    uploadDialogVisible.value = false
    fetchPhotos() // 重新获取照片列表
  } catch (error: any) {
    ElMessage.error(error.message || '发布失败')
  }
}

// 生命周期钩子
onMounted(() => {
  fetchPhotos()
})
</script>

<style scoped lang="scss">
.photo-wall-container {
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
  }

  .waterfall-container {
    padding: 20px;

    .waterfall {
      margin: 0 -10px;
    }

    .photo-item {
      padding: 10px;
      width: 33.333%;

      @media (max-width: 1200px) {
        width: 50%;
      }

      @media (max-width: 768px) {
        width: 100%;
      }
    }

    .photo-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
      cursor: pointer;

      &:hover {
        transform: translateY(-5px);
      }

      .el-image {
        width: 100%;
        height: 0;
        padding-bottom: 75%;
        position: relative;
        overflow: hidden;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .photo-info {
        padding: 15px;

        h3 {
          margin: 0 0 10px;
          font-size: 1.2em;
        }

        p {
          color: #666;
          margin: 0 0 10px;
        }

        .photo-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #999;
          font-size: 0.9em;
        }
      }
    }
  }
}

.photo-uploader {
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

  .preview-photo {
    width: 200px;
    height: 200px;
    object-fit: cover;
  }

  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    text-align: center;
    line-height: 200px;
  }
}
</style> 