/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de calendario
 * DATA: 16/10/2025
 * AUTOR: Gabriel Silva Guedes
 * Versão: 3.0
 **************************************************************************************************************************/

// Import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

// Instancia o Prisma Client
const prisma = new PrismaClient()
// supondo que no schema.prisma exista: model tbl_calendario { id_calendario Int @id @default(autoincrement()) ... }
const inserirCalendario = async (dados) => {
    try {
      const created = await prisma.tbl_calendario.create({
        data: {
          nome_evento: dados.nome_evento,
          data_evento: dados.data_evento,
          hora_evento: dados.hora_evento,
          descricao: dados.descricao
        }
      })
      return created ? true : false
    } catch (error) {
      console.error('Erro ao inserir calendário:', error)
      return false
    }
  }
  
const updateCalendario = async (dados) => {
    try {
      const updated = await prisma.tbl_calendario.update({
        where: { id_calendario: Number(dados.id_calendario) },
        data: {
          nome_evento: dados.nome_evento,
          data_evento: dados.data_evento,
          hora_evento: dados.hora_evento,
          descricao: dados.descricao
        }
      })
      return updated ? true : false
    } catch (error) {
      console.error('Erro ao atualizar calendário:', error)
      return false
    }
}
  
const deleteCalendario = async (id) => {
    try {
      const deleted = await prisma.tbl_calendario.delete({
        where: { id_calendario: Number(id) }
      })
      return deleted ? true : false
    } catch (error) {
      console.error('Erro ao deletar calendário:', error)
      return false
    }
}
  
const selectAllCalendario = async () => {
    try {
      const rows = await prisma.tbl_calendario.findMany({
        orderBy: { data_evento: 'desc' }
      })
      return rows.length ? rows : false
    } catch (error) {
      console.error('Erro ao listar calendários:', error)
      return false
    }
}
  
const selectCalendarioById = async (id) => {
    try {
      const row = await prisma.tbl_calendario.findUnique({
        where: { id_calendario: Number(id) }
      })
      return row || false
    } catch (error) {
      console.error('Erro ao buscar calendário por ID:', error)
      return false
    }
}

module.exports={
    selectAllCalendario,
    selectCalendarioById,
    deleteCalendario,
    updateCalendario,
    inserirCalendario
}