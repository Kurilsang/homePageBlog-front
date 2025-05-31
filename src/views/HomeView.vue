<template>
  <div class="home-view">
    <!-- 主内容区域 -->
    <div class="content-area">
      <!-- 使用Vue过渡效果 -->
      <transition name="fade-slide" mode="out-in">
        <!-- 个人简介部分 -->
        <section id="profile" class="content-section" v-if="activeSection === 'profile'" key="profile">
          <ProfileComponent />
        </section>
        
        <!-- 文章列表部分 -->
        <section id="articles" class="content-section" v-else-if="activeSection === 'articles'" key="articles">
          <ArticlesComponent @post-selected="handlePostSelected" />
        </section>
      </transition>
    </div>

    <!-- 设计说明部分 -->
    <section class="design-notes">
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
      <h2 class="notes-title">设计说明</h2>
      <div class="notes-content">
        <div class="note-item">
          <h3>设计灵感</h3>
          <p>此设计灵感来源于早期RPG游戏如《最终幻想》和《勇者斗恶龙》等8-bit时代的经典作品，呈现原汁原味的复古像素风。</p>
        </div>
        <div class="note-item">
          <h3>配色方案</h3>
          <p>采用蓝色系为主的多彩配色，辅以金色高亮和粉色点缀，保留了像素边缘和纹理，增强复古游戏感。</p>
        </div>
        <div class="note-item">
          <h3>设计元素</h3>
          <p>包含经典RPG元素：导航菜单、对话框、选择菜单、像素化头像和指针，边框采用明显的像素块状结构，文字使用点阵字体。</p>
        </div>
        <div class="note-item">
          <h3>交互设计</h3>
          <p>菜单选择带有指针动画，模拟游戏中的选择效果；整体布局紧凑，一屏内完整呈现所有内容。</p>
        </div>
      </div>
    </section>
    
    <!-- 音乐播放器 -->
    <MusicPlayerComponent />
  </div>
</template>

<script>
import ProfileComponent from '@/components/ProfileComponent.vue';
import ArticlesComponent from '@/components/ArticlesComponent.vue';
import MusicPlayerComponent from '@/components/MusicPlayerComponent.vue';

export default {
  name: 'HomeView',
  components: {
    ProfileComponent,
    ArticlesComponent,
    MusicPlayerComponent
  },
  data() {
    return {
      activeSection: 'profile', // 默认显示简介部分
    }
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section;
      // 强制滚动到顶部
      window.scrollTo(0, 0);
    },
    
    handlePostSelected(post) {
      console.log('Selected post:', post);
      // 导航到文章详情页
      this.$router.push({ name: 'Article', params: { id: post.id } })
        .catch(err => {
          // 忽略重复导航错误
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
    }
  },
  mounted() {
    // 监听导航事件
    this.$root.$on('set-active-section', this.setActiveSection);
    
    // 检查URL参数中是否有section
    const sectionParam = this.$route.query.section;
    if (sectionParam && ['profile', 'articles'].includes(sectionParam)) {
      this.activeSection = sectionParam;
    }
  },
  beforeDestroy() {
    // 移除事件监听器
    this.$root.$off('set-active-section', this.setActiveSection);
  },
  watch: {
    // 监听路由变化
    '$route.query.section': function(newSection) {
      if (newSection && ['profile', 'articles'].includes(newSection)) {
        this.activeSection = newSection;
      }
    }
  }
};
</script>

<style scoped>
.home-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.content-area {
  margin-bottom: 40px;
}

.content-section {
  width: 100%;
  margin-bottom: 30px;
}

/* 设计说明区域样式 */
.design-notes {
  margin-top: 40px;
  padding: 20px;
  background-color: rgba(16, 15, 75, 0.8);
  border: var(--border-width) solid var(--highlight-color);
  position: relative;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
}

.notes-title {
  font-size: 18px;
  color: var(--highlight-color);
  margin-bottom: 15px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  padding-bottom: 5px;
}

.notes-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.note-item {
  padding: 10px;
  background-color: rgba(12, 11, 60, 0.6);
}

.note-item h3 {
  font-size: 16px;
  color: var(--accent-color);
  margin-bottom: 8px;
}

.note-item p {
  font-size: 14px;
  line-height: 1.4;
  color: #a9b7d0;
}

/* 过渡动画 */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style> 