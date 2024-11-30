<template>
  <div class="confession-mode">
    <div class="post-confession">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>写下你的心事</span>
          </div>
        </template>
        
        <el-form :model="confessionForm" :rules="rules" ref="formRef">
          <el-form-item prop="content">
            <el-input
              v-model="confessionForm.content"
              type="textarea"
              :rows="6"
              placeholder="在这里倾诉你的心事..."
            />
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="confessionForm.isAnonymous">
              匿名发布
            </el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-radio-group v-model="confessionForm.mood">
              <el-radio label="happy">开心</el-radio>
              <el-radio label="normal">平静</el-radio>
              <el-radio label="sad">难过</el-radio>
              <el-radio label="angry">生气</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">
              发布心事
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <div class="confession-list">
      <el-timeline>
        <el-timeline-item
          v-for="item in confessionList"
          :key="item.id"
          :timestamp="item.createTime"
          :type="getMoodType(item.mood)"
        >
          <el-card>
            <div class="confession-content">
              {{ item.content }}
            </div>
            <div class="confession-footer">
              <span class="author">{{ item.isAnonymous ? '匿名用户' : item.author }}</span>
              <el-button text type="primary" @click="handleSupport(item)">
                <el-icon><Star /></el-icon>
                支持 ({{ item.supportCount }})
              </el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Star } from '@element-plus/icons-vue'

const formRef = ref<FormInstance>()
const confessionForm = reactive({
  content: '',
  isAnonymous: false,
  mood: 'normal'
})

const rules = {
  content: [
    { required: true, message: '请输入倾诉内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '内容长度应在10到1000个字符之间', trigger: 'blur' }
  ]
}

// 模拟数据
const confessionList = ref([
  {
    id: 1,
    content: '今天遇到了一件特别开心的事情...',
    author: '用户A',
    isAnonymous: false,
    mood: 'happy',
    createTime: '2024-01-20 14:30',
    supportCount: 5
  },
  {
    id: 2,
    content: '生活总是充满着各种不如意...',
    author: '匿名用户',
    isAnonymous: true,
    mood: 'sad',
    createTime: '2024-01-20 15:45',
    supportCount: 3
  }
])

const getMoodType = (mood: string) => {
  const moodMap: Record<string, "success" | "warning" | "info" | "primary" | "danger"> = {
    happy: 'success',
    normal: 'info',
    sad: 'warning',
    angry: 'danger'
  }
  return moodMap[mood] || 'info'
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // TODO: 实现发布倾诉的接口
    ElMessage.success('发布成功')
    confessionForm.content = ''
    confessionForm.isAnonymous = false
    confessionForm.mood = 'normal'
  } catch (error) {
    // 处理错误
  }
}

const handleSupport = (confession: any) => {
  // TODO: 实现支持功能的接口
  confession.supportCount++
  ElMessage.success('支持成功')
}
</script>

<style scoped lang="scss">
.confession-mode {
  .post-confession {
    margin-bottom: 30px;
  }
  
  .confession-list {
    .confession-content {
      margin-bottom: 10px;
      color: #666;
    }
    
    .confession-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .author {
        color: #999;
        font-size: 14px;
      }
    }
  }
}
</style> 