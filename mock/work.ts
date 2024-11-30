import { MockMethod } from 'vite-plugin-mock'
import type { ComponentTemplate, IconResource } from '@/api/types/work'

// 模拟组件模板数据
const templates: ComponentTemplate[] = [
  {
    id: 1,
    name: '响应式数据表格',
    description: '一个功能完整的响应式数据表格组件，支持排序、筛选、分页等功能',
    category: 'table',
    tags: ['表格', '数据展示', '响应式'],
    preview: 'https://picsum.photos/400/300?random=1',
    code: `<template>
  <div class="responsive-table">
    <!-- 组件代码 -->
  </div>
</template>`,
    framework: 'vue',
    dependencies: ['element-plus', '@vueuse/core'],
    createTime: '2024-01-20',
    author: {
      id: 1,
      name: '开发者A',
      avatar: 'https://picsum.photos/50/50?random=1'
    },
    downloads: 1234,
    likes: 88
  },
  {
    id: 2,
    name: '图片上传组件',
    description: '支持拖拽上传、预览、裁剪的图片上传组件',
    category: 'form',
    tags: ['上传', '图片处理', '表单'],
    preview: 'https://picsum.photos/400/300?random=2',
    code: `const ImageUploader = () => {
  // 组件代码
}`,
    framework: 'react',
    dependencies: ['antd', 'react-cropper'],
    createTime: '2024-01-19',
    author: {
      id: 2,
      name: '开发者B',
      avatar: 'https://picsum.photos/50/50?random=2'
    },
    downloads: 856,
    likes: 66
  },
  {
    id: 3,
    name: '响应式轮播图',
    description: '支持自动播放、无限循环、手势滑动的轮播图组件',
    category: 'components',
    tags: ['轮播图', '响应式', '交互'],
    preview: 'https://picsum.photos/400/300?random=3',
    code: `<template>
  <div class="carousel-container" @mouseenter="pause" @mouseleave="play">
    <div class="carousel-wrapper" 
      :style="wrapperStyle"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div v-for="(item, index) in displayItems" 
        :key="index"
        class="carousel-item"
      >
        <img :src="item.image" :alt="item.title">
        <div class="carousel-caption">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- 指示器 -->
    <div class="carousel-indicators">
      <span v-for="(_, index) in items" 
        :key="index"
        :class="{ active: activeIndex === index }"
        @click="goTo(index)"
      ></span>
    </div>
    
    <!-- 控制按钮 -->
    <button class="carousel-button prev" @click="prev">
      <el-icon><ArrowLeft /></el-icon>
    </button>
    <button class="carousel-button next" @click="next">
      <el-icon><ArrowRight /></el-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

interface CarouselItem {
  image: string
  title: string
  description: string
}

interface Props {
  items: CarouselItem[]
  autoplay?: boolean
  interval?: number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  interval: 3000,
  duration: 500
})

const activeIndex = ref(0)
const timer = ref<NodeJS.Timeout>()
const touchStartX = ref(0)
const touchDeltaX = ref(0)
const isAnimating = ref(false)

// 计算属性：展示项目（包含首尾过渡项）
const displayItems = computed(() => {
  const last = props.items[props.items.length - 1]
  const first = props.items[0]
  return [last, ...props.items, first]
})

// 计算属性：包装器样式
const wrapperStyle = computed(() => {
  const translateX = -(activeIndex.value + 1) * 100 - touchDeltaX.value
  return {
    transform: \`translateX(\${translateX}%)\`,
    transition: isAnimating.value ? \`transform \${props.duration}ms\` : ''
  }
})

// 自动播放
const play = () => {
  if (props.autoplay && !timer.value) {
    timer.value = setInterval(next, props.interval)
  }
}

// 暂停自动播放
const pause = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = undefined
  }
}

// 切换到指定索引
const goTo = (index: number) => {
  if (isAnimating.value) return
  isAnimating.value = true
  activeIndex.value = index
  setTimeout(() => {
    isAnimating.value = false
    // 处理边界情况
    if (index === props.items.length) {
      activeIndex.value = 0
    } else if (index === -1) {
      activeIndex.value = props.items.length - 1
    }
  }, props.duration)
}

// 上一张
const prev = () => {
  goTo(activeIndex.value - 1)
}

// 下一张
const next = () => {
  goTo(activeIndex.value + 1)
}

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  pause()
  touchStartX.value = e.touches[0].clientX
  touchDeltaX.value = 0
  isAnimating.value = false
}

const handleTouchMove = (e: TouchEvent) => {
  touchDeltaX.value = ((e.touches[0].clientX - touchStartX.value) / window.innerWidth) * 100
}

const handleTouchEnd = () => {
  const threshold = 20 // 滑动阈值（百分比）
  if (Math.abs(touchDeltaX.value) > threshold) {
    touchDeltaX.value > 0 ? prev() : next()
  }
  touchDeltaX.value = 0
  play()
}

// 生命周期钩子
onMounted(() => {
  play()
})

onUnmounted(() => {
  pause()
})
</script>

<style scoped lang="scss">
.carousel-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  
  .carousel-wrapper {
    display: flex;
    height: 100%;
    
    .carousel-item {
      flex-shrink: 0;
      width: 100%;
      height: 100%;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .carousel-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        color: white;
        
        h3 {
          margin: 0 0 10px;
          font-size: 24px;
        }
        
        p {
          margin: 0;
          font-size: 16px;
        }
      }
    }
  }
  
  .carousel-indicators {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    
    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.3s;
      
      &.active {
        background: white;
        transform: scale(1.2);
      }
    }
  }
  
  .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }
    
    &.prev {
      left: 20px;
    }
    
    &.next {
      right: 20px;
    }
  }
}
</style>`,
    framework: 'vue',
    dependencies: ['vue', '@element-plus/icons-vue'],
    createTime: '2024-01-18',
    author: {
      id: 3,
      name: '开发者C',
      avatar: 'https://picsum.photos/50/50?random=3'
    },
    downloads: 567,
    likes: 45
  }
]

// 模拟图标资源数据
const icons: IconResource[] = [
  {
    id: 1,
    name: '用户图标',
    category: 'ui',
    tags: ['用户', '个人', '头像'],
    svg: '<svg>...</svg>',
    createTime: '2024-01-20',
    downloads: 234
  },
  {
    id: 2,
    name: '设置图标',
    category: 'action',
    tags: ['设置', '配置', '工具'],
    svg: '<svg>...</svg>',
    createTime: '2024-01-19',
    downloads: 156
  }
]

export default [
  // 获取组件模板列表
  {
    url: '/api/work/templates',
    method: 'get',
    response: ({ query }) => {
      let result = [...templates]
      
      // 框架筛选
      if (query.framework && query.framework !== 'all') {
        result = result.filter(template => template.framework === query.framework)
      }
      
      // 分类筛选
      if (query.category) {
        result = result.filter(template => template.category === query.category)
      }
      
      // 标签筛选
      if (query.tag) {
        result = result.filter(template => template.tags.includes(query.tag))
      }
      
      // 关键词搜索
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        result = result.filter(template => 
          template.name.toLowerCase().includes(keyword) ||
          template.description.toLowerCase().includes(keyword)
        )
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: result
      }
    }
  },

  // 获取组件模板详情
  {
    url: '/api/work/templates/:id',
    method: 'get',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop() || '0')
      const template = templates.find(t => t.id === id)
      
      if (!template) {
        return {
          code: 404,
          message: '模板不存在'
        }
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: template
      }
    }
  },

  // 下载组件模板
  {
    url: '/api/work/templates/:id/download',
    method: 'get',
    response: ({ url }) => {
      const id = parseInt(url.split('/').slice(-2)[0])
      const template = templates.find(t => t.id === id)
      
      if (!template) {
        return {
          code: 404,
          message: '模板不存在'
        }
      }
      
      template.downloads++
      
      return {
        code: 200,
        message: '下载成功',
        data: {
          code: template.code,
          dependencies: template.dependencies
        }
      }
    }
  },

  // 点赞组件模板
  {
    url: '/api/work/templates/:id/like',
    method: 'post',
    response: ({ url }) => {
      const id = parseInt(url.split('/').slice(-2)[0])
      const template = templates.find(t => t.id === id)
      
      if (!template) {
        return {
          code: 404,
          message: '模板不存在'
        }
      }
      
      template.likes++
      
      return {
        code: 200,
        message: '点赞成功',
        data: template
      }
    }
  },

  // 获取图标列表
  {
    url: '/api/work/icons',
    method: 'get',
    response: ({ query }) => {
      let result = [...icons]
      
      // 分类筛选
      if (query.category) {
        result = result.filter(icon => icon.category === query.category)
      }
      
      // 标签筛选
      if (query.tag) {
        result = result.filter(icon => icon.tags.includes(query.tag))
      }
      
      // 关键词搜索
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        result = result.filter(icon => 
          icon.name.toLowerCase().includes(keyword)
        )
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: result
      }
    }
  },

  // 下载图标
  {
    url: '/api/work/icons/:id/download',
    method: 'get',
    response: ({ url, query }) => {
      const id = parseInt(url.split('/').slice(-2)[0])
      const icon = icons.find(i => i.id === id)
      
      if (!icon) {
        return {
          code: 404,
          message: '图标不存在'
        }
      }
      
      // 处理自定义参数
      let svg = icon.svg
      if (query.color) {
        svg = svg.replace(/fill="[^"]*"/g, `fill="${query.color}"`)
      }
      if (query.size) {
        svg = svg.replace(/width="[^"]*"/g, `width="${query.size}"`)
        svg = svg.replace(/height="[^"]*"/g, `height="${query.size}"`)
      }
      
      icon.downloads++
      
      return {
        code: 200,
        message: '下载成功',
        data: {
          content: query.format === 'png' ? 'base64...' : svg
        }
      }
    }
  }
] as MockMethod[] 