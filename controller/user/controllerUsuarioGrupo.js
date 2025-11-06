/*******************************************************************************************************************
 * CONTROLLER: Usuário-Grupo (padronizada)
 * DATA: 14/10/2025
 * AUTOR: Gabriel Silva Guedes 
 ******************************************************************************************************************/

const usuarioGrupoDAO = require("../../model/DAO/user/usuarioGrupoDAO.js")
const message = require("../../module/config.js")

// Inserir vínculo usuário-grupo
const inserirUsuarioGrupo = async (dados, contentType) => {
  try {
    if (!contentType || !contentType.includes("application/json"))
      return message.ERROR_CONTENT_TYPE

    if (!dados.id_usuario || !dados.id_grupo)
      return message.ERROR_REQUIRED_FIELDS

    const jaParticipa = await usuarioGrupoDAO.verificarParticipacao(
      Number(dados.id_usuario),
      Number(dados.id_grupo)
    )

    if (jaParticipa)
      return { status: false, status_code: 409, message: "Usuário já participa deste grupo" }

    const result = await usuarioGrupoDAO.insertUsuarioGrupo(dados)
    if (result)
      return { status: true, status_code: 201, message: "Usuário vinculado ao grupo com sucesso" }
    else
      return message.ERROR_INTERNAL_SERVER_MODEL
  } catch (error) {
    console.error("🔥 inserirUsuarioGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar todos os vínculos
const listarUsuarioGrupo = async () => {
  try {
    const result = await usuarioGrupoDAO.selectAllUsuariosGrupos()
    if (result && result.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: result.length,
        usuario_grupo: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error("🔥 listarUsuarioGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar vínculo por ID
const buscarUsuarioGrupo = async (id) => {
  try {
    if (!id || isNaN(id))
      return message.ERROR_REQUIRED_FIELDS

    const result = await usuarioGrupoDAO.selectUsuarioGrupoById(id)
    if (result)
      return { status: true, status_code: 200, usuario_grupo: result }
    else
      return message.ERROR_NOT_FOUND
  } catch (error) {
    console.error("🔥 buscarUsuarioGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Atualizar vínculo
const atualizarUsuarioGrupo = async (id, dados, contentType) => {
  try {
    if (!contentType || !contentType.includes("application/json"))
      return message.ERROR_CONTENT_TYPE

    if (!id || isNaN(id))
      return message.ERROR_REQUIRED_FIELDS

    const result = await usuarioGrupoDAO.updateUsuarioGrupo(id, dados)
    if (result)
      return message.SUCESS_UPDATED_ITEM
    else
      return message.ERROR_NOT_FOUND
  } catch (error) {
    console.error("🔥 atualizarUsuarioGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Excluir vínculo (por ID do relacionamento)
const excluirUsuarioGrupo = async (id) => {
  try {
    if (!id || isNaN(id))
      return message.ERROR_REQUIRED_FIELDS

    const result = await usuarioGrupoDAO.deleteUsuarioGrupo(id)
    if (result)
      return message.SUCCESS_DELETED_ITEM
    else
      return message.ERROR_NOT_FOUND
  } catch (error) {
    console.error("🔥 excluirUsuarioGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Verificar se o usuário participa de um grupo
const verificarParticipacao = async (id_usuario, id_grupo) => {
  try {
    const idUsuarioNum = Number(id_usuario)
    const idGrupoNum = Number(id_grupo)

    const participa = await usuarioGrupoDAO.verificarParticipacao(idUsuarioNum, idGrupoNum)
    return {
      status: true,
      status_code: 200,
      participa: !!participa
    }
  } catch (error) {
    console.error("🔥 verificarParticipacao:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Sair do grupo
const sairDoGrupo = async (id_usuario, id_grupo) => {
  try {
    const idUsuarioNum = Number(id_usuario)
    const idGrupoNum = Number(id_grupo)

    const result = await usuarioGrupoDAO.deleteUsuarioGrupoByIds(idUsuarioNum, idGrupoNum)
    if (result)
      return { status: true, status_code: 200, message: "Usuário saiu do grupo com sucesso" }
    else
      return message.ERROR_NOT_FOUND
  } catch (error) {
    console.error("🔥 sairDoGrupo:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar grupos que o usuário participa
const listarGruposPorUsuario = async (idUsuario) => {
  try {
    if (!idUsuario || isNaN(idUsuario))
      return message.ERROR_REQUIRED_FIELDS

    const grupos = await usuarioGrupoDAO.selectGroupsByUser(idUsuario)
    if (grupos && grupos.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: grupos.length,
        grupos
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error("🔥 listarGruposPorUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar grupos criados por um usuário
const listarGruposCriadosPorUsuario = async (idUsuario) => {
  try {
    if (!idUsuario || isNaN(idUsuario))
      return message.ERROR_REQUIRED_FIELDS

    const grupos = await usuarioGrupoDAO.selectGroupsCreatedByUser(idUsuario)
    if (grupos && grupos.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: grupos.length,
        grupos
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error("🔥 listarGruposCriadosPorUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Contar participantes do grupo
const contarParticipantes = async (idGrupo) => {
  try {
    if (!idGrupo || isNaN(idGrupo))
      return message.ERROR_REQUIRED_FIELDS

    const total = await usuarioGrupoDAO.countParticipantesByGroup(idGrupo)
    return {
      status: true,
      status_code: 200,
      total
    }
  } catch (error) {
    console.error("🔥 contarParticipantes:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}


// ✅ Listar participantes de um grupo
const listarParticipantesDoGrupo = async (req, res) => {
  try {
    const id_grupo = Number(req.params.id_grupo);
    if (!id_grupo) return res.status(400).json({ message: "ID inválido." });

    const participantes = await usuarioGrupoDAO.listarParticipantesPorGrupo(id_grupo);

    if (!participantes.length) {
      return res.status(200).json({ participantes: [] });
    }

    return res.status(200).json({ participantes });
  } catch (error) {
    console.error("Erro listarParticipantesDoGrupo:", error);
    return res.status(500).json({ message: "Erro interno ao listar participantes." });
  }
};

// ❌ Remover participante (somente criador pode)
const removerParticipante = async (req, res) => {
  try {
    // aceita tanto JSON no body quanto query (fallback)
    const id_grupo = Number(req.body.id_grupo ?? req.query.id_grupo);
    const id_usuario_removido = Number(req.body.id_usuario_removido ?? req.query.id_usuario_removido);
    const id_usuario_logado = Number(req.body.id_usuario_logado ?? req.query.id_usuario_logado);

    if (!id_grupo || !id_usuario_removido || !id_usuario_logado) {
      return res.status(400).json({ status: false, message: "Dados inválidos: id_grupo, id_usuario_removido e id_usuario_logado são obrigatórios." });
    }

    // 1) verifica se usuário logado é o criador
    const ehCriador = await usuarioGrupoDAO.verificarSeEhCriador(id_usuario_logado, id_grupo);
    if (!ehCriador) {
      return res.status(403).json({ status: false, message: "Apenas o criador pode remover participantes." });
    }

    // 2) não permitir remover o próprio criador (proteção extra)
    const removerEHcriador = await usuarioGrupoDAO.verificarSeEhCriador(id_usuario_removido, id_grupo);
    if (removerEHcriador) {
      return res.status(400).json({ status: false, message: "Não é permitido remover o criador do grupo." });
    }

    // 3) tenta deletar
    const delRes = await usuarioGrupoDAO.deleteUsuarioGrupoByIds(id_usuario_removido, id_grupo);
    if (delRes.ok && delRes.affected > 0) {
      return res.status(200).json({ status: true, message: "Participante removido com sucesso." });
    } else {
      return res.status(404).json({ status: false, message: delRes.message || "Participante não encontrado no grupo." });
    }
  } catch (error) {
    console.error("❌ Erro removerParticipante controller:", error);
    return res.status(500).json({ status: false, message: "Erro interno ao remover participante.", error: error.message });
  }
};


module.exports = {
  inserirUsuarioGrupo,
  listarUsuarioGrupo,
  buscarUsuarioGrupo,
  atualizarUsuarioGrupo,
  excluirUsuarioGrupo,
  verificarParticipacao,
  sairDoGrupo,
  listarGruposPorUsuario,
  listarGruposCriadosPorUsuario,
  contarParticipantes,
  listarParticipantesDoGrupo,
  removerParticipante
}
