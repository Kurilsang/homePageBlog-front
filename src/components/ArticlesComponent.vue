<template>
  <div class="articles-container">
    <div class="rpg-menu-box articles-box" :class="{'appear': isVisible}">
      <h2 class="rpg-heading menu-title" :class="{'slide-in': isVisible}">冒险日志</h2>
      
      <!-- 加载中状态 -->
      <div v-if="loading" class="loading-state">
        <p>正在加载文章...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <p>{{ errorMessage }}</p>
        <button class="retry-button" @click="loadArticles">重试</button>
      </div>
      
      <!-- 内容正常显示 -->
      <div v-else class="menu-items">
        <div v-for="(post, index) in blogPosts" 
             :key="post.id" 
             class="menu-item"
             :class="{ 
               'selected': index === selectedPost,
               'fade-in': isVisible
             }"
             :style="{ 'animation-delay': `${0.3 + index * 0.15}s` }"
             @click="selectPost(index)">
          <div class="cursor-icon" v-if="index === selectedPost">▶</div>
          <div class="item-content">
            <div class="item-cover">
              <img :src="post.coverImage" :alt="post.title" class="cover-image" />
            </div>
            <div class="item-info">
              <h3 class="item-title">{{ post.title }}</h3>
              <p class="item-summary">{{ post.summary }}</p>
              <p class="item-date">{{ post.date }}</p>
            </div>
          </div>
          <div class="pixel-tag" v-if="post.tag">{{ post.tag }}</div>
        </div>
        
        <!-- 没有文章时显示 -->
        <div v-if="blogPosts.length === 0" class="empty-state">
          <p>暂无文章</p>
        </div>
      </div>
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
  </div>
</template>

<script>
import { articleAPI } from '@/api';

export default {
  name: 'ArticlesComponent',
  data() {
    return {
      selectedPost: 0,
      isVisible: false,
      blogPosts: [],
      loading: true,
      error: false,
      errorMessage: '加载文章失败，请稍后重试'
    }
  },
  async mounted() {
    // 先显示组件，再加载数据
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
    
    // 加载文章数据
    await this.loadArticles();
  },
  methods: {
    async loadArticles() {
      this.loading = true;
      this.error = false;
      
      try {
        // 获取文章列表，优先显示置顶文章
        const response = await articleAPI.getArticles({ 
          page: 1, 
          pageSize: 10
        });
        
        if (response && response.articles) {
          this.blogPosts = response.articles;
        } else {
          throw new Error('获取文章失败');
        }
      } catch (error) {
        console.error('加载文章列表失败:', error);
        this.error = true;
        this.errorMessage = '加载文章失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    
    selectPost(index) {
      // 添加选择效果音效或动画逻辑
      const prevSelected = this.selectedPost;
      this.selectedPost = index;
      
      // 如果与当前选中相同，添加弹跳效果
      if (prevSelected === index) {
        const el = document.querySelectorAll('.menu-item')[index];
        el.classList.remove('bounce');
        void el.offsetWidth; // 重置动画
        el.classList.add('bounce');
      }
      
      this.$emit('post-selected', this.blogPosts[index]);
    }
  }
}
</script>

<style scoped lang="scss">
.articles-container {
  width: 100%;
}

.articles-box {
  border: var(--border-width) solid var(--highlight-color);
  padding: 25px;
  position: relative;
  background-color: rgba(16, 15, 75, 0.8);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.appear {
  opacity: 1;
  transform: translateY(0);
}

.menu-title {
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  color: var(--highlight-color);
  font-size: 20px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.5s ease;
}

.slide-in {
  opacity: 1;
  transform: translateX(0);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
  border-left: var(--pixel-size) solid transparent;
  background-color: rgba(20, 20, 80, 0.6);
  border-radius: 2px;
  opacity: 0;
  transform: translateX(-10px);
  min-height: 120px;
  
  &:hover {
    background-color: rgba(20, 20, 80, 0.9);
    border-left-color: var(--highlight-color);
    transform: translateX(5px);
  }
  
  &.selected {
    background-color: rgba(20, 20, 80, 0.9);
    border-left-color: var(--highlight-color);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
  }
  
  &.fade-in {
    animation: menu-item-appear 0.5s forwards;
  }
  
  &.bounce {
    animation: menu-bounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
}

// 加载和错误状态样式
.loading-state, .error-state, .empty-state {
  padding: 20px;
  text-align: center;
  color: var(--text-color);
  background-color: rgba(20, 20, 80, 0.6);
  border-radius: 2px;
}

.retry-button {
  background-color: var(--highlight-color);
  color: var(--primary-color);
  border: none;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
  font-family: inherit;
  border-radius: 2px;
  
  &:hover {
    filter: brightness(1.1);
  }
}

@keyframes menu-item-appear {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes menu-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.cursor-icon {
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--highlight-color);
  animation: cursor-blink 1s infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.item-content {
  display: flex;
  gap: 15px;
}

.item-cover {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border: var(--pixel-size) solid var(--highlight-color);
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex-grow: 1;
}

.item-title {
  font-size: 16px;
  color: var(--accent-color);
  margin-bottom: 8px;
}

.item-summary {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-date {
  font-size: 12px;
  color: var(--muted-color);
}

.pixel-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  background-color: var(--highlight-color);
  color: var(--primary-color);
  padding: 2px 8px;
  border: var(--pixel-border);
}

/* 响应式 */
@media (max-width: 600px) {
  .item-content {
    flex-direction: column;
    gap: 10px;
  }
  
  .item-cover {
    width: 100%;
    height: 150px;
  }
}
</style> 