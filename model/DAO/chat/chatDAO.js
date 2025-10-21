const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir novo chat
const insertChat = async (dados) => {
  try {
    const result = await prisma.tbl_chat.create({
      data: {
        tipo: dados.tipo,
        id_grupo: dados.id_grupo ? Number(dados.id_grupo) : null,
        remetente: dados.remetente ? Number(dados.remetente) : null,
        destinatario: dados.destinatario ? Number(dados.destinatario) : null
      }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro insertChat:', error)
    return false
  }
}

// Listar todos os chats
const selectAllChats = async () => {
  try {
    const result = await prisma.tbl_chat.findMany({
      orderBy: { criado_em: 'desc' }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectAllChats:', error)
    return false
  }
}

// Buscar chat por ID
const selectChatById = async (id) => {
  try {
    const result = await prisma.tbl_chat.findUnique({
      where: { id_chat: Number(id) }
    })
    return result ? result : false
  } catch (error) {
    console.error('Erro selectChatById:', error)
    return false
  }
}

// Atualizar chat
const updateChat = async (id, dados) => {
  try {
    const result = await prisma.tbl_chat.update({
      where: { id_chat: Number(id) },
      data: {
        tipo: dados.tipo,
        id_grupo: dados.id_grupo ? Number(dados.id_grupo) : null,
        remetente: dados.remetente ? Number(dados.remetente) : null,
        destinatario: dados.destinatario ? Number(dados.destinatario) : null
      }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro updateChat:', error)
    return false
  }
}

// Deletar chat
const deleteChat = async (id) => {
  try {
    const result = await prisma.tbl_chat.delete({
      where: { id_chat: Number(id) }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro deleteChat:', error)
    return false
  }
}

module.exports = {
  insertChat,
  selectAllChats,
  selectChatById,
  updateChat,
  deleteChat
}