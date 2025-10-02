/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de categoria
 * DATA: 25/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 1.0
 **************************************************************************************************************************/

//import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

//Instancia (criar um objeto a ser utilizado) a biblioteca do prisma/client
const prisma = new PrismaClient()

const inserirArea = async (dados) => {
    try {
        let sql = `CALL inserir_area('${dados.area}')`

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao inserir area:', error)
        return false
    }
}

const updateArea = async (dados) => {
    try {
        let sql = `CALL update_area(${dados.id}, '${dados.area}')`

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao atualizar area:', error)
        return false
    }
}

const deleteArea = async (id) => {
    try {
        let sql = `CALL delete_area(${id})`

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao deletar area:', error)
        return false
    }
}

const selectAllArea = async () => {
    try {
        let sql = `SELECT * FROM vw_area`
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result : false
    } catch (error) {
        console.error('Erro ao listar area:', error)
        return false
    }
}

const selectAreaById = async (id) => {
    try {
        let sql = `SELECT * FROM vw_area WHERE id_area = ${id}`
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result[0] : false
    } catch (error) {
        console.error('Erro ao buscar area por ID:', error)
        return false
    }
}


module.exports = {
    inserirArea,
    updateArea,
    deleteArea,
    selectAllArea,
    selectAreaById
}