const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Criar nova sala de chat
const insertChatRoom = async (dados) => {
  try {
    const result = await prisma.tbl_chat_room.create({
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
    const result = await prisma.tbl_chat_room.findMany({
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
    const result = await prisma.tbl_chat_room.findUnique({
      where: { id_chat_room: Number(id) }
    })
    return result ? result : false
  } catch (error) {
    console.error('Erro selectChatRoomById:', error)
    return false
  }
}

// Buscar salas por tipo
const selectChatRoomsByTipo = async (tipo) => {
  try {
    const result = await prisma.tbl_chat_room.findMany({
      where: { tipo: tipo }
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
    const result = await prisma.tbl_chat_room.delete({
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
  deleteChatRoom
}
