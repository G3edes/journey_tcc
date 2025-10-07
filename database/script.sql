create database db_journey;

use db_journey;


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
CREATE TABLE tbl_codigo_recuperacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(60) NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    expiracao DATETIME NOT NULL
);
CREATE TABLE tbl_grupo (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    limite_membros INT,
    descricao TEXT,
    imagem VARCHAR(255),
    id_area INT,
    id_usuario INT,
    CONSTRAINT fk_grupo_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario),
    CONSTRAINT fk_grupo_area FOREIGN KEY (id_area) REFERENCES tbl_area(id_area)
);

CREATE TABLE tbl_categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL
);
CREATE TABLE tbl_area (
    id_area INT AUTO_INCREMENT PRIMARY KEY,
    area VARCHAR(100) NOT NULL
);
CREATE TABLE tbl_usuario_grupo (
    id_usuario_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    entrou_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Definição das chaves estrangeiras
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) 
        REFERENCES tbl_usuario (id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_grupo FOREIGN KEY (id_grupo) 
        REFERENCES tbl_grupo (id_grupo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);