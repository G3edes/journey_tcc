const DAOCalendario = require('../../model/DAO/calendario/calendarioDAO.js')

const message = require('../../module/config.js')

const inserirCalendario = async (calendario, contentType) => {
    let dados = {}
    try {
        if (contentType && contentType.includes('application/json')) {

            if (calendario.nome_evento == '' || calendario.nome_evento == undefined || calendario.nome_evento == null || calendario.nome_evento.length > 100 ||
                calendario.data_evento == '' || calendario.data_evento == undefined || calendario.data_evento == null ||
                calendario.descricao == '' || calendario.descricao == undefined || calendario.descricao == null ||
                calendario.link == '' || calendario.link == undefined || calendario.link == null || calendario.link.length > 500 ||
                calendario.id_grupo == '' || calendario.id_grupo == undefined || calendario.id_grupo == null || isNaN(calendario.id_grupo)
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let result = await DAOCalendario.inserirCalendario(calendario)
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

const atualizarCalendario = async (id, calendario, contentType) => {
    try {
        console.log(calendario)
        if (contentType == 'application/json') {
            if (calendario.nome_evento == '' || calendario.nome_evento == undefined || calendario.nome_evento == null || calendario.nome_evento.length > 100 ||
                calendario.data_evento == '' || calendario.data_evento == undefined || calendario.data_evento == null ||
                calendario.descricao == '' || calendario.descricao == undefined || calendario.descricao == null ||
                calendario.link == '' || calendario.link == undefined || calendario.link == null || calendario.link.length > 500 ||
                calendario.id_grupo == '' || calendario.id_grupo == undefined || calendario.id_grupo == null || isNaN(calendario.id_grupo)
            ) {
                return message.ERROR_REQUIRED_FIELDS
            }
            let result = await DAOCalendario.selectCalendarioById(id)
            if (result != false || typeof (result) == 'object') {
                if (result.length > 0) {
                    calendario.id = parseInt(id)

                    let result = await DAOCalendario.updateCalendario(calendario)
                    if (result) {
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
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirCalendario = async function (id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {

            let results = await DAOCalendario.selectCalendarioById(parseInt(id))

            if (results != false || typeof (results) == 'object') {
                if (results.length > 0) {
                    let result = await DAOCalendario.deleteCalendario(parseInt(id))

                    if (result) {
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
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarCalendario = async function () {
    try {
        let dados = {}
        let result = await DAOCalendario.selectAllCalendario()
        if (result != false || typeof (result) == 'object') {

            if (result.length > 0) {
                dados.status = true
                dados.status_code = 200,
                dados.itens = result.length
                dados.Calendario = result
                return dados
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER ///500
    }
}

const buscarCalendario = async function (id) {
    let dados = {}
    try {
        if (id == '' || id == undefined || id == null || id < 0) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let result = await DAOCalendario.selectCalendarioById(id)
            if (result != false || typeof (result) == 'object') {
                if (result.length > 0) {
                    dados = {
                        status: true,
                        status_code: 200,
                        calendario: result
                    }
                    return dados
                } else {
                    return message.ERROR_NOT_FOUND //404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirCalendario,
    listarCalendario,
    buscarCalendario,
    excluirCalendario,
    atualizarCalendario,
}