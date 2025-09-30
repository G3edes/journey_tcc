/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de cadastro
 * DATA: 18/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 1.0
 **************************************************************************************************************************/
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir grupo
const insertGrupo = async (dados) => {
  try {
    const result = await prisma.$queryRaw`
      CALL inserir_grupo(
        ${dados.nome},
        ${dados.limite_membros},
        ${dados.descricao},
        ${dados.imagem || null},
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
    console.error("insertGrupo erro:", error)
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
  selectLastId
}


