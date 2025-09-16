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

app.use(express.json)

/*******************************************************************************************************************
 * 
 *                                  USUARIO
 * 
 ********************************************************************************************************************/
const controllerUser= require('./controller/user/controllerUser')
const controllerRecuperarSenha = require('./controller/user/controllerRecuperarSenha')

app.post('/v1/planify/usuario', cors(), bodyParserJSON, async function (request, response) {
    //recebe o content-type da requisição
    let contentType=request.headers['content-type']
    //recebe do body da requisição os dados encaminhados

    
    let dadosBody=request.body
    let result= await controllerUser.inserirUsuario(dadosBody,contentType)
    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/planify/usuario/senha/:id', cors(), bodyParserJSON, async function (request, response) {
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
app.get('/v1/planify/usuario', cors(), async function (request, response) {
    let result= await controllerUser.listarUsuario()
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/planify/usuario/:id', cors(), async function (request, response) {
    let id=request.params.id
    let result= await controllerUser.buscarUsuario(id)
    response.status(result.status_code)
    response.json(result)
})
app.get('/v1/planify/usuario/evento/:id', cors(), async function (request, response) {
    let id=request.params.id
    let result= await controllerUser.buscarUsuario(id)
    response.status(result.status_code)
    response.json(result)
})
app.delete('/v1/planify/usuario/:id', cors(), async function (request, response){
    let id = request.params.id
    let result = await controllerUser.excluirUsuario(id)

    response.status(result.status_code)
    response.json(result)
})
app.put('/v1/planify/usuario/:id', cors(), bodyParserJSON,async function (request, response) {
    //content-type requisição
    let contentType= request.headers['content-type']
    //id da requisção
    let id = request.params.id
    //body da requisição
    let dadosBody=request.body
    let result= await  controllerUser.atualizarUsuario(id, dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
})

app.post('/v1/planify/recuperar-senha', cors(), bodyParserJSON, controllerRecuperarSenha.enviarCodigo);
app.post('/v1/planify/validar-codigo', cors(), bodyParserJSON, controllerRecuperarSenha.validarCodigo);
