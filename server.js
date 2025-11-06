const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const app = require('./app')

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', // ajuste para seu frontend
    methods: ['GET', 'POST']
  }
})

const controllerMensagem = require('./controller/mensagens/controllerMensagens')

app.use(cors())
app.use(express.json())

// --- Rotas REST (opcional, continuam funcionando) ---
app.get('/v1/journey/mensagens', async (req, res) => {
  let result = await controllerMensagem.listarMensagens()
  res.status(result.status_code || 500).json(result)
})

app.get('/v1/journey/mensagem/:id', async (req, res) => {
  let result = await controllerMensagem.buscarMensagem(req.params.id)
  res.status(result.status_code || 500).json(result)
})

// --- SOCKET.IO ---
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`)

  // Usuário entra numa sala de chat
  socket.on('join_room', (id_chat_room) => {
    socket.join(`chat_${id_chat_room}`)
    console.log(`Usuário entrou na sala chat_${id_chat_room}`)
  })
  const config = require ('./module/config')
  // Recebe mensagem de um cliente
  socket.on("send_message", async (data) => {
  try {
    console.log("📨 Mensagem recebida do cliente:", data);

    const result = await controllerMensagem.inserirMensagem(data, "application/json");
    console.log("💾 Resultado do controllerMensagem:", result);

    if (result && result.status) {
      io.to(`chat_${data.id_chat_room}`).emit("receive_message", {
        ...data,
        enviado_em: new Date(),
      });
      console.log("✅ Mensagem emitida para sala:", data.id_chat_room);
    } else {
      console.warn("⚠️ Mensagem não enviada. Retorno do controller:", result);
    }
  } catch (error) {
    console.error("❌ Erro socket send_message:", error);
  }
});



  // Usuário sai da sala
  socket.on('leave_room', (id_chat_room) => {
    socket.leave(`chat_${id_chat_room}`)
    console.log(`Usuário saiu da sala chat_${id_chat_room}`)
  })

  // Desconexão
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`)
  })
})

// --- Iniciar servidor ---
const PORT = process.env.PORT || 3030
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})