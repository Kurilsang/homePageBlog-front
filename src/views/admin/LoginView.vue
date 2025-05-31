<template>
  <div class="login-view">
    <div class="login-container">
      <div class="rpg-menu-box login-box" :class="{'appear': isVisible}">
        <h2 class="rpg-heading menu-title" :class="{'slide-in': isVisible}">管理员登录</h2>
        
        <div class="form-container">
          <div class="form-group" :class="{'fade-in': isVisible}" style="animation-delay: 0.3s">
            <label for="username">用户名</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              class="rpg-input"
              placeholder="请输入用户名"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-group" :class="{'fade-in': isVisible}" style="animation-delay: 0.4s">
            <label for="password">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="rpg-input"
              placeholder="请输入密码"
              :disabled="isLoading"
            />
          </div>
          
          <div class="error-message" v-if="errorMsg">
            <span>{{ errorMsg }}</span>
          </div>
          
          <button 
            class="rpg-button login-button" 
            :class="{'fade-in': isVisible, 'loading': isLoading}" 
            @click="handleLogin" 
            :disabled="isLoading"
            style="animation-delay: 0.5s"
          >
            <span v-if="isLoading">登录中...</span>
            <span v-else>登录</span>
          </button>
          
          <div class="back-link" :class="{'fade-in': isVisible}" style="animation-delay: 0.6s">
            <a @click="goToHome" class="rpg-link">返回首页</a>
          </div>
        </div>
        
        <div class="pixel-corner top-left"></div>
        <div class="pixel-corner top-right"></div>
        <div class="pixel-corner bottom-left"></div>
        <div class="pixel-corner bottom-right"></div>
      </div>
    </div>
    
    <!-- 音乐播放器组件 -->
    <MusicPlayerComponent />
  </div>
</template>

<script>
import MusicPlayerComponent from '@/components/MusicPlayerComponent.vue';

export default {
  name: 'LoginView',
  components: {
    MusicPlayerComponent
  },
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      isVisible: false,
      errorMsg: ''
    };
  },
  mounted() {
    // 动画延迟
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
  },
  methods: {
    handleLogin() {
      this.errorMsg = '';
      
      if (!this.username || !this.password) {
        this.errorMsg = '请输入用户名和密码';
        return;
      }
      
      this.isLoading = true;
      
      // 模拟登录请求
      setTimeout(() => {
        // 简单的验证，实际应该使用API
        if (this.username === 'admin' && this.password === '123456') {
          // 登录成功
          localStorage.setItem('admin_logged_in', 'true');
          image.png
          // 如果有重定向参数，则重定向到该路径
          const redirectPath = this.$route.query.redirect || '/admin/dashboard';
          this.$router.push(redirectPath);
        } else {
          // 登录失败
          this.errorMsg = '用户名或密码错误';
          this.isLoading = false;
        }
      }, 1000);
    },
    
    goToHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped lang="scss">
.login-view {
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 450px;
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

.appear {
  opacity: 1;
  transform: translateY(0);
}

.menu-title {
  margin-bottom: 25px;
  padding-bottom: 10px;
  text-align: center;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  color: var(--highlight-color);
  font-size: 24px;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.5s ease;
}

.slide-in {
  opacity: 1;
  transform: translateY(0);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(-10px);
}

.fade-in {
  animation: form-item-appear 0.5s forwards;
}

@keyframes form-item-appear {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

label {
  color: var(--accent-color);
  font-size: 14px;
}

.rpg-input {
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
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.error-message {
  color: #ff5858;
  font-size: 14px;
  text-align: center;
  padding: 5px;
  animation: error-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes error-pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.rpg-button {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  text-align: center;
  
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
}

@keyframes loading-bar {
  0% { left: -30%; width: 30%; }
  50% { width: 50%; }
  100% { left: 100%; width: 30%; }
}

.back-link {
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
}

.rpg-link {
  color: var(--accent-color);
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  
  &:hover {
    color: var(--highlight-color);
    text-shadow: 0 0 5px rgba(94, 186, 226, 0.7);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--highlight-color);
    transition: width 0.3s;
  }
  
  &:hover::after {
    width: 100%;
  }
}
</style> 