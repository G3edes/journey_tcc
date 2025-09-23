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
    area VARCHAR(100),
    limite_membros INT,
    descricao TEXT,
    imagem VARCHAR(255)
);


-----Procedure inserir usuario------
DELIMITER $$

CREATE PROCEDURE inserir_usuario (
    IN p_nome_completo   VARCHAR(255),
    IN p_email           VARCHAR(255),
    IN p_senha           VARCHAR(255),
    IN p_data_nascimento DATE,
    IN p_foto_perfil     VARCHAR(255),
    IN p_descricao       TEXT,
    IN p_tipo_usuario    VARCHAR(50)
)
BEGIN
    INSERT INTO tbl_usuario (
        nome_completo,
        email,
        senha,
        data_nascimento,
        foto_perfil,
        descricao,
        tipo_usuario
    ) VALUES (
        p_nome_completo,
        p_email,
        p_senha,
        p_data_nascimento,
        p_foto_perfil,
        p_descricao,
        p_tipo_usuario
    );

    -- Retornar número de linhas afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;

-------Procedure Update Usuario-----------
DELIMITER $$

CREATE PROCEDURE update_usuario (
    IN p_id             INT,
    IN p_nome_completo  VARCHAR(255),
    IN p_email          VARCHAR(255),
    IN p_senha          VARCHAR(255),
    IN p_data_nascimento DATE,
    IN p_foto_perfil    VARCHAR(255),
    IN p_descricao      TEXT,
    IN p_tipo_usuario   VARCHAR(50)
)
BEGIN
    UPDATE tbl_usuario
    SET
        nome_completo   = p_nome_completo,
        email           = p_email,
        senha           = p_senha,
        data_nascimento = p_data_nascimento,
        foto_perfil     = p_foto_perfil,
        descricao       = p_descricao,
        tipo_usuario    = p_tipo_usuario
    WHERE id_usuario = p_id;

    -- Retorna quantas linhas foram afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;

DELIMITER $$
----PROCEDURE PARA REC-SENHA----
CREATE PROCEDURE update_senha_usuario (
    IN p_id INT,
    IN p_nova_senha VARCHAR(255)
)
BEGIN
    UPDATE tbl_usuario
    SET senha = p_nova_senha
    WHERE id_usuario = p_id;

    -- Retorna quantas linhas foram afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;

---Procedure para delete user ----
DELIMITER $$

CREATE PROCEDURE delete_usuario (
    IN p_id INT
)
BEGIN
    DELETE FROM tbl_usuario
    WHERE id_usuario = p_id;

    -- Retorna quantas linhas foram afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

--DELIMITER ;

---Procedure para voltar todos os usuarios----
--DELIMITER $$
--CREATE PROCEDURE select_all_usuario()
--BEGIN
--    SELECT * FROM tbl_usuario;
--END$$

--DELIMITER ;

---Procedure para voltar id usuario----
--DELIMITER $$
--CREATE PROCEDURE select_usuario_by_id(IN p_id INT)
--BEGIN
--    SELECT * FROM tbl_usuario
--    WHERE id_usuario = p_id
--    LIMIT 1;
--END$$

--DELIMITER ;

DELIMITER $$

---Procedure para voltar email usuario----
CREATE PROCEDURE select_usuario_by_email(IN p_email VARCHAR(255))
BEGIN
    SELECT * FROM tbl_usuario
    WHERE email = p_email
    LIMIT 1;
END$$

DELIMITER ;

---Procedure para voltar último usuario----


DELIMITER $$

CREATE PROCEDURE select_last_usuario_id()
BEGIN
    SELECT id_usuario FROM tbl_usuario
    ORDER BY id_usuario DESC
    LIMIT 1;
END$$

DELIMITER ;
