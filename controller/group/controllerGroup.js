const grupoDAO = require('../../model/DAO/group/groupDAO.js');
const message = require('../../module/config.js');
const DAOChatRoom = require('../../model/DAO/chat/chatRoomDAO.js');

// ========================================================
// INSERIR NOVO GRUPO (com criação automática de chat_room)
// ========================================================
const inserirGrupo = async (dados, contentType) => {
  try {
    // 1️⃣ Verifica o tipo de conteúdo
    if (contentType && contentType !== "application/json") {
      return message.ERROR_CONTENT_TYPE;
    }

    // 2️⃣ Verifica campos obrigatórios
    if (!dados || !dados.nome || !dados.limite_membros || !dados.descricao) {
      return message.ERROR_REQUIRED_FIELDS;
    }

    // 3️⃣ Identifica o usuário criador
    const id_usuario =
      dados.id_usuario ??
      dados.userId ??
      (dados.usuario && (dados.usuario.id_usuario ?? dados.usuario.id)) ??
      null;

    if (!id_usuario) return message.ERROR_REQUIRED_FIELDS;

    // 4️⃣ Monta payload do grupo
    const payload = {
      nome: String(dados.nome),
      limite_membros: Number(dados.limite_membros),
      descricao: String(dados.descricao),
      imagem: dados.imagem ?? null,
      id_area: dados.id_area ?? null,
      id_usuario: Number(id_usuario)
    };

    console.log("📦 Payload recebido para criação de grupo:", payload);

    // 5️⃣ Insere o grupo
    const resInsert = await grupoDAO.insertGrupo(payload);

    if (resInsert && resInsert.insertId) {
      const novoId = resInsert.insertId;
      console.log(`✅ Grupo criado com ID ${novoId}`);

      // 6️⃣ Cria automaticamente o ChatRoom (tipo grupo)
      const sala = { tipo: 'grupo', id_grupo: novoId };
      console.log("📦 Criando ChatRoom com dados:", sala);

      // Criar a sala diretamente (não existe selectChatRoomByGrupoId no DAO atual)
      const resChat = await DAOChatRoom.insertChatRoom(sala);

      // Verifica se a criação retornou um objeto válido
      if (resChat && resChat.id_chat_room) {
        console.log("✅ ChatRoom criada com sucesso:", resChat);
        return {
          ...message.SUCESS_CREATED_ITEM,
          id_grupo: novoId,
          chat_criado: true,
          chat_room: resChat
        };
      } else {
        console.warn("⚠️ Grupo criado, mas falhou ao criar ChatRoom. Retorno:", resChat);
        return {
          ...message.SUCESS_CREATED_ITEM,
          id_grupo: novoId,
          chat_criado: false
        };
      }
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL;
    }
  } catch (error) {
    console.error("❌ Erro inserirGrupo:", error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// ========================================================
// ATUALIZAR GRUPO
// ========================================================
const atualizarGrupo = async (id, grupo, contentType) => {
  try {
    if (!id || isNaN(id) || id <= 0) return message.ERROR_REQUIRED_FIELDS;

    if (contentType && contentType === "application/json") {
      if (!grupo || !grupo.nome || grupo.nome.length > 100) {
        return message.ERROR_REQUIRED_FIELDS;
      }

      const grupoExistente = await grupoDAO.selectGrupoById(id);
      if (!grupoExistente) return message.ERROR_NOT_FOUND;

      const payload = { ...grupo, id: parseInt(id) };
      const result = await grupoDAO.updateGrupo(payload);

      return result ? message.SUCESS_UPDATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL;
    } else {
      return message.ERROR_CONTENT_TYPE;
    }
  } catch (error) {
    console.error("❌ Erro atualizarGrupo:", error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// ========================================================
// EXCLUIR GRUPO
// ========================================================
const excluirGrupo = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) return message.ERROR_REQUIRED_FIELDS;

    const grupoExistente = await grupoDAO.selectGrupoById(id);
    if (!grupoExistente) return message.ERROR_NOT_FOUND;

    const result = await grupoDAO.deleteGrupo(id);
    return result ? message.SUCCESS_DELETED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL;
  } catch (error) {
    console.error("❌ Erro excluirGrupo:", error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// ========================================================
// LISTAR TODOS OS GRUPOS
// ========================================================
const listarGrupos = async () => {
  try {
    const grupos = await grupoDAO.selectAllGrupos();
    if (grupos && grupos.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: grupos.length,
        grupos
      };
    }
    return message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error("❌ Erro listarGrupos:", error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// ========================================================
// BUSCAR GRUPO POR ID
// ========================================================
const buscarGrupoPorId = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) return message.ERROR_REQUIRED_FIELDS;

    const grupo = await grupoDAO.selectGrupoById(id);
    if (grupo) {
      return {
        status: true,
        status_code: 200,
        grupo
      };
    }
    return message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error("❌ Erro buscarGrupoPorId:", error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// ========================================================
// BUSCAR GRUPO + CHAT_ROOM PELO ID
// ========================================================
const getGrupoComChatRoom = async (id_grupo) => {
  const id = Number(id_grupo);
  if (!id || isNaN(id) || id <= 0) {
    return { status: false, status_code: 400, message: 'ID de grupo inválido' };
  }

  try {
    const grupo = await grupoDAO.getGrupoComChatRoom(id);
    if (!grupo) return message.ERROR_NOT_FOUND;

    return { status: true, status_code: 200, grupo };
  } catch (error) {
    console.error('❌ Erro getGrupoComChatRoom controller:', error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

module.exports = {
  inserirGrupo,
  atualizarGrupo,
  excluirGrupo,
  listarGrupos,
  buscarGrupoPorId,
  getGrupoComChatRoom
};
