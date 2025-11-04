/*CREATE TABLE tbl_ebooks (
	id_ebooks INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT NOT NULL,
    link_imagem VARCHAR(255) NOT NULL,
    link_arquivo_pdf VARCHAR(255),
    id_usuario INT NOT NULL,
    CONSTRAINT fk_ebooks_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario)
);
CREATE TABLE tbl_ebooks_categoria (
    id_ebooks_categoria INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_ebooks INT NOT NULL,
	CONSTRAINT fk_ebooks_categoria_categoria FOREIGN KEY (id_categoria) REFERENCES tbl_categoria (id_categoria) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ebooks_categoria_ebooks FOREIGN KEY (id_ebooks) REFERENCES tbl_ebooks (id_ebooks) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE tbl_categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL
);*/
const DAOCategoria = require('../../model/DAO/categoria/categoriaDAO.js')
const message = require('../../module/config.js')

// --------------------------------------------------
// Inserir Categoria
// --------------------------------------------------
const inserirCategoria = async (categoria, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            if (
                categoria.categoria == '' ||
                categoria.categoria == undefined ||
                categoria.categoria == null ||
                categoria.categoria.length > 100
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let result = await DAOCategoria.inserirCategoria(categoria)
                if (result) {
                    return message.SUCESS_CREATED_ITEM
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// --------------------------------------------------
// Atualizar Categoria
// --------------------------------------------------
const atualizarCategoria = async (id, categoria, contentType) => {
    try {
        if (contentType == 'application/json') {
            if (
                categoria.categoria == '' ||
                categoria.categoria == undefined ||
                categoria.categoria == null ||
                categoria.categoria.length > 100
            ) {
                return message.ERROR_REQUIRED_FIELDS
            }

            let result = await DAOCategoria.selectCategoriaById(id)
            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    categoria.id = parseInt(id)

                    let updated = await DAOCategoria.updateCategoria(categoria)
                    if (updated) {
                        return message.SUCESS_UPDATED_ITEM
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// --------------------------------------------------
// Excluir Categoria
// --------------------------------------------------
const excluirCategoria = async (id) => {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            let result = await DAOCategoria.selectCategoriaById(parseInt(id))

            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    let deleted = await DAOCategoria.deleteCategoria(parseInt(id))
                    if (deleted) {
                        return message.SUCCESS_DELETED_ITEM
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// --------------------------------------------------
// Listar Categorias
// --------------------------------------------------
const listarCategoria = async () => {
    try {
        let dados = {}
        let result = await DAOCategoria.selectAllCategoria()

        if (result != false || typeof(result) == 'object') {
            if (result.length > 0) {
                dados.status = true
                dados.status_code = 200
                dados.itens = result.length
                dados.categorias = result
                return dados
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// --------------------------------------------------
// Buscar Categoria por ID
// --------------------------------------------------
const buscarCategoria = async (id) => {
    let dados = {}
    try {
        if (id == '' || id == undefined || id == null || id < 0) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            let result = await DAOCategoria.selectCategoriaById(id)

            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    dados = {
                        status: true,
                        status_code: 200,
                        categoria: result
                    }
                    return dados
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// --------------------------------------------------
// Exportar funções
// --------------------------------------------------
module.exports = {
    inserirCategoria,
    listarCategoria,
    buscarCategoria,
    excluirCategoria,
    atualizarCategoria
}
