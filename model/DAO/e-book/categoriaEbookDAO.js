/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD da relação Ebooks x Categoria
 * DATA: 25/10/2025
 * AUTOR: Gabriel Guedes
 * VERSÃO: 1.0
 **************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ------------------------------------------------------
// Inserir relação eBook x Categoria
// ------------------------------------------------------
const inserirEbookCategoria = async (dados) => {
    try {
        const result = await prisma.ebooksCategoria.create({
            data: {
                id_categoria: dados.id_categoria,
                id_ebooks: dados.id_ebooks
            }
        })
        return result ? true : false
    } catch (error) {
        console.error('Erro ao inserir relação eBook-Categoria:', error)
        return false
    }
}

// ------------------------------------------------------
// Deletar relação eBook x Categoria
// ------------------------------------------------------
const deleteEbookCategoria = async (id) => {
    try {
        const result = await prisma.ebooksCategoria.delete({
            where: { id_ebooks_categoria: id }
        })
        return result ? true : false
    } catch (error) {
        console.error('Erro ao deletar relação eBook-Categoria:', error)
        return false
    }
}

// ------------------------------------------------------
// Listar todas as relações eBook x Categoria
// ------------------------------------------------------
const selectAllEbooksCategorias = async () => {
    try {
        const result = await prisma.ebooksCategoria.findMany({
            include: {
                categoria: true,
                ebooks: true
            },
            orderBy: { id_ebooks_categoria: 'desc' }
        })
        return result.length > 0 ? result : false
    } catch (error) {
        console.error('Erro ao listar relações eBook-Categoria:', error)
        return false
    }
}

// ------------------------------------------------------
// Buscar relação por ID
// ------------------------------------------------------
const selectEbookCategoriaById = async (id) => {
    try {
        const result = await prisma.ebooksCategoria.findUnique({
            where: { id_ebooks_categoria: id },
            include: {
                categoria: true,
                ebooks: true
            }
        })
        return result ? [result] : false
    } catch (error) {
        console.error('Erro ao buscar relação eBook-Categoria:', error)
        return false
    }
}

module.exports = {
    inserirEbookCategoria,
    deleteEbookCategoria,
    selectAllEbooksCategorias,
    selectEbookCategoriaById
}
