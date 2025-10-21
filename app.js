/*******************************************************************************************************
 * OBJETIVO: Criar uma API para realizar o CRUD do sistema de Eventos                                  *                                                                                  *
 * AUTOR: Gabriel Guedes                                                                               *
 * Versão: 1.0                                                                                         *
 * Observação:                                                                                         *
 *          Para criar a API precisamos instalar:                                                      *
 *                 express             npm install express --save                                      *
 *                 cors                npm install cors --save                                         *
 *                 body-parser         npm install body-parser --save                                  *
 *                                                                                                     *
 *          Para criar a integração com o Banco de Dados precisamos instalar:                          *
 *                 prisma               npm install prisma --save(para fazer a conexão com o BD)       *
 *                 prisma/client        npm install @prisma/client --save (para rodar os scripts SQL)  *
 *                                                                                                     *  
 *                                                                                                     *
 *          Após a instalação do prima e do prisma client, devemos :                                   *
 *              npx prisma init                                                                        *
 *                                                                                                     *
 *                                                                                                     *
 *          Você deverá configurar o arquivo .env e o schema.prisma com as credenciais do BD           *
 *          Após essa configuração voce deverá rodar o seguinte comando:                               *
 *                      npx prisma migrate dev                                                         *
 *                                                                                                     *
 *          Instalar o NodeMailer para mandar os emails                                                *
 *                                                                                                     *
 *          npm install nodemailer                                                                     *
 *                                                                                                     *
 *          npm install dotenv                                                                         *
 *                                                                                                     *
 *          Instalação do gitmoji para melhora de commits                                              *                             
 *              npm install -save-dev gitmoji-cli                                                      *                    
 *          Efetuação do commit:                                                                       *
 *              npx gitmoji -c                                                                         *
 *                                                                                                     *
 *          Instalação do bcrypt para criptografia                                                     *
 *              npm install bcryptjs                                                                   *
 *                                                                                                     *
 *          Instalação do jsonwebtoken para gerar token                                                *
 *              npm install jsonwebtoken                                                               *
 *                                                                                                     *
 *          Instalação do socket para gerenciar mensagens                                              *
 *              npm install socket.io                                                                  *
 ******************************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()
const app = express()

// aumenta o limite de tamanho do corpo das requisições
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// para se for usar o bodyparser (opcional)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));


// Corrige erro de BigInt -> JSON
BigInt.prototype.toJSON = function () {
    return this.toString();
};

app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

app.use("/uploads", express.static("uploads"));

app.use(express.json())


// aumenta o limite de tamanho do corpo das requisições
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// para se for usar o bodyparser (opcional)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));


// Corrige erro de BigInt -> JSON
BigInt.prototype.toJSON = function () {
    return this.toString();
};


/*******************************************************************************************************************
 * 
 *                                  USUARIO
 * 
 ********************************************************************************************************************/
const controllerUser = require('./controller/user/controllerUser')

const controllerRecuperarSenha = require('./controller/user/controllerRecuperarSenha')

app.post('/v1/journey/usuario', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //recebe do body da requisição os dados encaminhados


    let dadosBody = request.body
    let result = await controllerUser.inserirUsuario(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/journey/usuario/senha/:id', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //recebe do body da requisição os dados encaminhados

    let id = request.params.id
    //body da requisição
    let dadosBody = request.body
    let result = await controllerUser.atualizarSenhaUsuario(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/usuario', cors(), async function (request, response) {
    let result = await controllerUser.listarUsuario()
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/usuario/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerUser.buscarUsuario(id)
    response.status(result.status_code)
    response.json(result)
})
app.post('/v1/journey/usuario/login', cors(), async function (request, response) {
    try {
        let dadosBody = request.body
        let result = await controllerUser.loginUsuario(dadosBody)

        response.status(result.status_code || 500)
        response.json(result)
    } catch (error) {
        console.error("🔥 endpoint /login:", error)
        response.status(500).json({ status: false, message: "Erro interno no servidor" })
    }
})
app.delete('/v1/journey/usuario/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerUser.excluirUsuario(id)

    response.status(result.status_code)
    response.json(result)
})




app.post('/v1/journey/recuperar-senha', cors(), bodyParserJSON, controllerRecuperarSenha.enviarCodigo);
app.post('/v1/journey/validar-codigo', cors(), bodyParserJSON, controllerRecuperarSenha.validarCodigo);



/*******************************************************************************************************************
 * 
 *                                  GRUPOS
 * 
 *******************************************************************************************************************/

const controllerGroup = require('./controller/group/controllerGroup')

app.post('/v1/journey/group', cors(), bodyParserJSON, async (request, response) => {
    const contentType = request.headers['content-type']
    const dadosBody = request.body

    const result = await controllerGroup.inserirGrupo(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})

// Listar todos os grupos
app.get('/v1/journey/group', cors(), async (request, response) => {
    const result = await controllerGroup.listarGrupos()
    response.status(result.status_code)
    response.json(result)
})

// Buscar grupo por ID
app.get('/v1/journey/group/:id', cors(), async (request, response) => {
    const id = request.params.id
    const result = await controllerGroup.buscarGrupoPorId(id)
    response.status(result.status_code)
    response.json(result)
})

// Atualizar grupo
app.put('/v1/journey/group/:id', cors(), bodyParserJSON, async (request, response) => {
    const contentType = request.headers['content-type']
    const id = request.params.id
    const dadosBody = request.body

    const result = await controllerGroup.atualizarGrupo(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})

// Excluir grupo
app.delete('/v1/journey/group/:id', cors(), async (request, response) => {
    const id = request.params.id
    const result = await controllerGroup.excluirGrupo(id)

    response.status(result.status_code)
    response.json(result)
})

/*******************************************************************************************************************
 * 
 *                                  CATEGORIA
 * 
 *******************************************************************************************************************/

const controllerCategoria = require('./controller/category/controllerCategoria')

app.post('/v1/journey/categoria', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //recebe do body da requisição os dados encaminhados


    let dadosBody = request.body
    let result = await controllerCategoria.inserirCategoria(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/categoria', cors(), async function (request, response) {
    let result = await controllerCategoria.listarCategoria()
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/categoria/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerCategoria.buscarCategoria(id)
    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/journey/categoria/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerCategoria.excluirCategoria(id)

    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/journey/categoria/:id', cors(), bodyParserJSON, async function (request, response) {
    //content-type requisição
    let contentType = request.headers['content-type']
    //id da requisção
    let id = request.params.id
    //body da requisição
    let dadosBody = request.body
    let result = await controllerCategoria.atualizarCategoria(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})

/*******************************************************************************************************************
 * 
 *                                  AREA
 * 
 *******************************************************************************************************************/
const controllerArea = require('./controller/area/controllerArea')

app.post('/v1/journey/area', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //recebe do body da requisição os dados encaminhados


    let dadosBody = request.body
    let result = await controllerArea.inserirArea(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/area', cors(), async function (request, response) {
    let result = await controllerArea.listarArea()
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/area/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerArea.buscarArea(id)
    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/journey/area/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerArea.excluirArea(id)

    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/journey/area/:id', cors(), bodyParserJSON, async function (request, response) {
    //content-type requisição
    let contentType = request.headers['content-type']
    //id da requisção
    let id = request.params.id
    //body da requisição
    let dadosBody = request.body
    let result = await controllerArea.atualizarArea(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})



/*******************************************************************************************************************
 * 
 *                                  USUARIO GRUPO
 * 
 *******************************************************************************************************************/
const controllerUsuarioGrupo = require('./controller/user/controllerUsuarioGrupo')

// Inserir novo relacionamento
app.post('/v1/journey/usuario-grupo', cors(), bodyParserJSON, async (req, res) => {
    const contentType = req.headers['content-type']
    const dadosBody = req.body

    const result = await controllerUsuarioGrupo.inserirUsuarioGrupo(dadosBody, contentType)
    res.status(result.status_code).json(result)
})

// Listar todos os relacionamentos
app.get('/v1/journey/usuario-grupo', cors(), async (req, res) => {
    const result = await controllerUsuarioGrupo.listarUsuariosGrupos()
    res.status(result.status_code).json(result)
})

// Buscar relacionamento por ID
app.get('/v1/journey/usuario-grupo/:id', cors(), async (req, res) => {
    const id = req.params.id
    const result = await controllerUsuarioGrupo.buscarUsuarioGrupoPorId(id)
    res.status(result.status_code).json(result)
})

// Excluir relacionamento
app.delete('/v1/journey/usuario-grupo/:id', cors(), async (req, res) => {
    const id = req.params.id
    const result = await controllerUsuarioGrupo.excluirUsuarioGrupo(id)
    res.status(result.status_code).json(result)
})

// Atualizar relacionamento
app.put('/v1/journey/usuario-grupo/:id', cors(), bodyParserJSON, async (req, res) => {
    const contentType = req.headers['content-type']
    const id = req.params.id
    const dadosBody = req.body

    const result = await controllerUsuarioGrupo.atualizarUsuarioGrupo(id, dadosBody, contentType)
    res.status(result.status_code).json(result)
})

/*******************************************************************************************************************
 * 
 *                                  ROTAS ESPECÍFICAS DE GRUPOS
 * 
 *******************************************************************************************************************/

app.get('/v1/journey/group/:id/status', cors(), async function (request, response) {
    try {
        let id_grupo = parseInt(request.params.id)
        let id_usuario = parseInt(request.query.userId)

        if (!id_usuario)
            return response.status(400).json({ status: false, message: "userId é obrigatório" })

        let grupoRes = await controllerGroup.buscarGrupoPorId(id_grupo)

        if (grupoRes && grupoRes.grupo) {
            let grupo = grupoRes.grupo
            if (parseInt(grupo.id_usuario) === id_usuario) {
                return response.status(200).json({ status: true, relation: 'criador', grupo })
            }
        }

        let participa = await controllerUsuarioGrupo.verificarParticipacao(id_usuario, id_grupo)
        if (participa && participa.participa) {
            return response.status(200).json({ status: true, relation: 'participante' })
        }

        return response.status(200).json({ status: true, relation: 'nenhum' })
    } catch (error) {
        console.error("Erro /group/:id/status:", error)
        response.status(500).json({ status: false, message: "Erro interno no servidor" })
    }
})

// ✅ Entrar no grupo
app.post('/v1/journey/group/:id/join', cors(), bodyParserJSON, async function (request, response) {
    try {
        let id_grupo = parseInt(request.params.id)
        let { id_usuario } = request.body

        if (!id_usuario)
            return response.status(400).json({ status: false, message: "id_usuario é obrigatório" })

        let payload = { id_usuario, id_grupo }
        let result = await controllerUsuarioGrupo.inserirUsuarioGrupo(payload, 'application/json')

        response.status(result.status_code || 201)
        response.json(result)
    } catch (error) {
        console.error("Erro /group/:id/join:", error)
        response.status(500).json({ status: false, message: "Erro interno" })
    }
})

// ✅ Sair do grupo
app.delete('/v1/journey/group/:id/leave', cors(), bodyParserJSON, async function (request, response) {
    try {
        let id_grupo = parseInt(request.params.id)
        let { id_usuario } = request.body

        if (!id_usuario)
            return response.status(400).json({ status: false, message: "id_usuario é obrigatório" })

        let result = await controllerUsuarioGrupo.sairDoGrupo(id_usuario, id_grupo)

        response.status(result.status_code || 200)
        response.json(result)
    } catch (error) {
        console.error("Erro /group/:id/leave:", error)
        response.status(500).json({ status: false, message: "Erro interno" })
    }
})

// ✅ Listar grupos que o usuário participa
app.get('/v1/journey/usuario/:id/grupos-participando', cors(), async function (request, response) {
    let id_usuario = parseInt(request.params.id)
    let result = await controllerUsuarioGrupo.listarGruposPorUsuario(id_usuario)

    response.status(result.status_code || 200)
    response.json(result)
})

// ✅ Listar grupos criados por um usuário
app.get('/v1/journey/usuario/:id/grupos-criados', cors(), async function (request, response) {
    let id_usuario = parseInt(request.params.id)
    let result = await controllerUsuarioGrupo.listarGruposCriadosPorUsuario(id_usuario)

    response.status(result.status_code || 200)
    response.json(result)
})

// ✅ Contar participantes do grupo
app.get('/v1/journey/group/:id/participantes', cors(), async function (request, response) {
    let id = parseInt(request.params.id)
    let result = await controllerUsuarioGrupo.contarParticipantes(id)

    response.status(result.status_code || 200)
    response.json(result)
})

/*******************************************************************************************************************
 * 
 *                                  Mensagem
 * 
 *******************************************************************************************************************/
/*
// POST - Inserir nova mensagem
app.post('/v1/journey/mensagem', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let result = await controllerMensagens.inserirMensagem(dadosBody, contentType)
    response.status(result.status_code || 500)
    response.json(result)
})

  // GET - Listar todas as mensagens
app.get('/v1/journey/mensagem', cors(), async function (request, response) {
    let result = await controllerMensagens.listarMensagens()
    response.status(result.status_code || 500)
    response.json(result)
})

  // GET - Buscar mensagem por ID
app.get('/v1/journey/mensagem/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerMensagens.buscarMensagem(id)
    response.status(result.status_code || 500)
    response.json(result)
})

  // PUT - Atualizar mensagem
app.put('/v1/journey/mensagem/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let id = request.params.id
    let dadosBody = request.body

    let result = await controllerMensagens.atualizarMensagem(id, dadosBody, contentType)
    response.status(result.status_code || 500)
    response.json(result)
})

  // DELETE - Excluir mensagem
app.delete('/v1/journey/mensagem/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerMensagens.excluirMensagem(id)
    response.status(result.status_code || 500)
    response.json(result)
})
*/


/*******************************************************************************************************************
 * 
 *                                  CALENDARIO
 * 
 *******************************************************************************************************************/
const controllerCalendario = require('./controller/calendario/controllerCalendario')

app.post('/v1/journey/calendario', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let result = await controllerCalendario.inserirCalendario(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})

// GET - Listar todos os calendários
app.get('/v1/journey/calendario', cors(), async function (request, response) {
    let result = await controllerCalendario.listarCalendario()
    response.status(result.status_code)
    response.json(result)
})

// GET - Buscar calendário por ID
app.get('/v1/journey/calendario/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerCalendario.buscarCalendario(id)
    response.status(result.status_code)
    response.json(result)
})

// DELETE - Excluir calendário
app.delete('/v1/journey/calendario/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerCalendario.excluirCalendario(id)

    response.status(result.status_code)
    response.json(result)
})

// PUT - Atualizar calendário
app.put('/v1/journey/calendario/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let id = request.params.id
    let dadosBody = request.body

    let result = await controllerCalendario.atualizarCalendario(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})
/*******************************************************************************************************************
 * 
 *                                  CHAT ROOMS
 * 
 *******************************************************************************************************************/

const controllerChatRoom = require('./controller/chat/controllerChatRoom.js')

// Listar todas as salas
app.get('/v1/journey/chatrooms', cors(), async (req, res) => {
  let result = await controllerChatRoom.listarChatRooms()
  res.status(result.status_code || 500).json(result)
})

// Buscar sala por ID
app.get('/v1/journey/chatroom/:id', cors(), async (req, res) => {
  let id = req.params.id
  let result = await controllerChatRoom.buscarChatRoom(id)
  res.status(result.status_code || 500).json(result)
})

// Inserir nova sala
app.post('/v1/journey/chatroom', cors(), async (req, res) => {
  let result = await controllerChatRoom.inserirChatRoom(req.body, req.headers['content-type'])
  res.status(result.status_code || 500).json(result)
})

// Atualizar sala
app.put('/v1/journey/chatroom/:id', cors(), async (req, res) => {
  let id = req.params.id
  let result = await controllerChatRoom.atualizarChatRoom(id, req.body, req.headers['content-type'])
  res.status(result.status_code || 500).json(result)
})

// Excluir sala
app.delete('/v1/journey/chatroom/:id', cors(), async (req, res) => {
  let id = req.params.id
  let result = await controllerChatRoom.excluirChatRoom(id)
  res.status(result.status_code || 500).json(result)
})

/*******************************************************************************************************************
 * 
 *                                  CHAT PARTICIPANTE
 * 
 *******************************************************************************************************************/
const controllerChatParticipant = require('./controller/chat/controllerchatParticipante.js')

// Listar todos os participantes
app.get('/v1/journey/chatparticipants', cors(), async (req, res) => {
  let result = await controllerChatParticipant.listarChatParticipants()
  res.status(result.status_code || 500).json(result)
})

// Buscar participante por ID
app.get('/v1/journey/chatparticipant/:id', cors(), async (req, res) => {
  let id = req.params.id
  let result = await controllerChatParticipant.buscarChatParticipant(id)
  res.status(result.status_code || 500).json(result)
})

// Buscar participantes por sala
app.get('/v1/journey/chatparticipants/room/:id_chat_room', cors(), async (req, res) => {
  let id_chat_room = req.params.id_chat_room
  let result = await controllerChatParticipant.buscarParticipantsByChatRoom(id_chat_room)
  res.status(result.status_code || 500).json(result)
})

// Inserir participante
app.post('/v1/journey/chatparticipant', cors(), async (req, res) => {
  let result = await controllerChatParticipant.inserirChatParticipant(req.body, req.headers['content-type'])
  res.status(result.status_code || 500).json(result)
})

// Excluir participante
app.delete('/v1/journey/chatparticipant/:id', cors(), async (req, res) => {
  let id = req.params.id
  let result = await controllerChatParticipant.excluirChatParticipant(id)
  res.status(result.status_code || 500).json(result)
})


/********************************************************************************************************************
 *                                                                                                                  *
 *                                MENSAGEM                                                                          *
 *                                                                                                                  *
 ********************************************************************************************************************/
// Importa o controller de mensagens
const controllerMensagens = require('./controller/mensagens/controllerMensagens')

// Listar todas as mensagens
app.get('/v1/journey/mensagens', cors(), async (req, res) => {
    let result = await controllerMensagens.listarMensagens()
    res.status(result.status_code || 500).json(result)
  })
  
  // Buscar mensagem por ID
  app.get('/v1/journey/mensagem/:id', cors(), async (req, res) => {
    let id = req.params.id
    let result = await controllerMensagens.buscarMensagem(id)
    res.status(result.status_code || 500).json(result)
  })
  
  // Inserir nova mensagem
  app.post('/v1/journey/mensagem', cors(), async (req, res) => {
    let result = await controllerMensagens.inserirMensagem(req.body, req.headers['content-type'])
    res.status(result.status_code || 500).json(result)
  })
  
  // Atualizar mensagem
  app.put('/v1/journey/mensagem/:id', cors(), async (req, res) => {
    let id = req.params.id
    let result = await controllerMensagens.atualizarMensagem(id, req.body, req.headers['content-type'])
    res.status(result.status_code || 500).json(result)
  })
  
  // Excluir mensagem
  app.delete('/v1/journey/mensagem/:id', cors(), async (req, res) => {
    let id = req.params.id
    let result = await controllerMensagens.excluirMensagem(id)
    res.status(result.status_code || 500).json(result)
  })

  module.exports = app