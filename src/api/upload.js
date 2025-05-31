/**
 * @Author kuril
 * @Description 文件上传相关API
 */
import { post } from './request';

/**
 * 上传图片
 * @param {File} file - 图片文件
 * @param {string} directory - 存储目录
 * @returns {Promise<Object>} - 上传结果
 */
export const uploadImage = async (file, directory) => {
  // 创建FormData对象
  const formData = new FormData();
  formData.append('file', file);
  formData.append('directory', directory);
  
  // 发送POST请求，这里不需要Content-Type，浏览器会自动设置
  return post('/api/upload/image', formData, {
    headers: {
      // 不设置Content-Type，让浏览器自动处理multipart/form-data
      'Content-Type': undefined
    }
  });
}; 