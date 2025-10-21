const DAOChatParticipant = require('../../model/DAO/chat/chatParticipanteDAO.js')
const message = require('../../module/config.js')

// Inserir participante
const inserirChatParticipant = async (participante, contentType) => {
  try {
    if (contentType && contentType.includes('application/json')) {
      if (
        participante.id_chat_room == '' || participante.id_chat_room == undefined || participante.id_chat_room == null ||
        participante.id_usuario == '' || participante.id_usuario == undefined || participante.id_usuario == null
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let result = await DAOChatParticipant.insertChatParticipant(participante)
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

// Excluir participante
const excluirChatParticipant = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) return message.ERROR_REQUIRED_FIELDS

    let existente = await DAOChatParticipant.selectParticipantById(id)
    if (existente && typeof existente === 'object') {
      let result = await DAOChatParticipant.deleteParticipant(id)
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

// Listar participantes
const listarChatParticipants = async () => {
  try {
    let result = await DAOChatParticipant.selectAllParticipants()
    if (result && typeof result === 'object') {
      return {
        status: true,
        status_code: 200,
        itens: result.length,
        participantes: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar participante por ID
const buscarChatParticipant = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) return message.ERROR_REQUIRED_FIELDS

    let result = await DAOChatParticipant.selectParticipantById(id)
    if (result && typeof result === 'object') {
      return {
        status: true,
        status_code: 200,
        participante: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar por sala
const buscarParticipantsByChatRoom = async (id_chat_room) => {
  try {
    if (!id_chat_room || isNaN(id_chat_room) || id_chat_room <= 0)
      return message.ERROR_REQUIRED_FIELDS

    let result = await DAOChatParticipant.selectParticipantsByChatRoom(id_chat_room)
    if (result && typeof result === 'object') {
      return {
        status: true,
        status_code: 200,
        itens: result.length,
        participantes: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

module.exports = {
  inserirChatParticipant,
  excluirChatParticipant,
  listarChatParticipants,
  buscarChatParticipant,
  buscarParticipantsByChatRoom
}
