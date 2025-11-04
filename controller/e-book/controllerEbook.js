const DAOEbook = require('../../model/DAO/e-book/ebookDAO')
const message = require('../../module/config')

// ------------------------------------------------------
// Inserir eBook
// ------------------------------------------------------
const DAOEC = require('../../model/DAO/e-book/categoriaEbookDAO')

// Inserir eBook + vincular categorias
const inserirEbook = async (dados, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            // validação dos campos obrigatórios
            if (!dados.titulo || !dados.preco || !dados.descricao || !dados.link_imagem || !dados.id_usuario) {
                return message.ERROR_REQUIRED_FIELDS
            }

            // Inserir o eBook
            const novoEbook = await DAOEbook.inserirEbook(dados)
            if (!novoEbook) {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }

            // Inserir vínculos de categoria (se vierem)
            if (dados.categorias && Array.isArray(dados.categorias) && dados.categorias.length > 0) {
                for (let idCategoria of dados.categorias) {
                    await DAOEC.inserirEbookCategoria({
                        id_ebooks: novoEbook.id_ebooks,
                        id_categoria: idCategoria
                    })
                }
            }

            return message.SUCESS_CREATED_ITEM
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// ------------------------------------------------------
// Atualizar eBook
// ------------------------------------------------------
const atualizarEbook = async (id, ebook, contentType) => {
    try {
        if (contentType.includes('application/json')) {
            if (
                !ebook.titulo || !ebook.preco || !ebook.descricao ||
                !ebook.link_imagem || !ebook.id_usuario
            ) {
                return message.ERROR_REQUIRED_FIELDS
            }

            const existente = await DAOEbook.selectEbookById(id)
            if (!existente || existente.length === 0) {
                return message.ERROR_NOT_FOUND
            }

            ebook.id = parseInt(id)
            const result = await DAOEbook.updateEbook(ebook)
            return result ? message.SUCESS_UPDATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ------------------------------------------------------
// Excluir eBook
// ------------------------------------------------------
const excluirEbook = async (id) => {
    try {
        if (!id || isNaN(id)) return message.ERROR_REQUIRED_FIELDS

        const existente = await DAOEbook.selectEbookById(id)
        if (!existente || existente.length === 0) return message.ERROR_NOT_FOUND

        const result = await DAOEbook.deleteEbook(id)
        return result ? message.SUCCESS_DELETED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ------------------------------------------------------
// Listar eBooks
// ------------------------------------------------------
const listarEbooks = async () => {
    try {
        const result = await DAOEbook.selectAllEbooks()
        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 200,
                itens: result.length,
                ebooks: result
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
// Buscar eBook por ID
// ------------------------------------------------------
const buscarEbook = async (id) => {
    try {
        if (!id || isNaN(id)) return message.ERROR_REQUIRED_FIELDS

        const result = await DAOEbook.selectEbookById(parseInt(id))
        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 200,
                ebook: result
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
    inserirEbook,
    atualizarEbook,
    excluirEbook,
    listarEbooks,
    buscarEbook
}
