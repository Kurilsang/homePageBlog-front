<template>
  <div class="admin-home">
    <h1 class="page-title">控制面板</h1>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="rpg-stat-card" :class="{'appear': isVisible}" style="animation-delay: 0.1s">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <div class="stat-value">{{ articleCount }}</div>
          <div class="stat-label">文章总数</div>
        </div>
        <router-link to="/admin/dashboard/articles" class="stat-link">查看全部</router-link>
      </div>
      
      <div class="rpg-stat-card" :class="{'appear': isVisible}" style="animation-delay: 0.2s">
        <div class="stat-icon">💬</div>
        <div class="stat-info">
          <div class="stat-value">{{ commentCount }}</div>
          <div class="stat-label">评论总数</div>
        </div>
        <router-link to="/admin/dashboard/comments" class="stat-link">查看全部</router-link>
      </div>
      
      <div class="rpg-stat-card" :class="{'appear': isVisible}" style="animation-delay: 0.3s">
        <div class="stat-icon">⏰</div>
        <div class="stat-info">
          <div class="stat-value">{{ pendingCommentCount }}</div>
          <div class="stat-label">待审核评论</div>
        </div>
        <router-link to="/admin/dashboard/comments" class="stat-link">前往审核</router-link>
      </div>
    </div>
    
    <!-- 最近文章 -->
    <div class="admin-section rpg-menu-box" :class="{'appear': isVisible}" style="animation-delay: 0.4s">
      <h2 class="section-title">最近文章</h2>
      
      <div class="recent-items">
        <div v-for="article in recentArticles" :key="article.id" class="recent-item">
          <div class="item-title">{{ article.title }}</div>
          <div class="item-meta">{{ article.date }}</div>
          <router-link :to="`/admin/dashboard/articles/edit/${article.id}`" class="item-action">编辑</router-link>
          <router-link :to="`/article/${article.id}`" class="item-action">查看</router-link>
        </div>
        
        <div v-if="recentArticles.length === 0" class="empty-state">
          暂无文章
        </div>
      </div>
      
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
    
    <!-- 最近评论 -->
    <div class="admin-section rpg-menu-box" :class="{'appear': isVisible}" style="animation-delay: 0.5s">
      <h2 class="section-title">最近评论</h2>
      
      <div class="recent-items">
        <div v-for="comment in recentComments" :key="comment.id" class="recent-item comment-item">
          <div class="item-author">{{ comment.author }}</div>
          <div class="item-content">{{ comment.content }}</div>
          <div class="item-meta">
            <span>{{ comment.date }}</span>
            <span class="comment-status" :class="comment.status">{{ getStatusText(comment.status) }}</span>
          </div>
          <div class="item-actions">
            <button class="item-action" v-if="comment.status === 'pending'" @click="approveComment(comment.id)">通过</button>
            <button class="item-action reject" v-if="comment.status === 'pending'" @click="rejectComment(comment.id)">拒绝</button>
            <button class="item-action reject" @click="deleteComment(comment.id)">删除</button>
          </div>
        </div>
        
        <div v-if="recentComments.length === 0" class="empty-state">
          暂无评论
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
import store from '@/store';

export default {
  name: 'AdminHomeView',
  data() {
    return {
      isVisible: false,
      storeInstance: store.getStore()
    };
  },
  computed: {
    // 文章统计
    articleCount() {
      return this.storeInstance.articles.length;
    },
    
    // 评论统计
    commentCount() {
      return this.storeInstance.comments.length;
    },
    
    // 待审核评论统计
    pendingCommentCount() {
      return this.storeInstance.comments.filter(c => c.status === 'pending').length;
    },
    
    // 最近文章
    recentArticles() {
      return [...this.storeInstance.articles]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    },
    
    // 最近评论
    recentComments() {
      return [...this.storeInstance.comments]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    }
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
    
    // 审核通过评论
    approveComment(id) {
      this.storeInstance.updateCommentStatus(id, 'approved');
    },
    
    // 拒绝评论
    rejectComment(id) {
      this.storeInstance.updateCommentStatus(id, 'rejected');
    },
    
    // 删除评论
    deleteComment(id) {
      if (confirm('确定要删除此评论吗？')) {
        this.storeInstance.deleteComment(id);
      }
    }
  },
  mounted() {
    // 组件挂载后等待200ms再开始动画
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
  }
};
</script>

<style scoped lang="scss">
.admin-home {
  padding: 10px 0;
  position: relative;
}

.page-title {
  color: var(--highlight-color);
  font-size: 24px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  padding-bottom: 10px;
  position: relative;
  z-index: 1;
  
  &:after {
    content: '';
    position: absolute;
    bottom: calc(-1 * var(--pixel-size));
    left: 0;
    width: 50%;
    height: 1px;
    background-color: var(--accent-color);
    box-shadow: 0 0 5px var(--accent-color);
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.rpg-stat-card {
  background-color: rgba(6, 6, 33, 0.8);
  border: var(--border-width) solid var(--highlight-color);
  border-radius: 2px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(45deg, rgba(58, 142, 169, 0.1), rgba(42, 103, 194, 0.1));
    z-index: 0;
    animation: bg-shift 3s ease infinite;
  }
  
  &.appear {
    opacity: 1;
    transform: translateY(0);
  }
  
  .stat-icon {
    font-size: 28px;
    margin-right: 15px;
    color: var(--accent-color);
    z-index: 1;
    filter: drop-shadow(0 0 3px var(--accent-color));
  }
  
  .stat-info {
    flex: 1;
    z-index: 1;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--highlight-color);
    margin-bottom: 5px;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  }
  
  .stat-label {
    font-size: 14px;
    color: #a9b7d0;
  }
  
  .stat-link {
    position: absolute;
    bottom: 10px;
    right: 15px;
    color: var(--accent-color);
    font-size: 12px;
    text-decoration: none;
    z-index: 1;
    
    &:hover {
      color: var(--highlight-color);
      text-decoration: underline;
      transform: translateX(2px);
    }
    
    &:after {
      content: ' ▶';
      font-size: 8px;
      opacity: 0;
      transition: all 0.3s;
    }
    
    &:hover:after {
      opacity: 1;
      margin-left: 3px;
    }
  }
}

@keyframes bg-shift {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.05); }
}

.admin-section {
  margin-bottom: 30px;
  border: var(--border-width) solid var(--highlight-color);
  padding: 20px;
  position: relative;
  background-color: rgba(6, 6, 33, 0.8);
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

.section-title {
  font-size: 18px;
  color: var(--highlight-color);
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.recent-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recent-item {
  padding: 12px 15px;
  background-color: rgba(12, 11, 60, 0.6);
  border-left: var(--pixel-size) solid var(--accent-color);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(12, 11, 60, 0.8);
    transform: translateX(3px);
  }
  
  .item-title {
    flex: 1;
    font-weight: bold;
    color: var(--text-color);
    margin-right: 15px;
  }
  
  .item-meta {
    font-size: 12px;
    color: var(--accent-color);
    margin-right: 15px;
  }
  
  .item-action {
    padding: 3px 8px;
    background-color: rgba(58, 142, 169, 0.3);
    border: var(--pixel-size) solid var(--highlight-color);
    color: var(--text-color);
    font-size: 12px;
    text-decoration: none;
    margin-left: 8px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background-color: rgba(58, 142, 169, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
    
    &.reject {
      background-color: rgba(255, 88, 88, 0.3);
      border-color: #ff5858;
      
      &:hover {
        background-color: rgba(255, 88, 88, 0.5);
      }
    }
  }
}

.comment-item {
  flex-direction: column;
  align-items: flex-start;
  
  .item-author {
    font-weight: bold;
    color: var(--highlight-color);
    margin-bottom: 5px;
  }
  
  .item-content {
    color: var(--text-color);
    margin-bottom: 10px;
    width: 100%;
  }
  
  .item-meta {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 8px;
    
    .comment-status {
      padding: 2px 5px;
      font-size: 10px;
      border-radius: 3px;
      
      &.approved {
        background-color: rgba(0, 200, 83, 0.3);
        color: #80ffb0;
      }
      
      &.pending {
        background-color: rgba(255, 171, 64, 0.3);
        color: #ffdb9e;
      }
      
      &.rejected {
        background-color: rgba(255, 88, 88, 0.3);
        color: #ffbebe;
      }
    }
  }
  
  .item-actions {
    display: flex;
    gap: 8px;
  }
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: var(--accent-color);
  font-style: italic;
  background-color: rgba(12, 11, 60, 0.3);
  border: 1px dashed var(--accent-color);
}

/* 像素角落装饰 */
.pixel-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: transparent;
  border: var(--pixel-size) solid var(--highlight-color);
  
  &.top-left {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }
  
  &.top-right {
    top: -1px;
    right: -1px;
    border-left: none;
    border-bottom: none;
  }
  
  &.bottom-left {
    bottom: -1px;
    left: -1px;
    border-right: none;
    border-top: none;
  }
  
  &.bottom-right {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style> 