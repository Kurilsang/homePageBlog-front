<template>
  <div class="admin-articles">
    <div class="page-header">
      <h1 class="page-title">文章管理</h1>
      <router-link to="/admin/dashboard/articles/new" class="rpg-button add-button">
        <span class="button-icon">+</span> 新建文章
      </router-link>
    </div>
    
    <!-- 文章列表 -->
    <div class="rpg-menu-box article-list-box" :class="{'appear': isVisible}">
      <h2 class="section-title">全部文章 <span v-if="!loading">({{ articles.length }})</span></h2>
      
      <!-- 加载中状态 -->
      <div v-if="loading" class="loading-state">
        <p>正在加载文章...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <p>{{ errorMessage }}</p>
        <button class="rpg-button" @click="loadArticles">重试</button>
      </div>
      
      <!-- 文章内容区域 -->
      <template v-else>
      <div class="article-filters">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            class="rpg-input" 
            placeholder="搜索文章..."
          />
        </div>
        
        <div class="filter-actions">
          <button 
            class="rpg-button filter-button" 
            :class="{'active': showPinnedOnly}" 
            @click="togglePinnedFilter"
          >
            仅显示置顶
          </button>
        </div>
      </div>
      
      <!-- 文章表格 -->
      <div class="articles-table" v-if="filteredArticles.length > 0">
        <div class="table-header">
          <div class="col col-title">标题</div>
          <div class="col col-date">发布日期</div>
          <div class="col col-status">状态</div>
          <div class="col col-actions">操作</div>
        </div>
        
        <div 
          v-for="article in filteredArticles" 
          :key="article.id" 
          class="table-row"
          :class="{'pinned': article.isPinned}"
        >
          <div class="col col-title">
            <span class="pin-icon" v-if="article.isPinned">📌</span>
            {{ article.title }}
            <span class="article-tag" v-if="article.tag">{{ article.tag }}</span>
          </div>
          <div class="col col-date">{{ article.date }}</div>
          <div class="col col-status">
            <span class="status-badge" :class="{'pinned': article.isPinned}">
              {{ article.isPinned ? '置顶' : '正常' }}
            </span>
          </div>
          <div class="col col-actions">
            <div class="action-buttons">
              <button class="rpg-button action-button" @click="togglePinned(article)">
                {{ article.isPinned ? '取消置顶' : '置顶' }}
              </button>
              <router-link :to="`/admin/dashboard/articles/edit/${article.id}`" class="rpg-button action-button">
                编辑
              </router-link>
              <router-link :to="`/article/${article.id}`" class="rpg-button action-button view">
                查看
              </router-link>
              <button class="rpg-button action-button delete" @click="confirmDelete(article)">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <p v-if="articles.length === 0">暂无文章</p>
        <p v-else>没有符合条件的文章</p>
      </div>
      </template>
      
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
  name: 'AdminArticlesView',
  data() {
    return {
      isVisible: false,
      searchQuery: '',
      showPinnedOnly: false,
      articles: [],
      loading: true,
      error: false,
      errorMessage: '加载文章失败'
    };
  },
  computed: {
    // 过滤后的文章
    filteredArticles() {
      let result = [...this.articles];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(article => 
          article.title.toLowerCase().includes(query) || 
          article.summary.toLowerCase().includes(query) ||
          (article.tag && article.tag.toLowerCase().includes(query))
        );
      }
      
      // 置顶过滤
      if (this.showPinnedOnly) {
        result = result.filter(article => article.isPinned);
      }
      
      // 排序：置顶优先，然后按日期降序
      result.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
        return new Date(b.date) - new Date(a.date);
      });
      
      return result;
    }
  },
  async mounted() {
    // 组件挂载后等待200ms再开始动画
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
    
    // 加载文章数据
    await this.loadArticles();
  },
  methods: {
    // 加载文章列表
    async loadArticles() {
      this.loading = true;
      this.error = false;
      
      try {
        const response = await articleAPI.getArticles({
          page: 1,
          pageSize: 100  // 管理页面加载更多文章
        });
        
        if (response && response.articles) {
          this.articles = response.articles;
        } else {
          throw new Error('获取文章失败');
        }
      } catch (error) {
        console.error('加载文章列表失败:', error);
        this.error = true;
        this.errorMessage = error.message || '加载文章失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    
    // 切换置顶过滤
    togglePinnedFilter() {
      this.showPinnedOnly = !this.showPinnedOnly;
    },
    
    // 切换文章置顶状态
    async togglePinned(article) {
      try {
        const newPinnedState = !article.isPinned;
        await articleAPI.toggleArticlePin(article.id, newPinnedState);
        
        // 更新本地状态
        const index = this.articles.findIndex(a => a.id === article.id);
        if (index !== -1) {
          this.articles[index].isPinned = newPinnedState;
        }
      } catch (error) {
        console.error('切换文章置顶状态失败:', error);
        alert('切换置顶状态失败，请稍后重试');
      }
    },
    
    // 确认删除文章
    async confirmDelete(article) {
      if (confirm(`确定要删除文章 "${article.title}" 吗？此操作不可恢复。`)) {
        try {
          await articleAPI.deleteArticle(article.id);
          
          // 从本地数组中移除文章
          this.articles = this.articles.filter(a => a.id !== article.id);
        } catch (error) {
          console.error('删除文章失败:', error);
          alert('删除文章失败，请稍后重试');
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.admin-articles {
  padding: 10px 0;
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

.add-button {
  display: flex;
  align-items: center;
  background-color: rgba(58, 142, 169, 0.3);
  padding: 8px 15px;
  
  .button-icon {
    margin-right: 5px;
    font-size: 16px;
  }
}

.article-list-box {
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

/* 加载和错误状态 */
.loading-state, .error-state {
  padding: 20px;
  text-align: center;
  color: var(--text-color);
  background-color: rgba(20, 20, 80, 0.6);
  border-radius: 2px;
  margin: 20px 0;
}

.error-state .rpg-button {
  margin-top: 10px;
  background-color: rgba(58, 142, 169, 0.3);
}

.appear {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  color: var(--highlight-color);
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
}

.article-filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.rpg-input {
  width: 100%;
  padding: 10px;
  background-color: rgba(12, 11, 60, 0.6);
  border: var(--pixel-size) solid var(--accent-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  
  &:focus {
    outline: none;
    background-color: rgba(12, 11, 60, 0.8);
    border-color: var(--highlight-color);
  }
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.rpg-button {
  padding: 8px 15px;
  background: var(--primary-color);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
  }
  
  &.filter-button {
    background-color: rgba(12, 11, 60, 0.5);
    
    &.active {
      background-color: rgba(58, 142, 169, 0.3);
      border-color: var(--accent-color);
    }
  }
}

.articles-table {
  width: 100%;
  border: var(--pixel-size) solid var(--secondary-color);
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  background-color: rgba(42, 103, 194, 0.3);
  padding: 10px;
  font-weight: bold;
  color: var(--highlight-color);
  border-bottom: var(--pixel-size) solid var(--secondary-color);
}

.table-row {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid rgba(58, 142, 169, 0.3);
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(12, 11, 60, 0.5);
  }
  
  &.pinned {
    background-color: rgba(58, 142, 169, 0.1);
    
    &:hover {
      background-color: rgba(58, 142, 169, 0.2);
    }
  }
}

.col {
  padding: 5px 10px;
  
  &.col-title {
    flex: 2;
    display: flex;
    align-items: center;
    
    .pin-icon {
      margin-right: 5px;
    }
  }
  
  &.col-date, &.col-status {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  &.col-actions {
    flex: 2;
    text-align: right;
  }
}

.article-tag {
  background-color: var(--accent-color);
  color: var(--dark-color);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  margin-left: 8px;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  font-size: 12px;
  background-color: rgba(12, 11, 60, 0.5);
  border: 1px solid var(--secondary-color);
  
  &.pinned {
    background-color: rgba(58, 142, 169, 0.3);
    border-color: var(--accent-color);
    color: var(--highlight-color);
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  flex-wrap: wrap;
}

.action-button {
  padding: 3px 8px;
  font-size: 12px;
  background-color: rgba(12, 11, 60, 0.5);
  
  &.view {
    background-color: rgba(42, 103, 194, 0.3);
  }
  
  &.delete {
    background-color: rgba(255, 88, 88, 0.3);
    border-color: #ff5858;
    
    &:hover {
      background-color: rgba(255, 88, 88, 0.5);
    }
  }
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: var(--accent-color);
  font-style: italic;
  background-color: rgba(12, 11, 60, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .table-header {
    display: none;
  }
  
  .table-row {
    flex-direction: column;
    border-bottom: var(--pixel-size) solid var(--secondary-color);
    padding: 15px;
  }
  
  .col {
    padding: 5px 0;
    
    &.col-title, &.col-date, &.col-status, &.col-actions {
      width: 100%;
      text-align: left;
    }
    
    &.col-actions {
      margin-top: 10px;
    }
  }
  
  .action-buttons {
    justify-content: flex-start;
  }
}
</style> 