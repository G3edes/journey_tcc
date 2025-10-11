/*******************************************************************************************************************
 * Controller de Usuário-Grupo (corrigido)
 *******************************************************************************************************************/
const usuarioGrupoDAO = require("../../model/DAO/user/usuarioGrupoDAO.js");

// inseir
const inserirUsuarioGrupo = async (dados, contentType) => {
  try {
    if (contentType !== "application/json")
      return { status: false, status_code: 415, message: "Content-Type inválido" }

    if (!dados.id_usuario || !dados.id_grupo)
      return { status: false, status_code: 400, message: "Campos obrigatórios faltando" }

    // evita inserir duplicado
    const jaParticipa = await usuarioGrupoDAO.verificarParticipacao(Number(dados.id_usuario), Number(dados.id_grupo))
    if (jaParticipa) {
      return { status: false, status_code: 409, message: "Usuário já participa deste grupo" }
    }

    const result = await usuarioGrupoDAO.insertUsuarioGrupo(dados)
    return result
      ? { status: true, status_code: 201, message: "Usuário vinculado ao grupo com sucesso" }
      : { status: false, status_code: 500, message: "Erro ao vincular usuário" };
  } catch (error) {
    console.error("Erro inserirUsuarioGrupo:", error);
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}

// Listar todos
const listarUsuariosGrupos = async () => {
  try {
    const result = await usuarioGrupoDAO.selectAllUsuariosGrupos()
    return {
      status: true,
      status_code: 200,
      itens: result.length,
      usuarios_grupos: result
    };
  } catch (error) {
    console.error("Erro listarUsuariosGrupos:", error)
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}

// Buscar por ID
const buscarUsuarioGrupoPorId = async (id) => {
  try {
    const result = await usuarioGrupoDAO.selectUsuarioGrupoById(id)
    if (!result)
      return { status: false, status_code: 404, message: "Relação não encontrada" }

    return { status: true, status_code: 200, usuario_grupo: result }
  } catch (error) {
    console.error("Erro buscarUsuarioGrupoPorId:", error)
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}

// excluir por id do vínculo
const excluirUsuarioGrupo = async (id) => {
  try {
    const result = await usuarioGrupoDAO.deleteUsuarioGrupo(id)
    return result
      ? { status: true, status_code: 200, message: "Relação excluída com sucesso" }
      : { status: false, status_code: 404, message: "Relação não encontrada" }
  } catch (error) {
    console.error("Erro excluirUsuarioGrupo:", error)
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}

// atualizar vínculo
const atualizarUsuarioGrupo = async (id, dados, contentType) => {
  try {
    if (contentType !== "application/json")
      return { status: false, status_code: 415, message: "Content-Type inválido" }

    const result = await usuarioGrupoDAO.updateUsuarioGrupo(id, dados)
    return result
      ? { status: true, status_code: 200, message: "Relação atualizada" }
      : { status: false, status_code: 404, message: "Relação não encontrada" }
  } catch (error) {
    console.error("Erro atualizarUsuarioGrupo:", error)
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}

// listar grupos criados por um usuário
const listarGruposCriadosPorUsuario = async (idUsuario) => {
  try {
    const grupos = await usuarioGrupoDAO.selectGroupsCreatedByUser(idUsuario)
    return {
      status: true,
      status_code: 200,
      itens: grupos.length,
      grupos
    }
  } catch (error) {
    console.error("Erro listarGruposCriadosPorUsuario:", error)
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}

// Listar grupos que o usuário participa
const listarGruposPorUsuario = async (idUsuario) => {
  try {
    const grupos = await usuarioGrupoDAO.selectGroupsByUser(idUsuario)
    return {
      status: true,
      status_code: 200,
      itens: grupos.length,
      grupos
    }
  } catch (error) {
    console.error("Erro listarGruposPorUsuario:", error)
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}
// contar participantes de um grupo
const contarParticipantes = async (idGrupo) => {
  try {
    const total = await usuarioGrupoDAO.countParticipantesByGroup(idGrupo)
    return {
      status: true,
      status_code: 200,
      total
    };
  } catch (error) {
    console.error("Erro contarParticipantes:", error)
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}

// verificar se o usuário participa de um grupo 
const verificarParticipacao = async (id_usuario, id_grupo) => {
  try {
    // garante números
    const idUsuarioNum = Number(id_usuario)
    const idGrupoNum = Number(id_grupo)

    const participa = await usuarioGrupoDAO.verificarParticipacao(idUsuarioNum, idGrupoNum)

    return {
      status: true,
      status_code: 200,
      participa: !!participa
    }
  } catch (error) {
    console.error("Erro verificarParticipacao:", error)
    return { status: false, status_code: 500, message: "Erro interno no servidor" }
  }
}

//Sair do grupo
const sairDoGrupo = async (id_usuario, id_grupo) => {
  try {
    const idUsuarioNum = Number(id_usuario)
    const idGrupoNum = Number(id_grupo)

    const result = await usuarioGrupoDAO.deleteUsuarioGrupoByIds(idUsuarioNum, idGrupoNum)
    return result
      ? { status: true, status_code: 200, message: "usuário saiu do grupo com sucesso" }
      : { status: false, status_code: 404, message: "usuário não participa deste grupo" }
  } catch (error) {
    console.error("Erro sairDoGrupo:", error)
    return { status: false, status_code: 500, message: "erro interno no servidor" }
  }
}

module.exports = {
  inserirUsuarioGrupo,
  listarUsuariosGrupos,
  buscarUsuarioGrupoPorId,
  excluirUsuarioGrupo,
  atualizarUsuarioGrupo,
  listarGruposCriadosPorUsuario,
  listarGruposPorUsuario,
  contarParticipantes,
  verificarParticipacao,
  sairDoGrupo
};
