/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de calendario
 * DATA: 04/11/2025
 * AUTOR: Gabriel Guedes
 * Versão: 2.0
 **************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir calendário
// Inserir calendário
const inserirCalendario = async (dados) => {
  try {
    const created = await prisma.calendario.create({
      data: {
        nome_evento: dados.nome_evento,
        data_evento: new Date(dados.data_evento), // recebe data + hora juntos
        descricao: dados.descricao,
        link: dados.link ?? null,
        id_grupo: Number(dados.id_grupo),
        id_usuario: Number(dados.id_usuario)
      }
    })
    return created ? true : false
  } catch (error) {
    console.error('Erro ao inserir calendário:', error)
    return false
  }
}

// Atualizar calendário
const updateCalendario = async (dados) => {
  try {
    const updated = await prisma.calendario.update({
      where: { id_calendario: Number(dados.id_calendario) },
      data: {
        nome_evento: dados.nome_evento,
        data_evento: new Date(dados.data_evento),
        descricao: dados.descricao,
        link: dados.link,
        id_grupo: Number(dados.id_grupo),
        id_usuario: Number(dados.id_usuario)
      }
    })
    return updated ? true : false
  } catch (error) {
    console.error('Erro ao atualizar calendário:', error)
    return false
  }
}

// Deletar calendário
const deleteCalendario = async (id) => {
  try {
    const deleted = await prisma.calendario.delete({
      where: { id_calendario: Number(id) }
    })
    return deleted ? true : false
  } catch (error) {
    console.error('Erro ao deletar calendário:', error)
    return false
  }
}

// Listar todos os calendários
const selectAllCalendario = async () => {
  try {
    const result = await prisma.calendario.findMany({
      orderBy: { data_evento: 'desc' },
      include: { grupo: true } // inclui dados do grupo
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro ao listar calendários:', error)
    return false
  }
}

// Buscar calendário por ID
const selectCalendarioById = async (id) => {
  try {
    const result = await prisma.calendario.findUnique({
      where: { id_calendario: Number(id) },
      include: { grupo: true }
    })
    return result || false
  } catch (error) {
    console.error('Erro ao buscar calendário por ID:', error)
    return false
  }
}

module.exports = {
  inserirCalendario,
  updateCalendario,
  deleteCalendario,
  selectAllCalendario,
  selectCalendarioById
}