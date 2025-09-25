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
      CALL inserir_usuario(
        ${dados.nome},
        ${dados.area},
        ${dados.limite_membros},
        ${dados.descricao},
        ${dados.imagem || null}
      )
    `

    // O MySQL retorna a procedure como array de arrays
    // Se você usou SELECT ROW_COUNT(), pode pegar assim:
    const linhasAfetadas = result[0][0]?.linhas_afetadas || 0

    if (linhasAfetadas > 0) {
      return linhasAfetadas
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL
    }

  } catch (error) {
    console.error("inserirUsuario erro:", error)
    return false
  }
}
// Atualizar grupo
const updateGrupo = async (dados) => {
  try {
    if (!dados || !dados.id) {
      return message.ERROR_REQUIRED_FIELDS
    }

    // Chamada da procedure
    const result = await prisma.$queryRaw`
      CALL update_usuario(
        ${Number(dados.id)},
        ${dados.nome ?? null},
        ${dados.area ?? null},
        ${dados.limite_membros ?? null},
        ${dados.descricao ?? null},
        ${dados.imagem ?? null}
      )
    `

    // A procedure retorna ROW_COUNT() -> vem dentro de um array
    const linhasAfetadas = result[0]?.[0]?.linhas_afetadas ?? 0

    if (linhasAfetadas > 0) {
      return message.SUCESS_UPDATED_ITEM
    } else {
      return message.ERROR_NOT_FOUND
    }

  } catch (error) {
    console.error("updateUsuario erro:", error)
    return false
  }
}

// Deletar grupo
const deleteGrupo = async (id) => {
    try {
        const result = await prisma.$executeRaw`
            DELETE FROM tbl_grupo WHERE id_grupo = ${id}
        `
        return result ? true : false
    } catch (error) {
        console.error(error)
        return false
    }
}

// Selecionar todos os grupos
const selectAllGrupos = async () => {
    try {
        const sql = `SELECT * FROM tbl_grupo`
        const result = await prisma.$queryRawUnsafe(sql)

        return result.length > 0 ? result : false
    } catch (error) {
        console.error(error)
        return false
    }
}

// Selecionar grupo por ID
const selectGrupoById = async (id) => {
    try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_grupo WHERE id_grupo = ${id}
        `
        return result.length > 0 ? result[0] : false
    } catch (error) {
        console.error(error)
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
        return result.length > 0 ? result[0].id_grupo : false
    } catch (error) {
        console.error(error)
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