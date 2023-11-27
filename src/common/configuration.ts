export default () => ({
  // port: parseInt(process.env.PORT, 10) || 8686
    port: parseInt(process.env.PORT, 10) || 2

  ,
  whitelistOrigins: (process.env.WHITELIST_ORIGINS || '')
    .split(',')
    .map((item) => (item && item.trim()) || item),
  database: {
    uri: process.env.MONGODB_URI,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  defaultEmailDomain: process.env.DEFAULT_EMAIL_DOMAIN,
  maxExaminationStudent: 50,
  testTime: {
    listening: 1800000,
    reading: 3600000,
  },
  time: Number(process.env.REDIS_SECRET),
});
