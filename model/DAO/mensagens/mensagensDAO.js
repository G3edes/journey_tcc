const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir mensagem
const insertMensagem = async (dados) => {
  try {
    const result = await prisma.mensagem.create({
      data: {
        id_chat_room: dados.id_chat_room ? Number(dados.id_chat_room) : null,
        id_usuario: Number(dados.id_usuario),
        conteudo: String(dados.conteudo),
        enviado_em: new Date()
      }
    });

    return result; // retorna o objeto salvo
  } catch (error) {
    console.error("❌ Erro insertMensagem:", error);
    return false;
  }
};

// Listar todas as mensagens (ordenadas por envio)
const selectAllMensagens = async () => {
  try {
    const result = await prisma.mensagem.findMany({
      orderBy: { enviado_em: 'asc' }
    });
    return result; // array (pode ser vazio)
  } catch (error) {
    console.error('Erro selectAllMensagens:', error);
    return false;
  }
}

// Buscar mensagem por ID
const selectMensagemById = async (id) => {
  try {
    const result = await prisma.mensagem.findUnique({
      where: { id_mensagem: Number(id) }
    });
    return result || false;
  } catch (error) {
    console.error('Erro selectMensagemById:', error);
    return false;
  }
}

// Buscar mensagens por sala (chat_room)
const selectMensagensByChatRoom = async (id_chat_room) => {
  try {
    const result = await prisma.mensagem.findMany({
      where: { id_chat_room: Number(id_chat_room) },
      orderBy: { enviado_em: 'asc' }
    });
    return result; // array (pode ser vazio)
  } catch (error) {
    console.error('Erro selectMensagensByChatRoom:', error);
    return false;
  }
}

// Atualizar mensagem
const updateMensagem = async (id, dados) => {
  try {
    const result = await prisma.mensagem.update({
      where: { id_mensagem: Number(id) },
      data: { conteudo: String(dados.conteudo) }
    });
    return result ? true : false;
  } catch (error) {
    console.error('Erro updateMensagem:', error);
    return false;
  }
}

// Deletar mensagem
const deleteMensagem = async (id) => {
  try {
    const result = await prisma.mensagem.delete({
      where: { id_mensagem: Number(id) }
    });
    return result ? true : false;
  } catch (error) {
    console.error('Erro deleteMensagem:', error);
    return false;
  }
}

const selectMensagensPorSala = async (id_chat_room) => {
  try {
    console.log("DAO - buscando mensagens da sala:", id_chat_room);

    const mensagens = await prisma.mensagem.findMany({
      where: { id_chat_room: Number(id_chat_room) },
      orderBy: { enviado_em: 'asc' },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nome_completo: true,
            foto_perfil: true
          }
        }
      }
    });

    return mensagens; // array (pode ser vazio)
  } catch (error) {
    console.error("Erro no selectMensagensPorSala:", error);
    return false;
  }
}

module.exports = {
  insertMensagem,
  selectAllMensagens,
  selectMensagemById,
  selectMensagensByChatRoom,
  updateMensagem,
  deleteMensagem,
  selectMensagensPorSala
}
