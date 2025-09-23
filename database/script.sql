create database db_journey;
use db_journey;


CREATE TABLE tbl_usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    foto_perfil VARCHAR(255),
    descricao TEXT,
    senha VARCHAR(25) NOT NULL,
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
    area VARCHAR(100),
    limite_membros INT,
    descricao TEXT,
    imagem VARCHAR(255)
);


-----Procedure inserir usuario------
CREATE PROCEDURE inserir_usuario (
    IN p_nome_completo   VARCHAR(255),
    IN p_email           VARCHAR(255),
    IN p_senha           VARCHAR(255),
    IN p_data_nascimento DATE,
    IN p_foto_perfil     VARCHAR(255),
    IN p_descricao       TEXT,
    IN p_tipo_usuario    VARCHAR(50),
    IN p_linkedin_url    VARCHAR(255)
)
BEGIN
    INSERT INTO tbl_usuario (
        nome_completo,
        email,
        senha,
        data_nascimento,
        foto_perfil,
        descricao,
        tipo_usuario,
        linkedin_url
    ) VALUES (
        p_nome_completo,
        p_email,
        p_senha,
        p_data_nascimento,
        p_foto_perfil,
        p_descricao,
        p_tipo_usuario,
        p_linkedin_url
    );

    -- Retornar número de linhas afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;
