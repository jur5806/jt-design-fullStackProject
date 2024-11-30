<template>
  <div class="message-board">
    <!-- 发布留言区域 -->
    <div class="post-message">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>发布留言</span>
          </div>
        </template>
        
        <el-form :model="messageForm" :rules="rules" ref="formRef">
          <el-form-item prop="content">
            <el-input
              v-model="messageForm.content"
              type="textarea"
              :rows="4"
              placeholder="说点什么吧..."
            />
          </el-form-item>
          
          <el-form-item>
            <el-upload
              class="image-uploader"
              action="/api/upload"
              :show-file-list="true"
              :limit="3"
              list-type="picture-card"
              :before-upload="beforeImageUpload"
              :on-success="handleImageSuccess"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">
              发布留言
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 留言列表 -->
    <div class="message-list">
      <el-card v-for="message in messages" :key="message.id" class="message-item">
        <div class="message-header">
          <div class="user-info">
            <el-avatar :size="40" :src="message.author.avatar">
              {{ message.author.name.charAt(0) }}
            </el-avatar>
            <div class="user-meta">
              <span class="username">{{ message.author.name }}</span>
              <span class="time">{{ message.createTime }}</span>
            </div>
          </div>
          <div class="message-actions">
            <el-button text type="primary" @click="handleReply(message)">
              回复
            </el-button>
          </div>
        </div>
        
        <div class="message-content">
          <p>{{ message.content }}</p>
          <div v-if="message.images?.length" class="message-images">
            <el-image
              v-for="(img, index) in message.images"
              :key="index"
              :src="img"
              :preview-src-list="message.images"
              fit="cover"
              class="message-image"
            />
          </div>
        </div>
        
        <div class="message-footer">
          <el-button 
            text 
            type="primary" 
            :class="{ liked: message.isLiked }"
            @click="handleLike(message)"
          >
            <el-icon><Star /></el-icon>
            {{ message.likes }}
          </el-button>
        </div>

        <!-- 回复列表 -->
        <div v-if="message.replies?.length" class="replies">
          <div v-for="reply in message.replies" :key="reply.id" class="reply-item">
            <div class="reply-header">
              <el-avatar :size="24" :src="reply.author.avatar">
                {{ reply.author.name.charAt(0) }}
              </el-avatar>
              <span class="reply-author">{{ reply.author.name }}</span>
              <span class="reply-time">{{ reply.createTime }}</span>
            </div>
            <div class="reply-content">
              {{ reply.content }}
            </div>
          </div>
        </div>
      </el-card>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <el-button text @click="loadMore">加载更多</el-button>
      </div>
    </div>

    <!-- 回复对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复留言"
      width="500px"
    >
      <el-form :model="replyForm">
        <el-form-item>
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
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
import { Plus, Star } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getMessages, createMessage, replyMessage, likeMessage } from '@/api/interaction'
import type { Message } from '@/api/types/interaction'

// 状态
const formRef = ref<FormInstance>()
const messages = ref<Message[]>([])
const hasMore = ref(true)
const page = ref(1)
const pageSize = 10

// 表单数据
const messageForm = reactive({
  content: '',
  images: [] as string[]
})

const rules = {
  content: [
    { required: true, message: '请输入留言内容', trigger: 'blur' },
    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
  ]
}

// 回复相关
const replyDialogVisible = ref(false)
const replyForm = reactive({
  content: '',
  replyTo: null as number | null
})

// 获取留言列表
const fetchMessages = async () => {
  try {
    const { data } = await getMessages({
      page: page.value,
      pageSize
    })
    if (page.value === 1) {
      messages.value = data.list
    } else {
      messages.value.push(...data.list)
    }
    hasMore.value = data.list.length === pageSize
  } catch (error: any) {
    ElMessage.error(error.message || '获取留言失败')
  }
}

// 加载更多
const loadMore = () => {
  page.value++
  fetchMessages()
}

// 上传图片
const beforeImageUpload = (file: File) => {
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

const handleImageSuccess = (response: any) => {
  messageForm.images.push(response.data.url)
}

// 发布留言
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    await createMessage({
      content: messageForm.content,
      images: messageForm.images
    })
    ElMessage.success('发布成功')
    messageForm.content = ''
    messageForm.images = []
    page.value = 1
    fetchMessages()
  } catch (error: any) {
    ElMessage.error(error.message || '发布失败')
  }
}

// 回复留言
const handleReply = (message: Message) => {
  replyForm.replyTo = message.id
  replyDialogVisible.value = true
}

const submitReply = async () => {
  if (!replyForm.content || !replyForm.replyTo) {
    ElMessage.warning('请输入回复内容')
    return
  }
  
  try {
    await replyMessage(replyForm.replyTo, {
      content: replyForm.content
    })
    ElMessage.success('回复成功')
    replyDialogVisible.value = false
    replyForm.content = ''
    replyForm.replyTo = null
    fetchMessages()
  } catch (error: any) {
    ElMessage.error(error.message || '回复失败')
  }
}

// 点赞
const handleLike = async (message: Message) => {
  try {
    await likeMessage(message.id)
    message.likes++
    message.isLiked = true
    ElMessage.success('点赞成功')
  } catch (error: any) {
    ElMessage.error(error.message || '点赞失败')
  }
}

// 初始化
fetchMessages()
</script>

<style scoped lang="scss">
.message-board {
  .post-message {
    margin-bottom: 30px;
  }

  .message-list {
    .message-item {
      margin-bottom: 20px;

      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;

          .user-meta {
            .username {
              display: block;
              font-weight: bold;
              color: var(--el-text-color-primary);
            }

            .time {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }
        }
      }

      .message-content {
        margin-bottom: 15px;

        p {
          margin-bottom: 10px;
          color: var(--el-text-color-regular);
          line-height: 1.5;
        }

        .message-images {
          display: flex;
          gap: 10px;
          margin-top: 10px;

          .message-image {
            width: 120px;
            height: 120px;
            border-radius: 4px;
            cursor: pointer;
          }
        }
      }

      .message-footer {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        border-top: 1px solid var(--el-border-color-lighter);

        .liked {
          color: var(--el-color-danger);
        }
      }

      .replies {
        margin-top: 15px;
        padding: 15px;
        background-color: var(--el-fill-color-lighter);
        border-radius: 4px;

        .reply-item {
          margin-bottom: 15px;

          &:last-child {
            margin-bottom: 0;
          }

          .reply-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;

            .reply-author {
              font-weight: bold;
              color: var(--el-text-color-primary);
            }

            .reply-time {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }

          .reply-content {
            color: var(--el-text-color-regular);
            padding-left: 32px;
          }
        }
      }
    }

    .load-more {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style> 