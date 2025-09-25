-- Procedure inserir grupo------
DELIMITER $$

CREATE PROCEDURE inserir_grupo (
    IN p_nome   		 	VARCHAR(100),
    IN p_area           	VARCHAR(100),
    IN p_limite_membros     INT,
    IN p_descricao		 	TEXT,
    IN p_imagem     		VARCHAR(255)
)
BEGIN
    INSERT INTO tbl_grupo (
        nome,
        area,
        limite_membros,
        descricao,
        imagem
    ) VALUES (
        p_nome,
        p_area,
        p_limite_membros,
        p_descricao,
        p_imagem
    );

    -- Retornar número de linhas afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;

-- Procedure Update Grupo-----------
DELIMITER $$

CREATE PROCEDURE update_grupo (
    IN p_id		            INT,
    IN p_nome				VARCHAR(100),
    IN p_area           	VARCHAR(100),
    IN p_limite_membros     VARCHAR(255),
    IN p_descricao      	TEXT,
    IN p_imagem   			VARCHAR(255)
)
BEGIN
    UPDATE tbl_grupo
    SET
        nome   			= p_nome,
        area            = p_area,
        limite_membros  = p_limite_membros,
        descricao       = p_descricao,
        imagem    		= p_imagem
    WHERE id_grupo = p_id;

    -- Retorna quantas linhas foram afetadas
    SELECT ROW_COUNT() AS linhas_afetadas;
END$$

DELIMITER ;

---Procedure para delete grupo ----
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