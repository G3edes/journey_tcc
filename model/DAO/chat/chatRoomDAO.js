const { PrismaClient } = require('@prisma/client');
const { get } = require('../../../app');
const prisma = new PrismaClient()

// Criar nova sala de chat
const insertChatRoom = async (dados) => {
  try {
    console.log("📦 Criando ChatRoom com dados:", dados);

    const result = await prisma.chatRoom.create({
      data: {
        tipo: dados.tipo, // 'privado' ou 'grupo'
        id_grupo: dados.id_grupo ? Number(dados.id_grupo) : null
      }
    });

    console.log("✅ ChatRoom criada com sucesso:", result);
    return result;
  } catch (error) {
    console.error("❌ Erro ao criar ChatRoom:", error);
    if (error.message) console.error("Mensagem:", error.message);
    if (error.code) console.error("Código do erro:", error.code);
    if (error.meta) console.error("Meta:", error.meta);
    return false;
  }
};


// Listar todas as salas
const selectAllChatRooms = async () => {
  try {
    const result = await prisma.chatRoom.findMany({
      orderBy: { criado_em: 'desc' }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectAllChatRooms:', error)
    return false
  }
}

// Buscar sala por ID
const selectChatRoomById = async (id) => {
  try {
    const result = await prisma.chatRoom.findUnique({
      where: { id_chat_room: Number(id) },
      include: {
        grupo: true,
        mensagens: {
          include: {
            usuario: { select: { id_usuario: true, nome_completo: true, foto_perfil: true } }
          }
        }
      }
    })
    return result || null
  } catch (error) {
    console.error('Erro selectChatRoomById:', error)
    return null
  }
}
const getMensagensPorChatRoom = async (id_chat_room) => {
  try {
    const mensagens = await prisma.mensagem.findMany({
      where: { id_chat_room: Number(id_chat_room) },
      orderBy: { enviado_em: 'asc' },
      include: {
        usuario: { select: { id_usuario: true, nome_completo: true, foto_perfil: true } }
      }
    })
    return mensagens.length > 0 ? mensagens : []
  } catch (error) {
    console.error('Erro getMensagensPorChatRoom:', error)
    return []
  }
}

// Buscar salas por tipo
const selectChatRoomsByTipo = async (tipo) => {
  try {
    const result = await prisma.chatRoom.findMany({
      where: { tipo }
    })
    return result.length > 0 ? result : false
  } catch (error) {
    console.error('Erro selectChatRoomsByTipo:', error)
    return false
  }
}

// Deletar sala
const deleteChatRoom = async (id) => {
  try {
    const result = await prisma.chatRoom.delete({
      where: { id_chat_room: Number(id) }
    })
    return result ? true : false
  } catch (error) {
    console.error('Erro deleteChatRoom:', error)
    return false
  }
}

// Buscar sala pelo ID do grupo
const selectChatRoomByGrupoId = async (id_grupo) => {
  try {
    const result = await prisma.chatRoom.findFirst({
      where: { id_grupo: Number(id_grupo) },
    })
    return result || null
  } catch (error) {
    console.error('Erro selectChatRoomByGrupoId:', error)
    return null
  }
}



// Verifica se já existe uma sala privada entre dois usuários
const selectPrivadoEntreUsuarios = async (id_usuario1, id_usuario2) => {
  try {
    const sql = `
      SELECT cr.*
      FROM tbl_chat_room cr
      JOIN tbl_chat_participant p1 ON cr.id_chat_room = p1.id_chat_room
      JOIN tbl_chat_participant p2 ON cr.id_chat_room = p2.id_chat_room
      WHERE cr.tipo = 'privado'
        AND p1.id_usuario = ?
        AND p2.id_usuario = ?
      LIMIT 1;
    `;
    const result = await prisma.$queryRawUnsafe(sql, id_usuario1, id_usuario2);
    return result?.[0] || null;
  } catch (error) {
    console.error("Erro selectPrivadoEntreUsuarios:", error);
    throw error;
  }
};

// Insere participante em uma sala
const insertParticipante = async (dados) => {
  try {
    return await prisma.chatParticipant.create({
      data: {
        id_chat_room: dados.id_chat_room,
        id_usuario: dados.id_usuario
      }
    });
  } catch (error) {
    console.error("Erro insertParticipante:", error);
    throw error;
  }
};

//funcao para buscar se ja exixstse um chat room entre oids usuarios



const findPrivateChatBetweenUsers = async (id_usuario1, id_usuario2) => {
  try {
    // Verifica se já existe uma sala privada entre os dois usuários
    const sala = await prisma.chatRoom.findFirst({
      where: {
        tipo: 'privado',
        participantes: {
          some: {
            id_usuario: id_usuario1,
          },
        },
        AND: {
          participantes: {
            some: {
              id_usuario: id_usuario2,
            },
          },
        },
      },
      include: {
        participantes: true,
      },
    });

    return sala || null;
  } catch (error) {
    console.error('Erro findPrivateChatBetweenUsers:', error);
    return null;
  }
};
const createPrivateChatRoom = async (id_usuario1, id_usuario2) => {
  try {
    const novaSala = await prisma.chatRoom.create({
      data: {
        tipo: 'privado',
        participantes: {
          create: [
            { id_usuario: id_usuario1 },
            { id_usuario: id_usuario2 },
          ],
        },
      },
      include: {
        participantes: true,
      },
    });

    return novaSala;
  } catch (error) {
    console.error('Erro createPrivateChatRoom:', error);
    return null;
  }
};


const getConversasPrivadasPorUsuario = async (id_usuario) => {
  try {
    const salas = await prisma.chatRoom.findMany({
      where: {
        tipo: "privado",
        participantes: {
          some: { id_usuario: Number(id_usuario) }
        }
      },
      include: {
        participantes: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nome_completo: true,
                foto_perfil: true
              }
            }
          }
        },
        mensagens: {
          orderBy: { enviado_em: "desc" },
          take: 1,
          select: {
            conteudo: true,
            enviado_em: true
          }
        }
      },
      orderBy: {
        id_chat_room: "desc" // 👈 simples e funcional
      }
    });

    return salas;
  } catch (error) {
    console.error("❌ Erro getConversasPrivadasPorUsuario:", error);
    return false;
  }
};

module.exports = {
  insertChatRoom,
  selectAllChatRooms,
  selectChatRoomById,
  selectChatRoomsByTipo,
  deleteChatRoom,
  getMensagensPorChatRoom,
  selectChatRoomByGrupoId,
  selectPrivadoEntreUsuarios,
  insertParticipante,
  findPrivateChatBetweenUsers,
  createPrivateChatRoom,
  getConversasPrivadasPorUsuario
}
