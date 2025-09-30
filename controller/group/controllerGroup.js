const DAOGrupo = require('../../model/DAO/group/groupDAO.js') // ajuste o caminho conforme sua estrutura
const message = require('../../module/config.js') // mensagens padrão (ex: SUCCESS, ERROR)

// Inserir novo grupo
const inserirGrupo = async (grupo, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            if (
                !grupo.nome || grupo.nome.length > 100 ||
                (grupo.area && grupo.area.length > 100) ||
                (grupo.imagem && grupo.imagem.length > 255) ||
                (grupo.limite_membros && isNaN(grupo.limite_membros)) ||
                !user.id_usuario || user.id_usuario.length > 100 ||
                !user.id_area || user.id_area.length > 100
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let result = await DAOGrupo.insertGrupo(grupo)
                if (result) {
                    let lastId = await DAOGrupo.selectLastId()
                    return {
                        status: true,
                        status_code: 201,
                        grupoID: lastId,
                        grupo: grupo
                    }
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

// Atualizar grupo
const atualizarGrupo = async (id, grupo, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            if (
                !grupo.nome || grupo.nome.length > 100 ||
                (grupo.area && grupo.area.length > 100) ||
                (grupo.imagem && grupo.imagem.length > 255) ||
                (grupo.limite_membros && isNaN(grupo.limite_membros)) ||
                !user.id_usuario || user.id_usuario.length > 100 ||
                !user.id_area || user.id_area.length > 100
            ) {
                return message.ERROR_REQUIRED_FIELDS
            }

            let grupoExistente = await DAOGrupo.selectGrupoById(id)
            if (!grupoExistente) return message.ERROR_NOT_FOUND

            grupo.id = parseInt(id)
            let result = await DAOGrupo.updateGrupo(grupo)
            if (result) {
                let grupoAtualizado = await DAOGrupo.selectGrupoById(id)
                return {
                    status: true,
                    status_code: 200,
                    grupo: grupoAtualizado
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

// Excluir grupo
const excluirGrupo = async (id) => {
    try {
        if (!id || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        }

        let grupo = await DAOGrupo.selectGrupoById(id)
        if (!grupo) return message.ERROR_NOT_FOUND

        let result = await DAOGrupo.deleteGrupo(id)
        if (result) {
            return message.SUCCESS_DELETED_ITEM
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Listar todos os grupos
const listarGrupos = async () => {
    try {
        let grupos = await DAOGrupo.selectAllGrupos()
        if (grupos && grupos.length > 0) {
            return {
                status: true,
                status_code: 200,
                itens: grupos.length,
                grupos: grupos
            }
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Buscar grupo por ID
const buscarGrupoPorId = async (id) => {
    try {
        if (!id || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        }

        let grupo = await DAOGrupo.selectGrupoById(id)
        if (grupo) {
            return {
                status: true,
                status_code: 200,
                grupo: grupo
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
inserirGrupo,
atualizarGrupo,
excluirGrupo,
listarGrupos,
buscarGrupoPorId
}
