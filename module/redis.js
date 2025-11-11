const Redis = require('ioredis')

// Se estiver usando local
const redis = new Redis(process.env.REDIS_URL)

// (Opcional) — log de conexão
redis.on('connect', () => console.log('🧠 Redis conectado!'))
redis.on('error', (err) => console.error('Erro no Redis:', err))

module.exports = redis
