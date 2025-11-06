/*********************************************************************************************
 * DAO - UsuarioGrupo
 *********************************************************************************************/
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// ====================== INSERT ==========================
const insertUsuarioGrupo = async (dados) => {
  try {
    const sql = `
      INSERT INTO tbl_usuario_grupo (id_usuario, id_grupo, entrou_em)
      VALUES (?, ?, NOW())
    `
    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.id_usuario,
      dados.id_grupo
    )
    console.log(`✅ Usuário ${dados.id_usuario} entrou no grupo ${dados.id_grupo}`)
    return result > 0
  } catch (error) {
    console.error("❌ Erro insertUsuarioGrupo:", error)
    return false
  }
}

// ====================== SELECT ALL ==========================
const selectAllUsuariosGrupos = async () => {
  try {
    const sql = `SELECT * FROM tbl_usuario_grupo`
    const result = await prisma.$queryRawUnsafe(sql)
    return result
  } catch (error) {
    console.error("❌ Erro selectAllUsuariosGrupos:", error)
    return []
  }
}

// ====================== SELECT BY ID ==========================
const selectUsuarioGrupoById = async (id) => {
  try {
    const sql = `SELECT * FROM tbl_usuario_grupo WHERE id_usuario_grupo = ?`
    const result = await prisma.$queryRawUnsafe(sql, id)
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("❌ Erro selectUsuarioGrupoById:", error)
    return null
  }
}

// ====================== UPDATE ==========================
const updateUsuarioGrupo = async (id, dados) => {
  try {
    const sql = `
      UPDATE tbl_usuario_grupo 
      SET id_usuario = ?, id_grupo = ?
      WHERE id_usuario_grupo = ?
    `
    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.id_usuario,
      dados.id_grupo,
      id
    )
    return result > 0
  } catch (error) {
    console.error("❌ Erro updateUsuarioGrupo:", error)
    return false
  }
}

// ====================== DELETE BY ID ==========================
const deleteUsuarioGrupo = async (id) => {
  try {
    const sql = `DELETE FROM tbl_usuario_grupo WHERE id_usuario_grupo = ?`
    const result = await prisma.$executeRawUnsafe(sql, id)
    return result > 0
  } catch (error) {
    console.error("❌ Erro deleteUsuarioGrupo:", error)
    return false
  }
}

// ====================== DELETE POR USUARIO+GRUPO ==========================
// DELETE POR USUARIO+GRUPO (robusto)
const deleteUsuarioGrupoByIds = async (idUsuario, idGrupo) => {
  try {
    // garante números
    const u = Number(idUsuario);
    const g = Number(idGrupo);
    if (!u || !g) {
      console.warn("deleteUsuarioGrupoByIds: ids inválidos", { idUsuario, idGrupo });
      return { ok: false, affected: 0, message: "IDs inválidos" };
    }

    const sql = `
      DELETE FROM tbl_usuario_grupo
      WHERE id_usuario = ? AND id_grupo = ?
    `;
    const result = await prisma.$executeRawUnsafe(sql, u, g);

    // prisma.$executeRawUnsafe retorna número de linhas afetadas (MySQL)
    const affected = Number(result) || 0;

    if (affected > 0) {
      console.log(`✅ deleteUsuarioGrupoByIds: removido usuario=${u} do grupo=${g}`);
      return { ok: true, affected };
    } else {
      console.warn(`⚠️ deleteUsuarioGrupoByIds: nenhum registro encontrado para usuario=${u} grupo=${g}`);
      return { ok: false, affected: 0, message: "Nenhum registro deletado" };
    }
  } catch (error) {
    console.error("❌ Erro deleteUsuarioGrupoByIds:", error);
    return { ok: false, affected: 0, message: error.message || "Erro interno" };
  }
};


// ====================== VERIFICAR PARTICIPAÇÃO ==========================
const verificarParticipacao = async (idUsuario, idGrupo) => {
  try {
    const sql = `
      SELECT * FROM tbl_usuario_grupo
      WHERE id_usuario = ? AND id_grupo = ?
    `
    const result = await prisma.$queryRawUnsafe(sql, idUsuario, idGrupo)
    return result.length > 0
  } catch (error) {
    console.error("❌ Erro verificarParticipacao:", error)
    return false
  }
}

// ====================== CONTAR PARTICIPANTES ==========================
const countParticipantesByGroup = async (idGrupo) => {
  try {
    const sql = `
      SELECT COUNT(*) as total 
      FROM tbl_usuario_grupo 
      WHERE id_grupo = ?
    `
    const result = await prisma.$queryRawUnsafe(sql, idGrupo)
    return result.length > 0 ? result[0].total : 0
  } catch (error) {
    console.error("❌ Erro countParticipantesByGroup:", error)
    return 0
  }
}

// ====================== LISTAR GRUPOS QUE O USUÁRIO PARTICIPA ==========================
const selectGroupsByUser = async (idUsuario) => {
  try {
    const sql = `
      SELECT g.*
      FROM tbl_usuario_grupo ug
      INNER JOIN tbl_grupo g ON g.id_grupo = ug.id_grupo
      WHERE ug.id_usuario = ?
    `
    const result = await prisma.$queryRawUnsafe(sql, idUsuario)
    return result
  } catch (error) {
    console.error("❌ Erro selectGroupsByUser:", error)
    return []
  }
}

// ====================== LISTAR GRUPOS CRIADOS PELO USUÁRIO ==========================
// ====================== LISTAR GRUPOS CRIADOS PELO USUÁRIO ==========================
const selectGroupsCreatedByUser = async (idUsuario) => {
  try {
    const sql = `
      SELECT * FROM tbl_grupo
      WHERE id_usuario = ?
    `
    const result = await prisma.$queryRawUnsafe(sql, idUsuario)
    return result || []
  } catch (error) {
    console.error("❌ Erro selectGroupsCreatedByUser:", error)
    return []
  }
}

const executarQuery = async (sql, params = []) => {
  try {
    const result = await prisma.$queryRawUnsafe(sql, ...params);
    return result;
  } catch (error) {
    console.error("Erro executarQuery:", error);
    return [];
  }
};

// Listar participantes de um grupo com dados do usuário
const listarParticipantesPorGrupo = async (id_grupo) => {
  try {
    const sql = `
      SELECT 
        u.id_usuario,
        u.nome_completo,
        u.email,
        u.foto_perfil,
        g.id_usuario AS id_criador
      FROM tbl_usuario_grupo ug
      INNER JOIN tbl_usuario u ON u.id_usuario = ug.id_usuario
      INNER JOIN tbl_grupo g ON g.id_grupo = ug.id_grupo
      WHERE ug.id_grupo = ?
    `;
    const result = await prisma.$queryRawUnsafe(sql, id_grupo);
    return result;
  } catch (error) {
    console.error("❌ Erro listarParticipantesPorGrupo:", error);
    return [];
  }
};

// Verificar se o usuário logado é o criador do grupo
const verificarSeEhCriador = async (idUsuario, idGrupo) => {
  try {
    const sql = `
      SELECT * FROM tbl_grupo 
      WHERE id_grupo = ? AND id_usuario = ?
    `;
    const result = await prisma.$queryRawUnsafe(sql, idGrupo, idUsuario);
    return result.length > 0;
  } catch (error) {
    console.error("❌ Erro verificarSeEhCriador:", error);
    return false;
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
  selectGroupsCreatedByUser,
  executarQuery,
  listarParticipantesPorGrupo,
  verificarSeEhCriador
}
