const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function testarConexao() {
  try {
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Azure exige SSL
    });

    console.log('✅ Conectado ao MySQL da Azure!');
    const [rows] = await connection.query('SELECT NOW() AS data_atual;');
    console.log('🕒 Data atual:', rows[0].data_atual);

    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  }
}

testarConexao();
