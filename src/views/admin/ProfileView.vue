<template>
  <div class="admin-profile">
    <h1 class="page-title">个人资料管理</h1>
    
    <div class="profile-edit-container rpg-menu-box" :class="{'appear': isVisible}">
      <h2 class="section-title">编辑个人资料</h2>
      
      <div class="form-container">
        <!-- 头像上传 -->
        <div class="form-section avatar-section">
          <h3 class="subsection-title">头像</h3>
          
          <div class="avatar-editor">
            <div class="avatar-preview">
              <div class="rpg-frame preview-frame">
                <img :src="profile.avatar" alt="当前头像" class="avatar-image" />
                <div class="pixel-corner top-left"></div>
                <div class="pixel-corner top-right"></div>
                <div class="pixel-corner bottom-left"></div>
                <div class="pixel-corner bottom-right"></div>
              </div>
            </div>
            
            <div class="avatar-controls">
              <p class="control-info">上传新头像 (建议尺寸: 200x200px)</p>
              
              <label for="avatar-upload" class="rpg-button upload-button">
                选择图片
                <input 
                  type="file" 
                  id="avatar-upload" 
                  @change="handleAvatarUpload" 
                  accept="image/*" 
                  class="file-input"
                />
              </label>
              
              <p class="upload-note">目前此功能仅为演示，不会实际上传文件。</p>
            </div>
          </div>
        </div>
        
        <!-- 个人标题 -->
        <div class="form-section">
          <h3 class="subsection-title">个人称号</h3>
          
          <div class="form-group">
            <label for="profile-title">标题</label>
            <input 
              type="text" 
              id="profile-title" 
              v-model="profile.title" 
              class="rpg-input"
              placeholder="请输入个人称号"
            />
          </div>
        </div>
        
        <!-- 个人简介 -->
        <div class="form-section">
          <h3 class="subsection-title">个人简介</h3>
          
          <div class="form-group">
            <label for="profile-description">简介内容</label>
            <textarea 
              id="profile-description" 
              v-model="profile.description" 
              class="rpg-input textarea"
              placeholder="请输入个人简介"
              rows="5"
            ></textarea>
            <div class="char-counter">{{ profile.description.length }}/200 字符</div>
          </div>
        </div>
        
        <!-- 保存按钮 -->
        <div class="form-actions">
          <button 
            class="rpg-button save-button" 
            :class="{'loading': isSaving}" 
            @click="saveProfile" 
            :disabled="isSaving"
          >
            <span v-if="isSaving">保存中...</span>
            <span v-else>保存更改</span>
          </button>
          
          <button class="rpg-button cancel-button" @click="resetProfile">重置</button>
        </div>
        
        <!-- 保存成功提示 -->
        <div class="success-message" v-if="showSuccess">
          保存成功！
        </div>
      </div>
      
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
    
    <div class="profile-preview-container rpg-menu-box" :class="{'appear': isVisible}" style="animation-delay: 0.3s">
      <h2 class="section-title">预览效果</h2>
      
      <div class="profile-preview">
        <div class="preview-header">
          <div class="rpg-frame avatar-frame">
            <img :src="profile.avatar" alt="头像" class="rpg-avatar">
            <div class="pixel-corner top-left"></div>
            <div class="pixel-corner top-right"></div>
            <div class="pixel-corner bottom-left"></div>
            <div class="pixel-corner bottom-right"></div>
          </div>
          <h1 class="preview-title">{{ profile.title || '像素冒险家' }}</h1>
        </div>
        
        <div class="preview-content">
          <p class="preview-description">{{ profile.description || '在这里显示个人简介...' }}</p>
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
  name: 'AdminProfileView',
  data() {
    return {
      isVisible: false,
      storeInstance: store.getStore(),
      profile: {
        avatar: '',
        title: '',
        description: ''
      },
      originalProfile: {
        avatar: '',
        title: '',
        description: ''
      },
      isSaving: false,
      showSuccess: false
    };
  },
  created() {
    // 获取当前个人资料
    const currentProfile = this.storeInstance.profile;
    this.profile = { ...currentProfile };
    this.originalProfile = { ...currentProfile };
  },
  mounted() {
    // 组件挂载后等待200ms再开始动画
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
  },
  methods: {
    // 处理头像上传
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // 检查文件类型
      if (!file.type.match('image.*')) {
        alert('请选择图片文件');
        return;
      }
      
      // 读取文件并预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profile.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    // 保存个人资料
    saveProfile() {
      this.isSaving = true;
      this.showSuccess = false;
      
      // 模拟API保存请求
      setTimeout(() => {
        // 保存到store
        this.storeInstance.updateProfile(this.profile);
        
        // 更新本地记录
        this.originalProfile = { ...this.profile };
        
        // 显示成功提示
        this.showSuccess = true;
        this.isSaving = false;
        
        // 3秒后隐藏成功提示
        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);
      }, 1000);
    },
    
    // 重置为原始数据
    resetProfile() {
      this.profile = { ...this.originalProfile };
    }
  }
};
</script>

<style scoped lang="scss">
.admin-profile {
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

.profile-edit-container, .profile-preview-container {
  margin-bottom: 30px;
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

.section-title {
  font-size: 18px;
  color: var(--highlight-color);
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
}

.form-section {
  margin-bottom: 25px;
}

.subsection-title {
  font-size: 16px;
  color: var(--accent-color);
  margin: 0 0 15px 0;
}

.avatar-section {
  margin-bottom: 30px;
}

.avatar-editor {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.avatar-preview {
  flex-shrink: 0;
}

.preview-frame {
  width: 150px;
  height: 150px;
  border: var(--border-width) solid var(--highlight-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: rgba(12, 11, 60, 0.6);
}

.avatar-image {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.avatar-controls {
  flex: 1;
}

.control-info {
  color: #a9b7d0;
  margin-bottom: 15px;
  font-size: 14px;
}

.upload-button {
  display: inline-block;
  position: relative;
  cursor: pointer;
  padding: 10px 15px;
}

.file-input {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-note {
  color: var(--accent-color);
  font-size: 12px;
  font-style: italic;
  margin-top: 10px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  color: var(--accent-color);
  margin-bottom: 8px;
  font-size: 14px;
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
    min-height: 100px;
  }
}

.char-counter {
  font-size: 12px;
  color: var(--accent-color);
  text-align: right;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.rpg-button {
  padding: 12px 20px;
  background: var(--primary-color);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
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

.success-message {
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(0, 200, 83, 0.2);
  border: var(--pixel-size) solid #00c853;
  color: #80ffb0;
  text-align: center;
  animation: success-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes success-pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* 预览部分样式 */
.profile-preview {
  background-color: rgba(12, 11, 60, 0.3);
  padding: 20px;
  border: var(--pixel-size) dashed var(--accent-color);
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-frame {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  margin-right: 15px;
  border: var(--pixel-size) solid var(--highlight-color);
  background-color: rgba(12, 11, 60, 0.6);
  position: relative;
}

.rpg-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-title {
  font-size: 20px;
  color: var(--highlight-color);
  margin: 0;
}

.preview-content {
  color: #a9b7d0;
  line-height: 1.6;
}

.preview-description {
  margin: 0;
}
</style> 