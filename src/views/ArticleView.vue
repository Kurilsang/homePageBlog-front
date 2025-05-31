<template>
  <div class="article-view">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <button class="rpg-button back-button" @click="goBack">
        <span class="button-icon">◀</span> 返回
      </button>
    </div>
    
    <!-- 文章详情框 -->
    <div class="rpg-menu-box article-detail-box" :class="{'appear': isVisible}">
      <!-- 文章封面区域 -->
      <div class="article-header">
        <div class="article-cover-wrapper">
          <img :src="article.coverImage" :alt="article.title" class="article-cover">
          <div class="article-meta">
            <span class="article-date">{{ article.date }}</span>
            <span class="pixel-tag" v-if="article.tag">{{ article.tag }}</span>
          </div>
        </div>
      </div>
      
      <!-- 文章标题和内容区域 -->
      <div class="article-content">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-body" v-html="article.content"></div>
        
        <!-- 文章标签区域 -->
        <div class="article-tags" v-if="article.keywords && article.keywords.length > 0">
          <span class="tag-label">关键字：</span>
          <div class="tags-container">
            <span v-for="(keyword, idx) in article.keywords" :key="idx" class="article-keyword">
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 像素角落装饰 -->
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
    
    <!-- 相关文章区域 -->
    <div class="rpg-menu-box related-articles-box" :class="{'appear': isVisible}" v-if="relatedArticles.length > 0">
      <h2 class="rpg-heading related-heading">相关文章</h2>
      <div class="related-articles-list">
        <div 
          v-for="(relArticle, index) in relatedArticles" 
          :key="relArticle.id" 
          class="related-article-item"
          :style="{ 'animation-delay': `${0.6 + index * 0.1}s` }"
          @click="goToArticle(relArticle.id)">
          <div class="related-article-cover">
            <img :src="relArticle.coverImage" :alt="relArticle.title">
          </div>
          <div class="related-article-info">
            <h3 class="related-article-title">{{ relArticle.title }}</h3>
            <p class="related-article-date">{{ relArticle.date }}</p>
          </div>
          <div class="pixel-tag" v-if="relArticle.tag">{{ relArticle.tag }}</div>
        </div>
      </div>
      
      <!-- 像素角落装饰 -->
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
    
    <!-- 评论区域 -->
    <div class="rpg-menu-box comments-box" :class="{'appear': isVisible}" style="animation-delay: 0.7s">
      <h2 class="rpg-heading comments-heading">
        文章评论
        <span class="comments-count" v-if="comments.length > 0">({{ comments.length }})</span>
      </h2>
      
      <!-- 评论表单 -->
      <comment-form 
        :article-id="id" 
        @submit="handleCommentSubmit"
      />
      
      <!-- 评论列表 -->
      <comment-list 
        :comments="comments" 
        :article-id="id" 
        @reply="handleCommentSubmit"
      />
      
      <!-- 像素角落装饰 -->
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
    
    <!-- 音乐播放器组件 -->
    <MusicPlayerComponent />
  </div>
</template>

<script>
import MusicPlayerComponent from '../components/MusicPlayerComponent.vue';
import CommentList from '../components/comments/CommentList.vue';
import CommentForm from '../components/comments/CommentForm.vue';
import store from '../store';

export default {
  name: 'ArticleView',
  components: {
    MusicPlayerComponent,
    CommentList,
    CommentForm
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      isVisible: false,
      article: {
        id: null,
        title: '',
        summary: '',
        content: '',
        coverImage: '',
        date: '',
        tag: '',
        keywords: []
      },
      relatedArticles: [],
      storeInstance: store.getStore()
    };
  },
  computed: {
    // 获取文章对应评论
    comments() {
      return this.storeInstance.getCommentsByArticleId(parseInt(this.id));
    }
  },
  created() {
    this.fetchArticleData(this.id);
  },
  mounted() {
    // 组件挂载后等待200ms再开始动画
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
  },
  methods: {
    fetchArticleData(id) {
      // 从store获取文章数据
      const article = this.storeInstance.getArticleById(parseInt(id));
      
      if (article) {
        this.article = article;
        
        // 获取相关文章（除了当前文章的其他文章）
        this.relatedArticles = this.storeInstance.getArticles()
          .filter(a => a.id !== parseInt(id))
          .slice(0, 2);
      } else {
        // 文章不存在，可以重定向到首页或显示错误
        this.$router.push('/');
      }
    },
    
    goBack() {
      this.$router.push('/')
        .catch(err => {
          // 忽略重复导航错误
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
    },
    
    goToArticle(articleId) {
      if (articleId !== this.article.id) {
        this.$router.push({ name: 'Article', params: { id: articleId } })
          .catch(err => {
            // 忽略重复导航错误
            if (err.name !== 'NavigationDuplicated') {
              throw err;
            }
          });
      }
    },
    
    // 处理评论提交
    handleCommentSubmit(commentData) {
      // 评论已经在CommentForm组件中添加到了store
      // 这里可以做额外处理，例如滚动到评论区顶部等
      console.log('Comment submitted:', commentData);
    }
  },
  watch: {
    id(newId) {
      this.fetchArticleData(newId);
    }
  }
}
</script>

<style scoped lang="scss">
.article-view {
  width: 100%;
  padding: 20px 0;
}

.back-button-container {
  margin-bottom: 15px;
}

.rpg-button {
  background: var(--primary-color);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--text-color);
  padding: 8px 15px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: var(--secondary-color);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
  }
  
  .button-icon {
    margin-right: 5px;
  }
}

.article-detail-box, .related-articles-box {
  border: var(--border-width) solid var(--highlight-color);
  padding: 25px;
  position: relative;
  background-color: rgba(16, 15, 75, 0.8);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
  margin-bottom: 20px;
}

.related-articles-box {
  transition-delay: 0.3s;
}

.appear {
  opacity: 1;
  transform: translateY(0);
}

.article-header {
  margin-bottom: 25px;
}

.article-cover-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border: var(--pixel-size) solid var(--highlight-color);
}

.article-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;
  background: rgba(6, 6, 33, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-date {
  color: var(--accent-color);
  font-size: 14px;
}

.pixel-tag {
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

.article-title {
  font-size: 24px;
  color: var(--highlight-color);
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
}

.article-body {
  font-size: 16px;
  line-height: 1.6;
  color: #a9b7d0;
  margin-bottom: 25px;
  
  h2 {
    font-size: 20px;
    color: var(--highlight-color);
    margin: 25px 0 15px;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  }
  
  p {
    margin: 15px 0;
  }
}

.article-tags {
  display: flex;
  align-items: flex-start;
  margin-top: 25px;
  padding-top: 15px;
  border-top: var(--pixel-size) solid rgba(58, 142, 169, 0.3);
}

.tag-label {
  font-size: 14px;
  color: var(--highlight-color);
  margin-right: 10px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.article-keyword {
  background: rgba(6, 6, 33, 0.8);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--text-color);
  font-size: 12px;
  padding: 3px 8px;
}

.related-heading {
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  color: var(--highlight-color);
  font-size: 20px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.related-articles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.related-article-item {
  flex: 1;
  min-width: 250px;
  max-width: calc(50% - 7.5px);
  padding: 10px;
  background-color: rgba(20, 20, 80, 0.6);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border-left: var(--pixel-size) solid transparent;
  
  &:hover {
    background-color: rgba(20, 20, 80, 0.9);
    border-left-color: var(--highlight-color);
    transform: translateX(5px);
  }
  
  @media (max-width: 767px) {
    max-width: 100%;
  }
}

.related-article-cover {
  height: 100px;
  overflow: hidden;
  border: var(--pixel-size) solid var(--highlight-color);
  margin-bottom: 10px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    .related-article-item:hover & {
      transform: scale(1.1);
    }
  }
}

.related-article-title {
  font-size: 16px;
  color: var(--highlight-color);
  margin: 0 0 5px 0;
}

.related-article-date {
  font-size: 12px;
  color: var(--accent-color);
  margin: 0;
}

/* 评论区样式 */
.comments-box {
  border: var(--border-width) solid var(--highlight-color);
  padding: 25px;
  position: relative;
  background-color: rgba(16, 15, 75, 0.8);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
  margin-bottom: 20px;
  
  /* 添加像素风格底纹 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(45deg, rgba(58, 142, 169, 0.05) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(58, 142, 169, 0.05) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(58, 142, 169, 0.05) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(58, 142, 169, 0.05) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    opacity: 0.3;
    z-index: -1;
    pointer-events: none;
  }
}

.comments-heading {
  font-size: 20px;
  color: var(--highlight-color);
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  
  /* 添加像素风格图标 */
  &::before {
    content: '💬';
    margin-right: 10px;
    font-size: 22px;
    filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.5));
  }
}

.comments-count {
  font-size: 14px;
  margin-left: 10px;
  color: var(--accent-color);
  background-color: rgba(12, 11, 60, 0.6);
  padding: 2px 8px;
  border-radius: 2px;
  border: 1px solid var(--accent-color);
}
</style> 