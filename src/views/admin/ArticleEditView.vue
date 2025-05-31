<template>
  <div class="article-edit-view">
    <div class="page-header">
      <h1 class="page-title">{{ isNewArticle ? '创建文章' : '编辑文章' }}</h1>
      <div class="header-actions">
        <button class="rpg-button cancel-button" @click="goBack">
          取消
        </button>
        <button 
          class="rpg-button save-button" 
          :class="{'loading': isSaving}"
          :disabled="isSaving || !isFormValid"
          @click="saveArticle"
        >
          <span v-if="isSaving">保存中...</span>
          <span v-else>保存</span>
        </button>
      </div>
    </div>
    
    <!-- 文章编辑表单 -->
    <div class="rpg-menu-box article-form-box" :class="{'appear': isVisible}">
      <div class="form-container">
        <!-- 文章标题 -->
        <div class="form-group">
          <label for="article-title">文章标题 <span class="required">*</span></label>
          <input 
            type="text" 
            id="article-title" 
            v-model="article.title" 
            class="rpg-input"
            placeholder="请输入文章标题"
          />
        </div>
        
        <!-- 文章摘要 -->
        <div class="form-group">
          <label for="article-summary">文章摘要 <span class="required">*</span></label>
          <textarea 
            id="article-summary" 
            v-model="article.summary" 
            class="rpg-input textarea"
            placeholder="请输入文章摘要"
            rows="2"
          ></textarea>
          <div class="char-counter">{{ article.summary.length }}/200 字符</div>
        </div>
        
        <!-- 文章内容 -->
        <div class="form-group">
          <label for="article-content">文章内容 <span class="required">*</span></label>
          <textarea 
            id="article-content" 
            v-model="article.content" 
            class="rpg-input textarea content-textarea"
            placeholder="请输入文章内容（支持HTML标签）"
            rows="10"
          ></textarea>
        </div>
        
        <!-- 封面图片 -->
        <div class="form-section">
          <h3 class="subsection-title">封面图片</h3>
          
          <div class="cover-editor">
            <div class="cover-preview">
              <div class="rpg-frame preview-frame">
                <img :src="article.coverImage || '/images/blog/default-cover.jpg'" class="cover-image" />
                <div class="pixel-corner top-left"></div>
                <div class="pixel-corner top-right"></div>
                <div class="pixel-corner bottom-left"></div>
                <div class="pixel-corner bottom-right"></div>
              </div>
            </div>
            
            <div class="cover-controls">
              <div class="form-group">
                <label for="cover-url">封面图片URL</label>
                <input 
                  type="text" 
                  id="cover-url" 
                  v-model="article.coverImage" 
                  class="rpg-input"
                  placeholder="请输入封面图片URL"
                />
              </div>
              
              <p class="upload-note">Tips: 可以使用相对路径如 '/images/blog/example.jpg' 或完整URL</p>
            </div>
          </div>
        </div>
        
        <!-- 其他设置 -->
        <div class="form-group half-width">
          <label for="article-tag">文章标签</label>
          <input 
            type="text" 
            id="article-tag" 
            v-model="article.tag" 
            class="rpg-input"
            placeholder="例如：艺术、开发、音乐"
          />
        </div>
        
        <div class="form-group half-width">
          <label for="article-date">发布日期</label>
          <input 
            type="date" 
            id="article-date" 
            v-model="article.date" 
            class="rpg-input"
          />
        </div>
        
        <div class="form-group">
          <label for="article-keywords">关键词（用逗号分隔）</label>
          <input 
            type="text" 
            id="article-keywords" 
            v-model="keywordsString" 
            class="rpg-input"
            placeholder="例如：像素艺术,8-bit,游戏设计"
          />
        </div>
        
        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="article.isPinned" 
              class="rpg-checkbox" 
            />
            <span class="checkbox-text">置顶文章</span>
          </label>
        </div>
      </div>
      
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
    
    <!-- 文章内容预览 -->
    <div class="rpg-menu-box content-preview-box" :class="{'appear': isVisible}" v-if="article.title">
      <h2 class="section-title">内容预览</h2>
      
      <div class="preview-container">
        <h1 class="preview-title">{{ article.title }}</h1>
        <div class="preview-content" v-html="article.content"></div>
      </div>
      
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
    
    <!-- 保存按钮（底部固定） -->
    <div class="bottom-actions">
      <button 
        class="rpg-button save-button" 
        :class="{'loading': isSaving}"
        :disabled="isSaving || !isFormValid"
        @click="saveArticle"
      >
        <span v-if="isSaving">保存中...</span>
        <span v-else>保存</span>
      </button>
      <button class="rpg-button cancel-button" @click="goBack">
        取消
      </button>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'ArticleEditView',
  props: {
    id: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      isVisible: false,
      isSaving: false,
      article: {
        title: '',
        summary: '',
        content: '',
        coverImage: '',
        date: new Date().toISOString().split('T')[0],
        tag: '',
        keywords: [],
        isPinned: false
      },
      keywordsString: '',
      storeInstance: store.getStore()
    };
  },
  computed: {
    isNewArticle() {
      return this.id === null || this.id === undefined;
    },
    
    isFormValid() {
      return this.article.title && this.article.summary && this.article.content;
    }
  },
  created() {
    // 如果是编辑模式，加载文章数据
    if (!this.isNewArticle) {
      this.loadArticleData();
    }
  },
  mounted() {
    // 组件挂载后等待200ms再开始动画
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
  },
  methods: {
    // 加载文章数据
    loadArticleData() {
      const article = this.storeInstance.getArticleById(parseInt(this.id));
      
      if (article) {
        this.article = { ...article };
        this.keywordsString = article.keywords ? article.keywords.join(',') : '';
      } else {
        // 文章不存在，重定向到文章列表
        this.$router.push('/admin/articles');
      }
    },
    
    // 保存文章
    saveArticle() {
      if (!this.isFormValid || this.isSaving) return;
      
      this.isSaving = true;
      
      // 处理关键词
      this.article.keywords = this.keywordsString
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword);
      
      // 模拟API保存请求
      setTimeout(() => {
        if (this.isNewArticle) {
          // 创建新文章
          const newArticle = this.storeInstance.addArticle(this.article);
          
          // 保存成功后跳转到编辑页
          this.$router.push(`/admin/articles/edit/${newArticle.id}`);
        } else {
          // 更新文章
          this.storeInstance.updateArticle(this.article);
          
          // 显示成功提示
          alert('文章保存成功！');
        }
        
        this.isSaving = false;
      }, 800);
    },
    
    // 返回文章列表
    goBack() {
      this.$router.push('/admin/articles');
    }
  }
};
</script>

<style scoped lang="scss">
.article-edit-view {
  padding: 10px 0;
  position: relative;
  padding-bottom: 80px; /* 为底部保存按钮留出空间 */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  color: var(--highlight-color);
  font-size: 24px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.article-form-box, .content-preview-box {
  border: var(--border-width) solid var(--highlight-color);
  padding: 25px;
  position: relative;
  background-color: rgba(16, 15, 75, 0.8);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.content-preview-box {
  transition-delay: 0.2s;
}

.appear {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 18px;
  color: var(--highlight-color);
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-group {
  width: 100%;
  
  &.half-width {
    width: calc(50% - 10px);
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

.form-section {
  width: 100%;
  margin-bottom: 15px;
}

.subsection-title {
  font-size: 16px;
  color: var(--accent-color);
  margin: 0 0 15px 0;
}

label {
  display: block;
  color: var(--accent-color);
  margin-bottom: 5px;
  font-size: 14px;
  
  .required {
    color: #ff5858;
  }
}

.rpg-input {
  width: 100%;
  padding: 12px 15px;
  background-color: rgba(12, 11, 60, 0.6);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    background-color: rgba(12, 11, 60, 0.8);
    border-color: var(--accent-color);
    box-shadow: 0 0 8px rgba(94, 186, 226, 0.4);
  }
  
  &.textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  &.content-textarea {
    min-height: 300px;
    font-family: monospace;
  }
}

.char-counter {
  font-size: 12px;
  color: var(--accent-color);
  text-align: right;
  margin-top: 5px;
}

.cover-editor {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.cover-preview {
  flex-shrink: 0;
}

.preview-frame {
  width: 180px;
  height: 120px;
  border: var(--border-width) solid var(--highlight-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: rgba(12, 11, 60, 0.6);
}

.cover-image {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.cover-controls {
  flex: 1;
}

.upload-note {
  color: var(--accent-color);
  font-size: 12px;
  font-style: italic;
  margin: 5px 0 0 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.rpg-checkbox {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  appearance: none;
  background-color: rgba(12, 11, 60, 0.6);
  border: var(--pixel-size) solid var(--highlight-color);
  position: relative;
  cursor: pointer;
  
  &:checked {
    background-color: rgba(58, 142, 169, 0.6);
    
    &:after {
      content: '✓';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: var(--highlight-color);
    }
  }
}

.checkbox-text {
  color: var(--text-color);
  font-size: 14px;
}

/* 预览样式 */
.preview-container {
  background-color: rgba(12, 11, 60, 0.3);
  padding: 20px;
  border: var(--pixel-size) dashed var(--accent-color);
}

.preview-title {
  font-size: 24px;
  color: var(--highlight-color);
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
}

.preview-content {
  font-size: 16px;
  line-height: 1.6;
  color: #a9b7d0;
  
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

/* 按钮样式 */
.rpg-button {
  padding: 12px 20px;
  background: var(--primary-color);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    background: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &.loading {
    background: var(--secondary-color);
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background: var(--accent-color);
      animation: loading-bar 1.5s infinite linear;
      width: 30%;
    }
  }
  
  &.save-button {
    background-color: rgba(58, 142, 169, 0.3);
  }
  
  &.cancel-button {
    background-color: rgba(12, 11, 60, 0.3);
  }
}

@keyframes loading-bar {
  0% { left: -30%; width: 30%; }
  50% { width: 50%; }
  100% { left: 100%; width: 30%; }
}

/* 底部固定保存按钮 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(6, 6, 33, 0.9);
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: var(--pixel-size) solid var(--highlight-color);
  z-index: 10;
}
</style> 