const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir mensagem
const insertMensagem = async (dados) => {
  try {
    const result = await prisma.tbl_mensagem.create({
      data: {
        id_chat: Number(dados.id_chat),
        id_usuario: Number(dados.id_usuario),
        conteudo: dados.conteudo
      }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro insertMensagem:', error)
    return false
  }
}

// Listar todas as mensagens
const selectAllMensagens = async () => {
  try {
    const result = await prisma.tbl_mensagem.findMany({
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
    const result = await prisma.tbl_mensagem.findUnique({
      where: { id_mensagem: Number(id) }
    })
    return result ? result : false
  } catch (error) {
    console.error('Erro selectMensagemById:', error)
    return false
  }
}

// Atualizar mensagem
const updateMensagem = async (id, dados) => {
  try {
    const result = await prisma.tbl_mensagem.update({
      where: { id_mensagem: Number(id) },
      data: {
        conteudo: dados.conteudo
      }
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
    const result = await prisma.tbl_mensagem.delete({
      where: { id_mensagem: Number(id) }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro deleteMensagem:', error)
    return false
  }
}

module.exports = {
  insertMensagem,
  selectAllMensagens,
  selectMensagemById,
  updateMensagem,
  deleteMensagem
}