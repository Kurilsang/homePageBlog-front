import { get, post, put, patch, del } from './request';

// 获取文章列表
export const getArticles = async (params = {}) => {
  try {
    // 构建查询参数
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.pageSize) query.append('pageSize', params.pageSize);
    if (params.search) query.append('search', params.search);
    if (params.tag) query.append('tag', params.tag);
    if (params.pinned !== undefined) query.append('pinned', params.pinned);
    
    // 发送请求
    const queryString = query.toString();
    const url = `/api/articles${queryString ? '?' + queryString : ''}`;
    return await get(url);
  } catch (error) {
    console.error('获取文章列表失败:', error);
    throw error;
  }
};

// 获取文章详情
export const getArticleById = async (id) => {
  try {
    return await get(`/api/articles/${id}`);
  } catch (error) {
    console.error('获取文章详情失败:', error);
    throw error;
  }
};

// 创建文章（管理员）
export const createArticle = async (articleData) => {
  try {
    return await post('/api/articles', articleData);
  } catch (error) {
    console.error('创建文章失败:', error);
    throw error;
  }
};

// 更新文章（管理员）
export const updateArticle = async (id, articleData) => {
  try {
    return await put(`/api/articles/${id}`, articleData);
  } catch (error) {
    console.error('更新文章失败:', error);
    throw error;
  }
};

// 切换文章置顶状态（管理员）
export const toggleArticlePin = async (id, isPinned) => {
  try {
    return await patch(`/api/articles/${id}/toggle-pin`, { isPinned });
  } catch (error) {
    console.error('切换文章置顶状态失败:', error);
    throw error;
  }
};

// 删除文章（管理员）
export const deleteArticle = async (id) => {
  try {
    return await del(`/api/articles/${id}`);
  } catch (error) {
    console.error('删除文章失败:', error);
    throw error;
  }
}; 