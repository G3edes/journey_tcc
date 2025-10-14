const mensagemDAO = require('../../model/DAO/mensagem/mensagemDAO.js')
const message = require('../../module/config.js')

// Inserir nova mensagem
const inserirMensagem = async (dados, contentType) => {
  try {
    if (!contentType || contentType !== "application/json") {
      return message.ERROR_CONTENT_TYPE
    } else {
      if (!dados || !dados.id_chat || !dados.id_usuario || !dados.conteudo) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        const payload = {
          id_chat: Number(dados.id_chat),
          id_usuario: Number(dados.id_usuario),
          conteudo: String(dados.conteudo)
        }

        const resInsert = await mensagemDAO.insertMensagem(payload)

        if (resInsert) {
          return message.SUCESS_CREATED_ITEM
        } else {
          return message.ERROR_INTERNAL_SERVER_MODEL
        }
      }
    }
  } catch (error) {
    console.error("Erro inserirMensagem:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Atualizar mensagem
const atualizarMensagem = async (id, dados, contentType) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      if (!contentType || contentType !== "application/json") {
        return message.ERROR_CONTENT_TYPE
      } else {
        if (!dados || !dados.conteudo) {
          return message.ERROR_REQUIRED_FIELDS
        } else {
          const mensagemExistente = await mensagemDAO.selectMensagemById(id)
          if (!mensagemExistente) {
            return message.ERROR_NOT_FOUND
          } else {
            const payload = { conteudo: String(dados.conteudo) }
            const result = await mensagemDAO.updateMensagem(id, payload)
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
    console.error("Erro atualizarMensagem:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Excluir mensagem
const excluirMensagem = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      const mensagem = await mensagemDAO.selectMensagemById(id)
      if (!mensagem) {
        return message.ERROR_NOT_FOUND
      } else {
        const result = await mensagemDAO.deleteMensagem(id)
        if (result) {
          return message.SUCCESS_DELETED_ITEM
        } else {
          return message.ERROR_INTERNAL_SERVER_MODEL
        }
      }
    }
  } catch (error) {
    console.error("Erro excluirMensagem:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar todas as mensagens
const listarMensagens = async () => {
  try {
    const mensagens = await mensagemDAO.selectAllMensagens()
    if (mensagens && mensagens.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: mensagens.length,
        mensagens
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error("Erro listarMensagens:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar mensagem por ID
const buscarMensagemPorId = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      const mensagem = await mensagemDAO.selectMensagemById(id)
      if (mensagem) {
        return { status: true, status_code: 200, mensagem }
      } else {
        return message.ERROR_NOT_FOUND
      }
    }
  } catch (error) {
    console.error("Erro buscarMensagemPorId:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

module.exports = {
  inserirMensagem,
  atualizarMensagem,
  excluirMensagem,
  listarMensagens,
  buscarMensagemPorId
}