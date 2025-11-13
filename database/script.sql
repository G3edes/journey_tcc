-- ===========================================================
-- BANCO DE DADOS: db_journey
-- Criado por: Gabriel Silva Guedes
-- ===========================================================

-- LIMPAR ESTRUTURA (opcional, use com cuidado)
DROP DATABASE IF EXISTS db_journey;
CREATE DATABASE db_journey;
USE db_journey;

-- ===========================================================
-- TABELAS
-- ===========================================================

CREATE TABLE tbl_usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    foto_perfil VARCHAR(255),
    descricao TEXT,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('Profissional', 'Estudante') NOT NULL
);

CREATE TABLE tbl_categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_area (
    id_area INT AUTO_INCREMENT PRIMARY KEY,
    area VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_grupo (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    limite_membros INT NOT NULL,
    descricao TEXT NOT NULL,
    imagem VARCHAR(255) NOT NULL,
    id_area INT NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_grupo_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario),
    CONSTRAINT fk_grupo_area FOREIGN KEY (id_area) REFERENCES tbl_area(id_area)
);

CREATE TABLE tbl_calendario (
    id_calendario INT AUTO_INCREMENT PRIMARY KEY,
    nome_evento VARCHAR(100) NOT NULL,
    data_evento DATETIME NOT NULL,
    descricao TEXT NOT NULL,
    link VARCHAR(500) NOT NULL,
    id_usuario INT NOT NULL,
    id_grupo INT NULL,
    CONSTRAINT fk_calendario_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario),
    CONSTRAINT fk_calendario_grupo FOREIGN KEY (id_grupo) REFERENCES tbl_grupo(id_grupo)
);

CREATE TABLE tbl_chat (
    id_chat INT AUTO_INCREMENT PRIMARY KEY,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remetente INT NOT NULL,
    destinatario INT NOT NULL,
    CONSTRAINT fk_chat_remetente FOREIGN KEY (remetente) REFERENCES tbl_usuario(id_usuario),
    CONSTRAINT fk_chat_destinatario FOREIGN KEY (destinatario) REFERENCES tbl_usuario(id_usuario)
);

CREATE TABLE tbl_chat_room (
    id_chat_room INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('privado','grupo') NOT NULL,
    id_grupo INT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chatroom_grupo FOREIGN KEY (id_grupo) REFERENCES tbl_grupo(id_grupo) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_chatroom_grupo UNIQUE (id_grupo)
);

CREATE TABLE tbl_mensagens (
    id_mensagens INT AUTO_INCREMENT PRIMARY KEY,
    conteudo TEXT NOT NULL,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_chat INT NOT NULL,
    id_usuario INT NOT NULL,
    id_chat_room INT NULL,
    id_grupo INT NULL,
    CONSTRAINT fk_mensagens_chat FOREIGN KEY (id_chat) REFERENCES tbl_chat(id_chat) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_mensagens_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario),
    CONSTRAINT fk_mensagens_chat_room FOREIGN KEY (id_chat_room) REFERENCES tbl_chat_room(id_chat_room),
    CONSTRAINT fk_mensagens_grupo FOREIGN KEY (id_grupo) REFERENCES tbl_grupo(id_grupo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE tbl_chat_participant (
    id_participante INT AUTO_INCREMENT PRIMARY KEY,
    id_chat_room INT NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_chat_participant_chatroom FOREIGN KEY (id_chat_room) REFERENCES tbl_chat_room(id_chat_room),
    CONSTRAINT fk_chat_participant_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario)
);

CREATE TABLE tbl_ebooks (
    id_ebooks INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT NOT NULL,
    link_imagem VARCHAR(255) NOT NULL,
    link_arquivo_pdf VARCHAR(255),
    id_usuario INT NOT NULL,
    CONSTRAINT fk_ebooks_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario)
);

CREATE TABLE tbl_usuario_grupo (
    id_usuario_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    entrou_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_grupo_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_usuario_grupo_grupo FOREIGN KEY (id_grupo) REFERENCES tbl_grupo(id_grupo) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tbl_ebooks_categoria (
    id_ebooks_categoria INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_ebooks INT NOT NULL,
    CONSTRAINT fk_ebooks_categoria_categoria FOREIGN KEY (id_categoria) REFERENCES tbl_categoria(id_categoria) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ebooks_categoria_ebooks FOREIGN KEY (id_ebooks) REFERENCES tbl_ebooks(id_ebooks) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===========================================================
-- INSERÇÕES DE EXEMPLO
-- ===========================================================

-- Usuários
INSERT INTO tbl_usuario (nome_completo, email, data_nascimento, foto_perfil, descricao, senha, tipo_usuario)
VALUES
('Gabriel Silva Guedes', 'gabriel@example.com', '2000-05-15', 'foto1.jpg', 'Desenvolvedor Full Stack', '123456', 'Profissional'),
('Maria Oliveira', 'maria@example.com', '2002-08-20', 'foto2.jpg', 'Estudante de Análise de Sistemas', 'abcdef', 'Estudante');

-- Categorias
INSERT INTO tbl_categoria (categoria) VALUES
('Tecnologia'), ('Educação'), ('Saúde');

-- Áreas
INSERT INTO tbl_area (area) VALUES
('Desenvolvimento Web'), ('Inteligência Artificial'), ('Design');

-- Grupos
INSERT INTO tbl_grupo (nome, limite_membros, descricao, imagem, id_area, id_usuario)
VALUES
('Grupo Devs', 50, 'Grupo para desenvolvedores web.', 'grupo1.jpg', 1, 1),
('Grupo IA', 30, 'Discussões sobre inteligência artificial.', 'grupo2.jpg', 2, 1);

-- Calendário
INSERT INTO tbl_calendario (nome_evento, data_evento, descricao, link, id_usuario, id_grupo)
VALUES
('Reunião Semanal', '2025-11-15 10:00:00', 'Reunião com equipe de desenvolvimento.', 'https://meet.google.com/devs', 1, 1),
('Workshop IA', '2025-11-20 14:00:00', 'Evento sobre Machine Learning.', 'https://meet.google.com/ia', 2, 2);

-- Chat
INSERT INTO tbl_chat (remetente, destinatario)
VALUES (1, 2), (2, 1);

-- Chat Room
INSERT INTO tbl_chat_room (tipo, id_grupo)
VALUES ('privado', NULL), ('grupo', 1);

-- Mensagens
INSERT INTO tbl_mensagens (conteudo, id_chat, id_usuario, id_chat_room, id_grupo)
VALUES
('Olá Maria!', 1, 1, 1, NULL),
('Oi Gabriel! Tudo bem?', 2, 2, 1, NULL),
('Bem-vindos ao grupo Devs!', 1, 1, 2, 1);

-- Chat Participant
INSERT INTO tbl_chat_participant (id_chat_room, id_usuario)
VALUES (1, 1), (1, 2), (2, 1);

-- Ebooks
INSERT INTO tbl_ebooks (titulo, preco, descricao, link_imagem, link_arquivo_pdf, id_usuario)
VALUES
('Guia do Desenvolvedor', 29.90, 'Aprenda desenvolvimento web moderno.', 'ebook1.jpg', 'ebook1.pdf', 1),
('Introdução à IA', 49.90, 'Conceitos fundamentais de inteligência artificial.', 'ebook2.jpg', 'ebook2.pdf', 2);

-- Usuário-Grupo
INSERT INTO tbl_usuario_grupo (id_usuario, id_grupo)
VALUES (1, 1), (2, 1), (2, 2);

-- Ebooks-Categoria
INSERT INTO tbl_ebooks_categoria (id_categoria, id_ebooks)
VALUES (1, 1), (2, 2);

-- ===========================================================
-- VIEWS
-- ===========================================================

CREATE VIEW vw_usuario AS
SELECT * FROM tbl_usuario;

CREATE VIEW vw_categoria AS
SELECT * FROM tbl_categoria;

CREATE VIEW vw_area AS
SELECT * FROM tbl_area;

CREATE VIEW vw_grupo AS
SELECT * FROM tbl_grupo;

CREATE VIEW vw_calendario AS
SELECT * FROM tbl_calendario;

CREATE VIEW vw_chat AS
SELECT * FROM tbl_chat;

CREATE VIEW vw_mensagens AS
SELECT * FROM tbl_mensagens;

CREATE VIEW vw_chat_room AS
SELECT * FROM tbl_chat_room;

CREATE VIEW vw_chat_participant AS
SELECT * FROM tbl_chat_participant;

CREATE VIEW vw_ebooks AS
SELECT * FROM tbl_ebooks;

CREATE VIEW vw_usuario_grupo AS
SELECT * FROM tbl_usuario_grupo;

CREATE VIEW vw_ebooks_categoria AS
SELECT * FROM tbl_ebooks_categoria;

-- ===========================================================
-- CREDENCIAIS (comentadas - apenas referência)
-- ===========================================================
-- NOME: GABRIEL SILVA GUEDES
-- USER: guedesadmin
-- SENHA: journey-tcc-#01
-- DATABASE_URL="mysql://guedesadmin:journey-tcc-%2301@db-journey.mysql.database.azure.com:3306/db_journey?sslaccept=accept_invalid_certs"
-- ===========================================================
