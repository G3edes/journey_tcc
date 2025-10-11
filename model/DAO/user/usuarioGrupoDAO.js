/*********************************************************************************************
 * DAO - UsuarioGrupo
 *********************************************************************************************/
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ====================== INSERT ==========================
const insertUsuarioGrupo = async (dados) => {
  try {
    const sql = `
      INSERT INTO tbl_usuario_grupo (id_usuario, id_grupo, entrou_em)
      VALUES (?, ?, NOW())
    `;
    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.id_usuario,
      dados.id_grupo
    );
    console.log(`✅ Usuário ${dados.id_usuario} entrou no grupo ${dados.id_grupo}`);
    return result > 0;
  } catch (error) {
    console.error("❌ Erro insertUsuarioGrupo:", error);
    return false;
  }
};

// ====================== SELECT ALL ==========================
const selectAllUsuariosGrupos = async () => {
  try {
    const sql = `SELECT * FROM tbl_usuario_grupo`;
    const result = await prisma.$queryRawUnsafe(sql);
    return result;
  } catch (error) {
    console.error("❌ Erro selectAllUsuariosGrupos:", error);
    return [];
  }
};

// ====================== SELECT BY ID ==========================
const selectUsuarioGrupoById = async (id) => {
  try {
    const sql = `SELECT * FROM tbl_usuario_grupo WHERE id_usuario_grupo = ?`;
    const result = await prisma.$queryRawUnsafe(sql, id);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("❌ Erro selectUsuarioGrupoById:", error);
    return null;
  }
};

// ====================== UPDATE ==========================
const updateUsuarioGrupo = async (id, dados) => {
  try {
    const sql = `
      UPDATE tbl_usuario_grupo 
      SET id_usuario = ?, id_grupo = ?
      WHERE id_usuario_grupo = ?
    `;
    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.id_usuario,
      dados.id_grupo,
      id
    );
    return result > 0;
  } catch (error) {
    console.error("❌ Erro updateUsuarioGrupo:", error);
    return false;
  }
};

// ====================== DELETE BY ID ==========================
const deleteUsuarioGrupo = async (id) => {
  try {
    const sql = `DELETE FROM tbl_usuario_grupo WHERE id_usuario_grupo = ?`;
    const result = await prisma.$executeRawUnsafe(sql, id);
    return result > 0;
  } catch (error) {
    console.error("❌ Erro deleteUsuarioGrupo:", error);
    return false;
  }
};

// ====================== DELETE POR USUARIO+GRUPO ==========================
const deleteUsuarioGrupoByIds = async (idUsuario, idGrupo) => {
  try {
    const sql = `
      DELETE FROM tbl_usuario_grupo
      WHERE id_usuario = ? AND id_grupo = ?
    `;
    const result = await prisma.$executeRawUnsafe(sql, idUsuario, idGrupo);

    if (result > 0) {
      console.log(`✅ Usuário ${idUsuario} removido do grupo ${idGrupo}`);
      return true;
    } else {
      console.warn("⚠️ Nenhum registro deletado (usuário não estava no grupo)");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro deleteUsuarioGrupoByIds:", error);
    return false;
  }
};

// ====================== VERIFICAR PARTICIPAÇÃO ==========================
const verificarParticipacao = async (idUsuario, idGrupo) => {
  try {
    const sql = `
      SELECT * FROM tbl_usuario_grupo
      WHERE id_usuario = ? AND id_grupo = ?
    `;
    const result = await prisma.$queryRawUnsafe(sql, idUsuario, idGrupo);
    return result.length > 0;
  } catch (error) {
    console.error("❌ Erro verificarParticipacao:", error);
    return false;
  }
};

// ====================== CONTAR PARTICIPANTES ==========================
const countParticipantesByGroup = async (idGrupo) => {
  try {
    const sql = `
      SELECT COUNT(*) as total 
      FROM tbl_usuario_grupo 
      WHERE id_grupo = ?
    `;
    const result = await prisma.$queryRawUnsafe(sql, idGrupo);
    return result.length > 0 ? result[0].total : 0;
  } catch (error) {
    console.error("❌ Erro countParticipantesByGroup:", error);
    return 0;
  }
};

// ====================== LISTAR GRUPOS QUE O USUÁRIO PARTICIPA ==========================
const selectGroupsByUser = async (idUsuario) => {
  try {
    const sql = `
      SELECT g.*
      FROM tbl_usuario_grupo ug
      INNER JOIN tbl_grupo g ON g.id_grupo = ug.id_grupo
      WHERE ug.id_usuario = ?
    `;
    const result = await prisma.$queryRawUnsafe(sql, idUsuario);
    return result;
  } catch (error) {
    console.error("❌ Erro selectGroupsByUser:", error);
    return [];
  }
};

// ====================== LISTAR GRUPOS CRIADOS PELO USUÁRIO ==========================
const selectGroupsCreatedByUser = async (idUsuario) => {
  try {
    const sql = `
      SELECT *
      FROM tbl_grupo
      WHERE id_usuario = ?
    `;
    const result = await prisma.$queryRawUnsafe(sql, idUsuario);
    return result;
  } catch (error) {
    console.error("❌ Erro selectGroupsCreatedByUser:", error);
    return [];
  }
};

// ===========================================================
module.exports = {
  insertUsuarioGrupo,
  selectAllUsuariosGrupos,
  selectUsuarioGrupoById,
  updateUsuarioGrupo,
  deleteUsuarioGrupo,
  deleteUsuarioGrupoByIds,
  verificarParticipacao,
  countParticipantesByGroup,
  selectGroupsByUser,
  selectGroupsCreatedByUser
};
