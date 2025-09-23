/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de cadastro
 * DATA: 18/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 2.1
 **************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const message = require('../../../module/config')

const prisma = new PrismaClient()

// Inserir novo usuário
const inserirUsuario = async (dados) => {
  try {
    const result = await prisma.$queryRaw`
      CALL inserir_usuario(
        ${dados.nome_completo},
        ${dados.email},
        ${dados.senha},
        ${dados.data_nascimento},
        ${dados.foto_perfil || null},
        ${dados.descricao || null},
        ${dados.tipo_usuario}
      )
    `

    // O MySQL retorna a procedure como array de arrays
    // Se você usou SELECT ROW_COUNT(), pode pegar assim:
    const linhasAfetadas = result[0][0]?.linhas_afetadas || 0

    if (linhasAfetadas > 0) {
      return message.SUCESS_CREATED_ITEM
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL
    }

  } catch (error) {
    console.error("inserirUsuario erro:", error)
    return false
  }
}
/*
const inserirUsuario = async (dados) => {
  try {
    const sql = `
      INSERT INTO tbl_usuario (
        nome_completo,
        email,
        senha,
        data_nascimento,
        foto_perfil,
        descricao,
        tipo_usuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.nome_completo,
      dados.email,
      dados.senha,
      dados.data_nascimento,
      dados.foto_perfil || null,
      dados.descricao || null,
      dados.tipo_usuario
    )

    if(result > 0) {
      return message.SUCESS_CREATED_ITEM
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL
    }

  } catch (error) {
    console.error("inserirUsuario erro:", error)
    return message.ERROR_INTERNAL_SERVER_MODEL
  }
}
*/

// Atualizar dados do usuário




const updateUsuario = async (dados) => {
  try {
    if (!dados || !dados.id) {
      return message.ERROR_REQUIRED_FIELDS
    }

    // Chamada da procedure
    const result = await prisma.$queryRaw`
      CALL update_usuario(
        ${Number(dados.id)},
        ${dados.nome_completo ?? null},
        ${dados.email ?? null},
        ${dados.senha ?? null},
        ${dados.data_nascimento ?? null},
        ${dados.foto_perfil ?? null},
        ${dados.descricao ?? null},
        ${dados.tipo_usuario ?? null}
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
    return message.ERROR_INTERNAL_SERVER_MODEL
  }
}


// Atualizar apenas a senha
const updateSenhaUsuario = async (id, novaSenha) => {
  try {
    if (!id || !novaSenha) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const result = await prisma.$queryRaw`
      CALL update_senha_usuario(${Number(id)}, ${novaSenha})
    `

    // A procedure retorna ROW_COUNT()
    const linhasAfetadas = result[0]?.[0]?.linhas_afetadas ?? 0

    if (linhasAfetadas > 0) {
      return message.SUCESS_UPDATED_ITEM
    } else {
      return message.ERROR_NOT_FOUND
    }

  } catch (error) {
    console.error("updateSenhaUsuario erro:", error)
    return message.ERROR_INTERNAL_SERVER_MODEL
  }
}

// Deletar usuário por ID
const deleteUsuario = async (id) => {
  try {
    if (!id) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const result = await prisma.$queryRaw`
      CALL delete_usuario(${Number(id)})
    `

    // A procedure retorna ROW_COUNT()
    const linhasAfetadas = result[0]?.[0]?.linhas_afetadas ?? 0

    if (linhasAfetadas > 0) {
      return message.SUCCESS_DELETED_ITEM
    } else {
      return message.ERROR_NOT_FOUND
    }

  } catch (error) {
    console.error("deleteUsuario erro:", error)
    return message.ERROR_INTERNAL_SERVER_MODEL
  }
}


// Listar todos os usuários
const selectAllUsuario = async () => {
  try {
    const result = await prisma.$queryRaw`CALL select_all_usuario()`

    // Em MySQL, CALL retorna um array de arrays
    const usuarios = result[0] ?? []

    if (usuarios.length > 0) {
      return usuarios
    } else {
      return message.ERROR_NOT_FOUND
    }

  } catch (error) {
    console.error("selectAllUsuario erro:", error)
    return message.ERROR_INTERNAL_SERVER_MODEL
  }
}


// Buscar usuário por ID
const selectUsuarioById = async (id) => {
  try {
    const rs = await prisma.$queryRaw`CALL select_usuario_by_id(${Number(id)})`
    return rs[0]?.[0] ?? null
  } catch (error) {
    console.error("selectUsuarioById erro:", error)
    return null
  }
}


// Buscar usuário por Email
const selectUsuarioByEmail = async (email) => {
  try {
    const rs = await prisma.$queryRaw`CALL select_usuario_by_email(${email})`
    return rs[0]?.[0] ?? null
  } catch (error) {
    console.error("selectUsuarioByEmail erro:", error)
    return null
  }
}

// Pegar o último ID inserido
const selectLastId = async () => {
  try {
    const result = await prisma.$queryRaw`CALL select_last_usuario_id()`
    return result[0]?.[0]?.id_usuario ?? null
  } catch (error) {
    console.error("selectLastId erro:", error)
    return null
  }
}

module.exports = {
  inserirUsuario,
  updateUsuario,
  updateSenhaUsuario,
  deleteUsuario,
  selectAllUsuario,
  selectUsuarioById,
  selectUsuarioByEmail,
  selectLastId
}
