<template>
  <div class="comment-list">
    <!-- 顶层评论 -->
    <div v-for="comment in topLevelComments" :key="comment.id" class="comment-thread">
      <comment-item 
        :comment="comment" 
        :all-comments="comments"
        @reply="handleReply"
      />
    </div>
    
    <!-- 没有评论时的提示 -->
    <div v-if="topLevelComments.length === 0" class="empty-comments">
      还没有评论，来发表第一条评论吧！
    </div>
  </div>
</template>

<script>
import CommentItem from './CommentItem.vue';

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    comments: {
      type: Array,
      default: () => []
    },
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    // 获取顶级评论（没有父评论的评论）
    topLevelComments() {
      return this.comments.filter(comment => comment.parentId === null);
    }
  },
  methods: {
    // 处理回复评论
    handleReply(commentData) {
      this.$emit('reply', commentData);
    }
  }
};
</script>

<style scoped lang="scss">
.comment-list {
  margin-top: 20px;
}

.comment-thread {
  margin-bottom: 20px;
}

.empty-comments {
  padding: 20px;
  text-align: center;
  color: var(--accent-color);
  font-style: italic;
  background-color: rgba(12, 11, 60, 0.3);
  border: var(--pixel-size) dashed rgba(58, 142, 169, 0.3);
}
</style> 