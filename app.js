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
 *              npm install bcryptjs                                                                    *
 *                                                                                                    *
 *          Instalação do jsonwebtoken para gerar token                                               *
 *              npm install jsonwebtoken                                                              *
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

// npm install multer
const multer = require("multer");
const path = require("path");

// Configura o destino e o nome do arquivo salvo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // cria a pasta "uploads" se ainda não existir
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// aumenta o limite de tamanho do corpo das requisições
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// para se for usar o bodyparser (opcional)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));


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


// Atualizar usuário com possível upload de imagem
app.put("/v1/journey/usuario/:id", cors(), upload.single("foto_perfil"), async function (request, response) {
  try {
    const id = request.params.id;
    const contentType = request.headers["content-type"];
    let dadosBody = request.body;

    // Se veio imagem, adiciona o caminho do arquivo salvo
    if (request.file) {
      const caminhoImagem = `/uploads/${request.file.filename}`;
      dadosBody.foto_perfil = caminhoImagem;
    }

    const result = await controllerUser.atualizarUsuario(id, dadosBody, contentType);
    response.status(result.status_code).json(result);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    response.status(500).json({ message: "Erro interno ao atualizar usuário" });
  }
});

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
app.post('/v1/journey/usuario-grupo', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let result = await controllerUsuarioGrupo.inserirUsuarioGrupo(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})


// Listar todos os relacionamentos
app.get('/v1/journey/usuario-grupo', cors(), async function (request, response) {
    let result = await controllerUsuarioGrupo.listarUsuariosGrupos()
    response.status(result.status_code)
    response.json(result)
})

// Buscar relacionamento por ID
app.get('/v1/journey/usuario-grupo/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerUsuarioGrupo.buscarUsuarioGrupoPorId(id)
    response.status(result.status_code)
    response.json(result)
})

// Excluir relacionamento
app.delete('/v1/journey/usuario-grupo/:id', cors(), async function (request, response) {
    let id = request.params.id
    let result = await controllerUsuarioGrupo.excluirUsuarioGrupo(id)

    response.status(result.status_code)
    response.json(result)
})

// Atualizar relacionamento
app.put('/v1/journey/usuario-grupo/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let id = request.params.id
    let dadosBody = request.body

    let result = await controllerUsuarioGrupo.atualizarUsuarioGrupo(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});