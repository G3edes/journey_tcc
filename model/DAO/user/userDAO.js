/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de cadastro
 * DATA: 18/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 2.1 (Mix + Config.js)
 **************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const message = require('./config.js')

const prisma = new PrismaClient()

// Inserir novo usuário
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
        tipo_usuario,
        linkedin_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.nome_completo,
      dados.email,
      dados.senha,
      dados.data_nascimento,
      dados.foto_perfil || null,
      dados.descricao || null,
      dados.tipo_usuario,
      dados.linkedin_url || null
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

// Atualizar dados do usuário
const updateUsuario = async (dados) => {
  try {
    if (!dados || !dados.id) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const result = await prisma.$executeRaw`
      UPDATE tbl_usuario SET
          nome_completo   = ${dados.nome_completo ?? null},
          email           = ${dados.email ?? null},
          senha           = ${dados.senha ?? null},
          data_nascimento = ${dados.data_nascimento ?? null},
          foto_perfil     = ${dados.foto_perfil ?? null},
          descricao       = ${dados.descricao ?? null},
          tipo_usuario    = ${dados.tipo_usuario ?? null},
          linkedin_url    = ${dados.linkedin_url ?? null}
      WHERE id_usuario = ${Number(dados.id)}
    `

    if(result > 0) {
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
    const sql = `UPDATE tbl_usuario SET senha = ? WHERE id_usuario = ?`
    const result = await prisma.$executeRawUnsafe(sql, novaSenha, id)

    if(result > 0) {
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
    const result = await prisma.$executeRaw`
      DELETE FROM tbl_usuario WHERE id_usuario = ${id}
    `

    if(result > 0) {
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
    const sql = 'SELECT * FROM tbl_usuario'
    const result = await prisma.$queryRawUnsafe(sql)

    if(result && result.length > 0) {
      return result
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

// Buscar usuário por Email
const selectUsuarioByEmail = async (email) => {
  try {
    const sql = `SELECT * FROM tbl_usuario WHERE email = ? LIMIT 1;`
    const rs = await prisma.$queryRawUnsafe(sql, email)
    return rs && rs.length > 0 
    ? rs[0] 
    : null
  } catch (error) {
    console.error("selectUsuarioByEmail erro:", error)
    return null
  }
}

// Pegar o último ID inserido
const selectLastId = async () => {
  try {
    const result = await prisma.$queryRaw`
      SELECT id_usuario FROM tbl_usuario
      ORDER BY id_usuario DESC
      LIMIT 1
    `
    return result.length > 0 
    ? result[0].id_usuario 
    : null
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
