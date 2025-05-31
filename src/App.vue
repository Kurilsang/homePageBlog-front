<template>
  <div id="app" class="rpg-container">
    <!-- 像素装饰元素 -->
    <div class="pixel-decoration top-left"></div>
    <div class="pixel-decoration top-right"></div>
    <div class="pixel-decoration bottom-left"></div>
    <div class="pixel-decoration bottom-right"></div>
    
    <!-- 像素星星背景 -->
    <div class="pixel-stars">
      <div v-for="n in 50" :key="n" class="star" :style="{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }"></div>
    </div>
    
    <!-- 像素行星 -->
    <div class="pixel-planet"></div>
    
    <!-- 像素流星Canvas -->
    <canvas ref="shootingStarsCanvas" class="shooting-stars-canvas"></canvas>
    
    <!-- 音乐播放器 -->
    <MusicPlayerComponent />
    
    <!-- 导航栏，在首页和文章详情页显示 -->
    <nav class="pixel-nav" v-if="isHomePage || isArticlePage">
      <div class="nav-container">
        <div class="nav-logo">像素冒险家</div>
        <div class="nav-links">
          <button 
             class="nav-link" 
             @click="goToSection('profile')">简介</button>
          <button 
             class="nav-link" 
             @click="goToSection('articles')">文章</button>
        </div>
      </div>
    </nav>
    
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script>
import MusicPlayerComponent from './components/MusicPlayerComponent.vue';

export default {
  name: 'App',
  components: {
    MusicPlayerComponent
  },
  data() {
    return {
      shootingStars: [],
      animationFrameId: null
    }
  },
  computed: {
    // 判断是否为首页
    isHomePage() {
      return this.$route.path === '/';
    },
    
    // 判断是否为文章详情页
    isArticlePage() {
      return this.$route.name === 'Article';
    }
  },
  methods: {
    // 导航到不同部分
    goToSection(section) {
      if (this.isHomePage) {
        // 在首页内导航
        this.$root.$emit('set-active-section', section);
        // 强制滚动到顶部
        window.scrollTo(0, 0);
      } else {
        // 从文章页返回首页并定位到对应部分
        this.$router.push({ 
          path: '/',
          query: { section: section }
        });
      }
    },
    
    // 流星相关方法
    initShootingStars() {
      const canvas = this.$refs.shootingStarsCanvas;
      const ctx = canvas.getContext('2d');
      
      // 设置Canvas尺寸为窗口大小
      this.resizeCanvas();
      
      // 创建流星
      this.createShootingStars();
      
      // 开始动画
      this.animateShootingStars(ctx);
      
      // 监听窗口大小变化
      window.addEventListener('resize', this.resizeCanvas);
    },
    
    resizeCanvas() {
      const canvas = this.$refs.shootingStarsCanvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    
    createShootingStars() {
      // 清空现有流星
      this.shootingStars = [];
      
      // 创建8个流星，约为原来25个的三分之一
      
      // 左边缘 (减少到2个)
      for (let i = 0; i < 2; i++) {
        const y = (i / 1) * window.innerHeight * 0.7;
        this.shootingStars.push(this.createStar(5, y, 0.5));
      }
      
      // 底边缘 (减少到2个)
      for (let i = 0; i < 2; i++) {
        const x = (i / 1) * window.innerWidth * 0.7;
        this.shootingStars.push(this.createStar(x, window.innerHeight - 50, 0.5));
      }
      
      // 特别在左下角添加一个
      this.shootingStars.push(this.createStar(5, window.innerHeight - 5, 0.8));
      
      // 其他区域随机分布 (减少到3个)
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        this.shootingStars.push(this.createStar(x, y));
      }
    },
    
    createStar(x, y, speedMultiplier = 1) {
      return {
        x,
        y,
        length: 25 + Math.random() * 50, // 减小轨迹长度
        speed: (0.5 + Math.random() * 0.5) * speedMultiplier,
        particles: [],
        delay: Math.random() * 10000, // 随机延迟启动
        active: false,
        startTime: Date.now() + Math.random() * 10000,
        lifeTime: 1500 + Math.random() * 1000 // 缩短生命周期
      };
    },
    
    animateShootingStars(ctx) {
      // 清除画布
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      const now = Date.now();
      
      // 更新和绘制每个流星
      this.shootingStars.forEach(star => {
        // 检查是否应该激活
        if (!star.active && now > star.startTime) {
          star.active = true;
          star.particles = [];
        }
        
        if (star.active) {
          // 移动流星
          star.x += star.speed;
          star.y += star.speed;
          
          // 检查是否需要重置位置
          if (star.x > window.innerWidth) {
            // 重置到左侧
            star.x = 0;
            // Y位置保持不变
          }
          
          if (star.y > window.innerHeight) {
            // 重置到顶部
            star.y = 0;
            // X位置保持不变
          }
          
          // 添加新粒子
          star.particles.unshift({
            x: star.x,
            y: star.y,
            createdAt: now,
            size: 0.5 + Math.random() * 1 // 减小粒子尺寸
          });
          
          // 控制粒子数量，防止过多
          if (star.particles.length > star.length) {
            star.particles = star.particles.slice(0, star.length);
          }
          
          // 绘制头部 - 更明亮的蓝色头部
          ctx.fillStyle = '#3a8ea9'; // 更换为更暗的青色
          ctx.beginPath();
          ctx.arc(star.x, star.y, 2, 0, Math.PI * 2); // 略微增大流星头部
          ctx.fill();
          
          // 添加发光效果
          ctx.shadowBlur = 10; 
          ctx.shadowColor = '#3a8ea9'; // 更换为更暗的青色
          
          // 绘制轨迹粒子
          star.particles.forEach((particle, index) => {
            const age = now - particle.createdAt;
            
            // 粒子存在时间超过流星生命周期，则删除
            if (age > star.lifeTime) return;
            
            // 透明度基于粒子年龄，让尾部逐渐消失
            const alpha = 1 - (age / star.lifeTime);
            
            ctx.fillStyle = `rgba(58, 142, 169, ${alpha * 0.5})`; // 更换为更暗的青色，降低不透明度
            
            // 粒子尺寸随着距离头部距离减小
            const size = Math.max(0.1, particle.size * (1 - index / star.length));
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });
      
      // 重复下一帧的流星动画
      this.animationFrameId = requestAnimationFrame(() => this.animateShootingStars(ctx));
    }
  },
  mounted() {
    // 初始化流星效果
    this.$nextTick(() => {
      if (this.$refs.shootingStarsCanvas) {
        this.initShootingStars();
      }
    });
  },
  beforeDestroy() {
    // 清理动画
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // 移除事件监听器
    window.removeEventListener('resize', this.resizeCanvas);
  },
  watch: {
    // 监听路由变化，在路由变化时重新检查是否需要显示导航
    '$route'() {
      // 这里什么都不做，只是为了触发计算属性的重新计算
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: 'Press Start 2P';
  src: url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
}

/* 添加支持中文的像素风字体 */
@font-face {
  font-family: 'PixelFont';
  src: url('//cdn.jsdelivr.net/gh/SolidZORO/zpix-pixel-font@latest/dist/zpix.ttf') format('truetype');
  font-display: swap;
}

:root {
  --primary-color: #0c0b3c; /* 更深的蓝紫色背景 */
  --secondary-color: #2a67c2; /* 偏亮的蓝色 */
  --highlight-color: #3a8ea9; /* 更暗的青色替代之前的亮青色 */
  --accent-color: #5ebae2; /* 天蓝色作为新的强调色 */
  --dark-color: #060621; /* 更深的背景色 */
  --text-color: #ffffff;
  --pixel-size: 2px;
  --border-width: 4px;
}

* {
  box-sizing: border-box;
  image-rendering: pixelated;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--dark-color); /* 更改为更深的背景色 */
  color: var(--text-color);
  font-family: 'PixelFont', 'Press Start 2P', monospace; /* 优先使用中文像素字体 */
  font-size: 14px;
  line-height: 1.4;
  overflow-x: hidden;
  position: relative;
}

/* 全局像素风格滚动条 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background-color: rgba(6, 6, 33, 0.8);
  border-left: var(--pixel-size) solid rgba(58, 142, 169, 0.3);
}

::-webkit-scrollbar-thumb {
  background-color: var(--highlight-color);
  border: var(--pixel-size) solid var(--highlight-color);
  image-rendering: pixelated;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--accent-color);
}

::-webkit-scrollbar-corner {
  background-color: var(--dark-color);
}

/* Firefox滚动条样式 */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--highlight-color) rgba(6, 6, 33, 0.8);
}

/* 像素星星背景 */
.pixel-stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: #5ebae2; /* 基础颜色为亮蓝色 */
  animation: twinkle 3s infinite;
  
  &:nth-child(3n) {
    background-color: #3a8ea9; /* 更换为更暗的青色 */
  }
  
  &:nth-child(3n+1) {
    background-color: #a0d0ff; /* 每3个一组的第二个为淡蓝色 */
    width: 3px;
    height: 3px;
  }
  
  &:nth-child(5n) {
    background-color: #ffffff; /* 每5个一组的为白色 */
    width: 1px;
    height: 1px;
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); } /* 添加缩放效果 */
}

/* Canvas流星 */
.shooting-stars-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
}

.rpg-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
  padding-top: 90px; /* 调整为导航栏高度 + 额外间距 */
}

/* 导航栏 */
.pixel-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(12, 11, 60, 0.95); /* 调整为深蓝紫色 */
  border-bottom: var(--border-width) solid var(--highlight-color);
  z-index: 100;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  height: 60px;
}

.nav-logo {
  font-size: 20px;
  color: var(--highlight-color);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: var(--text-color);
  background: none;
  border: none;
  font-family: 'Press Start 2P', monospace;
  font-size: 14px;
  text-decoration: none;
  padding: 5px 10px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover, &.active {
    color: var(--highlight-color);
    border-bottom: 2px solid var(--highlight-color);
  }
}

/* 主内容区域 */
.content-area {
  margin-bottom: 20px;
  padding-top: 30px;
}

.content-section {
  margin-bottom: 20px;
}

/* 像素装饰元素 */
.pixel-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  border: var(--pixel-size) solid var(--highlight-color);
  z-index: 1;
  
  &.top-left {
    top: 70px;
    left: 0;
    border-right: none;
    border-bottom: none;
  }
  
  &.top-right {
    top: 70px;
    right: 0;
    border-left: none;
    border-bottom: none;
  }
  
  &.bottom-left {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
  }
  
  &.bottom-right {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }
}

/* 像素角落装饰 */
.pixel-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: var(--pixel-size) solid var(--highlight-color);
  
  &.top-left {
    top: -var(--pixel-size);
    left: -var(--pixel-size);
    border-right: none;
    border-bottom: none;
  }
  
  &.top-right {
    top: -var(--pixel-size);
    right: -var(--pixel-size);
    border-left: none;
    border-bottom: none;
  }
  
  &.bottom-left {
    bottom: -var(--pixel-size);
    left: -var(--pixel-size);
    border-right: none;
    border-top: none;
  }
  
  &.bottom-right {
    bottom: -var(--pixel-size);
    right: -var(--pixel-size);
    border-left: none;
    border-top: none;
  }
}

/* 像素行星 */
.pixel-planet {
  position: fixed;
  bottom: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #3a8ea9 0%, #2a67c2 50%, #0c0b3c 100%); /* 更换为更暗的青色作为亮点 */
  box-shadow: 0 0 20px rgba(58, 142, 169, 0.5); /* 更换为更暗的青色的阴影 */
  filter: contrast(1.2);
  z-index: -1;
  image-rendering: pixelated;
  transform: rotate(-15deg);
  
  &:before {
    content: '';
    position: absolute;
    top: 20%;
    left: 15%;
    width: 30%;
    height: 10%;
    background-color: rgba(58, 142, 169, 0.4); /* 更换为更暗的青色 */
    border-radius: 50%;
    transform: rotate(30deg);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 40%;
    left: 25%;
    width: 40%;
    height: 8%;
    background-color: rgba(58, 142, 169, 0.3); /* 更换为更暗的青色 */
    border-radius: 50%;
    transform: rotate(20deg);
  }
}

/* 内容区域过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>






