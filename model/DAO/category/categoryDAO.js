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

const inserirCategoria = async (dados) => {
    try {
        let sql = `CALL sp_insert_categoria('${dados.categoria}')`

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao inserir categoria:', error)
        return false
    }
}

const updateCategoria = async (dados) => {
    try {
        let sql = `CALL sp_update_categoria(${dados.id}, '${dados.categoria}')`

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error)
        return false
    }
}

const deleteCategoria = async (id) => {
    try {
        let sql = `CALL sp_delete_categoria(${id})`

        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        console.error('Erro ao deletar categoria:', error)
        return false
    }
}

const selectAllCategoria = async () => {
    try {
        let sql = `SELECT * FROM vw_categorias`
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result : false
    } catch (error) {
        console.error('Erro ao listar categorias:', error)
        return false
    }
}

const selectCategoriaById = async (id) => {
    try {
        let sql = `SELECT * FROM vw_categoria WHERE id_categoria = ${id}`
        let result = await prisma.$queryRawUnsafe(sql)

        return result && result.length > 0 ? result[0] : false
    } catch (error) {
        console.error('Erro ao buscar categoria por ID:', error)
        return false
    }
}


module.exports = {
    inserirCategoria,
    updateCategoria,
    deleteCategoria,
    selectAllCategoria,
    selectCategoriaById
}