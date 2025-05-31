<template>
  <div class="music-player-container" :class="{'expanded': isExpanded}">
    <!-- 折叠/展开按钮 -->
    <div class="toggle-button-wrapper">
      <div class="toggle-button pixel-button" @click="togglePlayer">
        <span class="music-icon" :class="{'rotating': isPlaying}" v-if="!isExpanded">♫</span>
        <span v-else>×</span>
      </div>
    </div>
    
    <!-- 音乐播放器内容 -->
    <div class="player-content" v-if="isExpanded">
      <div class="rpg-frame player-frame">
        <!-- 播放器标题 -->
        <div class="player-header">
          <h3 class="player-title">像素音乐盒</h3>
        </div>
        
        <!-- 播放中的歌曲信息 -->
        <div class="now-playing">
          <div class="song-info">
            <div class="song-title">{{ currentSong.title }}</div>
            <div class="song-artist">{{ currentSong.artist }}</div>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-current" :style="{width: progressPercent + '%'}"></div>
            <div class="buffer-bar" :style="{width: bufferPercent + '%'}"></div>
          </div>
          <div class="time-info">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>
        
        <!-- 播放控制 -->
        <div class="control-buttons">
          <button class="control-btn prev-btn" @click="prevSong">◀◀</button>
          <button class="control-btn play-btn interactive-element" @click="togglePlay">
            {{ isPlaying ? '❚❚' : '▶' }}
          </button>
          <button class="control-btn next-btn" @click="nextSong">▶▶</button>
          
          <!-- 音量控制 -->
          <div class="volume-control">
            <span class="volume-icon interactive-element" @click="toggleMute">{{ isMuted ? '🔇' : '🔊' }}</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model="volume" 
              class="volume-slider" 
              @input="changeVolume"
            />
          </div>
        </div>
        
        <!-- 播放列表 -->
        <div class="playlist-container custom-scrollbar">
          <h4 class="playlist-title">歌曲列表</h4>
          <ul class="playlist">
            <li 
              v-for="(song, index) in playlist" 
              :key="song.id" 
              :class="{active: currentSongIndex === index}"
              @click="selectSong(index)"
              class="interactive-element"
            >
              <span class="song-number">{{ index + 1 }}.</span>
              <span class="song-name">{{ song.title }}</span>
              <span class="song-duration">- {{ song.artist }}</span>
            </li>
          </ul>
        </div>
        
        <div class="loading-indicator" v-if="isLoading">
          加载中...
        </div>
        
        <div class="pixel-corner top-left"></div>
        <div class="pixel-corner top-right"></div>
        <div class="pixel-corner bottom-left"></div>
        <div class="pixel-corner bottom-right"></div>
      </div>
    </div>
  </div>
</template>

<script>
import apiConfig from '../config/api.js';

export default {
  name: 'MusicPlayerComponent',
  data() {
    return {
      isExpanded: false,
      isPlaying: false,
      isLoading: false,
      isMuted: false,
      audio: null,
      volume: 70,
      currentSongIndex: 0,
      currentTime: 0,
      duration: 0,
      progressPercent: 0,
      bufferPercent: 0,
      playlist: [
        {
          id: 1,
          title: '音乐一号',
          artist: '像素艺术家',
          url: `${apiConfig.minioBaseUrl}/public/MusicPlayer/1.mp3`
        },
        {
          id: 2,
          title: '音乐二号',
          artist: '复古合成器',
          url: `${apiConfig.minioBaseUrl}/public/MusicPlayer/2.mp3`
        },
        {
          id: 3,
          title: '音乐三号',
          artist: '8-bit作曲家',
          url: `${apiConfig.minioBaseUrl}/public/MusicPlayer/3.mp3`
        }
      ],
      notes: ['♩', '♪', '♫', '♬', '𝅘𝅥𝅮', '𝅘𝅥𝅯', '𝄞'],
      particleTimeout: null,
      musicNoteContainer: null
    };
  },
  computed: {
    currentSong() {
      return this.playlist[this.currentSongIndex] || {};
    }
  },
  watch: {
    isExpanded(newValue) {
      if (newValue && !this.audio) {
        this.initAudio();
      }
    },
    isPlaying(newValue) {
      if (newValue) {
        this.createMusicNoteContainer();
        this.startMusicNoteAnimation();
      } else {
        this.stopMusicNoteAnimation();
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkNoteContainerSize);
  },
  methods: {
    // 初始化音频对象 - 懒加载
    initAudio() {
      if (this.audio) return;
      
      this.audio = new Audio();
      
      // 事件监听
      this.audio.addEventListener('timeupdate', this.updateProgress);
      this.audio.addEventListener('loadedmetadata', this.onMetadataLoaded);
      this.audio.addEventListener('ended', this.onSongEnded);
      this.audio.addEventListener('progress', this.updateBufferProgress);
      this.audio.addEventListener('waiting', () => { this.isLoading = true; });
      this.audio.addEventListener('canplay', () => { this.isLoading = false; });
      
      // 设置初始音量
      this.audio.volume = this.volume / 100;
      
      // 预加载设置为'auto'以实现流式播放
      this.audio.preload = 'auto';
    },
    
    // 加载并播放歌曲
    loadSong(index) {
      if (!this.audio) this.initAudio();
      
      this.currentSongIndex = index;
      const song = this.playlist[index];
      
      this.isLoading = true;
      this.audio.src = song.url;
      this.audio.load();
      
      if (this.isPlaying) {
        this.audio.play().catch(e => {
          console.error('播放失败:', e);
          this.isPlaying = false;
        });
      }
    },
    
    // 播放/暂停切换
    togglePlay() {
      if (!this.audio) {
        this.initAudio();
        this.loadSong(this.currentSongIndex);
      }
      
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play().catch(e => {
          console.error('播放失败:', e);
        });
      }
      
      this.isPlaying = !this.isPlaying;
      this.createClickEffect(event);
    },
    
    // 播放下一首
    nextSong() {
      const newIndex = (this.currentSongIndex + 1) % this.playlist.length;
      this.loadSong(newIndex);
      if (this.isPlaying) {
        this.audio.play().catch(e => console.error('播放失败:', e));
      }
      this.createClickEffect(event);
    },
    
    // 播放上一首
    prevSong() {
      const newIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
      this.loadSong(newIndex);
      if (this.isPlaying) {
        this.audio.play().catch(e => console.error('播放失败:', e));
      }
      this.createClickEffect(event);
    },
    
    // 选择特定歌曲播放
    selectSong(index) {
      if (index === this.currentSongIndex && this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
        return;
      }
      
      this.loadSong(index);
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(e => {
        console.error('播放失败:', e);
        this.isPlaying = false;
      });
      
      this.createClickEffect(event);
    },
    
    // 更新进度条
    updateProgress() {
      if (!this.audio) return;
      
      this.currentTime = this.audio.currentTime;
      this.progressPercent = (this.currentTime / this.duration) * 100 || 0;
    },
    
    // 更新缓冲进度
    updateBufferProgress() {
      if (!this.audio || !this.audio.buffered || this.audio.buffered.length === 0) return;
      
      const bufferedEnd = this.audio.buffered.end(this.audio.buffered.length - 1);
      this.bufferPercent = (bufferedEnd / this.duration) * 100 || 0;
    },
    
    // 元数据加载完成
    onMetadataLoaded() {
      this.duration = this.audio.duration;
      this.isLoading = false;
    },
    
    // 歌曲播放结束
    onSongEnded() {
      this.nextSong();
    },
    
    // 更改音量
    changeVolume() {
      if (!this.audio) return;
      this.audio.volume = this.volume / 100;
      if (this.volume > 0) this.isMuted = false;
    },
    
    // 静音切换
    toggleMute() {
      if (!this.audio) return;
      
      this.isMuted = !this.isMuted;
      this.audio.muted = this.isMuted;
      this.createClickEffect(event);
    },
    
    // 格式化时间
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00';
      
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },
    
    // 展开/折叠播放器
    togglePlayer() {
      this.isExpanded = !this.isExpanded;
      this.createClickEffect(event);
    },
    
    // 点击涟漪效果
    createClickEffect(event) {
      if (!event) return;
      
      const x = event.clientX;
      const y = event.clientY;
      
      const ripple = document.createElement('div');
      ripple.classList.add('click-ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 800);
    },
    
    // 创建音符容器
    createMusicNoteContainer() {
      // 如果已有容器，则不重复创建
      if (this.musicNoteContainer) return;
      
      // 创建固定尺寸的容器，防止音符影响页面布局
      const container = document.createElement('div');
      container.className = 'music-note-container';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '500';
      container.style.overflow = 'hidden';
      
      document.body.appendChild(container);
      this.musicNoteContainer = container;
    },
    
    // 开始音符动画
    startMusicNoteAnimation() {
      if (!this.isPlaying || !this.musicNoteContainer) return;
      
      this.createRandomMusicNote();
      
      // 设置定时创建新音符
      this.particleTimeout = setInterval(() => {
        if (this.isPlaying) {
          this.createRandomMusicNote();
        } else {
          this.stopMusicNoteAnimation();
        }
      }, 1000);
    },
    
    // 停止音符动画
    stopMusicNoteAnimation() {
      if (this.particleTimeout) {
        clearInterval(this.particleTimeout);
        this.particleTimeout = null;
      }
      
      // 保留容器，只是停止动画
    },
    
    // 创建随机音符
    createRandomMusicNote() {
      if (!this.musicNoteContainer || !this.isPlaying) return;
      
      // 随机位置（屏幕范围内）
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.7 + window.innerHeight * 0.2; // 避开顶部和底部
      const size = 24 + Math.random() * 16; // 更大的字体尺寸，介于24-40px之间
      const noteIndex = Math.floor(Math.random() * this.notes.length);
      const duration = 3000 + Math.random() * 4000; // 3-7秒的动画时间
      
      // 创建音符元素
      const noteElement = document.createElement('div');
      noteElement.className = 'floating-music-note';
      noteElement.textContent = this.notes[noteIndex];
      noteElement.style.position = 'absolute';
      noteElement.style.left = `${x}px`;
      noteElement.style.top = `${y}px`;
      noteElement.style.fontSize = `${size}px`;
      noteElement.style.color = 'var(--highlight-color)';
      noteElement.style.opacity = '0';
      noteElement.style.pointerEvents = 'none';
      noteElement.style.textShadow = '0 0 10px rgba(58, 142, 169, 0.5)';
      noteElement.style.animation = `float-note ${duration}ms ease-in-out forwards`;
      noteElement.style.zIndex = '501';
      
      // 随机旋转角度
      const rotation = -30 + Math.random() * 60; // -30° 到 +30°
      noteElement.style.transform = `rotate(${rotation}deg)`;
      
      // 添加到容器
      this.musicNoteContainer.appendChild(noteElement);
      
      // 根据动画时间移除音符
      setTimeout(() => {
        if (noteElement && noteElement.parentNode) {
          noteElement.parentNode.removeChild(noteElement);
        }
      }, duration);
    },
    
    // 检查音符容器尺寸
    checkNoteContainerSize() {
      if (this.musicNoteContainer) {
        this.musicNoteContainer.style.width = '100vw';
        this.musicNoteContainer.style.height = '100vh';
      }
    }
  },
  beforeDestroy() {
    // 组件销毁前清除监听器
    if (this.audio) {
      this.audio.removeEventListener('timeupdate', this.updateProgress);
      this.audio.removeEventListener('loadedmetadata', this.onMetadataLoaded);
      this.audio.removeEventListener('ended', this.onSongEnded);
      this.audio.removeEventListener('progress', this.updateBufferProgress);
      this.audio.pause();
      this.audio = null;
    }
    
    // 清除定时器
    if (this.particleTimeout) {
      clearInterval(this.particleTimeout);
      this.particleTimeout = null;
    }
    
    // 移除音符容器
    if (this.musicNoteContainer && this.musicNoteContainer.parentNode) {
      this.musicNoteContainer.parentNode.removeChild(this.musicNoteContainer);
    }
    
    // 移除事件监听
    window.removeEventListener('resize', this.checkNoteContainerSize);
  }
}
</script>

<style scoped lang="scss">
.music-player-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* 折叠/展开按钮 */
.toggle-button-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1001;
  width: 40px;
  height: 40px;
}

.toggle-button {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--dark-color);
  border: var(--pixel-size) solid var(--highlight-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--highlight-color);
  font-size: 20px;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  }
}

.music-icon {
  display: inline-block;
  
  &.rotating {
    animation: rotate-icon 3s linear infinite;
  }
}

@keyframes rotate-icon {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 播放器内容 */
.player-content {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 300px;
  transition: all 0.3s ease;
}

.player-frame {
  background-color: rgba(16, 15, 75, 0.95);
  border: var(--border-width) solid var(--highlight-color);
  padding: 15px;
  position: relative;
  border-radius: 2px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
}

.player-header {
  margin-bottom: 15px;
}

.player-title {
  margin: 0;
  font-size: 18px;
  color: var(--highlight-color);
  text-align: center;
  border-bottom: var(--pixel-size) solid var(--accent-color);
  padding-bottom: 10px;
}

.now-playing {
  margin-bottom: 15px;
  background-color: rgba(20, 20, 80, 0.6);
  padding: 10px;
  border-radius: 2px;
  border-left: var(--pixel-size) solid var(--highlight-color);
}

.song-info {
  display: flex;
  flex-direction: column;
}

.song-title {
  font-size: 16px;
  color: var(--highlight-color);
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 12px;
  color: var(--accent-color);
}

/* 进度条样式 */
.progress-container {
  margin-bottom: 15px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: rgba(20, 20, 80, 0.6);
  position: relative;
  border: var(--pixel-size) solid var(--highlight-color);
  overflow: hidden;
  margin-bottom: 5px;
  cursor: pointer;
}

.buffer-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(58, 142, 169, 0.3);
}

.progress-current {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--highlight-color);
}

.time-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--accent-color);
}

/* 控制按钮 */
.control-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.control-btn {
  background: none;
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--highlight-color);
  font-size: 14px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--highlight-color);
    color: var(--dark-color);
  }
}

.play-btn {
  width: 60px;
}

/* 音量控制 */
.volume-control {
  display: flex;
  align-items: center;
}

.volume-icon {
  cursor: pointer;
  margin-right: 5px;
  font-size: 14px;
  color: var(--highlight-color);
}

.volume-slider {
  width: 80px;
  height: 5px;
  -webkit-appearance: none;
  background-color: rgba(20, 20, 80, 0.6);
  outline: none;
  border-radius: 0;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 15px;
    background: var(--highlight-color);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 10px;
    height: 15px;
    background: var(--highlight-color);
    cursor: pointer;
    border: none;
  }
}

/* 播放列表 */
.playlist-container {
  max-height: 150px;
  overflow-y: auto;
  background-color: rgba(20, 20, 80, 0.4);
  border: var(--pixel-size) solid var(--accent-color);
  padding: 10px;
}

/* 自定义滚动条 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--highlight-color) rgba(16, 15, 75, 0.5);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(16, 15, 75, 0.5);
    border: var(--pixel-size) solid rgba(58, 142, 169, 0.3);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--highlight-color);
    border: var(--pixel-size) solid var(--highlight-color);
    
    &:hover {
      background-color: var(--accent-color);
    }
  }
}

.playlist-title {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--accent-color);
  text-align: center;
}

.playlist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.playlist li {
  padding: 8px 5px;
  cursor: pointer;
  border-bottom: var(--pixel-size) solid rgba(58, 142, 169, 0.2);
  font-size: 13px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(58, 142, 169, 0.3);
    transform: translateX(3px);
  }
  
  &.active {
    color: var(--highlight-color);
    background-color: rgba(58, 142, 169, 0.3);
    position: relative;
    
    &:before {
      content: '▶';
      position: absolute;
      left: -15px;
      font-size: 10px;
      color: var(--highlight-color);
    }
  }
}

.song-number {
  margin-right: 5px;
  font-size: 12px;
  color: var(--accent-color);
  min-width: 20px;
}

.song-name {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-duration {
  margin-left: 5px;
  font-size: 11px;
  color: var(--accent-color);
}

/* 加载指示器 */
.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(6, 6, 33, 0.8);
  padding: 10px 15px;
  border: var(--pixel-size) solid var(--highlight-color);
  color: var(--highlight-color);
  font-size: 14px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* 点击涟漪效果 */
.click-ripple {
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

/* 浮动音符动画 */
@keyframes float-note {
  0% {
    transform: translateY(0) translateX(0) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
    transform: translateY(-20px) translateX(-10px) scale(0.8);
  }
  80% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) translateX(var(--random-x, 20px)) scale(1.2);
    opacity: 0;
  }
}

/* 通用交互元素效果 */
.interactive-element {
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
    pointer-events: none;
  }
  
  &:hover::after {
    left: 100%;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .player-content {
    width: 280px;
  }
  
  .toggle-button-wrapper,
  .toggle-button {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
}
</style> 