const DAO = require('../../model/DAO/e-book/categoriaEbookDAO')
const message = require('../../module/config')

// ------------------------------------------------------
// Inserir relação eBook x Categoria
// ------------------------------------------------------
const inserirEbookCategoria = async (dados, contentType) => {
    try {
        if (contentType.includes('application/json')) {
            if (!dados.id_categoria || !dados.id_ebooks) {
                return message.ERROR_REQUIRED_FIELDS
            }

            const result = await DAO.inserirEbookCategoria(dados)
            return result ? message.SUCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ------------------------------------------------------
// Deletar relação
// ------------------------------------------------------
const excluirEbookCategoria = async (id) => {
    try {
        if (!id || isNaN(id)) return message.ERROR_REQUIRED_FIELDS

        const existente = await DAO.selectEbookCategoriaById(id)
        if (!existente || existente.length === 0) return message.ERROR_NOT_FOUND

        const result = await DAO.deleteEbookCategoria(id)
        return result ? message.SUCCESS_DELETED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ------------------------------------------------------
// Listar todas as relações
// ------------------------------------------------------
const listarEbooksCategorias = async () => {
    try {
        const result = await DAO.selectAllEbooksCategorias()
        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 200,
                itens: result.length,
                ebooks_categorias: result
            }
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ------------------------------------------------------
// Buscar relação por ID
// ------------------------------------------------------
const buscarEbookCategoria = async (id) => {
    try {
        if (!id || isNaN(id)) return message.ERROR_REQUIRED_FIELDS

        const result = await DAO.selectEbookCategoriaById(parseInt(id))
        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 200,
                ebook_categoria: result
            }
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirEbookCategoria,
    excluirEbookCategoria,
    listarEbooksCategorias,
    buscarEbookCategoria
}
