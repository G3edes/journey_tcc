/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de usuario_grupo
 * DATA: 07/10/2025
 * AUTOR: Gabriel Guedes
 * VERSÃO: 1.0
 **************************************************************************************************************************/

// Import da biblioteca do Prisma Client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

// Instancia (criar um objeto a ser utilizado) a biblioteca do prisma/client
const prisma = new PrismaClient()

// Inserir novo relacionamento usuário-grupo
const insertUsuarioGrupo = async (dados) => {
    try {
        let sql = `
            INSERT INTO tbl_usuario_grupo (id_usuario, id_grupo, entrou_em)
            VALUES (${dados.id_usuario}, ${dados.id_grupo}, NOW())
        `

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao inserir usuario_grupo:', error)
        return false
    }
}

// Atualizar relacionamento
const updateUsuarioGrupo = async (dados) => {
    try {
        let sql = `
            UPDATE tbl_usuario_grupo
            SET id_usuario = ${dados.id_usuario},
                id_grupo = ${dados.id_grupo}
            WHERE id_usuario_grupo = ${dados.id}
        `

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao atualizar usuario_grupo:', error)
        return false
    }
}

// Deletar relacionamento
const deleteUsuarioGrupo = async (id) => {
    try {
        let sql = `DELETE FROM tbl_usuario_grupo WHERE id_usuario_grupo = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao deletar usuario_grupo:', error)
        return false
    }
}

// Listar todos os relacionamentos
const selectAllUsuariosGrupos = async () => {
    try {
        let sql = `SELECT * FROM tbl_usuario_grupo`
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result : false
    } catch (error) {
        console.error('Erro ao listar usuarios_grupos:', error)
        return false
    }
}

// Buscar relacionamento por ID
const selectUsuarioGrupoById = async (id) => {
    try {
        let sql = `SELECT * FROM tbl_usuario_grupo WHERE id_usuario_grupo = ${id}`
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result[0] : false
    } catch (error) {
        console.error('Erro ao buscar usuario_grupo por ID:', error)
        return false
    }
}

// Buscar último ID inserido
const selectLastId = async () => {
    try {
        let sql = `SELECT CAST(LAST_INSERT_ID() AS DECIMAL) as id`
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result[0].id : false
    } catch (error) {
        console.error('Erro ao buscar último ID inserido em usuario_grupo:', error)
        return false
    }
}

module.exports = {
    insertUsuarioGrupo,
    updateUsuarioGrupo,
    deleteUsuarioGrupo,
    selectAllUsuariosGrupos,
    selectUsuarioGrupoById,
    selectLastId
}
