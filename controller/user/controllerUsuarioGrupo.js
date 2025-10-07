const DAOUsuarioGrupo = require('../../model/DAO/user/usuarioGrupoDAO.js') // ajuste o caminho conforme sua estrutura
const message = require('../../module/config.js') // mensagens padrão (ex: SUCCESS, ERROR)

// Inserir novo relacionamento usuário-grupo
const inserirUsuarioGrupo = async (usuarioGrupo, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            if (
                !usuarioGrupo.id_usuario || isNaN(usuarioGrupo.id_usuario) ||
                !usuarioGrupo.id_grupo || isNaN(usuarioGrupo.id_grupo)
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let result = await DAOUsuarioGrupo.insertUsuarioGrupo(usuarioGrupo)
                if (result) {
                    let lastId = await DAOUsuarioGrupo.selectLastId()
                    return {
                        status: true,
                        status_code: 201,
                        usuarioGrupoID: lastId,
                        usuarioGrupo: usuarioGrupo
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

// Atualizar relacionamento
const atualizarUsuarioGrupo = async (id, usuarioGrupo, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            if (
                !usuarioGrupo.id_usuario || isNaN(usuarioGrupo.id_usuario) ||
                !usuarioGrupo.id_grupo || isNaN(usuarioGrupo.id_grupo)
            ) {
                return message.ERROR_REQUIRED_FIELDS
            }

            let existente = await DAOUsuarioGrupo.selectUsuarioGrupoById(id)
            if (!existente) return message.ERROR_NOT_FOUND

            usuarioGrupo.id = parseInt(id)
            let result = await DAOUsuarioGrupo.updateUsuarioGrupo(usuarioGrupo)
            if (result) {
                let atualizado = await DAOUsuarioGrupo.selectUsuarioGrupoById(id)
                return {
                    status: true,
                    status_code: 200,
                    usuarioGrupo: atualizado
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

// Excluir relacionamento
const excluirUsuarioGrupo = async (id) => {
    try {
        if (!id || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        }

        let existente = await DAOUsuarioGrupo.selectUsuarioGrupoById(id)
        if (!existente) return message.ERROR_NOT_FOUND

        let result = await DAOUsuarioGrupo.deleteUsuarioGrupo(id)
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

// Listar todos os relacionamentos
const listarUsuariosGrupos = async () => {
    try {
        let registros = await DAOUsuarioGrupo.selectAllUsuariosGrupos()
        if (registros && registros.length > 0) {
            return {
                status: true,
                status_code: 200,
                itens: registros.length,
                usuariosGrupos: registros
            }
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Buscar relacionamento por ID
const buscarUsuarioGrupoPorId = async (id) => {
    try {
        if (!id || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        }

        let registro = await DAOUsuarioGrupo.selectUsuarioGrupoById(id)
        if (registro) {
            return {
                status: true,
                status_code: 200,
                usuarioGrupo: registro
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
    inserirUsuarioGrupo,
    atualizarUsuarioGrupo,
    excluirUsuarioGrupo,
    listarUsuariosGrupos,
    buscarUsuarioGrupoPorId
}
