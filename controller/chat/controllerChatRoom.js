const DAOChatRoom = require('../../model/DAO/chat/chatRoomDAO.js')
const message = require('../../module/config.js')

// Inserir sala
const inserirChatRoom = async (sala, contentType) => {
  try {
    if (contentType && contentType.includes('application/json')) {
      if (
        sala.tipo == '' || sala.tipo == undefined || sala.tipo == null ||
        (sala.tipo !== 'privado' && sala.tipo !== 'grupo')
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let result = await DAOChatRoom.insertChatRoom(sala)
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

// Atualizar (pode ser opcional dependendo da regra)
const atualizarChatRoom = async (id, sala, contentType) => {
  try {
    if (contentType && contentType.includes('application/json')) {
      if (
        sala.tipo == '' || sala.tipo == undefined || sala.tipo == null ||
        (sala.tipo !== 'privado' && sala.tipo !== 'grupo')
      ) {
        return message.ERROR_REQUIRED_FIELDS
      }

      let existente = await DAOChatRoom.selectChatRoomById(id)
      if (existente && typeof existente === 'object') {
        // atualiza apenas tipo e id_grupo
        let result = await DAOChatRoom.updateChatRoom(id, sala)
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

// Excluir sala
const excluirChatRoom = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) return message.ERROR_REQUIRED_FIELDS

    let existente = await DAOChatRoom.selectChatRoomById(id)
    if (existente && typeof existente === 'object') {
      let result = await DAOChatRoom.deleteChatRoom(id)
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

// Listar todas
const listarChatRooms = async () => {
  try {
    let result = await DAOChatRoom.selectAllChatRooms()
    if (result && typeof result === 'object') {
      return {
        status: true,
        status_code: 200,
        itens: result.length,
        salas: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error(error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar por ID
const buscarChatRoom = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) return message.ERROR_REQUIRED_FIELDS

    let result = await DAOChatRoom.selectChatRoomById(id)
    if (result && typeof result === 'object') {
      return {
        status: true,
        status_code: 200,
        sala: result
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
  inserirChatRoom,
  atualizarChatRoom,
  excluirChatRoom,
  listarChatRooms,
  buscarChatRoom
}
