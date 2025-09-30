DELIMITER $$

CREATE PROCEDURE inserir_grupo (
    IN p_nome            VARCHAR(100), 
    IN p_limite_membros  INT,
    IN p_descricao       TEXT,
    IN p_imagem          VARCHAR(255),
    IN p_id_usuario      INT,
    IN p_id_area         INT
)
BEGIN
    INSERT INTO tbl_grupo (
        nome,
        limite_membros,
        descricao,
        imagem,
        id_usuario,
        id_area
    ) VALUES (
        p_nome,
        p_limite_membros,
        p_descricao,
        p_imagem,
        p_id_usuario,
        p_id_area
    );

    -- Retornar número de linhas afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE update_grupo (
    IN p_id              INT,
    IN p_nome            VARCHAR(100),
    IN p_limite_membros  INT,
    IN p_descricao       TEXT,
    IN p_imagem          VARCHAR(255),
    IN p_id_usuario      INT,
    IN p_id_area         INT
)
BEGIN
    UPDATE tbl_grupo
    SET
        nome           = p_nome,
        limite_membros = p_limite_membros,
        descricao      = p_descricao,
        imagem         = p_imagem,
        id_usuario     = p_id_usuario,
        id_area        = p_id_area
    WHERE id_grupo = p_id;

    -- Retorna quantas linhas foram afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE delete_grupo (
    IN p_id INT
)
BEGIN
    DELETE FROM tbl_grupo
    WHERE id_grupo = p_id;

    -- Retorna quantas linhas foram afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;
