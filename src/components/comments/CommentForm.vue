<template>
  <div class="comment-form">
    <h3 class="form-title" v-if="!parentId">发表评论</h3>
    <h3 class="form-title" v-else>回复评论</h3>
    
    <div class="form-group">
      <label for="comment-author">昵称</label>
      <input 
        type="text" 
        id="comment-author" 
        v-model="author" 
        class="rpg-input"
        placeholder="请输入您的昵称"
      />
    </div>
    
    <div class="form-group">
      <label for="comment-content">评论内容</label>
      <textarea 
        id="comment-content" 
        v-model="content" 
        class="rpg-input textarea"
        placeholder="请输入评论内容"
        rows="3"
      ></textarea>
      <div class="char-counter" :class="{'warning': content.length > 200}">
        {{ content.length }}/500 字符
      </div>
    </div>
    
    <div class="form-actions">
      <button 
        class="rpg-button submit-button" 
        :disabled="!isValid || isSending" 
        :class="{'loading': isSending}"
        @click="submitComment"
      >
        <span v-if="isSending">提交中...</span>
        <span v-else>发表评论</span>
      </button>
      <button 
        class="rpg-button cancel-button" 
        v-if="parentId" 
        @click="cancel"
      >
        取消
      </button>
    </div>
    
    <div class="form-notice" v-if="!isValid">
      <p>请填写昵称和评论内容</p>
    </div>
    
    <div class="form-notice success" v-if="submitSuccess">
      <p>评论提交成功，等待审核后显示</p>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'CommentForm',
  props: {
    articleId: {
      type: [Number, String],
      required: true
    },
    parentId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      author: '',
      content: '',
      isSending: false,
      submitSuccess: false,
      storeInstance: store.getStore()
    };
  },
  computed: {
    isValid() {
      return this.author.trim() && this.content.trim();
    }
  },
  methods: {
    // 提交评论
    submitComment() {
      if (!this.isValid || this.isSending) return;
      
      this.isSending = true;
      this.submitSuccess = false;
      
      // 构造评论数据
      const commentData = {
        articleId: parseInt(this.articleId),
        parentId: this.parentId,
        author: this.author.trim(),
        content: this.content.trim(),
        avatar: '/images/avatars/default-avatar.jpg' // 使用默认头像
      };
      
      // 模拟提交API请求
      setTimeout(() => {
        // 添加评论到Store
        this.storeInstance.addComment(commentData);
        
        // 重置表单
        this.resetForm();
        
        // 显示成功提示
        this.submitSuccess = true;
        this.isSending = false;
        
        // 发出提交成功事件
        this.$emit('submit', commentData);
        
        // 3秒后隐藏成功提示
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      }, 800);
    },
    
    // 重置表单
    resetForm() {
      this.author = '';
      this.content = '';
    },
    
    // 取消评论
    cancel() {
      this.resetForm();
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped lang="scss">
.comment-form {
  padding: 15px;
  background-color: rgba(12, 11, 60, 0.5);
  border: var(--pixel-size) solid var(--highlight-color);
  margin-bottom: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid var(--highlight-color);
  }
}

.form-title {
  font-size: 16px;
  color: var(--highlight-color);
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  color: var(--accent-color);
  margin-bottom: 5px;
  font-size: 14px;
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
    box-shadow: 0 0 8px rgba(94, 186, 226, 0.4);
  }
  
  &.textarea {
    resize: vertical;
    min-height: 80px;
  }
}

.char-counter {
  font-size: 12px;
  color: var(--accent-color);
  text-align: right;
  margin-top: 5px;
  
  &.warning {
    color: #ff7a7a;
  }
}

.form-actions {
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
  position: relative;
  
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
      height: 3px;
      background: var(--accent-color);
      animation: loading-bar 1.5s infinite linear;
      width: 30%;
    }
  }
  
  &.submit-button {
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

.form-notice {
  margin-top: 10px;
  padding: 8px;
  font-size: 12px;
  border-radius: 2px;
  background-color: rgba(255, 88, 88, 0.2);
  color: #ff7a7a;
  
  &.success {
    background-color: rgba(0, 200, 83, 0.2);
    color: #80ffb0;
  }
  
  p {
    margin: 0;
  }
}
</style> 