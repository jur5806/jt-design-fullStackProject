<template>
  <div class="tree-hole">
    <el-tabs v-model="activeTab" class="tree-hole-tabs">
      <el-tab-pane label="提问模式" name="question">
        <router-view v-if="activeTab === 'question'" />
      </el-tab-pane>
      <el-tab-pane label="倾述模式" name="confession">
        <router-view v-if="activeTab === 'confession'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('question')

watch(activeTab, (newVal) => {
  router.push(`/tree-hole/${newVal}`)
})
</script>

<style scoped lang="scss">
.tree-hole {
  padding: 20px;
  
  .tree-hole-tabs {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
  }
}
</style> 