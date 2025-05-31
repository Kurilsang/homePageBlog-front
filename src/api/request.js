import apiConfig from '@/config/api';

/**
 * API请求工具
 * 封装axios或基于fetch的请求方法
 */

// 获取API根路径
const API_BASE_URL = apiConfig.apiBaseUrl;

// 请求拦截器 - 为所有请求添加token
const addToken = (options = {}) => {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return { 
    ...options, 
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
};

// 响应处理
const handleResponse = async (response) => {
  if (!response.ok) {
    // 处理401未授权错误，清除token并跳转到登录页
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin_logged_in');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin';
      }
    }
    
    // 尝试解析错误信息
    let errorMessage = '请求失败';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // 解析失败时使用默认错误信息
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json();
  } catch (e) {
    // 处理空响应或非JSON响应
    return {};
  }
};

// GET请求
export const get = async (url, options = {}) => {
  const requestOptions = addToken(options);
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'GET',
    ...requestOptions
  });
  
  return handleResponse(response);
};

// POST请求
export const post = async (url, data = {}, options = {}) => {
  const requestOptions = addToken(options);
  
  // 检查是否为FormData类型
  const isFormData = data instanceof FormData;
  
  // 如果是FormData类型，不要序列化数据
  const requestBody = isFormData ? data : JSON.stringify(data);
  
  // 如果是FormData，不设置Content-Type，让浏览器自动处理multipart/form-data
  if (isFormData && requestOptions.headers) {
    delete requestOptions.headers['Content-Type'];
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    body: requestBody,
    ...requestOptions
  });
  
  return handleResponse(response);
};

// PUT请求
export const put = async (url, data = {}, options = {}) => {
  const requestOptions = addToken(options);
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...requestOptions
  });
  
  return handleResponse(response);
};

// PATCH请求
export const patch = async (url, data = {}, options = {}) => {
  const requestOptions = addToken(options);
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...requestOptions
  });
  
  return handleResponse(response);
};

// DELETE请求
export const del = async (url, options = {}) => {
  const requestOptions = addToken(options);
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'DELETE',
    ...requestOptions
  });
  
  return handleResponse(response);
}; 