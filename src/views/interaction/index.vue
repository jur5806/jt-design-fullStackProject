<template>
  <div class="interaction-container">
    <el-tabs v-model="activeTab" class="interaction-tabs">
      <el-tab-pane label="聊天室" name="chat">
        <chat-room v-if="activeTab === 'chat'" />
      </el-tab-pane>
      <el-tab-pane label="留言板" name="message">
        <message-board v-if="activeTab === 'message'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatRoom from './chat.vue'
import MessageBoard from './message-board.vue'

const activeTab = ref('chat')
</script>

<style scoped lang="scss">
.interaction-container {
  padding: 20px;
  
  .interaction-tabs {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}
</style> 