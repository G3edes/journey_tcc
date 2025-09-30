-- =============================
-- PROCEDURES
-- =============================

-- CREATE (POST)
DELIMITER $$
CREATE PROCEDURE sp_insert_categoria(IN p_categoria VARCHAR(100))
BEGIN
    INSERT INTO tbl_categoria (categoria)
    VALUES (p_categoria);
END $$
DELIMITER ;

-- UPDATE (PUT)
DELIMITER $$
CREATE PROCEDURE sp_update_categoria(IN p_id INT, IN p_categoria VARCHAR(100))
BEGIN
    UPDATE tbl_categoria
    SET nome = p_categoria
    WHERE id_categoria = p_id;
END $$
DELIMITER ;

-- DELETE
DELIMITER $$
CREATE PROCEDURE sp_delete_categoria(IN p_id INT)
BEGIN
    DELETE FROM tbl_categoria
    WHERE id_categoria = p_id;
END $$
DELIMITER ;