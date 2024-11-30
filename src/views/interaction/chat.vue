<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>实时聊天室</h3>
      <el-select v-model="currentRoom" placeholder="选择聊天室">
        <el-option
          v-for="room in rooms"
          :key="room.value"
          :label="room.label"
          :value="room.value"
        />
      </el-select>
    </div>

    <div class="chat-messages" ref="messagesRef">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message-item"
        :class="{ 'is-mine': message.sender.id === currentUser.id }"
      >
        <div class="message-avatar">
          <el-avatar :size="40" :src="message.sender.avatar">
            {{ message.sender.name.charAt(0) }}
          </el-avatar>
        </div>
        <div class="message-content">
          <div class="message-info">
            <span class="sender-name">{{ message.sender.name }}</span>
            <span class="message-time">{{ message.createTime }}</span>
          </div>
          <div class="message-body">
            <template v-if="message.type === 'text'">
              {{ message.content }}
            </template>
            <template v-else-if="message.type === 'image'">
              <el-image 
                :src="message.content" 
                :preview-src-list="[message.content]"
                class="message-image"
              />
            </template>
            <template v-else-if="message.type === 'file'">
              <div class="file-message">
                <el-icon><Document /></el-icon>
                <span class="file-name">{{ message.content }}</span>
                <el-button type="primary" link>下载</el-button>
              </div>
            </template>
          </div>
          <div v-if="message.replyTo" class="reply-content">
            <div class="reply-info">
              回复 {{ message.replyTo.sender.name }}:
            </div>
            <div class="reply-text">{{ message.replyTo.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <div class="input-toolbar">
        <el-upload
          class="upload-image"
          action="/api/upload"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
          :on-success="handleImageSuccess"
        >
          <el-button type="primary" link>
            <el-icon><Picture /></el-icon>
          </el-button>
        </el-upload>
        <el-upload
          class="upload-file"
          action="/api/upload"
          :show-file-list="false"
          :before-upload="beforeFileUpload"
          :on-success="handleFileSuccess"
        >
          <el-button type="primary" link>
            <el-icon><Folder /></el-icon>
          </el-button>
        </el-upload>
      </div>
      <div class="input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="输入消息..."
          @keyup.enter.native="handleSend"
        />
        <el-button 
          type="primary" 
          :disabled="!inputMessage.trim()" 
          @click="handleSend"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { Picture, Document, Folder } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getChatMessages, sendChatMessage } from '@/api/interaction'
import { useUserStore } from '@/stores/user'

// 房间数据
const rooms = [
  { label: '综合讨论', value: 'general' },
  { label: '技术交流', value: 'tech' },
  { label: '生活闲聊', value: 'life' }
]

// 状态
const currentRoom = ref('general')
const messages = ref([])
const inputMessage = ref('')
const messagesRef = ref<HTMLElement>()
const userStore = useUserStore()

// 当前用户
const currentUser = computed(() => userStore.userInfo)

// 获取消息列表
const fetchMessages = async () => {
  try {
    const { data } = await getChatMessages(currentRoom.value)
    messages.value = data
    await nextTick()
    scrollToBottom()
  } catch (error: any) {
    ElMessage.error(error.message || '获取消息失败')
  }
}

// 发送消息
const handleSend = async () => {
  if (!inputMessage.value.trim()) return
  
  try {
    const { data } = await sendChatMessage({
      content: inputMessage.value,
      type: 'text',
      room: currentRoom.value
    })
    messages.value.push(data)
    inputMessage.value = ''
    await nextTick()
    scrollToBottom()
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  }
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

const handleImageSuccess = async (response: any) => {
  try {
    const { data } = await sendChatMessage({
      content: response.data.url,
      type: 'image',
      room: currentRoom.value
    })
    messages.value.push(data)
    await nextTick()
    scrollToBottom()
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  }
}

// 上传文件
const beforeFileUpload = (file: File) => {
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

const handleFileSuccess = async (response: any) => {
  try {
    const { data } = await sendChatMessage({
      content: response.data.url,
      type: 'file',
      room: currentRoom.value
    })
    messages.value.push(data)
    await nextTick()
    scrollToBottom()
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// 监听房间变化
watch(currentRoom, () => {
  fetchMessages()
})

// 初始化
onMounted(() => {
  fetchMessages()
})
</script>

<style scoped lang="scss">
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .chat-header {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    .message-item {
      display: flex;
      margin-bottom: 20px;

      &.is-mine {
        flex-direction: row-reverse;

        .message-content {
          margin-left: 0;
          margin-right: 10px;

          .message-info {
            flex-direction: row-reverse;
          }

          .message-body {
            background-color: var(--el-color-primary-light-9);
          }
        }
      }

      .message-content {
        margin-left: 10px;
        max-width: 70%;

        .message-info {
          display: flex;
          align-items: center;
          margin-bottom: 5px;

          .sender-name {
            font-weight: bold;
            margin-right: 10px;
          }

          .message-time {
            color: #999;
            font-size: 12px;
          }
        }

        .message-body {
          background-color: var(--el-fill-color-light);
          padding: 10px;
          border-radius: 4px;
          word-break: break-all;

          .message-image {
            max-width: 300px;
            max-height: 200px;
            cursor: pointer;
          }

          .file-message {
            display: flex;
            align-items: center;
            gap: 10px;

            .file-name {
              flex: 1;
              @include text-overflow;
            }
          }
        }

        .reply-content {
          margin-top: 5px;
          padding: 5px 10px;
          background-color: var(--el-fill-color);
          border-radius: 4px;
          font-size: 12px;

          .reply-info {
            color: var(--el-color-primary);
            margin-bottom: 3px;
          }

          .reply-text {
            color: var(--el-text-color-regular);
          }
        }
      }
    }
  }

  .chat-input {
    border-top: 1px solid var(--el-border-color-light);
    padding: 20px;

    .input-toolbar {
      margin-bottom: 10px;
      display: flex;
      gap: 10px;
    }

    .input-area {
      display: flex;
      gap: 10px;

      .el-input {
        flex: 1;
      }
    }
  }
}
</style> 