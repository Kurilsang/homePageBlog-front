<template>
  <div class="admin-comments">
    <h1 class="page-title">评论管理</h1>
    
    <!-- 评论列表 -->
    <div class="rpg-menu-box comments-list-box" :class="{'appear': isVisible}">
      <div class="comments-header">
        <h2 class="section-title">全部评论 ({{ comments.length }})</h2>
        
        <div class="filter-tabs">
          <button 
            class="tab-button" 
            :class="{ active: currentFilter === 'all' }" 
            @click="currentFilter = 'all'"
          >
            全部 ({{ comments.length }})
          </button>
          <button 
            class="tab-button" 
            :class="{ active: currentFilter === 'pending' }" 
            @click="currentFilter = 'pending'"
          >
            待审核 ({{ pendingCount }})
          </button>
          <button 
            class="tab-button" 
            :class="{ active: currentFilter === 'approved' }" 
            @click="currentFilter = 'approved'"
          >
            已通过 ({{ approvedCount }})
          </button>
          <button 
            class="tab-button" 
            :class="{ active: currentFilter === 'rejected' }" 
            @click="currentFilter = 'rejected'"
          >
            已拒绝 ({{ rejectedCount }})
          </button>
        </div>
      </div>
      
      <!-- 评论搜索 -->
      <div class="comments-filters">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            class="rpg-input" 
            placeholder="搜索评论内容或作者..."
          />
        </div>
      </div>
      
      <!-- 评论列表 -->
      <div class="comments-list" v-if="filteredComments.length > 0">
        <div 
          v-for="comment in filteredComments" 
          :key="comment.id" 
          class="comment-item"
          :class="comment.status"
        >
          <div class="comment-header">
            <div class="comment-info">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-date">{{ comment.date }}</span>
            </div>
            
            <div class="comment-status-badge" :class="comment.status">
              {{ getStatusText(comment.status) }}
            </div>
          </div>
          
          <div class="comment-content">{{ comment.content }}</div>
          
          <div class="comment-meta">
            <div class="article-ref" v-if="getArticleTitle(comment.articleId)">
              文章：
              <router-link :to="`/article/${comment.articleId}`" class="article-link">
                {{ getArticleTitle(comment.articleId) }}
              </router-link>
            </div>
            
            <div class="parent-ref" v-if="comment.parentId">
              回复：{{ getCommentAuthor(comment.parentId) }}
            </div>
          </div>
          
          <div class="comment-actions">
            <button 
              v-if="comment.status !== 'approved'" 
              class="rpg-button approve-button" 
              @click="updateCommentStatus(comment.id, 'approved')"
            >
              通过
            </button>
            
            <button 
              v-if="comment.status !== 'rejected'" 
              class="rpg-button reject-button" 
              @click="updateCommentStatus(comment.id, 'rejected')"
            >
              拒绝
            </button>
            
            <button 
              class="rpg-button delete-button" 
              @click="confirmDeleteComment(comment)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <p v-if="comments.length === 0">暂无评论</p>
        <p v-else>没有符合条件的评论</p>
      </div>
      
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'AdminCommentsView',
  data() {
    return {
      isVisible: false,
      currentFilter: 'all',
      searchQuery: '',
      storeInstance: store.getStore()
    };
  },
  computed: {
    // 获取所有评论
    comments() {
      return this.storeInstance.getAllComments();
    },
    
    // 待审核评论数
    pendingCount() {
      return this.comments.filter(c => c.status === 'pending').length;
    },
    
    // 已通过评论数
    approvedCount() {
      return this.comments.filter(c => c.status === 'approved').length;
    },
    
    // 已拒绝评论数
    rejectedCount() {
      return this.comments.filter(c => c.status === 'rejected').length;
    },
    
    // 过滤后的评论
    filteredComments() {
      let result = [...this.comments];
      
      // 状态过滤
      if (this.currentFilter !== 'all') {
        result = result.filter(comment => comment.status === this.currentFilter);
      }
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(comment => 
          comment.content.toLowerCase().includes(query) || 
          comment.author.toLowerCase().includes(query)
        );
      }
      
      // 排序：按日期降序
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      return result;
    }
  },
  mounted() {
    // 组件挂载后等待200ms再开始动画
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
  },
  methods: {
    // 获取评论状态文本
    getStatusText(status) {
      switch (status) {
        case 'approved': return '已通过';
        case 'pending': return '待审核';
        case 'rejected': return '已拒绝';
        default: return '未知状态';
      }
    },
    
    // 获取文章标题
    getArticleTitle(articleId) {
      const article = this.storeInstance.getArticleById(articleId);
      return article ? article.title : '';
    },
    
    // 获取评论作者
    getCommentAuthor(commentId) {
      const comment = this.comments.find(c => c.id === commentId);
      return comment ? comment.author : '';
    },
    
    // 更新评论状态
    updateCommentStatus(id, status) {
      this.storeInstance.updateCommentStatus(id, status);
    },
    
    // 确认删除评论
    confirmDeleteComment(comment) {
      if (confirm(`确定要删除"${comment.author}"的评论吗？此操作不可恢复。`)) {
        this.storeInstance.deleteComment(comment.id);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.admin-comments {
  padding: 10px 0;
}

.page-title {
  color: var(--highlight-color);
  font-size: 24px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  padding-bottom: 10px;
}

.comments-list-box {
  border: var(--border-width) solid var(--highlight-color);
  padding: 25px;
  position: relative;
  background-color: rgba(16, 15, 75, 0.8);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.appear {
  opacity: 1;
  transform: translateY(0);
}

.comments-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  color: var(--highlight-color);
  margin: 0 0 15px 0;
  padding-bottom: 5px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
}

.filter-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.tab-button {
  padding: 8px 15px;
  background: rgba(12, 11, 60, 0.5);
  border: var(--pixel-size) solid var(--secondary-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(12, 11, 60, 0.8);
  }
  
  &.active {
    background: rgba(58, 142, 169, 0.3);
    border-color: var(--highlight-color);
    color: var(--highlight-color);
  }
}

.comments-filters {
  margin-bottom: 20px;
}

.search-box {
  width: 100%;
}

.rpg-input {
  width: 100%;
  padding: 10px;
  background-color: rgba(12, 11, 60, 0.6);
  border: var(--pixel-size) solid var(--accent-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    background-color: rgba(12, 11, 60, 0.8);
    border-color: var(--highlight-color);
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-item {
  padding: 15px;
  background-color: rgba(12, 11, 60, 0.6);
  border-left: 4px solid var(--accent-color);
  
  &.approved {
    border-left-color: #00c853;
    
    .comment-status-badge {
      background-color: rgba(0, 200, 83, 0.3);
      border-color: #00c853;
    }
  }
  
  &.pending {
    border-left-color: #ffab40;
    
    .comment-status-badge {
      background-color: rgba(255, 171, 64, 0.3);
      border-color: #ffab40;
    }
  }
  
  &.rejected {
    border-left-color: #ff5858;
    background-color: rgba(12, 11, 60, 0.4);
    
    .comment-status-badge {
      background-color: rgba(255, 88, 88, 0.3);
      border-color: #ff5858;
    }
    
    .comment-content {
      opacity: 0.7;
    }
  }
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.comment-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-author {
  font-weight: bold;
  color: var(--highlight-color);
}

.comment-date {
  font-size: 12px;
  color: var(--accent-color);
}

.comment-status-badge {
  padding: 3px 8px;
  font-size: 12px;
  border: 1px solid;
}

.comment-content {
  margin-bottom: 15px;
  color: var(--text-color);
  line-height: 1.4;
  word-break: break-word;
}

.comment-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--accent-color);
  margin-bottom: 15px;
}

.article-link {
  color: var(--highlight-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.comment-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.rpg-button {
  padding: 5px 10px;
  background: rgba(12, 11, 60, 0.5);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.approve-button {
    background-color: rgba(0, 200, 83, 0.2);
    border-color: #00c853;
    
    &:hover {
      background-color: rgba(0, 200, 83, 0.4);
    }
  }
  
  &.reject-button {
    background-color: rgba(255, 171, 64, 0.2);
    border-color: #ffab40;
    
    &:hover {
      background-color: rgba(255, 171, 64, 0.4);
    }
  }
  
  &.delete-button {
    background-color: rgba(255, 88, 88, 0.2);
    border-color: #ff5858;
    
    &:hover {
      background-color: rgba(255, 88, 88, 0.4);
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
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style> 