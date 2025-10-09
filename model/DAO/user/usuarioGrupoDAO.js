/*******************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados da tabela tbl_usuario_grupo
 * Data: 2025
 * Autor: Journey
 *******************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===============================================================
// Inserir novo relacionamento usuário-grupo
// ===============================================================
const insertUsuarioGrupo = async (dadosUsuarioGrupo) => {
  try {
    const sql = `
      INSERT INTO tbl_usuario_grupo (id_usuario, id_grupo, entrou_em)
      VALUES (${dadosUsuarioGrupo.id_usuario}, ${dadosUsuarioGrupo.id_grupo}, NOW());
    `;
    const result = await prisma.$executeRawUnsafe(sql);
    return result ? true : false;
  } catch (error) {
    console.error("Erro insertUsuarioGrupo:", error);
    return false;
  }
};

// ===============================================================
// Listar todos os relacionamentos
// ===============================================================
const selectAllUsuariosGrupos = async () => {
  try {
    const sql = `SELECT * FROM tbl_usuario_grupo;`;
    const result = await prisma.$queryRawUnsafe(sql);
    return result;
  } catch (error) {
    console.error("Erro selectAllUsuariosGrupos:", error);
    return false;
  }
};

// ===============================================================
// Buscar relacionamento por ID
// ===============================================================
const selectUsuarioGrupoById = async (id) => {
  try {
    const sql = `SELECT * FROM tbl_usuario_grupo WHERE id_usuario_grupo = ${id};`;
    const result = await prisma.$queryRawUnsafe(sql);
    return result.length > 0 ? result[0] : false;
  } catch (error) {
    console.error("Erro selectUsuarioGrupoById:", error);
    return false;
  }
};

// ===============================================================
// Atualizar relacionamento
// ===============================================================
const updateUsuarioGrupo = async (id, dadosUsuarioGrupo) => {
  try {
    const sql = `
      UPDATE tbl_usuario_grupo
      SET id_usuario = ${dadosUsuarioGrupo.id_usuario},
          id_grupo = ${dadosUsuarioGrupo.id_grupo}
      WHERE id_usuario_grupo = ${id};
    `;
    const result = await prisma.$executeRawUnsafe(sql);
    return result ? true : false;
  } catch (error) {
    console.error("Erro updateUsuarioGrupo:", error);
    return false;
  }
};

// ===============================================================
// Excluir relacionamento
// ===============================================================
const deleteUsuarioGrupo = async (id) => {
  try {
    const sql = `DELETE FROM tbl_usuario_grupo WHERE id_usuario_grupo = ${id};`;
    const result = await prisma.$executeRawUnsafe(sql);
    return result ? true : false;
  } catch (error) {
    console.error("Erro deleteUsuarioGrupo:", error);
    return false;
  }
};

// ===============================================================
// Listar grupos que o usuário participa
// ===============================================================
const selectGroupsByUser = async (idUsuario) => {
  try {
    const sql = `
      SELECT g.*
      FROM tbl_usuario_grupo AS ug
      INNER JOIN tbl_grupo AS g ON g.id_grupo = ug.id_grupo
      WHERE ug.id_usuario = ${idUsuario};
    `;
    const result = await prisma.$queryRawUnsafe(sql);
    return result;
  } catch (error) {
    console.error("Erro selectGroupsByUser:", error);
    return false;
  }
};

// ===============================================================
// Listar grupos criados pelo usuário
// ===============================================================
const selectGroupsCreatedByUser = async (idUsuario) => {
  try {
    const sql = `
      SELECT *
      FROM tbl_grupo
      WHERE id_usuario = ${idUsuario};
    `;
    const result = await prisma.$queryRawUnsafe(sql);
    return result;
  } catch (error) {
    console.error("Erro selectGroupsCreatedByUser:", error);
    return false;
  }
};

// ===============================================================
// Contar participantes de um grupo
// ===============================================================
const countParticipantesByGroup = async (idGrupo) => {
  try {
    const sql = `
      SELECT COUNT(*) AS total
      FROM tbl_usuario_grupo
      WHERE id_grupo = ${idGrupo};
    `;
    const result = await prisma.$queryRawUnsafe(sql);
    return result[0]?.total || 0;
  } catch (error) {
    console.error("Erro countParticipantesByGroup:", error);
    return 0;
  }
};

// ===============================================================
// Função auxiliar genérica
// ===============================================================
const executarConsulta = async (sql) => {
  try {
    const result = await prisma.$queryRawUnsafe(sql);
    return result;
  } catch (error) {
    console.error("Erro executarConsulta:", error);
    return false;
  }
};

module.exports = {
  insertUsuarioGrupo,
  selectAllUsuariosGrupos,
  selectUsuarioGrupoById,
  updateUsuarioGrupo,
  deleteUsuarioGrupo,
  selectGroupsByUser,
  selectGroupsCreatedByUser,
  countParticipantesByGroup,
  executarConsulta
};
