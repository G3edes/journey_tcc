/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de cadastro
 * DATA: 18/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 1.0
 **************************************************************************************************************************/
// Import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

// Instancia (criar um objeto a ser utilizado) do Prisma Client
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

        return result ? true : false
    } catch (error) {
        console.error(error)
        return false
    }
}

// Atualizar dados do usuário
const updateUsuario = async (dados) => {
    try {
        if (!dados || !dados.id) return false

        const result = await prisma.$executeRaw`
            UPDATE tbl_usuario SET
                nome_completo   = ${dados.nome_completo ?? null},
                email           = ${dados.email ?? null},
                senha           = ${dados.senha ?? null},
                data_nascimento = ${dados.data_nascimento ?? null},
                foto_perfil     = ${dados.foto_perfil ?? null},
                descricao       = ${dados.descricao ?? null},
                tipo_usuario    = ${dados.tipo_usuario ?? null}
            WHERE id_usuario = ${Number(dados.id)}
        `

        return !!result
    } catch (error) {
        console.error(error)
        return false
    }
}

// Atualizar apenas a senha
const updateSenhaUsuario = async (dados) => {
    try {
        if (!dados || !dados.id) return false

        const result = await prisma.$executeRaw`
            UPDATE tbl_usuario SET
                senha = ${dados.senha ?? null}
            WHERE id_usuario = ${Number(dados.id)}
        `

        return result ? true : false
    } catch (error) {
        console.error(error)
        return false
    }
}

// Deletar usuário por ID
const deleteUsuario = async (id) => {
    try {
        const result = await prisma.$executeRaw`
            DELETE FROM tbl_usuario
            WHERE id_usuario = ${id}
        `

        return result ? true : false
    } catch (error) {
        console.error(error)
        return false
    }
}

// Listar todos os usuários
const selectAllUsuario = async () => {
    try {
        const sql = 'SELECT * FROM tbl_usuario'
        const result = await prisma.$queryRawUnsafe(sql)

        return result || false
    } catch (error) {
        console.error(error)
        return false
    }
}

// Buscar usuário por ID
const selectusuarioById = async (id) => {
    try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_usuario
            WHERE id_usuario = ${id}
        `

        return result.length > 0 ? result[0] : false
    } catch (error) {
        console.error(error)
        return false
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

        return result.length > 0 ? result[0].id_usuario : false
    } catch (error) {
        console.error(error)
        return false
    }
}

// Exporta as funções para uso externo
module.exports = {
    inserirUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuario,
    selectusuarioById,
    selectLastId,
    updateSenhaUsuario
}
