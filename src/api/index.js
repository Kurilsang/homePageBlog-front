// 统一导出所有API

import * as authAPI from './auth';
import * as articleAPI from './article';
import * as commentAPI from './comment';
import * as userAPI from './user';
import * as profileAPI from './profile';
import * as uploadAPI from './upload';

export {
  authAPI,
  articleAPI,
  commentAPI,
  userAPI,
  profileAPI,
  uploadAPI
};

// 也可以单独导出，方便直接使用
export * from './auth';
export * from './article';
export * from './comment';
export * from './user';
export * from './profile'; 