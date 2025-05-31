<template>
  <div class="dashboard-view">
    <!-- 侧边栏导航 -->
    <div class="sidebar" :class="{'collapsed': isSidebarCollapsed, 'mobile-expanded': isMobileExpanded}">
      <div class="sidebar-header">
        <h2 class="dashboard-title">管理控制台</h2>
        <button class="toggle-button" @click="toggleSidebar">
          <span v-if="isSidebarCollapsed && !isMobileExpanded">▶</span>
          <span v-else>◀</span>
        </button>
      </div>
      
      <div class="nav-items">
        <router-link to="/admin/dashboard" exact class="nav-item" active-class="active">
          <div class="nav-icon">📊</div>
          <span class="nav-text" v-if="!isSidebarCollapsed || isMobileExpanded">控制面板</span>
        </router-link>
        
        <router-link to="/admin/dashboard/profile" class="nav-item" active-class="active">
          <div class="nav-icon">👤</div>
          <span class="nav-text" v-if="!isSidebarCollapsed || isMobileExpanded">个人资料</span>
        </router-link>
        
        <router-link to="/admin/dashboard/articles" class="nav-item" active-class="active">
          <div class="nav-icon">📝</div>
          <span class="nav-text" v-if="!isSidebarCollapsed || isMobileExpanded">文章管理</span>
        </router-link>
        
        <router-link to="/admin/dashboard/comments" class="nav-item" active-class="active">
          <div class="nav-icon">💬</div>
          <span class="nav-text" v-if="!isSidebarCollapsed || isMobileExpanded">评论管理</span>
        </router-link>
      </div>
      
      <div class="sidebar-footer">
        <button class="logout-button" @click="handleLogout">
          <div class="nav-icon">🚪</div>
          <span class="nav-text" v-if="!isSidebarCollapsed || isMobileExpanded">退出登录</span>
        </button>
        
        <button class="home-button" @click="goToHome">
          <div class="nav-icon">🏠</div>
          <span class="nav-text" v-if="!isSidebarCollapsed || isMobileExpanded">返回首页</span>
        </button>
      </div>
    </div>

    <!-- 移动端遮罩层 -->
    <div 
      class="mobile-overlay" 
      v-if="isMobileExpanded" 
      @click="closeMobileSidebar"
    ></div>
    
    <!-- 移动端菜单按钮 -->
    <button 
      class="mobile-menu-button" 
      v-if="isMobile" 
      @click="toggleMobileSidebar"
    >
      <span v-if="isMobileExpanded">✕</span>
      <span v-else>☰</span>
    </button>
    
    <!-- 主内容区域 -->
    <div class="main-content" :class="{'full-width': isSidebarCollapsed && !isMobileExpanded}">
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
    
    <!-- 音乐播放器组件 -->
    <MusicPlayerComponent />
  </div>
</template>

<script>
import MusicPlayerComponent from '@/components/MusicPlayerComponent.vue';
import { doAdminLogout } from '@/utils/authHelper';

export default {
  name: 'DashboardView',
  components: {
    MusicPlayerComponent
  },
  data() {
    return {
      isSidebarCollapsed: false,
      isMobileExpanded: false,
      isMobile: false,
      windowWidth: window.innerWidth
    };
  },
  methods: {
    toggleSidebar() {
      if (this.isMobile) {
        this.toggleMobileSidebar();
      } else {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        localStorage.setItem('sidebar_collapsed', this.isSidebarCollapsed);
      }
    },
    
    toggleMobileSidebar() {
      this.isMobileExpanded = !this.isMobileExpanded;
      // 防止页面滚动当侧边栏展开时
      if (this.isMobileExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    
    closeMobileSidebar() {
      this.isMobileExpanded = false;
      document.body.style.overflow = '';
    },
    
    async handleLogout() {
      // 显示确认对话框
      if (confirm('确定要退出登录吗？')) {
        try {
          // 使用辅助函数处理登出
          await doAdminLogout();
        } catch (error) {
          console.error('登出失败:', error);
          // 即使API调用失败，也强制退出
          window.location.href = '/admin';
        }
      }
    },
    
    goToHome() {
      this.$router.push('/');
    },
    
    checkScreenSize() {
      this.windowWidth = window.innerWidth;
      this.isMobile = this.windowWidth < 768;
      
      // 在移动端自动折叠侧边栏
      if (this.isMobile) {
        this.isSidebarCollapsed = true;
      } else {
        // 恢复到保存的状态
        const storedState = localStorage.getItem('sidebar_collapsed');
        if (storedState !== null) {
          this.isSidebarCollapsed = storedState === 'true';
        }
        
        // 关闭移动端展开
        this.isMobileExpanded = false;
        document.body.style.overflow = '';
      }
    }
  },
  mounted() {
    // 从本地存储读取侧边栏状态
    const storedState = localStorage.getItem('sidebar_collapsed');
    if (storedState !== null) {
      this.isSidebarCollapsed = storedState === 'true';
    }
    
    // 检查屏幕尺寸
    this.checkScreenSize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeDestroy() {
    // 移除事件监听器
    window.removeEventListener('resize', this.checkScreenSize);
    // 恢复页面滚动
    document.body.style.overflow = '';
  }
};
</script>

<style scoped lang="scss">
.dashboard-view {
  min-height: 100vh;
  display: flex;
  background-color: var(--dark-color); /* 添加背景色 */
  position: relative;
  padding-top: 0; /* 删除顶部内边距 */
}

.sidebar {
  width: 250px;
  background-color: rgba(6, 6, 33, 0.95); /* 更深色背景 */
  border-right: var(--border-width) solid var(--highlight-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; /* 从顶部开始 */
  bottom: 0;
  left: 0;
  z-index: 100;
  overflow-y: auto;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3); /* 添加阴影 */
  
  &.collapsed {
    width: 60px;
  }
}

.sidebar-header {
  padding: 20px 15px;
  border-bottom: var(--pixel-size) solid var(--highlight-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(12, 11, 60, 0.95);
  position: sticky; /* 使标题固定 */
  top: 0;
  z-index: 2;
}

.dashboard-title {
  color: var(--highlight-color);
  font-size: 18px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5); /* 像素风格文字阴影 */
}

.toggle-button {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  padding: 5px;
  font-size: 16px;
  
  &:hover {
    color: var(--highlight-color);
  }
}

.nav-items {
  flex: 1;
  padding: 15px 0;
}

.nav-item, .logout-button, .home-button {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  margin-bottom: 8px;
  cursor: pointer;
  background: none;
  border-top: none;
  border-right: none;
  border-bottom: none;
  width: 100%;
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  position: relative;
  
  &:hover {
    background-color: rgba(58, 142, 169, 0.2);
    border-left-color: var(--accent-color);
    transform: translateX(3px); /* 悬停时轻微移动 */
  }
  
  &.active {
    background-color: rgba(58, 142, 169, 0.3);
    border-left-color: var(--highlight-color);
    
    .nav-icon {
      color: var(--highlight-color);
    }
    
    .nav-text {
      color: var(--highlight-color);
    }
    
    &:before {
      content: '▶';
      position: absolute;
      left: 5px;
      color: var(--highlight-color);
      font-size: 10px;
      opacity: 0.8;
    }
  }
}

.nav-icon {
  margin-right: 15px;
  font-size: 18px;
  width: 24px;
  text-align: center;
  color: var(--accent-color);
}

.nav-text {
  white-space: nowrap;
  transition: opacity 0.2s;
}

.sidebar-footer {
  padding: 15px;
  border-top: var(--pixel-size) solid var(--highlight-color);
  background-color: rgba(12, 11, 60, 0.95);
  position: sticky; /* 使底部固定 */
  bottom: 0;
  
  .logout-button, .home-button {
    margin-bottom: 8px;
    
    &:hover {
      .nav-icon {
        color: var(--highlight-color);
      }
    }
  }
  
  .logout-button {
    color: #ff7a7a;
    
    &:hover {
      background-color: rgba(255, 122, 122, 0.2);
    }
  }
}

/* 移动端菜单按钮 */
.mobile-menu-button {
  display: none; /* 默认隐藏 */
  position: fixed;
  bottom: 20px;
  left: 20px; /* 改为左下角 */
  width: 50px;
  height: 50px;
  border-radius: 4px; /* 更改为方形风格，有轻微圆角 */
  background-color: rgba(6, 6, 33, 0.9);
  color: var(--highlight-color);
  border: var(--pixel-size) solid var(--highlight-color);
  font-size: 24px;
  cursor: pointer;
  z-index: 150;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.5);
  transition: all 0.2s;
  image-rendering: pixelated;
  
  /* 添加像素风格边角 */
  &::before, &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: var(--pixel-size) solid var(--highlight-color);
  }
  
  &::before {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }
  
  &::after {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 rgba(0, 0, 0, 0.5);
    color: var(--accent-color);
  }
  
  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
  }
}

/* 移动端遮罩层 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 95;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.main-content {
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  background-color: var(--dark-color); /* 确保有背景色 */
  
  &.full-width {
    margin-left: 60px;
  }
}

.content-wrapper {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .sidebar {
    width: 0; /* 完全隐藏 */
    transform: translateX(-100%);
    box-shadow: none;
    
    &.collapsed {
      width: 0;
      transform: translateX(-100%);
    }
    
    &.mobile-expanded {
      width: 250px;
      transform: translateX(0);
      box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);
    }
  }
  
  .mobile-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .main-content {
    margin-left: 0 !important;
    width: 100%;
  }
  
  .content-wrapper {
    padding: 15px;
  }
}
</style> 