/**
 * @Author kuril
 * @Description 评论相关API
 */
import { get, post, put, del } from './request';

/**
 * 获取文章评论列表
 * @param {string} articleId - 文章ID
 * @returns {Promise<Object>} - 评论列表
 */
export const getComments = (articleId) => {
  return get(`/api/comments/${articleId}`);
};

/**
 * 添加评论
 * @param {Object} commentData - 评论数据
 * @returns {Promise<Object>} - 添加结果
 */
export const addComment = (commentData) => {
  return post('/api/comments', commentData);
};

/**
 * 更新评论
 * @param {string} commentId - 评论ID
 * @param {Object} commentData - 评论数据
 * @returns {Promise<Object>} - 更新结果
 */
export const updateComment = (commentId, commentData) => {
  return put(`/api/comments/${commentId}`, commentData);
};

/**
 * 删除评论
 * @param {string} commentId - 评论ID
 * @returns {Promise<Object>} - 删除结果
 */
export const deleteComment = (commentId) => {
  return del(`/api/comments/${commentId}`);
}; 