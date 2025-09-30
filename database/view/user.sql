CREATE VIEW vw_usuario AS
SELECT id_usuario, nome_completo, email, data_nascimento, foto_perfil, descricao, senha, tipo_usuario FROM tbl_usuario;
