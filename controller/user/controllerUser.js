const DAOUser = require('../../model/DAO/user/userDAO.js')
/*
const controllerEvento = require('../evento/controllerEvento.js')
const controllerEventoUsuario = require('../evento/controllerParticiparEvento.js')
*/
const message = require('../../module/config.js')

const inserirUsuario = async (user, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            let dados = {}
            if (
                !user.nome_completo || user.nome_completo.length > 150 ||
                !user.email || user.email.length > 100 ||
                !user.senha || user.senha.length > 25 ||
                !user.data_nascimento || isNaN(Date.parse(user.data_nascimento)) ||
                (user.foto_perfil && user.foto_perfil.length > 255) ||
                !user.tipo_usuario || !['Profissional', 'Estudante'].includes(user.tipo_usuario)) {

                return message.ERROR_REQUIRED_FIELDS
            } else {
                let result = await DAOUser.inserirUsuario(user)
                if (result) {
                    let lastid = await DAOUser.selectLastId()
                    dados = {
                        status: true,
                        status_code: 200,
                        UsuarioID: lastid,
                        usuario: user
                    }
                    return dados
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

const atualizarUsuario = async (id, user, contentType) => {
    try {
        dados = {}
        if (contentType == 'application/json') {
            if (
                !user.nome_completo || user.nome_completo.length > 150 ||
                !user.email || user.email.length > 100 ||
                !user.senha || user.senha.length > 25 ||
                !user.data_nascimento || isNaN(Date.parse(user.data_nascimento)) ||
                (user.foto_perfil && user.foto_perfil.length > 255) ||
                !user.tipo_usuario || !['Profissional', 'Estudante'].includes(user.tipo_usuario)) {
                return message.ERROR_REQUIRED_FIELDS
            }
            let result = await DAOUser.selectusuarioById(id)
            if (result != false || typeof (result) == 'object') {
                if (result.length > 0) {
                    user.id = parseInt(id)

                    let result = await DAOUser.updateUsuario(user)
                    let usuarioAtualizado = await DAOUser.selectusuarioById(id)
                    if (result) {
                        dados.status = true
                        dados.status_code = 200,
                            dados.usuario = usuarioAtualizado
                        return dados
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
const atualizarSenhaUsuario = async (id, user, contentType) => {
    try {

        if (contentType == 'application/json') {
            if (user.senha == '' || user.senha == undefined || user.senha == null || user.senha.length > 100) {
                return message.ERROR_REQUIRED_FIELDS
            }
            let result = await DAOUser.selectusuarioById(id)
            if (result != false || typeof (result) == 'object') {
                if (result.length > 0) {
                    user.id = parseInt(id)

                    let result = await DAOUser.updateSenhaUsuario(user)
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
const excluirUsuario = async function (id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {

            //função que verifica se ID existe no BD
            let results = await DAOUser.selectusuarioById(parseInt(id))

            if (results != false || typeof (results) == 'object') {
                //se exestir, faremos o delete
                if (results.length > 0) {
                    //delete    
                    let result = await DAOUser.deleteUsuario(parseInt(id))

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

const listarUsuario = async function () {
    try {
        let arrayEventos = []
        let dados = {}
        let result = await DAOUser.selectAllUsuario()
        if (result != false || typeof (result) == 'object') {

            if (result.length > 0) {
                dados.status = true
                dados.status_code = 200,
                    dados.itens = result.length
                dados.usuario = result
                /*
                                for (const itemUsuario of result) {
                                    /* Monta o objeto da classificação para retornar no Filme (1XN) 
                                    //Busca os dados da classificação na controller de classificacao
                                    let dadosEvento = await controllerEvento.buscarEvento(itemUsuario.id_evento)
                                    //Adiciona um atributo classificação no JSON de filmes e coloca os dados da classificação
                                    itemUsuario.evento = dadosEvento.evento
                                    //Remover um atributo do JSON
                                    delete itemUsuario.id_evento
                                    
                                    let eventos = await controllerEventoUsuario.buscarEventoPorUsuario(itemUsuario.id_usuario)
                                    itemUsuario.eventos = eventos
                                    
                                    
                
                                    arrayEventos.push(itemUsuario)
                                }
                                
                                
                */
                return dados

            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
        //cha,a a funcao para retornarusuarios cadastrados
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER ///500
    }
}

const buscarUsuario = async function (id) {
    let dados = {}
    let arrayEventos = []
    try {
        if (id == '' || id == undefined || id == null || id < 0
        ) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let result = await DAOUser.selectusuarioById(id)
            if (result != false || typeof (result) == 'object') {
                if (result.length > 0) {
                    dados.status = true,
                        dados.status_code = 200,
                        dados.usuario = result

                    /*for (const itemUsuario of result) {
                        /* Monta o objeto da classificação para retornar no Filme (1XN) *
                        //Busca os dados da classificação na controller de classificacao
                        let dadosEvento = await controllerEvento.buscarEvento(itemUsuario.id_evento)
                        //Adiciona um atributo classificação no JSON de filmes e coloca os dados da classificação
                        itemUsuario.evento = dadosEvento.evento
                        //Remover um atributo do JSON
                        delete itemUsuario.id_evento
                        
                        let eventos = await controllerEventoUsuario.buscarEventoPorUsuario(itemUsuario.id_usuario)
                        itemUsuario.eventos = eventos
                        
                        
    
                        arrayEventos.push(itemUsuario)
                    }
                        */
                    return dados

                } else {
                    return message.ERROR_NOT_FOUND//404
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

const buscarUsuarioEvento = async function (id) {
    let dados = {}
    try {

        if (id == '' || id == undefined || id == null || id < 0
        ) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let result = await DAOUser.selectEventoByIdEstado(id)
            if (result != false || typeof (result) == 'object') {
                if (result.length > 0) {
                    dados = {
                        status: true,
                        status_code: 200,
                        evento: result
                    }
                    return dados
                } else {
                    return message.ERROR_NOT_FOUND//404
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
    inserirUsuario,
    listarUsuario,
    buscarUsuario,
    excluirUsuario,
    atualizarUsuario,
    atualizarSenhaUsuario,
    buscarUsuarioEvento
}