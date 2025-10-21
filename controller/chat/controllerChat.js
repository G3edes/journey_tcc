const chatDAO = require('../../model/DAO/chat/chatDAO.js')
const message = require('../../module/config.js')

// Inserir novo chat
const inserirChat = async (dados, contentType) => {
  try {
    if (!contentType || contentType !== "application/json") {
      return message.ERROR_CONTENT_TYPE
    } else {
      if (
        !dados ||
        !dados.tipo ||
        (dados.tipo !== 'publico' && dados.tipo !== 'privado')
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        const payload = {
          tipo: String(dados.tipo),
          id_grupo: dados.id_grupo ? Number(dados.id_grupo) : null,
          remetente: dados.remetente ? Number(dados.remetente) : null,
          destinatario: dados.destinatario ? Number(dados.destinatario) : null
        }

        const resInsert = await chatDAO.insertChat(payload)

        if (resInsert) {
          return message.SUCESS_CREATED_ITEM
        } else {
          return message.ERROR_INTERNAL_SERVER_MODEL
        }
      }
    }
  } catch (error) {
    console.error("Erro inserirChat:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Atualizar chat
const atualizarChat = async (id, dados, contentType) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      if (!contentType || contentType !== "application/json") {
        return message.ERROR_CONTENT_TYPE
      } else {
        if (
          !dados ||
          !dados.tipo ||
          (dados.tipo !== 'publico' && dados.tipo !== 'privado')
        ) {
          return message.ERROR_REQUIRED_FIELDS
        } else {
          const chatExistente = await chatDAO.selectChatById(id)
          if (!chatExistente) {
            return message.ERROR_NOT_FOUND
          } else {
            const payload = {
              tipo: String(dados.tipo),
              id_grupo: dados.id_grupo ? Number(dados.id_grupo) : null,
              remetente: dados.remetente ? Number(dados.remetente) : null,
              destinatario: dados.destinatario ? Number(dados.destinatario) : null
            }

            const result = await chatDAO.updateChat(id, payload)
            if (result) {
              return message.SUCESS_UPDATED_ITEM
            } else {
              return message.ERROR_INTERNAL_SERVER_MODEL
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Erro atualizarChat:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Excluir chat
const excluirChat = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      const chat = await chatDAO.selectChatById(id)
      if (!chat) {
        return message.ERROR_NOT_FOUND
      } else {
        const result = await chatDAO.deleteChat(id)
        if (result) {
          return message.SUCCESS_DELETED_ITEM
        } else {
          return message.ERROR_INTERNAL_SERVER_MODEL
        }
      }
    }
  } catch (error) {
    console.error("Erro excluirChat:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar todos os chats
const listarChats = async () => {
  try {
    const chats = await chatDAO.selectAllChats()
    if (chats && chats.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: chats.length,
        chats
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error("Erro listarChats:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar chat por ID
const buscarChatPorId = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      const chat = await chatDAO.selectChatById(id)
      if (chat) {
        return { status: true, status_code: 200, chat }
      } else {
        return message.ERROR_NOT_FOUND
      }
    }
  } catch (error) {
    console.error("Erro buscarChatPorId:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

module.exports = {
  inserirChat,
  atualizarChat,
  excluirChat,
  listarChats,
  buscarChatPorId
}