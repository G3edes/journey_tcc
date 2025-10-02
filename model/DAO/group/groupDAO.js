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
    // CORREÇÃO: Removido o comentário de JS dentro do template literal SQL (` `)
    const result = await prisma.$queryRaw`
      CALL inserir_grupo( 
        ${dados.nome},
        ${dados.limite_membros},
        ${dados.descricao},
        ${dados.imagem || 'default_group_image.png'},
        ${dados.id_area},
        ${dados.id_usuario} 
      )
    `

    // O MySQL retorna a procedure como array de arrays. O seu resultado pode variar.
    // Presumo que a stored procedure retorne o número de linhas afetadas.
    const linhasAfetadas = result[0][0]?.linhas_afetadas || 0

    if (linhasAfetadas > 0) {
      return linhasAfetadas
    } else {
      return { status: false, message: 'Erro ao inserir no Banco de Dados.' } 
    }

  } catch (error) {
    // Mantido o console.error para debugging, é útil.
    console.error("inserirGrupo erro:", error)
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


