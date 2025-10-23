const DAOCalendario = require('../../model/DAO/calendario/calendarioDAO.js')

const message = require('../../module/config.js')

const inserirCalendario = async (calendario, contentType) => {
    try {
        if (!contentType || !contentType.includes('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }
        // Validação de campos obrigatórios
        if (!calendario.nome_evento || !calendario.data_evento || !calendario.descricao ||
            !calendario.id_grupo || !calendario.id_usuario ||
            calendario.nome_evento.length > 100 || (calendario.link && calendario.link.length > 500) ||
            isNaN(calendario.id_grupo) || isNaN(calendario.id_usuario)
        ) {
            return message.ERROR_REQUIRED_FIELDS
        }
        

        const result = await DAOCalendario.inserirCalendario(calendario)
        return result ? message.SUCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        console.error('Erro inserirCalendario:', error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarCalendario = async (id, calendario, contentType) => {
    try {
        if (!contentType || !contentType.includes('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        // Validação de campos obrigatórios
        if (!calendario.nome_evento || !calendario.data_evento || !calendario.hora_evento ||
            !calendario.descricao || !calendario.id_grupo || !calendario.id_usuario ||
            calendario.nome_evento.length > 100 || (calendario.link && calendario.link.length > 500) ||
            isNaN(calendario.id_grupo) || isNaN(calendario.id_usuario)
        ) {
            return message.ERROR_REQUIRED_FIELDS
        }

        // Verifica se o evento existe
        const existente = await DAOCalendario.selectCalendarioById(id)
        if (!existente) return message.ERROR_NOT_FOUND

        calendario.id_calendario = Number(id)
        const result = await DAOCalendario.updateCalendario(calendario)
        return result ? message.SUCESS_UPDATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        console.error('Erro atualizarCalendario:', error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const excluirCalendario = async function (id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {

            let results = await DAOCalendario.selectCalendarioById(parseInt(id))

            if (results != false) {
                if (typeof (results) == 'object') {
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