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
    return false
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
    return false
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
    return false
  }
}


// Listar todos os usuários
const selectAllUsuario = async () => {
  try {
    const sql = 'SELECT * FROM tbl_usuario'
    const result = await prisma.$queryRawUnsafe(sql)

    if(result && result.length > 0) {
      return result
    } else {
      return message.ERROR_NOT_FOUND
    }
  }catch{
    return false
  }
}


// Buscar usuário por ID
const selectUsuarioById = async (id) => {
  try {
    const sql = `SELECT * FROM tbl_usuario WHERE id_usuario = ${Number(id)} LIMIT 1;`
    const rs = await prisma.$queryRawUnsafe(sql)
    return rs && rs.length > 0 
    ? rs[0] 
    : null
  } catch (error) {
    console.error("selectUsuarioById erro:", error)
    return null
  }
}

const selectUsuarioByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM tbl_usuario WHERE email = ? LIMIT 1'
    const rs = await prisma.$queryRawUnsafe(sql, email)

    // Se encontrou, retorna o objeto; se não, retorna null
    return rs && rs.length > 0 ? rs[0] : null

  } catch (error) {
    console.error("selectUsuarioByEmail erro:", error)
    return null
  }
}

// Pegar o último ID inserido
const selectLastId = async () => {
  try {
    const sql = 'SELECT id_usuario FROM tbl_usuario ORDER BY id_usuario DESC LIMIT 1'
    const result = await prisma.$queryRawUnsafe(sql)

    // Se houver resultado, retorna o último id_usuario, senão retorna null
    return result && result.length > 0 ? result[0].id_usuario : null

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
