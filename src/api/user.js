import { get, put, patch } from './request';

// 获取用户信息
export const getUserProfile = async () => {
  try {
    return await get('/api/users/profile');
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 更新用户信息
export const updateUserProfile = async (userData) => {
  try {
    return await put('/api/users/profile', userData);
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

// 修改密码
export const changePassword = async (passwords) => {
  try {
    return await put('/api/users/password', passwords);
  } catch (error) {
    console.error('修改密码失败:', error);
    throw error;
  }
};

// 获取用户列表（管理员）
export const getAllUsers = async (params = {}) => {
  try {
    // 构建查询参数
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.pageSize) query.append('pageSize', params.pageSize);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    
    // 发送请求
    const queryString = query.toString();
    const url = `/api/admin/users${queryString ? '?' + queryString : ''}`;
    return await get(url);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 更新用户状态（管理员）
export const updateUserStatus = async (userId, status) => {
  try {
    return await patch(`/api/admin/users/${userId}/status`, { status });
  } catch (error) {
    console.error('更新用户状态失败:', error);
    throw error;
  }
}; 