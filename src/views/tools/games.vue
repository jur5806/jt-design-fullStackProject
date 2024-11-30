<template>
  <div class="games-container">
    <div class="header-section">
      <h2>休闲小游戏</h2>
      <p>放松一下，玩个小游戏吧</p>
    </div>

    <div class="games-grid">
      <el-row :gutter="20">
        <el-col :span="8" v-for="game in games" :key="game.id">
          <el-card class="game-card" shadow="hover" @click="handlePlay(game)">
            <div class="game-cover">
              <el-image 
                :src="game.cover" 
                fit="cover"
                loading="lazy"
              >
                <template #placeholder>
                  <div class="image-placeholder">
                    <el-icon><Platform /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="game-tag">
                <el-tag :type="game.isNew ? 'success' : 'info'" size="small">
                  {{ game.isNew ? '新游戏' : game.category }}
                </el-tag>
              </div>
            </div>
            <div class="game-info">
              <h3>{{ game.name }}</h3>
              <p>{{ game.description }}</p>
              <div class="game-meta">
                <span class="play-count">
                  <el-icon><View /></el-icon>
                  已玩 {{ game.playCount }} 次
                </span>
                <span class="rating">
                  <el-rate
                    v-model="game.rating"
                    disabled
                    :max="5"
                    :colors="['#409EFF', '#409EFF', '#409EFF']"
                  />
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 游戏弹窗 -->
    <el-dialog
      v-model="gameDialogVisible"
      :title="currentGame?.name"
      width="80%"
      destroy-on-close
      :fullscreen="isFullscreen"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="dialog-header">
          <h3 :id="titleId" :class="titleClass">{{ currentGame?.name }}</h3>
          <div class="dialog-actions">
            <el-button
              type="primary"
              link
              @click="toggleFullscreen"
            >
              <el-icon>
                <FullScreen v-if="!isFullscreen" />
                <Aim v-else />
              </el-icon>
            </el-button>
            <el-button
              type="primary"
              link
              @click="close"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>
      </template>

      <div class="game-container" :class="{ fullscreen: isFullscreen }">
        <iframe
          v-if="currentGame"
          :src="currentGame.url"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="gameDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleRate" v-if="currentGame">
            评分
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 评分对话框 -->
    <el-dialog
      v-model="rateDialogVisible"
      title="游戏评分"
      width="400px"
      append-to-body
    >
      <div class="rate-form">
        <el-rate
          v-model="rateValue"
          :colors="['#409EFF', '#409EFF', '#409EFF']"
          show-score
        />
        <el-input
          v-model="rateComment"
          type="textarea"
          :rows="3"
          placeholder="说说你的想法..."
        />
      </div>
      <template #footer>
        <el-button @click="rateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRate">提交评分</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Platform, 
  View, 
  FullScreen, 
  Aim, 
  Close 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 游戏数据
const games = ref([
  {
    id: 1,
    name: '2048',
    description: '经典数字益智游戏',
    cover: 'https://picsum.photos/400/300?random=1',
    category: '益智',
    isNew: true,
    playCount: 1234,
    rating: 4.5,
    url: 'https://play2048.co/'
  },
  {
    id: 2,
    name: '贪吃蛇',
    description: '永不过时的经典游戏',
    cover: 'https://picsum.photos/400/300?random=2',
    category: '休闲',
    isNew: false,
    playCount: 2345,
    rating: 4.2,
    url: 'https://playsnake.org/'
  },
  {
    id: 3,
    name: '俄罗斯方块',
    description: '考验反应能力的方块游戏',
    cover: 'https://picsum.photos/400/300?random=3',
    category: '益智',
    isNew: false,
    playCount: 3456,
    rating: 4.8,
    url: 'https://tetris.com/play-tetris'
  }
])

// 状态
const gameDialogVisible = ref(false)
const rateDialogVisible = ref(false)
const isFullscreen = ref(false)
const currentGame = ref<any>(null)
const rateValue = ref(5)
const rateComment = ref('')

// 方法
const handlePlay = (game: any) => {
  currentGame.value = game
  gameDialogVisible.value = true
  // 增加游戏播放次数
  game.playCount++
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const handleRate = () => {
  rateDialogVisible.value = true
}

const submitRate = () => {
  if (currentGame.value) {
    // 这里可以添加评分提交的逻辑
    currentGame.value.rating = (currentGame.value.rating + rateValue.value) / 2
    ElMessage.success('评分成功')
    rateDialogVisible.value = false
    rateValue.value = 5
    rateComment.value = ''
  }
}
</script>

<style scoped lang="scss">
.games-container {
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

  .games-grid {
    .game-card {
      margin-bottom: 20px;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .game-cover {
        position: relative;
        height: 200px;
        overflow: hidden;

        .el-image {
          width: 100%;
          height: 100%;
        }

        .game-tag {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }

      .game-info {
        padding: 15px;

        h3 {
          margin: 0 0 10px;
          font-size: 18px;
          color: var(--el-text-color-primary);
        }

        p {
          margin: 0 0 15px;
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }

        .game-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .play-count {
            color: #999;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 20px;

  h3 {
    margin: 0;
    font-size: 18px;
  }

  .dialog-actions {
    display: flex;
    gap: 10px;
  }
}

.game-container {
  width: 100%;
  height: 600px;
  background: #000;

  &.fullscreen {
    height: calc(100vh - 120px);
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}

.rate-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  .el-rate {
    margin-bottom: 10px;
  }
}
</style> 