<template>
  <div class="articles-container">
    <div class="rpg-menu-box articles-box" :class="{'appear': isVisible}">
      <h2 class="rpg-heading menu-title" :class="{'slide-in': isVisible}">冒险日志</h2>
      <div class="menu-items">
        <div v-for="(post, index) in blogPosts" 
             :key="index" 
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
      </div>
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticlesComponent',
  data() {
    return {
      selectedPost: 0,
      isVisible: false,
      blogPosts: [
        {
          id: 1,
          title: '像素艺术创作技巧',
          summary: '探索像素艺术的基础技巧，从基本形状到高级着色方法，帮助你创建令人惊叹的8位风格插图。',
          coverImage: '/images/blog/pixel-art.jpg',
          date: '2024-03-20',
          tag: '艺术'
        },
        {
          id: 2,
          title: '复古游戏开发笔记',
          summary: '记录使用现代工具开发具有复古风格游戏的过程，包括游戏机制设计和像素完美的界面实现。',
          coverImage: '/images/blog/retro-game.jpg',
          date: '2024-03-15',
          tag: '开发'
        },
        {
          id: 3,
          title: '8-bit音乐合成指南',
          summary: '学习如何创作令人怀旧的8位音乐，从基础的声波形式到创建完整的复古游戏配乐。',
          coverImage: '/images/blog/8bit-music.jpg',
          date: '2024-03-10',
          tag: '音乐'
        }
      ]
    }
  },
  mounted() {
    // 组件挂载后等待200ms再开始动画
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
  },
  methods: {
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
  animation: blink 0.8s infinite;
  color: var(--highlight-color);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.item-content {
  display: flex;
  gap: 15px;
}

.item-cover {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: var(--pixel-size) solid var(--highlight-color);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .menu-item:hover & {
    transform: scale(1.1);
  }
}

.item-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: var(--highlight-color);
}

.item-summary {
  font-size: 14px;
  color: #a9b7d0;
  margin: 0 0 10px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-date {
  font-size: 12px;
  color: var(--accent-color);
  margin: auto 0 0 0;
}

.pixel-tag {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: var(--accent-color);
  color: var(--dark-color);
  font-size: 12px;
  padding: 3px 8px;
  border: var(--pixel-size) solid var(--highlight-color);
  animation: tag-pulse 2s infinite;
}

@keyframes tag-pulse {
  0%, 100% { 
    transform: scale(1); 
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.05); 
    filter: brightness(1.2);
  }
}
</style> 