const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir participante
const insertChatParticipant = async (dados) => {
  try {
    const result = await prisma.tbl_chat_participant.create({
      data: {
        id_chat_room: Number(dados.id_chat_room),
        id_usuario: Number(dados.id_usuario)
      }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro insertChatParticipant:', error)
    return false
  }
}

// Listar todos os participantes
const selectAllParticipants = async () => {
  try {
    const result = await prisma.tbl_chat_participant.findMany()
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectAllParticipants:', error)
    return false
  }
}

// Buscar participante por ID
const selectParticipantById = async (id) => {
  try {
    const result = await prisma.tbl_chat_participant.findUnique({
      where: { id_participante: Number(id) }
    })
    return result ? result : false
  } catch (error) {
    console.error('Erro selectParticipantById:', error)
    return false
  }
}

// Buscar participantes por sala
const selectParticipantsByChatRoom = async (id_chat_room) => {
  try {
    const result = await prisma.tbl_chat_participant.findMany({
      where: { id_chat_room: Number(id_chat_room) }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectParticipantsByChatRoom:', error)
    return false
  }
}

// Remover participante
const deleteParticipant = async (id) => {
  try {
    const result = await prisma.tbl_chat_participant.delete({
      where: { id_participante: Number(id) }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro deleteParticipant:', error)
    return false
  }
}

module.exports = {
  insertChatParticipant,
  selectAllParticipants,
  selectParticipantById,
  selectParticipantsByChatRoom,
  deleteParticipant
}
