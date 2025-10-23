const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Criar nova sala de chat
const insertChatRoom = async (dados) => {
  try {
    const result = await prisma.chatRoom.create({
      data: {
        tipo: dados.tipo, // 'privado' ou 'grupo'
        id_grupo: dados.id_grupo ? Number(dados.id_grupo) : null
      }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro insertChatRoom:', error)
    return false
  }
}

// Listar todas as salas
const selectAllChatRooms = async () => {
  try {
    const result = await prisma.chatRoom.findMany({
      orderBy: { criado_em: 'desc' }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectAllChatRooms:', error)
    return false
  }
}

// Buscar sala por ID
const selectChatRoomById = async (id) => {
  try {
    const result = await prisma.chatRoom.findUnique({
      where: { id_chat_room: Number(id) }
    })
    return result ? result : false
  } catch (error) {
    console.error('Erro selectChatRoomById:', error)
    return false
  }
}
const getMensagensPorChatRoom = async (id_chat_room) => {
  try {
    const mensagens = await prisma.mensagem.findMany({
      where: { id_chat_room: Number(id_chat_room) },
      orderBy: { enviado_em: 'asc' }, // ordena por data/hora
      include: {
        usuario: { select: { id_usuario: true, nome_completo: true, foto_perfil: true } }
      }
    })

    return mensagens.length > 0 ? mensagens : null
  } catch (error) {
    console.error('Erro getMensagensPorChatRoom:', error)
    return null
  }
}
// Buscar salas por tipo
const selectChatRoomsByTipo = async (tipo) => {
  try {
    const result = await prisma.chatRoom.findMany({
      where: { tipo }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectChatRoomsByTipo:', error)
    return false
  }
}

// Deletar sala
const deleteChatRoom = async (id) => {
  try {
    const result = await prisma.chatRoom.delete({
      where: { id_chat_room: Number(id) }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro deleteChatRoom:', error)
    return false
  }
}

module.exports = {
  insertChatRoom,
  selectAllChatRooms,
  selectChatRoomById,
  selectChatRoomsByTipo,
  deleteChatRoom,
  getMensagensPorChatRoom
}
