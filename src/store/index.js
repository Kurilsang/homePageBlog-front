import Vue from 'vue';

// 使用简单的事件总线进行状态管理
export const store = new Vue({
  data() {
    return {
      profile: {
        avatar: '/images/avatar.png',
        title: '像素冒险家',
        description: '我是一名热爱像素艺术和编程的开发者，专注于创造有趣且独特的交互体验。在这个8-bit风格的世界里，我记录着我的冒险与发现。'
      },
      articles: [
        {
          id: 1,
          title: '像素艺术创作技巧',
          summary: '探索像素艺术的基础技巧，从基本形状到高级着色方法，帮助你创建令人惊叹的8位风格插图。',
          content: `
            <p>像素艺术是一种以像素为基本单位的数字艺术形式，它起源于早期电子游戏中的图形设计。在这个教程中，我们将探索创建优秀像素艺术的基本技巧。</p>
            
            <h2>基础知识</h2>
            <p>像素艺术的核心在于限制。与其他数字艺术形式不同，像素艺术通常使用有限的调色板和分辨率。这些限制促使艺术家们创造性地使用有限的工具。</p>
            
            <h2>构图技巧</h2>
            <p>良好的像素艺术从基本形状开始。先创建简单的轮廓，然后逐渐添加细节。记住，每个像素都很重要！</p>
            
            <h2>着色技巧</h2>
            <p>像素艺术中最常用的着色技术是"抖动"，它通过交替不同颜色的像素来创造新的色调。另一种技术是"AA(抗锯齿)"，这种方法通过在边缘添加中间色调来使线条看起来更平滑。</p>
            
            <h2>工具推荐</h2>
            <p>有很多工具可以用于创建像素艺术。Aseprite是一个专门为像素艺术设计的付费软件，而GIMP和Piskel是免费选择。</p>
          `,
          coverImage: '/images/blog/pixel-art.jpg',
          date: '2024-03-20',
          tag: '艺术',
          keywords: ['像素艺术', '数字设计', '游戏美术', '8-bit'],
          isPinned: true
        },
        {
          id: 2,
          title: '复古游戏开发笔记',
          summary: '记录使用现代工具开发具有复古风格游戏的过程，包括游戏机制设计和像素完美的界面实现。',
          content: `
            <p>现代技术与复古风格的结合为游戏开发带来了独特的机遇。本文记录了我使用现代工具开发8-bit风格游戏的经验。</p>
            
            <h2>选择正确的工具</h2>
            <p>开发复古风格游戏时，选择合适的工具至关重要。Unity和Godot等现代引擎都提供了工具来模拟像素完美渲染。</p>
            
            <h2>像素完美的摄像机</h2>
            <p>为了保持像素艺术的清晰度，需要设置特殊的相机设置。避免使用抗锯齿和平滑过渡，因为这些会破坏像素艺术的美感。</p>
            
            <h2>音效与音乐</h2>
            <p>8-bit音乐使用方波、三角波、噪声和脉冲波等简单波形。工具如FamiTracker和LMMS可以帮助创建这种复古风格的声音。</p>
            
            <h2>性能考虑</h2>
            <p>即使是复古风格游戏，现代开发中性能仍然很重要。注意优化动画和物理效果，以确保游戏在各种设备上流畅运行。</p>
          `,
          coverImage: '/images/blog/retro-game.jpg',
          date: '2024-03-15',
          tag: '开发',
          keywords: ['游戏开发', '复古游戏', 'Unity', 'Godot'],
          isPinned: false
        },
        {
          id: 3,
          title: '8-bit音乐合成指南',
          summary: '学习如何创作令人怀旧的8位音乐，从基础的声波形式到创建完整的复古游戏配乐。',
          content: `
            <p>8-bit音乐，也被称为芯片音乐，是电子游戏的早期特征。这种音乐风格以其简单而具有标志性的声音而闻名，今天我们将探索如何创建这种风格的音乐。</p>
            
            <h2>基本波形</h2>
            <p>8-bit音乐主要使用四种波形：方波、三角波、噪声和脉冲波。方波产生明亮的"哔哔"声，三角波更柔和，噪声用于打击乐，脉冲波可用于各种效果。</p>
            
            <h2>硬件限制与创意</h2>
            <p>早期游戏硬件通常仅支持3-4个声道同时发声。这些限制促使作曲家创造性地使用音轨，如快速切换音符来模拟和弦。</p>
            
            <h2>现代工具</h2>
            <p>今天，可以使用如FamiTracker、LSDJ或现代DAW软件配合8-bit音色库来创作芯片音乐。这些工具让现代作曲家可以在不受硬件限制的情况下探索这种风格。</p>
            
            <h2>循环与变化</h2>
            <p>芯片音乐通常依赖重复和细微变化来构建，这种方法部分源于存储空间限制。学习如何通过细微的旋律和节奏变化来保持音乐有趣。</p>
          `,
          coverImage: '/images/blog/8bit-music.jpg',
          date: '2024-03-10',
          tag: '音乐',
          keywords: ['8-bit音乐', '芯片音乐', '游戏配乐', '合成器'],
          isPinned: false
        }
      ],
      comments: [
        {
          id: 1,
          articleId: 1,
          parentId: null,
          author: '像素艺术家',
          avatar: '/images/avatars/user1.jpg',
          content: '非常感谢你分享这些像素艺术技巧！抖动技术真的是创造有深度像素画的关键。',
          date: '2024-03-22',
          status: 'approved' // approved, pending, rejected
        },
        {
          id: 2,
          articleId: 1,
          parentId: 1,
          author: '游戏开发者',
          avatar: '/images/avatars/user2.jpg',
          content: '我完全同意！抖动技术在有限色彩下创建渐变效果非常有用。',
          date: '2024-03-22',
          status: 'approved'
        },
        {
          id: 3,
          articleId: 2,
          parentId: null,
          author: '复古游戏爱好者',
          avatar: '/images/avatars/user3.jpg',
          content: 'Unity确实是制作复古游戏的好工具，但我更喜欢Godot的简洁性。',
          date: '2024-03-16',
          status: 'approved'
        },
        {
          id: 4,
          articleId: 3,
          parentId: null,
          author: '音乐制作人',
          avatar: '/images/avatars/user4.jpg',
          content: 'FamiTracker是我的最爱！创造那种原汁原味的NES音效真是太棒了。',
          date: '2024-03-12',
          status: 'pending'
        }
      ],
      nextArticleId: 4,
      nextCommentId: 5
    };
  },
  methods: {
    // 个人资料相关
    updateProfile(profile) {
      this.profile = {...this.profile, ...profile};
    },
    
    // 文章相关
    getArticleById(id) {
      return this.articles.find(article => article.id === parseInt(id)) || null;
    },
    
    getArticles() {
      return this.articles;
    },
    
    addArticle(article) {
      const newArticle = {
        ...article,
        id: this.nextArticleId++,
        date: new Date().toISOString().split('T')[0]
      };
      this.articles.push(newArticle);
      return newArticle;
    },
    
    updateArticle(article) {
      const index = this.articles.findIndex(a => a.id === article.id);
      if (index !== -1) {
        this.articles.splice(index, 1, {...this.articles[index], ...article});
        return true;
      }
      return false;
    },
    
    deleteArticle(id) {
      const index = this.articles.findIndex(a => a.id === parseInt(id));
      if (index !== -1) {
        this.articles.splice(index, 1);
        return true;
      }
      return false;
    },
    
    setPinned(id, isPinned) {
      const article = this.getArticleById(id);
      if (article) {
        article.isPinned = isPinned;
        return true;
      }
      return false;
    },
    
    // 评论相关
    getCommentsByArticleId(articleId) {
      return this.comments.filter(comment => 
        comment.articleId === parseInt(articleId) && comment.status === 'approved');
    },
    
    getAllComments() {
      return this.comments;
    },
    
    addComment(comment) {
      const newComment = {
        ...comment,
        id: this.nextCommentId++,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      this.comments.push(newComment);
      return newComment;
    },
    
    updateCommentStatus(id, status) {
      const comment = this.comments.find(c => c.id === parseInt(id));
      if (comment) {
        comment.status = status;
        return true;
      }
      return false;
    },
    
    deleteComment(id) {
      const index = this.comments.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        this.comments.splice(index, 1);
        return true;
      }
      return false;
    }
  }
});

// 导出获取store实例的方法
export default {
  getStore() {
    return store;
  }
}; 