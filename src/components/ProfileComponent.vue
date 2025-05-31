<template>
  <div class="profile-container">
    <div class="rpg-dialog-box profile-box">
      <div class="profile-header">
        <div class="rpg-frame avatar-frame hover-scale" 
             :class="{'avatar-appear': isVisible, 'secret-mode': secretMode}"
             @mouseenter="avatarHover = true" 
             @mouseleave="avatarHover = false"
             @click="handleAvatarClick">
          <img :src="profileData.avatar || '../assets/avatar.png'" alt="头像" class="rpg-avatar" :class="{'avatar-pulse': avatarHover}">
          <div class="pixel-corner top-left"></div>
          <div class="pixel-corner top-right"></div>
          <div class="pixel-corner bottom-left"></div>
          <div class="pixel-corner bottom-right"></div>
        </div>
        <div class="profile-title">
          <h1 class="rpg-title" :class="{'text-animate': isVisible, 'secret-text': secretMode}">
            <span v-for="(char, index) in profileData.title" 
                  :key="index" 
                  :style="{ 'animation-delay': `${index * 0.08 + 0.5}s` }"
                  class="hover-glow">
              {{ char }}
            </span>
          </h1>
          <div class="pixel-line" :class="{'line-extend': isVisible}"></div>
          <div class="pixel-hearts" :class="{'hearts-appear': isVisible}">
            <span class="heart hover-pop" @click="createClickEffect">♥</span>
            <span class="heart hover-pop" @click="createClickEffect">♥</span>
            <span class="heart hover-pop" @click="createClickEffect">♥</span>
          </div>
        </div>
      </div>
      
      <div class="profile-content">
        <h2 class="rpg-heading hover-lift" :class="{'fade-in': isVisible, 'secret-text': secretMode}" style="animation-delay: 1.2s;">关于我</h2>
        <p class="rpg-text">
          <span class="text-container" :class="{'typing-effect': isVisible, 'secret-text': secretMode}">
            {{ displayedText }}
          </span>
          <span class="typing-cursor" :class="{'blink-cursor': isTypingComplete}">_</span>
        </p>
      </div>
      
      <div class="pixel-corner top-left"></div>
      <div class="pixel-corner top-right"></div>
      <div class="pixel-corner bottom-left"></div>
      <div class="pixel-corner bottom-right"></div>
    </div>
  </div>
</template>

<script>
import { profileAPI } from '@/api';

export default {
  name: 'ProfileComponent',
  data() {
    return {
      isVisible: false,
      avatarHover: false,
      profileData: {
        title: '像素冒险家',  // 默认值，加载完成后会被替换
        avatar: '',
        description: ''
      },
      fullText: '',
      displayedText: '',
      typingIndex: 0,
      typingSpeed: 50, // 打字速度(ms)
      isTypingComplete: false,
      typingTimeout: null,
      clickCount: 0,
      secretMode: false,
      easterEggTimeout: null,
      loading: true
    }
  },
  async mounted() {
    // 尝试从API获取个人资料
    try {
      const profileData = await profileAPI.getProfile();
      console.log(profileData);
      // 如果数据存在才进行赋值，否则使用默认值
      if (profileData && profileData.data) {
        this.profileData = profileData.data;
        this.fullText = profileData.data.description || '我是一名热爱像素艺术和编程的开发者，专注于创造有趣且独特的交互体验。在这个8-bit风格的世界里，我记录着我的冒险与发现。';
      } else {
        // 后端返回无效数据时使用默认值
        this.profileData = {
          title: '像素冒险家',
          avatar: require('@/assets/avatar.png'),
          description: '我是一名热爱像素艺术和编程的开发者，专注于创造有趣且独特的交互体验。在这个8-bit风格的世界里，我记录着我的冒险与发现。'
        };
        this.fullText = this.profileData.description;
      }
    } catch (error) {
      console.error('获取个人资料失败:', error);
      // 使用默认值
      this.profileData = {
        title: '像素冒险家',
        avatar: require('@/assets/avatar.png'),
        description: '我是一名热爱像素艺术和编程的开发者，专注于创造有趣且独特的交互体验。在这个8-bit风格的世界里，我记录着我的冒险与发现。'
      };
      this.fullText = this.profileData.description;
    } finally {
      this.loading = false;
      
    // 组件挂载后等待300ms再开始动画
    setTimeout(() => {
      this.isVisible = true;
      this.startTyping();
    }, 300);
    }
  },
  methods: {
    startTyping() {
      // 清除之前可能存在的计时器
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      
      // 确保fullText始终有值
      if (!this.fullText) {
        this.fullText = '我是一名热爱像素艺术和编程的开发者，专注于创造有趣且独特的交互体验。在这个8-bit风格的世界里，我记录着我的冒险与发现。';
      }
      
      // 重置打字相关状态
      this.typingIndex = 0;
      this.displayedText = '';
      this.isTypingComplete = false;
      
      // 开始逐字打印文本
      this.typeNextChar();
    },
    typeNextChar() {
      // 再次确保fullText存在
      if (!this.fullText || this.typingIndex >= this.fullText.length) {
        this.isTypingComplete = true;
        return;
      }
      
      this.displayedText += this.fullText.charAt(this.typingIndex);
      this.typingIndex++;
      this.typingTimeout = setTimeout(this.typeNextChar, this.typingSpeed);
    },
    
    // 头像点击彩蛋
    handleAvatarClick() {
      this.clickCount++;
      
      // 清除之前的定时器
      if (this.easterEggTimeout) {
        clearTimeout(this.easterEggTimeout);
      }
      
      // 设置5秒后重置点击计数
      this.easterEggTimeout = setTimeout(() => {
        this.clickCount = 0;
      }, 5000);
      
      // 如果点击5次，触发彩蛋
      if (this.clickCount >= 5) {
        this.triggerEasterEgg();
        this.clickCount = 0;
      }
    },
    
    // 触发彩蛋效果
    triggerEasterEgg() {
      this.secretMode = !this.secretMode;
      
      if (this.secretMode) {
        // 创建像素雨
        this.createPixelRain();
      }
    },
    
    // 创建像素雨效果
    createPixelRain() {
      const container = document.createElement('div');
      container.classList.add('pixel-rain-container');
      document.body.appendChild(container);
      
      // 创建500个像素点
      for (let i = 0; i < 100; i++) {
        setTimeout(() => {
          if (!this.secretMode) {
            return;
          }
          
          const pixel = document.createElement('div');
          pixel.classList.add('pixel-drop');
          
          // 随机位置和颜色
          const randomX = Math.random() * window.innerWidth;
          const randomDelay = Math.random() * 5;
          const randomDuration = 1 + Math.random() * 3;
          const colors = ['#3a8ea9', '#5ebae2', '#2a67c2', '#ffffff'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          pixel.style.left = `${randomX}px`;
          pixel.style.animationDelay = `${randomDelay}s`;
          pixel.style.animationDuration = `${randomDuration}s`;
          pixel.style.backgroundColor = randomColor;
          
          container.appendChild(pixel);
          
          // 动画结束后移除
          setTimeout(() => {
            pixel.remove();
          }, randomDuration * 1000 + randomDelay * 1000);
        }, i * 50);
      }
      
      // 20秒后自动退出秘密模式
      setTimeout(() => {
        this.secretMode = false;
        container.remove();
      }, 20000);
    },
    
    // 创建点击效果
    createClickEffect(event) {
      const ripple = document.createElement('div');
      ripple.classList.add('profile-ripple');
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 800);
    }
  },
  beforeDestroy() {
    // 在组件销毁前清除计时器
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    if (this.easterEggTimeout) {
      clearTimeout(this.easterEggTimeout);
    }
  }
};
</script>

<style scoped lang="scss">
.profile-container {
  width: 100%;
  margin-bottom: 20px;
}

.profile-box {
  background-color: rgba(16, 15, 75, 0.8);
  border: var(--border-width) solid var(--highlight-color);
  padding: 25px;
  position: relative;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-title {
  flex: 1;
}

/* 头像动画 */
.avatar-frame {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
  overflow: hidden;
  border-color: var(--highlight-color);
  background-color: var(--dark-color);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: scale(0.8) translateY(20px);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  
  &.secret-mode {
    animation: avatar-glitch 0.5s infinite;
    border-color: #ff00ff; // 彩蛋模式下的边框颜色
  }
}

@keyframes avatar-glitch {
  0%, 100% { transform: translate(0); }
  25% { transform: translate(3px, 2px); }
  50% { transform: translate(-2px, 1px); }
  75% { transform: translate(1px, -2px); }
}

.avatar-appear {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.rpg-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  transition: all 0.3s ease;
}

.avatar-pulse {
  transform: scale(1.05);
  filter: brightness(1.1) contrast(1.1);
}

/* 标题动画 */
.rpg-title {
  font-size: 28px;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  color: var(--highlight-color);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  display: flex;
}

.rpg-title span {
  opacity: 0;
  transform: translateY(-10px);
}

.text-animate span {
  animation: char-appear 0.3s forwards;
}

.secret-text {
  color: #ff00ff !important; // 彩蛋模式下的文字颜色
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.7), 0 0 10px #ff00ff;
}

@keyframes char-appear {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 像素线动画 */
.pixel-line {
  height: var(--pixel-size);
  background-color: var(--highlight-color);
  margin: 10px 0;
  position: relative;
  width: 0;
  transition: width 1.2s ease-in-out;
}

.line-extend {
  width: 100%;
}

/* 心形图标动画 */
.pixel-hearts {
  display: flex;
  gap: 5px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease;
  transition-delay: 1s;
}

.hearts-appear {
  opacity: 1;
  transform: translateY(0);
}

.heart {
  color: var(--highlight-color);
  font-size: 16px;
  animation: heart-beat 1.5s infinite;
  cursor: pointer;
  
  &:nth-child(2) {
    animation-delay: 0.5s;
  }
  
  &:nth-child(3) {
    animation-delay: 1s;
  }
}

@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 内容动画 */
.profile-content {
  margin-top: 10px;
}

.rpg-heading {
  font-size: 20px;
  margin: 0 0 15px 0;
  color: var(--highlight-color);
  position: relative;
  display: inline-block;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.5s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: var(--pixel-size);
    background-color: var(--highlight-color);
  }
}

.fade-in {
  opacity: 1;
  transform: translateX(0);
}

/* 打字机效果 */
.text-container {
  display: inline;
}

.typing-cursor {
  display: inline-block;
  color: var(--highlight-color);
  font-weight: bold;
  margin-left: 2px;
}

.blink-cursor {
  animation: cursor-blink 0.8s infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.rpg-text {
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  color: var(--text-color);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
}

/* 点击涟漪效果 */
.profile-ripple {
  position: fixed;
  border-radius: 50%;
  background-color: rgba(58, 142, 169, 0.4);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ripple-effect 0.8s ease-out;
  width: 5px;
  height: 5px;
  z-index: 9999;
}

@keyframes ripple-effect {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

/* 像素雨效果 */
.pixel-rain-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9990;
}

.pixel-drop {
  position: absolute;
  top: -10px;
  width: 5px;
  height: 5px;
  background-color: var(--highlight-color);
  animation: pixel-fall 2s linear infinite;
  image-rendering: pixelated;
}

@keyframes pixel-fall {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(105vh);
    opacity: 0;
  }
}

/* 交互效果 */
.hover-scale {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.hover-glow {
  transition: text-shadow 0.3s ease;
  
  &:hover {
    text-shadow: 0 0 5px var(--highlight-color), 0 0 10px var(--highlight-color);
  }
}

.hover-lift {
  transition: transform 0.3s ease, text-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    text-shadow: 2px 4px 0 rgba(0, 0, 0, 0.3);
  }
}

.hover-pop {
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.4);
  }
  
  &:active {
    transform: scale(0.9);
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .rpg-title {
    margin-top: 10px;
    justify-content: center;
  }
  
  .pixel-hearts {
    justify-content: center;
  }
}
</style> 