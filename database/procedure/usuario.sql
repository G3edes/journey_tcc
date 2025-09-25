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

DELIMITER ;
