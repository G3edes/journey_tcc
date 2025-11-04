/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de categoria usando Prisma ORM
 * DATA: 25/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 2.0
 **************************************************************************************************************************/

// Import do Prisma Client
const { PrismaClient } = require('@prisma/client')

// Instancia do Prisma Client
const prisma = new PrismaClient()

// ------------------------------------------------------
// Inserir Categoria
// ------------------------------------------------------
const inserirCategoria = async (dados) => {
    try {
        const result = await prisma.categoria.create({
            data: {
                categoria: dados.categoria
            }
        })
        return result ? true : false
    } catch (error) {
        console.error('Erro ao inserir categoria:', error)
        return false
    }
}

// ------------------------------------------------------
// Atualizar Categoria
// ------------------------------------------------------
const updateCategoria = async (dados) => {
    try {
        const result = await prisma.categoria.update({
            where: {
                id_categoria: dados.id
            },
            data: {
                categoria: dados.categoria
            }
        })
        return result ? true : false
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error)
        return false
    }
}

// ------------------------------------------------------
// Deletar Categoria
// ------------------------------------------------------
const deleteCategoria = async (id) => {
    try {
        const result = await prisma.categoria.delete({
            where: {
                id_categoria: id
            }
        })
        return result ? true : false
    } catch (error) {
        console.error('Erro ao deletar categoria:', error)
        return false
    }
}

// ------------------------------------------------------
// Selecionar Todas as Categorias
// ------------------------------------------------------
const selectAllCategoria = async () => {
    try {
        const result = await prisma.categoria.findMany({
            orderBy: {
                id_categoria: 'desc'
            }
        })
        return result.length > 0 ? result : false
    } catch (error) {
        console.error('Erro ao listar categorias:', error)
        return false
    }
}

// ------------------------------------------------------
// Selecionar Categoria por ID
// ------------------------------------------------------
const selectCategoriaById = async (id) => {
    try {
        const result = await prisma.categoria.findUnique({
            where: {
                id_categoria: id
            }
        })
        return result ? [result] : false // mantém compatível com sua controller
    } catch (error) {
        console.error('Erro ao buscar categoria por ID:', error)
        return false
    }
}

// ------------------------------------------------------
// Export dos métodos
// ------------------------------------------------------
module.exports = {
    inserirCategoria,
    updateCategoria,
    deleteCategoria,
    selectAllCategoria,
    selectCategoriaById
}
