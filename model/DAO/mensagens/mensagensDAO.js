const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir mensagem
const insertMensagem = async (dados) => {
  try {
    const result = await prisma.mensagem.create({
      data: {
        id_chat_room: Number(dados.id_chat_room),
        id_usuario: Number(dados.id_usuario),
        conteudo: String(dados.conteudo),
        enviado_em: new Date() // 🔥 adiciona o timestamp atual
      }
    });

    return result; // retorna o objeto salvo (não só true/false)
  } catch (error) {
    console.error("❌ Erro insertMensagem:", error);
    return false;
  }
};


// Listar todas as mensagens (ordenadas por envio)
const selectAllMensagens = async () => {
  try {
    const result = await prisma.Mensagem.findMany({
      orderBy: { enviado_em: 'asc' }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectAllMensagens:', error)
    return false
  }
}

// Buscar mensagem por ID
const selectMensagemById = async (id) => {
  try {
    const result = await prisma.Mensagem.findUnique({
      where: { id_mensagem: Number(id) }
    })
    return result ? result : false
  } catch (error) {
    console.error('Erro selectMensagemById:', error)
    return false
  }
}

// Buscar mensagens por sala (chat_room)
const selectMensagensByChatRoom = async (id_chat_room) => {
  try {
    const result = await prisma.Mensagem.findMany({
      where: { id_chat_room: Number(id_chat_room) },
      orderBy: { enviado_em: 'asc' }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectMensagensByChatRoom:', error)
    return false
  }
}

// Atualizar mensagem
const updateMensagem = async (id, dados) => {
  try {
    const result = await prisma.Mensagem.update({
      where: { id_mensagem: Number(id) },
      data: { conteudo: String(dados.conteudo) }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro updateMensagem:', error)
    return false
  }
}

// Deletar mensagem
const deleteMensagem = async (id) => {
  try {
    const result = await prisma.Mensagem.delete({
      where: { id_mensagem: Number(id) }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro deleteMensagem:', error)
    return false
  }
}

const selectMensagensPorSala = async (id_chat_room) => {
  try {
    console.log("DAO - buscando mensagens da sala:", id_chat_room)

    const mensagens = await prisma.mensagem.findMany({
      where: {
        id_chat_room: Number(id_chat_room) // 👈 força a conversão para Int
      },
      orderBy: {
        id_mensagem: 'asc'
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nome_completo: true,
            foto_perfil: true
          }
        }
      }
    })

    return mensagens
  } catch (error) {
    console.error("Erro no selectMensagensPorSala:", error)
    return false
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