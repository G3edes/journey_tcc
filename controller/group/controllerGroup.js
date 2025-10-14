const grupoDAO = require('../../model/DAO/group/groupDAO.js') 
const message = require('../../module/config.js') 

// Inserir novo grupo
const inserirGrupo = async (dados, contentType) => {
  try {
    if (contentType && contentType !== "application/json")
      return { status: false, status_code: 415, message: "Content-Type inválido" }

    if (!dados || !dados.nome || !dados.limite_membros || !dados.descricao)
      return { status: false, status_code: 400, message: "Campos obrigatórios faltando" }

    const id_usuario =
      dados.id_usuario ??
      dados.userId ??
      (dados.usuario && (dados.usuario.id_usuario ?? dados.usuario.id)) ??
      null;

    if (!id_usuario) return { status: false, status_code: 400, message: "id_usuario é obrigatório" }

    const payload = {
      nome: String(dados.nome),
      limite_membros: Number(dados.limite_membros),
      descricao: String(dados.descricao),
      imagem: dados.imagem ?? null,
      id_area: dados.id_area ?? null,
      id_usuario: Number(id_usuario)
    }

    console.log("inserirGrupo payload:", payload)

    const resInsert = await grupoDAO.insertGrupo(payload)

    console.log("resInsert:", resInsert)

    if (resInsert && resInsert.insertId) {
      return { status: true, status_code: 201, message: "Grupo criado", id_grupo: resInsert.insertId }
    }

    if (resInsert && (resInsert.ok || resInsert.affected)) {
      return { status: true, status_code: 201, message: "Grupo criado" }
    }

    return { status: false, status_code: 500, message: "Erro ao criar grupo" }
  } catch (error) {
    console.error("Erro inserirGrupo:", error);
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}


// Atualizar grupo
const atualizarGrupo = async (id, grupo, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            if (
                !grupo.nome || grupo.nome.length > 100 ||
                (grupo.imagem && grupo.imagem.length > 255) ||
                (grupo.limite_membros && isNaN(grupo.limite_membros)) ||
                !grupo.id_usuario || grupo.id_usuario.length > 100 ||
                !grupo.id_area || grupo.id_area.length > 100
            ) {
                return message.ERROR_REQUIRED_FIELDS
            }

            let grupoExistente = await grupoDAO.selectGrupoById(id)
            if (!grupoExistente) return message.ERROR_NOT_FOUND

            grupo.id = parseInt(id)
            let result = await grupoDAO.updateGrupo(grupo)
            if (result) {
                let grupoAtualizado = await grupoDAO.selectGrupoById(id)
                return {
                    status: true,
                    status_code: 200,
                    grupo: grupoAtualizado
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Excluir grupo
const excluirGrupo = async (id) => {
    try {
        if (!id || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        }

        let grupo = await grupoDAO.selectGrupoById(id)
        if (!grupo) return message.ERROR_NOT_FOUND

        let result = await grupoDAO.deleteGrupo(id)
        if (result) {
            return message.SUCCESS_DELETED_ITEM
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Listar todos os grupos
const listarGrupos = async () => {
    try {
        let grupos = await grupoDAO.selectAllGrupos()
        if (grupos && grupos.length > 0) {
            return {
                status: true,
                status_code: 200,
                itens: grupos.length,
                grupos: grupos
            }
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Buscar grupo por ID
const buscarGrupoPorId = async (id) => {
    try {
        if (!id || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        }

        let grupo = await grupoDAO.selectGrupoById(id)
        if (grupo) {
            return {
                status: true,
                status_code: 200,
                grupo: grupo
            }
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
inserirGrupo,
atualizarGrupo,
excluirGrupo,
listarGrupos,
buscarGrupoPorId
}
