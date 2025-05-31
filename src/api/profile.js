import { get, put } from './request';

// 获取个人资料
export const getProfile = async () => {
  try {
    return await get('/api/profile');
  } catch (error) {
    console.error('获取个人资料失败:', error);
    throw error;
  }
};

// 更新个人资料（管理员）
export const updateProfile = async (profileData) => {
  try {
    return await put('/api/profile', profileData);
  } catch (error) {
    console.error('更新个人资料失败:', error);
    throw error;
  }
}; 