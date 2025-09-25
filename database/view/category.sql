
-- =============================
-- VIEWS
-- =============================

-- View para listar todas as categorias
CREATE VIEW vw_categorias AS
SELECT id_categoria, nome
FROM tbl_categoria;

-- View para listar uma categoria pelo ID
CREATE VIEW vw_categoria_id AS
SELECT id_categoria, nome
FROM tbl_categoria;
