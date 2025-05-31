/**
 * 认证相关辅助函数
 */
import { authAPI } from '@/api';

/**
 * 处理管理员登录成功后的导航
 * @param {Object} router 路由实例
 * @param {string} redirectPath 重定向路径
 * @returns {Promise<void>}
 */
export const handleAdminRedirect = (redirectPath) => {
  // 避免使用vue-router的push方法，改用window.location以避免导航守卫冲突
  const finalPath = redirectPath || '/admin/dashboard';
  window.location.href = finalPath;
};

/**
 * 检查并执行管理员登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise<Object>} 登录结果
 */
export const doAdminLogin = async (username, password) => {
  // 调用API进行登录认证
  const result = await authAPI.adminLogin(username, password);
  return result;
};

/**
 * 处理管理员登出
 */
export const doAdminLogout = async () => {
  await authAPI.adminLogout();
  window.location.href = '/admin';
};

/**
 * 获取管理员信息
 * @returns {Object|null} 管理员信息
 */
export const getAdminInfo = () => {
  const adminInfo = localStorage.getItem('admin_info');
  return adminInfo ? JSON.parse(adminInfo) : null;
}; 