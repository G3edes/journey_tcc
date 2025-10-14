/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de calendario
 * DATA: 07/11/2025
 * AUTOR: Hiago Ortolan (ajuste solicitado)
 * Versão: 2.0
 **************************************************************************************************************************/

// Import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

// Instancia o prisma client
const prisma = new PrismaClient()

// INSERT (POST)
const inserirCalendario = async (dados) => {
    try {
        let sql = `
            INSERT INTO tbl_calendario (calendario)
            VALUES ('${dados.calendario}')
        `

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao inserir calendário:', error)
        return false
    }
}

// UPDATE (PUT)
const updateCalendario = async (dados) => {
    try {
        let sql = `
            UPDATE tbl_calendario
            SET calendario = '${dados.calendario}'
            WHERE id_calendario = ${dados.id}
        `

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao atualizar calendário:', error)
        return false
    }
}

// DELETE (DELETE)
const deleteCalendario = async (id) => {
    try {
        let sql = `
            DELETE FROM tbl_calendario
            WHERE id_calendario = ${id}
        `

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao deletar calendário:', error)
        return false
    }
}

// SELECT ALL (GET)
const selectAllCalendario = async () => {
    try {
        let sql = `SELECT * FROM tbl_calendario`
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result : false
    } catch (error) {
        console.error('Erro ao listar calendários:', error)
        return false
    }
}

// SELECT BY ID (GET)
const selectCalendarioById = async (id) => {
    try {
        let sql = `
            SELECT * FROM tbl_calendario
            WHERE id_calendario = ${id}
        `
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result[0] : false
    } catch (error) {
        console.error('Erro ao buscar calendário por ID:', error)
        return false
    }
}

// Exporta as funções
module.exports = {
    inserirCalendario,
    updateCalendario,
    deleteCalendario,
    selectAllCalendario,
    selectCalendarioById
}
