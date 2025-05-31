/**
 * @Author kuril
 * @Description API接口配置文件
 */
const env = {
  development: {
    // 开发环境
    apiBaseUrl: 'http://localhost:8080',
    minioBaseUrl: 'http://kuril.site:9000'
  },
  production: {
    // 生产环境
    apiBaseUrl: 'https://www.kuril.site:8080',
    minioBaseUrl: 'http://kuril.site:9000'
  }
}

// 当前环境配置
const currentEnv = process.env.NODE_ENV === 'production' ? env.production : env.development

export default {
  apiBaseUrl: currentEnv.apiBaseUrl,
  minioBaseUrl: currentEnv.minioBaseUrl
} 