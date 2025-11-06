/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de cadastro
 * DATA: 18/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 1.0
 **************************************************************************************************************************/
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const insertGrupo = async (g) => {
  try {
    const sql = `
      INSERT INTO tbl_grupo (nome, limite_membros, descricao, imagem, id_area, id_usuario)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const affected = await prisma.$executeRawUnsafe(
      sql,
      g.nome,
      g.limite_membros,
      g.descricao,
      g.imagem,
      g.id_area,
      g.id_usuario
    )

    if (!affected || affected <= 0) {
      console.warn("insertGrupo: nenhuma linha afetada")
      return { ok: false }
    }

    const rows = await prisma.$queryRawUnsafe("SELECT LAST_INSERT_ID() as insertId")
    const insertId = Array.isArray(rows) && rows.length > 0 ? rows[0].insertId : null

    return { ok: true, insertId }
  } catch (error) {
    console.error("Erro insertGrupo:", error)
    return false
  }
}

// Atualizar grupo
const updateGrupo = async (dados) => {
  try {
    if (!dados || !dados.id) {
      return false
    }

    const result = await prisma.$queryRaw`
      CALL update_grupo(
        ${Number(dados.id)},
        ${dados.nome ?? null},
        ${dados.area ?? null},
        ${dados.limite_membros ?? null},
        ${dados.descricao ?? null},
        ${dados.imagem ?? null},
        ${dados.id_usuario},
        ${dados.id_area}
      )
    `

    if (result) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("updateGrupo erro:", error)
    return false
  }
}
const getGrupoComChatRoom = async (id_grupo) => {
  try {
    const grupo = await prisma.grupo.findUnique({
      where: { id_grupo: Number(id_grupo) },
      include: {
        usuario: { select: { id_usuario: true, nome_completo: true, foto_perfil: true } },
        area: true,
        chat_room: true
      }
    })
    console.log("📦 getGrupoComChatRoom:", grupo)
    return grupo || null
  } catch (error) {
    console.error('Erro getGrupoComChatRoom:', error)
    return null
  }
}
// Deletar grupo
const deleteGrupo = async (id) => {
  try {
    const result = await prisma.$executeRaw`
      DELETE FROM tbl_grupo WHERE id_grupo = ${id}
    `
    if (result) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("deleteGrupo erro:", error)
    return false
  }
}

// Selecionar todos os grupos
const selectAllGrupos = async () => {
  try {
    const result = await prisma.$queryRawUnsafe(`SELECT * FROM tbl_grupo`)
    if (result) {
      return result
    } else {
      return false
    }
  } catch (error) {
    console.error("selectAllGrupos erro:", error)
    return false
  }
}

// Selecionar grupo por ID
const selectGrupoById = async (id) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM tbl_grupo WHERE id_grupo = ${id}
    `
    if (result) {
      return result
    } else {
      return false
    }
  } catch (error) {
    console.error("selectGrupoById erro:", error)
    return false
  }
}

// Selecionar último ID
const selectLastId = async () => {
  try {
    const result = await prisma.$queryRaw`
      SELECT id_grupo FROM tbl_grupo
      ORDER BY id_grupo DESC
      LIMIT 1
    `
    if (result) {
      return result
    } else {
      return false
    }
  } catch (error) {
    console.error("selectLastId erro:", error)
    return false
  }
}

module.exports = {
  insertGrupo,
  updateGrupo,
  deleteGrupo,
  selectAllGrupos,
  selectGrupoById,
  selectLastId,
  getGrupoComChatRoom
}


