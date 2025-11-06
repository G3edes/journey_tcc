/******************************************************************************************************
 * OBJETIVO: Criar uma API para realizar o CRUD do sistema de Eventos                                 *                                                                                  *
 * AUTOR: Gabriel Guedes                                                                              *
 * Versão: 1.0                                                                                        *
 * Observação:                                                                                        *
 *          Para criar a API precisamos instalar:                                                     *
 *                 express             npm install express --save                                     *
 *                 cors                npm install cors --save                                        *
 *                 body-parser         npm install body-parser --save                                 *
 *                                                                                                    *
 *          Para criar a integração com o Banco de Dados precisamos instalar:                         *
 *                 prisma               npm install prisma --save(para fazer a conexão com o BD)      *
 *                 prisma/client        npm install @prisma/client --save (para rodar os scripts SQL) *
 *                                                                                                    *  
 *                                                                                                    *
 *          Após a instalação do prima e do prisma client, devemos :                                  *
 *              npx prisma init                                                                       *
 *                                                                                                    *
 *                                                                                                    *
 *          Você deverá configurar o arquivo .env e o schema.prisma com as credenciais do BD          *
 *          Após essa configuração voce deverá rodar o seguinte comando:                              *
 *                      npx prisma migrate dev                                                        *
 *                                                                                                    *
 *          Instalar o NodeMailer para mandar os emails                                               *
 *                                                                                                    *
 *          npm install nodemailer                                                                    *
 *                                                                                                    *
 *          npm install dotenv                                                                        *
 *                                                                                                    *
 *          Instalação do gitmoji para melhora de commits                                             *                             
 *              npm install -save-dev gitmoji-cli                                                     *                    
 *          Efetuação do commit:                                                                      *
 *              npx gitmoji -c                                                                        *
 *                                                                                                    *
 *          Instalação do bcrypt para criptografia                                                    *
 *              npm install bcryptjs                                                                  *
 *                                                                                                    *
 *          Instalação do jsonwebtoken para gerar token                                               *
 *              npm install jsonwebtoken                                                              *
*          Instalção do socket                                                                        *
*                         npm install socket.io                                                                            *
 ******************************************************************************************************/

const express =require ('express')
const cors =require ('cors')
const bodyParser =require ('body-parser')

const bodyParserJSON = bodyParser.json()
const app = express()

app.use (cors())
app.use((req,res,next) =>{
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
const controllerUser= require('./controller/user/controllerUser')

const controllerRecuperarSenha = require('./controller/user/controllerRecuperarSenha')

app.post('/v1/journey/usuario', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType=request.headers['content-type']
    //recebe do body da requisição os dados encaminhados

    
    let dadosBody=request.body
    let result= await controllerUser.inserirUsuario(dadosBody,contentType)
    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/journey/usuario/senha/:id', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType=request.headers['content-type']
    //recebe do body da requisição os dados encaminhados

    let id = request.params.id
    //body da requisição
    let dadosBody=request.body
    let result= await  controllerUser.atualizarSenhaUsuario(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/journey/usuario/:id', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType=request.headers['content-type']
    //recebe do body da requisição os dados encaminhados

    let id = request.params.id
    //body da requisição
    let dadosBody=request.body
    let result= await  controllerUser.atualizarUsuario(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/usuario', cors(), async function (request, response) {
    let result= await controllerUser.listarUsuario()
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/usuario/:id', cors(), async function (request, response) {
    let id=request.params.id
    let result= await controllerUser.buscarUsuario(id)
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
app.delete('/v1/journey/usuario/:id', cors(), async function (request, response){
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
 *                                  E-book
 * 
 *******************************************************************************************************************/
const controllerEbook = require('./controller/e-book/controllerEbook')
// Inserir eBook
app.post('/v1/journey/ebook', cors(), bodyParserJSON, async (req, res) => {
    const contentType = req.headers['content-type']
    const result = await controllerEbook.inserirEbook(req.body, contentType)
    res.status(result.status_code)
    res.json(result)
})

// Listar eBooks
app.get('/v1/journey/ebook', cors(), async (req, res) => {
    const result = await controllerEbook.listarEbooks()
    res.status(result.status_code)
    res.json(result)
})

// Buscar eBook por ID
app.get('/v1/journey/ebook/:id', cors(), async (req, res) => {
    const result = await controllerEbook.buscarEbook(req.params.id)
    res.status(result.status_code)
    res.json(result)
})

// Atualizar eBook
app.put('/v1/journey/ebook/:id', cors(), bodyParserJSON, async (req, res) => {
    const contentType = req.headers['content-type']
    const result = await controllerEbook.atualizarEbook(req.params.id, req.body, contentType)
    res.status(result.status_code)
    res.json(result)
})

// Excluir eBook
app.delete('/v1/journey/ebook/:id', cors(), async (req, res) => {
    const result = await controllerEbook.excluirEbook(req.params.id)
    res.status(result.status_code)
    res.json(result)
})

/*******************************************************************************************************************
 * 
 *                                  E-book x Categoria
 * 
 *******************************************************************************************************************/
const controllerEbookCategoria = require('./controller/e-book/controllerEbookCategoria')

// Inserir relação eBook-Categoria
app.post('/v1/journey/ebook-categoria', cors(), bodyParserJSON, async (req, res) => {
    const contentType = req.headers['content-type']
    const result = await controllerEbookCategoria.inserirEbookCategoria(req.body, contentType)
    res.status(result.status_code)
    res.json(result)
})

// Listar todas as relações
app.get('/v1/journey/ebook-categoria', cors(), async (req, res) => {
    const result = await controllerEbookCategoria.listarEbooksCategorias()
    res.status(result.status_code)
    res.json(result)
})

// Buscar relação por ID
app.get('/v1/journey/ebook-categoria/:id', cors(), async (req, res) => {
    const result = await controllerEbookCategoria.buscarEbookCategoria(req.params.id)
    res.status(result.status_code)
    res.json(result)
})

// Deletar relação
app.delete('/v1/journey/ebook-categoria/:id', cors(), async (req, res) => {
    const result = await controllerEbookCategoria.excluirEbookCategoria(req.params.id)
    res.status(result.status_code)
    res.json(result)
})



/*******************************************************************************************************************
 * 
 *                                  CATEGORIA
 * 
 *******************************************************************************************************************/

const controllerCategoria = require('./controller/category/controllerCategoria')

app.post('/v1/journey/categoria', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType=request.headers['content-type']
    //recebe do body da requisição os dados encaminhados

    
    let dadosBody=request.body
    let result= await controllerCategoria.inserirCategoria(dadosBody,contentType)
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/categoria', cors(), async function (request, response) {
    let result= await controllerCategoria.listarCategoria()
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/categoria/:id', cors(), async function (request, response) {
    let id=request.params.id
    let result= await controllerCategoria.buscarCategoria(id)
    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/journey/categoria/:id', cors(), async function (request, response){
    let id = request.params.id
    let result = await controllerCategoria.excluirCategoria(id)

    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/journey/categoria/:id', cors(), bodyParserJSON,async function (request, response) {
    //content-type requisição
    let contentType= request.headers['content-type']
    //id da requisção
    let id = request.params.id
    //body da requisição
    let dadosBody=request.body
    let result= await  controllerCategoria.atualizarCategoria(id, dadosBody, contentType)
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
    let contentType=request.headers['content-type']
    //recebe do body da requisição os dados encaminhados

    
    let dadosBody=request.body
    let result= await controllerArea.inserirArea(dadosBody,contentType)
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/area', cors(), async function (request, response) {
    let result= await controllerArea.listarArea()
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/journey/area/:id', cors(), async function (request, response) {
    let id=request.params.id
    let result= await controllerArea.buscarArea(id)
    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/journey/area/:id', cors(), async function (request, response){
    let id = request.params.id
    let result = await controllerArea.excluirArea(id)

    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/journey/area/:id', cors(), bodyParserJSON,async function (request, response) {
    //content-type requisição
    let contentType= request.headers['content-type']
    //id da requisção
    let id = request.params.id
    //body da requisição
    let dadosBody=request.body
    let result= await  controllerArea.atualizarArea(id, dadosBody, contentType)
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

app.get('/v1/journey/grupo/:id_grupo/participantes', controllerUsuarioGrupo.listarParticipantesDoGrupo);

// Remover participante
app.delete('/v1/journey/grupo/remover-participante', controllerUsuarioGrupo.removerParticipante);

app.delete('/v1/journey/grupo/remover-participante', express.json(), controllerUsuarioGrupo.removerParticipante);


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
 *                                  MENSAGEM
 * 
 *******************************************************************************************************************/

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

/*******************************************************************************************************************
 * 
 *                                  CHAT ROOM POR GRUPO
 * 
 *******************************************************************************************************************/

 app.get('/v1/journey/group/chat-room/:id', cors(), async function (request, response) {
   const id_grupo = request.params.id
 
   try {
     const result = await controllerGroup.getGrupoComChatRoom(id_grupo)
     response.status(result.status_code || 200)
     response.json(result)
   } catch (error) {
     console.error("Erro /v1/journey/group/chat-room/:id:", error)
     response.status(500).json({ message: "Erro interno no servidor" })
   }
 })
 

 app.get('/v1/journey/chatroom/:id/mensagens', cors(), async (req, res) => {
    const id = req.params.id
    try {
      const controllerMensagens = require('./controller/mensagens/controllerMensagens')
      const result = await controllerMensagens.listarMensagensPorSala(id)
      res.status(result.status_code || 200).json(result)
    } catch (error) {
      console.error("Erro /v1/journey/chatroom/:id/mensagens:", error)
      res.status(500).json({ message: "Erro interno" })
    }
  })
  
  app.get('/v1/journey/chatroom/:id/mensagens', cors(), async (request, response) => {
    const id_chat_room = Number(request.params.id)
  
    try {
      const result = await controllerMensagens.listarMensagensPorSala(id_chat_room)
      response.status(result.status_code || 200).json(result)
    } catch (error) {
      console.error("Erro /v1/journey/chatroom/:id/mensagens:", error)
      response.status(500).json({ message: "Erro interno no servidor" })
    }
  })

/*******************************************************************************************************************
 * 
 *                                  CHAT ROOM privado
 * 
 *******************************************************************************************************************/

const { obterOuCriarSalaPrivada, listarConversasPrivadas } = require('./controller/chat/controllerChatRoom');
app.post('/v1/journey/chat-room/privado', obterOuCriarSalaPrivada);

app.get( "/v1/journey/usuario/:id_usuario/conversas-privadas", listarConversasPrivadas);

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
 *                                  CALENDARIO PESSOAL
 * 
 *******************************************************************************************************************/

const controllerCalendarioPessoal = require('./controller/calendario/controllerCalendarioPessoal')

// Inserir
app.post('/v1/journey/calendario-pessoal', cors(), bodyParserJSON, async (request, response) => {
  const contentType = request.headers['content-type']
  const dadosBody = request.body

  const result = await controllerCalendarioPessoal.inserirCalendarioPessoal(dadosBody, contentType)
  response.status(result.status_code)
  response.json(result)
})

// Listar todos
app.get('/v1/journey/calendario-pessoal', cors(), async (request, response) => {
  const result = await controllerCalendarioPessoal.listarCalendarioPessoal()
  response.status(result.status_code)
  response.json(result)
})

// Buscar por ID
app.get('/v1/journey/calendario-pessoal/:id', cors(), async (request, response) => {
  const id = request.params.id
  const result = await controllerCalendarioPessoal.buscarCalendarioPessoal(id)
  response.status(result.status_code)
  response.json(result)
})

// Atualizar
app.put('/v1/journey/calendario-pessoal/:id', cors(), bodyParserJSON, async (request, response) => {
  const contentType = request.headers['content-type']
  const id = request.params.id
  const dadosBody = request.body

  const result = await controllerCalendarioPessoal.atualizarCalendarioPessoal(id, dadosBody, contentType)
  response.status(result.status_code)
  response.json(result)
})

// Excluir
app.delete('/v1/journey/calendario-pessoal/:id', cors(), async (request, response) => {
  const id = request.params.id
  const result = await controllerCalendarioPessoal.excluirCalendarioPessoal(id)
  response.status(result.status_code)
  response.json(result)
})

module.exports = app