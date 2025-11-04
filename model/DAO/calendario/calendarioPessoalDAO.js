/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de calendario_pessoal
 * DATA: 04/11/2025
 * AUTOR: Gabriel Guedes
 * Versão: 1.0
 **************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um calendário pessoal
const inserirCalendarioPessoal = async (dados) => {
  try {
    const created = await prisma.calendario_pessoal.create({
      data: {
        id_calendario: Number(dados.id_calendario),
        id_usuario: Number(dados.id_usuario)
      }
    })
    return created ? true : false
  } catch (error) {
    console.error('Erro ao inserir calendario_pessoal:', error)
    return false
  }
}

// Atualizar calendário pessoal (caso seja necessário trocar o usuário ou calendário)
const updateCalendarioPessoal = async (dados) => {
  try {
    const updated = await prisma.calendario_pessoal.update({
      where: { id_calendario_pessoal: Number(dados.id_calendario_pessoal) },
      data: {
        id_calendario: Number(dados.id_calendario),
        id_usuario: Number(dados.id_usuario)
      }
    })
    return updated ? true : false
  } catch (error) {
    console.error('Erro ao atualizar calendario_pessoal:', error)
    return false
  }
}

// Excluir um calendário pessoal
const deleteCalendarioPessoal = async (id) => {
  try {
    const deleted = await prisma.calendario_pessoal.delete({
      where: { id_calendario_pessoal: Number(id) }
    })
    return deleted ? true : false
  } catch (error) {
    console.error('Erro ao deletar calendario_pessoal:', error)
    return false
  }
}

// Listar todos os vínculos de calendário pessoal
const selectAllCalendarioPessoal = async () => {
  try {
    const result = await prisma.calendario_pessoal.findMany({
      include: {
        calendario: true,
        usuario: true
      },
      orderBy: { id_calendario_pessoal: 'desc' }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro ao listar calendario_pessoal:', error)
    return false
  }
}

// Buscar vínculo de calendário pessoal por ID
const selectCalendarioPessoalById = async (id) => {
  try {
    const result = await prisma.calendario_pessoal.findUnique({
      where: { id_calendario_pessoal: Number(id) },
      include: {
        calendario: true,
        usuario: true
      }
    })
    return result || false
  } catch (error) {
    console.error('Erro ao buscar calendario_pessoal por ID:', error)
    return false
  }
}

module.exports = {
  inserirCalendarioPessoal,
  updateCalendarioPessoal,
  deleteCalendarioPessoal,
  selectAllCalendarioPessoal,
  selectCalendarioPessoalById
}
