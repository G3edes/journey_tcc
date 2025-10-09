/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de cadastro
 * DATA: 18/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 2.1 (Mix + Config.js)
 **************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir usuário usando procedure
// Inserir usuário usando procedure
const inserirUsuario = async (dados) => {
  try {
    const sql = `CALL inserir_usuario(?, ?, ?, ?, ?, ?, ?)`
    const result = await prisma.$queryRawUnsafe(
      sql,
      dados.nome_completo,
      dados.email,
      dados.senha,
      dados.data_nascimento || null,
      dados.foto_perfil || null,
      dados.descricao || null,
      dados.tipo_usuario
    )

    if (result) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("inserirUsuario erro:", error)
    return false
  }
}

// Atualizar usuário
const updateUsuario = async (dados) => {
  try {
    if (!dados || !dados.id) return false

    // ✅ Corrige formato da data se vier no padrão ISO
    let dataFormatada = null
    if (dados.data_nascimento) {
      const dateObj = new Date(dados.data_nascimento)
      if (!isNaN(dateObj)) {
        // Converte para yyyy-mm-dd
        dataFormatada = dateObj.toISOString().split("T")[0]
      }
    }

    const sql = `CALL update_usuario(?, ?, ?, ?, ?, ?, ?, ?)`
    const result = await prisma.$queryRawUnsafe(
      sql,
      Number(dados.id),
      dados.nome_completo || null,
      dados.email || null,
      dados.senha || null,
      dataFormatada || null,   // ✅ Usa a data formatada
      dados.foto_perfil || null,
      dados.descricao || null,
      dados.tipo_usuario || null
    )

    return !!result
  } catch (error) {
    console.error("updateUsuario erro:", error)
    return false
  }
}

// Atualizar senha
const updateSenhaUsuario = async (id, novaSenha) => {
  try {
    const sql = `CALL update_senha_usuario(?, ?)`
    const result = await prisma.$queryRawUnsafe(sql, id, novaSenha)

    if (result) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("updateSenhaUsuario erro:", error)
    return false
  }
}

// Deletar usuário
const deleteUsuario = async (id) => {
  try {
    const sql = `CALL delete_usuario(?)`
    const result = await prisma.$queryRawUnsafe(sql, id)

    if (result) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("deleteUsuario erro:", error)
    return false
  }
}

// Selecionar todos os usuários
const selectAllUsuario = async () => {
  try {
    const sql = `SELECT * FROM vw_usuario`
    const result = await prisma.$queryRawUnsafe(sql)

    if (result) {
      return result
    } else {
      return false
    }
  } catch (error) {
    console.error("selectAllUsuario erro:", error)
    return false
  }
}

// Selecionar usuário por ID
const selectUsuarioById = async (id) => {
  try {
    const sql = `SELECT * FROM vw_usuario WHERE id_usuario = ? LIMIT 1`
    const result = await prisma.$queryRawUnsafe(sql, id)

    if (result) {
      return result
    } else {
      return false
    }
  } catch (error) {
    console.error("selectUsuarioById erro:", error)
    return false
  }
}

// Selecionar usuário por Email
const selectUsuarioByEmail = async (email) => {
  try {
    const sql = `SELECT * FROM vw_usuario WHERE email = ? LIMIT 1`
    const result = await prisma.$queryRawUnsafe(sql, email)

    if (result && result.length > 0) {
      // força a conversão para objeto puro
      return JSON.parse(JSON.stringify(result[0]))
    } else {
      return null
    }
  } catch (error) {
    console.error("selectUsuarioByEmail erro:", error)
    return null
  }
}

// Pegar último ID
const selectLastId = async () => {
  try {
    const sql = `SELECT id_usuario FROM vw_usuario ORDER BY id_usuario DESC LIMIT 1`
    const result = await prisma.$queryRawUnsafe(sql)

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
  inserirUsuario,
  updateUsuario,
  updateSenhaUsuario,
  deleteUsuario,
  selectAllUsuario,
  selectUsuarioById,
  selectUsuarioByEmail,
  selectLastId
}