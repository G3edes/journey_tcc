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
        const sql = `
            INSERT INTO tbl_grupo (
                nome, area, limite_membros, descricao, imagem
            ) VALUES (?, ?, ?, ?, ?)
        `
        const result = await prisma.$executeRawUnsafe(
            sql,
            dados.nome,
            dados.area || null,
            dados.limite_membros || null,
            dados.descricao || null,
            dados.imagem || null
        )

        return result ? true : false
    } catch (error) {
        console.error(error)
        return false
    }
}

// Atualizar grupo
const updateGrupo = async (dados) => {
    try {
        if (!dados || !dados.id) return false

        const result = await prisma.$executeRaw`
            UPDATE tbl_grupo SET
                nome = ${dados.nome ?? null},
                area = ${dados.area ?? null},
                limite_membros = ${dados.limite_membros ?? null},
                descricao = ${dados.descricao ?? null},
                imagem = ${dados.imagem ?? null}
            WHERE id_grupo = ${Number(dados.id)}
        `

        return !!result
    } catch (error) {
        console.error(error)
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