/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de eBooks
 * DATA: 25/10/2025
 * AUTOR: Gabriel Guedes
 * VERSÃO: 1.0
 **************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ------------------------------------------------------
// Inserir eBook
// ------------------------------------------------------
const inserirEbook = async (dados) => {
    try {
        const result = await prisma.ebooks.create({
            data: {
                titulo: dados.titulo,
                preco: parseFloat(dados.preco),
                descricao: dados.descricao,
                link_imagem: dados.link_imagem,
                link_arquivo_pdf: dados.link_arquivo_pdf || null,
                id_usuario: dados.id_usuario
            }
        })
        return result // retorna o objeto completo (inclui id_ebooks)
    } catch (error) {
        console.error('Erro ao inserir eBook:', error)
        return false
    }
}


// ------------------------------------------------------
// Atualizar eBook
// ------------------------------------------------------
const updateEbook = async (dados) => {
    try {
        const result = await prisma.ebooks.update({
            where: { id_ebooks: dados.id },
            data: {
                titulo: dados.titulo,
                preco: parseFloat(dados.preco),
                descricao: dados.descricao,
                link_imagem: dados.link_imagem,
                link_arquivo_pdf: dados.link_arquivo_pdf,
                id_usuario: dados.id_usuario
            }
        })
        return result ? true : false
    } catch (error) {
        console.error('Erro ao atualizar eBook:', error)
        return false
    }
}

// ------------------------------------------------------
// Excluir eBook
// ------------------------------------------------------
const deleteEbook = async (id) => {
    try {
        const result = await prisma.ebooks.delete({
            where: { id_ebooks: id }
        })
        return result ? true : false
    } catch (error) {
        console.error('Erro ao deletar eBook:', error)
        return false
    }
}

// ------------------------------------------------------
// Listar Todos os eBooks
// ------------------------------------------------------
const selectAllEbooks = async () => {
    try {
        const result = await prisma.ebooks.findMany({
            include: {
                usuario: true,
                categoriasEbooks: {
                    include: { categoria: true }
                }
            },
            orderBy: { id_ebooks: 'desc' }
        })
        return result.length > 0 ? result : false
    } catch (error) {
        console.error('Erro ao listar eBooks:', error)
        return false
    }
}

// ------------------------------------------------------
// Buscar eBook por ID
// ------------------------------------------------------
const selectEbookById = async (id) => {
    try {
        const result = await prisma.ebooks.findUnique({
            where: { id_ebooks: id },
            include: {
                usuario: true,
                categoriasEbooks: {
                    include: { categoria: true }
                }
            }
        })
        return result ? [result] : false
    } catch (error) {
        console.error('Erro ao buscar eBook por ID:', error)
        return false
    }
}

module.exports = {
    inserirEbook,
    updateEbook,
    deleteEbook,
    selectAllEbooks,
    selectEbookById
}
