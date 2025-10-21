// Arquivo: socket.js
const { Server } = require("socket.io");
const controllerMensagens = require('./controller/mensagens/controllerMensagens');

let io;

/**
 * Inicializa o Socket.IO com o servidor HTTP
 * @param {import('http').Server} server 
 */
function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*", // Ajuste para a URL do seu frontend em produção
            methods: ["GET", "POST"]
        }
    });

    // Evento de conexão do cliente
    io.on('connection', (socket) => {
        console.log('✅ Novo usuário conectado ao Socket.IO:', socket.id);

        // Evento customizado para o cadastro de mensagens
        // O cliente emitirá este evento com os dados da mensagem
        // data = { id_chat: X, id_usuario: Y, conteudo: 'Texto' }
        socket.on('send_message', async (data, callback) => {
            console.log(`Recebendo mensagem do cliente ${socket.id}:`, data);

            // Chama o controller para cadastrar a mensagem no banco
            // Passamos 'socket.io' como contentType para diferenciá-lo da rota REST, 
            // mas o controller só precisa dos dados.
            let result = await controllerMensagens.inserirMensagem(data, 'socket.io');

            if (result.status_code === 201) {
                // Se o cadastro for bem-sucedido, emite a nova mensagem para todos os clientes
                console.log('Mensagem salva e emitida para todos os clientes.');
                
                // Envia o objeto da mensagem (com o ID gerado)
                io.emit('receive_message', result.mensagem); 
                
                // Opcional: Chama a função de callback para confirmar a operação para o remetente
                if (callback) {
                    callback({ status: 'ok', data: result.mensagem });
                }

            } else {
                // Emite um erro apenas para o cliente que tentou enviar
                console.error('Erro ao salvar mensagem:', result);
                socket.emit('message_error', result.message || 'Erro ao enviar mensagem.');
            }
        });

        // Evento de desconexão do cliente
        socket.on('disconnect', () => {
            console.log('❌ Usuário desconectado do Socket.IO:', socket.id);
        });
    });
}

/**
 * Retorna a instância do Socket.IO Server para uso em outros módulos (como rotas REST)
 * @returns {Server}
 */
function getIo() {
    if (!io) {
        throw new Error("Socket.IO não inicializado. Chame initializeSocket primeiro.");
    }
    return io;
}

module.exports = {
    initializeSocket,
    getIo
};