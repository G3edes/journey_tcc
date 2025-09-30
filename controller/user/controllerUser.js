// Controller User (mix das duas abordagens, sem ";")

const DAOUser = require("../../model/DAO/user/userDAO.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const message = require("../../module/config.js")

// chave secreta JWT
const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_forte"

// Inserir usuário
const inserirUsuario = async (user, contentType) => {
  try {
    if (!contentType || !contentType.includes("application/json")) {
      return message.ERROR_CONTENT_TYPE // 415
    }
    if (
      !user.nome_completo || user.nome_completo.length > 150 ||
      !user.email || user.email.length > 100 ||
      !user.senha || user.senha.length > 100 ||
      !user.data_nascimento || isNaN(Date.parse(user.data_nascimento)) ||
      (user.foto_perfil && user.foto_perfil.length > 255) ||
      !user.tipo_usuario || !["Profissional", "Estudante"].includes(user.tipo_usuario)
    ) {
      return message.ERROR_REQUIRED_FIELDS // 400
    }

    // hash seguro da senha
    const hashed = await bcrypt.hash(user.senha, 10)

    const result = await DAOUser.inserirUsuario({
      ...user,
      senha: hashed,
    })

    if (result) {
      const lastId = await DAOUser.selectLastId()
      return {
        status: true,
        status_code: 201,
        UsuarioID: lastId,
        usuario: { ...user, senha: undefined }, // não retorna senha
      }
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL // 500
    }
  } catch (error) {
    console.error("----------inserirUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
  }
}

// Atualizar dados do usuário
const atualizarUsuario = async (id, user, contentType) => {
  try {
    if (contentType !== "application/json") {
      return message.ERROR_CONTENT_TYPE
    }

    if (
      !user.nome_completo || user.nome_completo.length > 150 ||
      !user.email || user.email.length > 100 ||
      (user.data_nascimento && isNaN(Date.parse(user.data_nascimento))) ||
      (user.foto_perfil && user.foto_perfil.length > 255) ||
      (user.tipo_usuario && !["Profissional", "Estudante"].includes(user.tipo_usuario))
    ) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const existe = await DAOUser.selectUsuarioById(id)
    if (!existe) {
      return message.ERROR_NOT_FOUND
    }

    user.id = parseInt(id)
    const result = await DAOUser.updateUsuario(user)
    if (result) {
      const usuarioAtualizado = await DAOUser.selectUsuarioById(id)
      return {
        status: true,
        status_code: 200,
        usuario: usuarioAtualizado
      }
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL
    }
  } catch (error) {
    console.error("----------atualizarUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Atualizar apenas senha
const atualizarSenhaUsuario = async (id, user, contentType) => {
  try {
    if (contentType !== "application/json") {
      return message.ERROR_CONTENT_TYPE
    }

    if (!user.senha || user.senha.length < 6 || user.senha.length > 100) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const existe = await DAOUser.selectUsuarioById(id)
    if (!existe) {
      return message.ERROR_NOT_FOUND
    }

    const hashed = await bcrypt.hash(user.senha, 10) //--- função da biblioteca bcryptjs que transforma a senha em um hash seguro.
    const result = await DAOUser.updateSenhaUsuario(id, hashed)
    if (result) {
      return message.SUCESS_UPDATED_ITEM
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL
    }
  } catch (error) {
    console.error("------------atualizarSenhaUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Login
const loginUsuario = async (dadosBody) => {
  try {
    const { email, senha } = dadosBody
    if (!email || !senha) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const usuario = await DAOUser.selectUsuarioByEmail(email)
    if (!usuario) {
      return message.ERROR_NOT_FOUND
    }

    const match = await bcrypt.compare(senha, usuario.senha)
    if (!match) {
      return { status_code: 401, message: "Senha incorreta" }
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, tipo: usuario.tipo_usuario },
      JWT_SECRET,
      { expiresIn: "2h" }
    )

    return {
      status: true,
      status_code: 200,
      message: "Login bem-sucedido",
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome_completo,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
      }
    }
  } catch (error) {
    console.error("🔥 loginUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Excluir
const excluirUsuario = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const existe = await DAOUser.selectUsuarioById(id)
    if (!existe) {
      return message.ERROR_NOT_FOUND
    }

    const result = await DAOUser.deleteUsuario(id)
    if (result) {
      return message.SUCCESS_DELETED_ITEM
    } else {
      return message.ERROR_INTERNAL_SERVER_MODEL
    }
  } catch (error) {
    console.error("🔥 excluirUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Listar todos
const listarUsuario = async () => {
  try {
    const result = await DAOUser.selectAllUsuario()
    if (result && result.length > 0) {
      return {
        status: true,
        status_code: 200,
        itens: result.length,
        usuario: result
      }
    } else {
      
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error("🔥 listarUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

// Buscar por ID
const buscarUsuario = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS
    }

    const result = await DAOUser.selectUsuarioById(id)
    if (result) {
      return {
        status: true,
        status_code: 200,
        usuario: result
      }
    } else {
      return message.ERROR_NOT_FOUND
    }
  } catch (error) {
    console.error("-----------buscarUsuario:", error)
    return message.ERROR_INTERNAL_SERVER_CONTROLLER
  }
}

module.exports = {
  inserirUsuario,
  atualizarUsuario,
  atualizarSenhaUsuario,
  excluirUsuario,
  listarUsuario,
  buscarUsuario,
  loginUsuario
}
