<template>
  <div class="question-mode">
    <div class="post-question">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>发布提问</span>
          </div>
        </template>
        
        <el-form :model="questionForm" :rules="rules" ref="formRef">
          <el-form-item prop="title">
            <el-input
              v-model="questionForm.title"
              placeholder="请输入问题标题"
            />
          </el-form-item>
          
          <el-form-item prop="content">
            <el-input
              v-model="questionForm.content"
              type="textarea"
              :rows="4"
              placeholder="请详细描述您的问题"
            />
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="questionForm.isAnonymous">
              匿名发布
            </el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">
              发布问题
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <div class="question-list">
      <el-card v-for="item in questionList" :key="item.id" class="question-item">
        <template #header>
          <div class="question-header">
            <span class="title">{{ item.title }}</span>
            <span class="author">{{ item.isAnonymous ? '匿名用户' : item.author }}</span>
          </div>
        </template>
        <div class="question-content">
          {{ item.content }}
        </div>
        <div class="question-footer">
          <span class="time">{{ item.createTime }}</span>
          <div class="actions">
            <el-button text type="primary" @click="handleReply(item)">
              回复
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 回复对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复问题"
      width="500px"
    >
      <el-form :model="replyForm">
        <el-form-item>
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入您的回复"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="replyForm.isAnonymous">
            匿名回复
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">提交回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()
const questionForm = reactive({
  title: '',
  content: '',
  isAnonymous: false
})

const rules = {
  title: [
    { required: true, message: '请输入问题标题', trigger: 'blur' },
    { min: 3, max: 50, message: '标题长度应在3到50个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入问题内容', trigger: 'blur' },
    { min: 10, max: 500, message: '内容长度应在10到500个字符之间', trigger: 'blur' }
  ]
}

// 模拟数据
const questionList = ref([
  {
    id: 1,
    title: '如何看待现代社会压力？',
    content: '最近感觉工作压力很大，想听听大家的想法和建议...',
    author: '用户A',
    isAnonymous: false,
    createTime: '2024-01-20 14:30'
  },
  {
    id: 2,
    title: '你们是如何平衡工作和生活的？',
    content: '总感觉时间不够用，想知道大家是怎么安排时间的...',
    author: '匿名用户',
    isAnonymous: true,
    createTime: '2024-01-20 15:45'
  }
])

const replyDialogVisible = ref(false)
const replyForm = reactive({
  content: '',
  isAnonymous: false,
  questionId: null as number | null
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // TODO: 实现发布问题的接口
    ElMessage.success('发布成功')
    questionForm.title = ''
    questionForm.content = ''
    questionForm.isAnonymous = false
  } catch (error) {
    // 处理错误
  }
}

const handleReply = (question: any) => {
  replyForm.questionId = question.id
  replyDialogVisible.value = true
}

const submitReply = () => {
  if (!replyForm.content) {
    ElMessage.warning('请输入回复内容')
    return
  }
  // TODO: 实现回复的接口
  ElMessage.success('回复成功')
  replyDialogVisible.value = false
  replyForm.content = ''
  replyForm.isAnonymous = false
  replyForm.questionId = null
}
</script>

<style scoped lang="scss">
.question-mode {
  .post-question {
    margin-bottom: 20px;
  }
  
  .question-list {
    .question-item {
      margin-bottom: 20px;
      
      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .title {
          font-weight: bold;
        }
        
        .author {
          color: #999;
          font-size: 14px;
        }
      }
      
      .question-content {
        margin: 10px 0;
        color: #666;
      }
      
      .question-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        
        .time {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}
</style> 