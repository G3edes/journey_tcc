const grupoDAO = require('../../model/DAO/group/groupDAO.js')
const message = require('../../module/config.js')
const DAOChatRoom = require('../../model/DAO/chat/chatRoomDAO.js')

// Inserir novo grupo
const inserirGrupo = async (dados, contentType) => {
  try {
    if (contentType && contentType !== "application/json") {
      return message.ERROR_CONTENT_TYPE
    } else {
      if (!dados || !dados.nome || !dados.limite_membros || !dados.descricao) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        const id_usuario =
          dados.id_usuario ??
          dados.userId ??
          (dados.usuario && (dados.usuario.id_usuario ?? dados.usuario.id)) ??
          null

        if (!id_usuario) {
          return message.ERROR_REQUIRED_FIELDS
        } else {
          const payload = {
            nome: String(dados.nome),
            limite_membros: Number(dados.limite_membros),
            descricao: String(dados.descricao),
            imagem: dados.imagem ?? null,
            id_area: dados.id_area ?? null,
            id_usuario: Number(id_usuario)
          }
          console.log("Payload recebido:", payload)
          const resInsert = await grupoDAO.insertGrupo(payload)
          
          if (resInsert && resInsert.insertId) {
            const sala = {
              tipo: 'grupo',
              id_grupo: resInsert.insertId
            }
            const resChat = await DAOChatRoom.insertChatRoom(sala)
            console.log(resChat)
            if (resChat) {
              return {
                ...message.SUCESS_CREATED_ITEM,
                id_grupo: resInsert.insertId,
                chat_criado: true
              }
            } else {
              console.warn('Grupo criado, mas falhou ao criar sala de chat.')
              return {
                ...message.SUCESS_CREATED_ITEM,
                id_grupo: resInsert.insertId,
                chat_criado: false
              }
            }
          } else {
            return message.ERROR_INTERNAL_SERVER_MODEL
          }
        }
      }
    }
  } catch (error) {
    console.error("Erro inserirGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Atualizar grupo
const atualizarGrupo = async (id, grupo, contentType) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      if (contentType && contentType === "application/json") {
        if (!grupo || !grupo.nome || grupo.nome.length > 100) {
          return message.ERROR_REQUIRED_FIELDS
        } else {
          const grupoExistente = await grupoDAO.selectGrupoById(id)
          if (!grupoExistente) {
            return message.ERROR_NOT_FOUND
          } else {
            const payload = { ...grupo, id: parseInt(id) }
            const result = await grupoDAO.updateGrupo(payload)
            if (result) {
              return message.SUCESS_UPDATED_ITEM
            } else {
              return message.ERROR_INTERNAL_SERVER_MODEL
            }
          }
        }
      } else {
        return message.ERROR_CONTENT_TYPE
      }
    }
  } catch (error) {
    console.error("Erro atualizarGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Excluir grupo
const excluirGrupo = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      const grupoExistente = await grupoDAO.selectGrupoById(id)
      if (!grupoExistente) {
        return message.ERROR_NOT_FOUND
      } else {
        const result = await grupoDAO.deleteGrupo(id)
        if (result) {
          return message.SUCCESS_DELETED_ITEM
        } else {
          return message.ERROR_INTERNAL_SERVER_MODEL
        }
      }
    }
  } catch (error) {
    console.error("Erro excluirGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar todos os grupos
const listarGrupos = async () => {
  try {
    const grupos = await grupoDAO.selectAllGrupos()
    if (grupos && grupos.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: grupos.length,
        grupos
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error("Erro listarGrupos:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar grupo por ID
const buscarGrupoPorId = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    } else {
      const grupo = await grupoDAO.selectGrupoById(id)
      if (grupo) {
        return {
          status: true,
          status_code: 200,
          grupo
        }
      } else {
        return message.ERROR_NOT_FOUND
      }
    }
  } catch (error) {
    console.error("Erro buscarGrupoPorId:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}


// Buscar grupo + chat_room pelo ID
const getGrupoComChatRoom = async (id_grupo) => {
  // Validação do ID
  const id = Number(id_grupo)
  if (!id || isNaN(id) || id <= 0) {
    return { status: false, status_code: 400, message: 'ID de grupo inválido' }
  }

  try {
    const grupo = await grupoDAO.getGrupoComChatRoom(id)
    

    if (!grupo) {
      return message.ERROR_NOT_FOUND
    }

    return { status: true, status_code: 200, grupo }
  } catch (error) {
    console.error('Erro getGrupoComChatRoom controller:', error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}


module.exports = {
  inserirGrupo,
  atualizarGrupo,
  excluirGrupo,
  listarGrupos,
  buscarGrupoPorId,
  getGrupoComChatRoom
}
