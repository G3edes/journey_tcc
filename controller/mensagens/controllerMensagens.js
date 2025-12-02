const DAOMensagem = require('../../model/DAO/mensagens/mensagensDAO.js');
const message = require('../../module/config.js');

// Inserir mensagem
const inserirMensagem = async (mensagem, contentType) => {
  try {
    if (!contentType || !contentType.includes("application/json"))
      return message.ERROR_CONTENT_TYPE;

    if (
      mensagem.id_chat_room == '' || mensagem.id_chat_room == undefined || mensagem.id_chat_room == null ||
      mensagem.id_usuario == '' || mensagem.id_usuario == undefined || mensagem.id_usuario == null ||
      mensagem.conteudo == '' || mensagem.conteudo == undefined || mensagem.conteudo == null
    ) {
      return message.ERROR_REQUIRED_FIELDS;
    }

    const result = await DAOMensagem.insertMensagem(mensagem);

    if (result) {
      // result é o objeto criado
      return {
        status: true,
        status_code: 201,
        mensagem: result
      };
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL;
    }
  } catch (error) {
    console.error("Erro inserirMensagem:", error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Listar mensagens por sala
const listarMensagensPorSala = async (id_chat_room) => {
  try {
    const id = Number(id_chat_room);
    if (!id || isNaN(id)) {
      return { status_code: 400, message: "ID do chat inválido", mensagens: [] };
    }

    const mensagens = await DAOMensagem.selectMensagensPorSala(id);

    if (mensagens === false) {
      return { status_code: 500, message: "Devido a erros internos no servidor da MODEL, não foi possível processar a requisição", mensagens: [] };
    }

    // Retornar sempre array (pode estar vazio)
    return { status_code: 200, mensagens: mensagens || [] };
  } catch (error) {
    console.error("Erro listarMensagensPorSala:", error);
    return { status_code: 500, message: "Erro ao buscar mensagens", mensagens: [] };
  }
};

module.exports = {
  inserirMensagem,
  listarMensagensPorSala
};
