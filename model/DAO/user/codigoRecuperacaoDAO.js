const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir novo código
const inserirCodigo = async (email, codigo, expiracao) => {
  try {
    const sql = `
      INSERT INTO tbl_codigo_recuperacao (email, codigo, expiracao)
      VALUES ('${email}', '${codigo}', '${expiracao}');
    `;
    const result = await prisma.$executeRawUnsafe(sql);
    return result ? true : false;
  } catch (error) {
    console.error('Erro ao inserir código de recuperação:', error);
    return false;
  }
};

// Buscar código válido
const buscarCodigoValido = async (email, codigo) => {
  try {
    const sql = `
      SELECT * FROM tbl_codigo_recuperacao
      WHERE email = '${email}' AND codigo = '${codigo}' AND expiracao > NOW();
    `;
    const result = await prisma.$queryRawUnsafe(sql);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Erro ao buscar código:', error);
    return null;
  }
};

// Excluir código após uso
const excluirCodigo = async (email) => {
  try {
    const sql = `DELETE FROM tbl_codigo_recuperacao WHERE email = '${email}'`;
    const result = await prisma.$executeRawUnsafe(sql);
    return result ? true : false;
  } catch (error) {
    console.error('Erro ao excluir código:', error);
    return false;
  }
};

module.exports = {
  inserirCodigo,
  buscarCodigoValido,
  excluirCodigo
};