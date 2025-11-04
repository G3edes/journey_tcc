const DAOMensagem = require('../../model/DAO/mensagens/mensagensDAO.js')
const message = require('../../module/config.js')

// Inserir mensagem
const inserirMensagem = async (mensagem, contentType) => {
  try {
    if (contentType && contentType.includes('application/json')) {

      if (
        mensagem.id_chat_room == '' || mensagem.id_chat_room == undefined || mensagem.id_chat_room == null ||
        mensagem.id_usuario == '' || mensagem.id_usuario == undefined || mensagem.id_usuario == null ||
        mensagem.conteudo == '' || mensagem.conteudo == undefined || mensagem.conteudo == null
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let result = await DAOMensagem.insertMensagem(mensagem)
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
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Atualizar mensagem
const atualizarMensagem = async (id, mensagem, contentType) => {
  try {
    if (contentType && contentType.includes('application/json')) {

      if (mensagem.conteudo == '' || mensagem.conteudo == undefined || mensagem.conteudo == null) {
        return message.ERROR_REQUIRED_FIELDS
      }

      let existente = await DAOMensagem.selectMensagemById(id)
      if (existente && typeof existente === 'object') {
        let result = await DAOMensagem.updateMensagem(id, mensagem)
        if (result) {
          return message.SUCESS_UPDATED_ITEM
        } else {
          return message.ERROR_INTERNAL_SERVER_MODEL
        }
      } else {
        return message.ERROR_NOT_FOUND
      }

    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Excluir mensagem
const excluirMensagem = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    }

    let existente = await DAOMensagem.selectMensagemById(id)
    if (existente && typeof existente === 'object') {
      let result = await DAOMensagem.deleteMensagem(id)
      if (result) {
        return message.SUCCESS_DELETED_ITEM
      } else {
        return message.ERROR_INTERNAL_SERVER_MODEL
      }
    } else {
      return message.ERROR_NOT_FOUND
    }

  } catch (error) {
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar todas as mensagens
const listarMensagens = async () => {
  try {
    let result = await DAOMensagem.selectAllMensagens()
    if (result && typeof result === 'object') {
      return {
        status: true,
        status_code: 200,
        itens: result.length,
        mensagens: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar mensagem por ID
const buscarMensagem = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    }

    let result = await DAOMensagem.selectMensagemById(id)
    if (result && typeof result === 'object') {
      return {
        status: true,
        status_code: 200,
        mensagem: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}
const listarMensagensPorSala = async (id_chat_room) => {
  try {
    console.log("Controller - buscando mensagens da sala:", id_chat_room)

    const mensagens = await DAOMensagem.selectMensagensPorSala(id_chat_room)

    if (mensagens && mensagens.length > 0) {
      return {
        status_code: 200,
        mensagens
      }
    } else {
      return {
        status_code: 404,
        message: "Nenhuma mensagem encontrada para esta sala"
      }
    }
  } catch (error) {
    console.error("Erro listarMensagensPorSala:", error)
    return {
      status_code: 500,
      message: "Erro ao buscar mensagens"
    }
  }
}

module.exports = {
  inserirMensagem,
  listarMensagens,
  buscarMensagem,
  excluirMensagem,
  atualizarMensagem,
  listarMensagensPorSala // ✅ exportação da nova função
}