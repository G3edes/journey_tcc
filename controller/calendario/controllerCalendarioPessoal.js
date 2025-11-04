/***************************************************************************************************************************
 * OBJETIVO: Controlar as regras de negócio de calendario_pessoal
 * DATA: 04/11/2025
 * AUTOR: Gabriel Guedes
 * Versão: 1.0
 **************************************************************************************************************************/

const DAOCalendarioPessoal = require('../../model/DAO/calendario/calendarioPessoalDAO.js')
const message = require('../../module/config.js')

// Inserir vínculo de calendário pessoal
const inserirCalendarioPessoal = async (dados, contentType) => {
  try {
    if (!contentType || !contentType.includes('application/json')) {
      return message.ERROR_CONTENT_TYPE
    }

    if (!dados.id_calendario || !dados.id_usuario || isNaN(dados.id_calendario) || isNaN(dados.id_usuario)) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const result = await DAOCalendarioPessoal.inserirCalendarioPessoal(dados)
    return result ? message.SUCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL
  } catch (error) {
    console.error('Erro inserirCalendarioPessoal:', error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Atualizar vínculo de calendário pessoal
const atualizarCalendarioPessoal = async (id, dados, contentType) => {
  try {
    if (!contentType || !contentType.includes('application/json')) {
      return message.ERROR_CONTENT_TYPE
    }

    if (!dados.id_calendario || !dados.id_usuario || isNaN(dados.id_calendario) || isNaN(dados.id_usuario)) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const existente = await DAOCalendarioPessoal.selectCalendarioPessoalById(id)
    if (!existente) return message.ERROR_NOT_FOUND

    dados.id_calendario_pessoal = Number(id)
    const result = await DAOCalendarioPessoal.updateCalendarioPessoal(dados)
    return result ? message.SUCESS_UPDATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL
  } catch (error) {
    console.error('Erro atualizarCalendarioPessoal:', error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Excluir vínculo de calendário pessoal
const excluirCalendarioPessoal = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const existente = await DAOCalendarioPessoal.selectCalendarioPessoalById(id)
    if (!existente) return message.ERROR_NOT_FOUND

    const result = await DAOCalendarioPessoal.deleteCalendarioPessoal(id)
    return result ? message.SUCCESS_DELETED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL
  } catch (error) {
    console.error('Erro excluirCalendarioPessoal:', error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar todos os vínculos
const listarCalendarioPessoal = async () => {
  try {
    const result = await DAOCalendarioPessoal.selectAllCalendarioPessoal()
    if (result && result.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: result.length,
        calendario_pessoal: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error('Erro listarCalendarioPessoal:', error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar vínculo por ID
const buscarCalendarioPessoal = async (id) => {
  try {
    if (!id || isNaN(id)) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const result = await DAOCalendarioPessoal.selectCalendarioPessoalById(id)
    if (result) {
      return {
        status: true,
        status_code: 200,
        calendario_pessoal: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error('Erro buscarCalendarioPessoal:', error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

module.exports = {
  inserirCalendarioPessoal,
  atualizarCalendarioPessoal,
  excluirCalendarioPessoal,
  listarCalendarioPessoal,
  buscarCalendarioPessoal
}
