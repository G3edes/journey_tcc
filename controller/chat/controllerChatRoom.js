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


const getMensagensChat = async (id_chat_room) => {
  const id = Number(id_chat_room)
  if (!id || isNaN(id) || id <= 0) {
    return { status: false, status_code: 400, message: 'ID do chat inválido' }
  }

  try {
    const mensagens = await DAOChatRoom.getMensagensPorChatRoom(id)

    if (!mensagens) {
      return { status: false, status_code: 404, message: 'Nenhuma mensagem encontrada' }
    }

    return { status: true, status_code: 200, mensagens }
  } catch (error) {
    console.error('Erro getMensagensChat controller:', error)
    return { status: false, status_code: 500, message: message.ERROR_INTERNAL_SERVER_CONTROLLER }
  }
}

module.exports = { getMensagensChat }


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

const obterOuCriarSalaPrivada = async (req, res) => {
  try {
    const { id_usuario1, id_usuario2 } = req.body;

    if (!id_usuario1 || !id_usuario2)
      return res.status(400).json({ message: 'IDs de usuário obrigatórios.' });

    // 1️⃣ Verifica se já existe uma sala entre esses usuários
    let sala = await DAOChatRoom.findPrivateChatBetweenUsers(id_usuario1, id_usuario2);

    if (sala) {
      console.log('✅ Sala privada existente encontrada:', sala.id_chat_room);
      return res.status(200).json({ sala });
    }

    // 2️⃣ Se não existir, cria uma nova
    sala = await DAOChatRoom.createPrivateChatRoom(id_usuario1, id_usuario2);

    if (!sala) {
      return res.status(500).json({ message: 'Erro ao criar sala privada.' });
    }

    console.log('✅ Nova sala privada criada:', sala.id_chat_room);
    return res.status(201).json({ sala });
  } catch (error) {
    console.error('Erro obterOuCriarSalaPrivada:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

const listarConversasPrivadas = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const salas = await DAOChatRoom.getConversasPrivadasPorUsuario(id_usuario);
    if (!salas || salas.length === 0) {
      return res.status(200).json({ conversas: [] });
    }

    const conversas = salas.map((sala) => {
      // pega o outro usuário (não o logado)
      const outro = sala.participantes.find(p => p.id_usuario !== Number(id_usuario))?.usuario || {};

      const ultima = sala.mensagens?.[0] || {};

      return {
        id_chat_room: sala.id_chat_room,
        contato: {
          id_usuario: outro.id_usuario,
          nome_completo: outro.nome_completo,
          foto_perfil: outro.foto_perfil,
        },
        ultima_mensagem: ultima.conteudo || "",
        atualizado_em: ultima.enviado_em || sala.criado_em,
      };
    });

    return res.status(200).json({ conversas });
  } catch (error) {
    console.error("❌ Erro listarConversasPrivadas:", error);
    return res.status(500).json({ message: "Erro interno ao listar conversas." });
  }
};


module.exports = {
  inserirChatRoom,
  atualizarChatRoom,
  excluirChatRoom,
  listarChatRooms,
  buscarChatRoom,
  getMensagensChat,
  obterOuCriarSalaPrivada,
  listarConversasPrivadas
}
