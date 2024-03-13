export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt_key: process.env.JWT_KEY || 'CHANGE_ME',
  jwt_ttl: process.env.JWT_TTL || '24h',
});
