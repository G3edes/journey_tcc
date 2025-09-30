DELIMITER $$
CREATE PROCEDURE inserir_area(
	IN p_area VARCHAR(100)
)
BEGIN
    INSERT INTO tbl_area (
	area
) VALUES (
	p_area
);

END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE update_area(
	IN p_id INT, 
    IN p_area VARCHAR(100)
)
BEGIN
    UPDATE tbl_area
    SET area = p_area
    WHERE id_area = p_id;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE delete_area(
	IN p_id INT
)
BEGIN
    DELETE FROM tbl_area
    WHERE id_area = p_id;
END $$
DELIMITER ;