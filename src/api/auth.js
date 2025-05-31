import { post } from './request';

// 管理员登录
export const adminLogin = async (username, password) => {
  try {
    const result = await post('/api/auth/login', { username, password });
    
    // 检查返回码
    if (result && result.code === 0 && result.data && result.data.token) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('admin_logged_in', 'true');
      
      // 保存用户信息
      if (result.data.user) {
        localStorage.setItem('admin_info', JSON.stringify(result.data.user));
      }
      
      return result;
    } else if (result && result.code === 401) {
      // 抛出带有返回信息的错误
      throw new Error(result.message || '用户名或密码错误');
    } else {
      throw new Error('登录失败，请稍后重试');
    }
  } catch (error) {
    console.error('管理员登录失败:', error);
    throw error;
  }
};

// 管理员登出
export const adminLogout = async () => {
  try {
    const result = await post('/api/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('admin_logged_in');
    return result;
  } catch (error) {
    console.error('管理员登出失败:', error);
    // 即使API调用失败，仍然清除本地存储的token
    localStorage.removeItem('token');
    localStorage.removeItem('admin_logged_in');
    throw error;
  }
};

// 用户注册
export const userRegister = async (userData) => {
  try {
    return await post('/api/users/register', userData);
  } catch (error) {
    console.error('用户注册失败:', error);
    throw error;
  }
};

// 用户登录
export const userLogin = async (username, password) => {
  try {
    const result = await post('/api/users/login', { username, password });
    if (result && result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user_info', JSON.stringify(result.user));
    }
    return result;
  } catch (error) {
    console.error('用户登录失败:', error);
    throw error;
  }
};

// 用户登出
export const userLogout = async () => {
  try {
    const result = await post('/api/users/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    return result;
  } catch (error) {
    console.error('用户登出失败:', error);
    // 即使API调用失败，仍然清除本地存储的token
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    throw error;
  }
};

// 检查是否已登录（根据本地存储的token判断）
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// 检查是否是管理员
export const isAdmin = () => {
  return !!localStorage.getItem('admin_logged_in');
};

// 获取当前用户信息
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
}; 