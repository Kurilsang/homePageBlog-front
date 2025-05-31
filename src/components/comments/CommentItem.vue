<template>
  <div class="comment-item" :class="{ 'child-comment': isChildComment }">
    <!-- 评论主体 -->
    <div class="comment-main">
      <!-- 评论头像 -->
      <div class="comment-avatar">
        <div class="rpg-frame avatar-frame">
          <img :src="comment.avatar || defaultAvatar" :alt="comment.author" class="avatar-image">
          <div class="pixel-corner top-left"></div>
          <div class="pixel-corner top-right"></div>
          <div class="pixel-corner bottom-left"></div>
          <div class="pixel-corner bottom-right"></div>
        </div>
      </div>
      
      <!-- 评论内容 -->
      <div class="comment-content">
        <div class="comment-header">
          <h4 class="comment-author">{{ comment.author }}</h4>
          <span class="comment-date">{{ comment.date }}</span>
        </div>
        
        <p class="comment-text">{{ comment.content }}</p>
        
        <!-- 回复按钮 -->
        <div class="comment-actions">
          <button class="rpg-button reply-button" @click="toggleReplyForm">
            {{ isReplying ? '取消回复' : '回复' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 回复表单 -->
    <div class="reply-form-wrapper" v-if="isReplying">
      <comment-form 
        :parent-id="comment.id" 
        :article-id="comment.articleId"
        @submit="handleReplySubmit"
        @cancel="isReplying = false"
      />
    </div>
    
    <!-- 子评论列表 -->
    <div class="child-comments" v-if="childComments.length > 0">
      <comment-item 
        v-for="childComment in childComments" 
        :key="childComment.id" 
        :comment="childComment" 
        :all-comments="allComments"
        :is-child-comment="true"
        @reply="$emit('reply', $event)"
      />
    </div>
  </div>
</template>

<script>
import CommentForm from './CommentForm.vue';

export default {
  name: 'CommentItem',
  components: {
    CommentForm
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    allComments: {
      type: Array,
      default: () => []
    },
    isChildComment: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isReplying: false,
      defaultAvatar: '/images/avatars/default-avatar.jpg'
    };
  },
  computed: {
    // 获取该评论的直接子评论
    childComments() {
      return this.allComments.filter(c => c.parentId === this.comment.id);
    }
  },
  methods: {
    // 切换回复表单显示状态
    toggleReplyForm() {
      this.isReplying = !this.isReplying;
    },
    
    // 处理回复提交
    handleReplySubmit(commentData) {
      this.$emit('reply', {
        ...commentData,
        parentId: this.comment.id
      });
      this.isReplying = false;
    }
  }
};
</script>

<style scoped lang="scss">
.comment-item {
  padding: 15px;
  background-color: rgba(16, 15, 75, 0.6);
  border-left: var(--pixel-size) solid var(--highlight-color);
  margin-bottom: 10px;
  
  &.child-comment {
    margin-left: 40px;
    border-left-color: var(--accent-color);
    background-color: rgba(16, 15, 75, 0.4);
  }
}

.comment-main {
  display: flex;
  gap: 15px;
}

.comment-avatar {
  flex-shrink: 0;
}

.avatar-frame {
  width: 45px;
  height: 45px;
  border: var(--pixel-size) solid var(--highlight-color);
  position: relative;
  overflow: hidden;
  background-color: rgba(12, 11, 60, 0.6);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.comment-author {
  font-size: 14px;
  color: var(--highlight-color);
  margin: 0;
}

.comment-date {
  font-size: 12px;
  color: var(--accent-color);
}

.comment-text {
  margin: 0 0 10px 0;
  color: var(--text-color);
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.rpg-button {
  padding: 5px 10px;
  background: rgba(12, 11, 60, 0.5);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--accent-color);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(12, 11, 60, 0.8);
    color: var(--highlight-color);
  }
}

.reply-form-wrapper {
  margin-top: 10px;
  margin-left: 60px;
  padding-top: 10px;
  border-top: var(--pixel-size) dotted rgba(58, 142, 169, 0.3);
}

.child-comments {
  margin-top: 10px;
}
</style> 