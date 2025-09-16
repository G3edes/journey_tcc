/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de cadastro
 * DATA: 16/09/2025
 * AUTOR: Gabriel Guedes
 * Versão: 1.0
 **************************************************************************************************************************/

//import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

//Instancia (criar um objeto a ser utilizado) a biblioteca do prisma/client
const prisma = new PrismaClient()

const inserirUsuario = async (dados) => {
    try {
      const sql = `
        INSERT INTO tbl_usuario (
          nome_completo,
          email,
          senha,
          data_nascimento,
          foto_perfil,
          descricao,
          tipo_usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      const result = await prisma.$executeRawUnsafe(sql, 
        dados.nome_completo, 
        dados.email, 
        dados.senha, 
        dados.data_nascimento, 
        dados.foto_perfil || null, 
        dados.descricao || null, 
        dados.tipo_usuario
      )
  
      return result ? true : false
  
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const updateUsuario = async (dados) => {
    try {
      if (!dados || !dados.id) return false
  
      const result = await prisma.$executeRaw`
        UPDATE tbl_usuario
        SET
          nome_completo = ${dados.nome_completo ?? null},
          email         = ${dados.email ?? null},
          senha         = ${dados.senha ?? null},
          data_nascimento = ${dados.data_nascimento ?? null},
          foto_perfil   = ${dados.foto_perfil ?? null},
          descricao     = ${dados.descricao ?? null},
          tipo_usuario  = ${dados.tipo_usuario ?? null}
        WHERE id_usuario = ${Number(dados.id)}
      `;
  
      return !!result 
    } catch (error) {
      console.error(error)
      return false
    }
  }

const updateSenhaUsuario = async (dados) => {
    
    try {
        if (!dados || !dados.id) return false
  
      const result = await prisma.$executeRaw`
        UPDATE tbl_usuario
        SET
          senha          = ${dados.senha ?? null}
        WHERE id_usuario = ${Number(dados.id)}
      `;



        if(result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteUsuario = async function(id){
    try {
        //               FEITO PARA FAZER A EXCUÇÃO NO BANCO
        const result = await prisma.$executeRaw`
        DELETE FROM tbl_usuario
        WHERE
        id_usuario = ${id}`

        if (result)
            return true
        else 
            return false
    } catch (error) {
        return false
    }
}

const selectAllUsuario = async function(){
    try {
        let sql = 'select * from tbl_usuario'

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const selectusuarioById = async function(id){
    try {
        //                       ISSO DEVOLVE O ARRAY
        const result = await prisma.$queryRaw`
        SELECT * FROM tbl_usuario
        WHERE
        id_usuario = ${id}`
        

        if (result)
            return result.length > 0 ? result[0] : false
        else 
            return false
    } catch (error) {
        return false
    }
}
const selectLastId = async function() {
    try {

        const result = await prisma.$queryRaw`
        SELECT id_usuario FROM tbl_usuario
        ORDER BY id_usuario DESC LIMIT 1`

        //let sql = 'select id_usuario from tbl_usuario order by id_usuario desc limit 1'
        if (result)
            return result[0].id_usuario
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}


module.exports = {
    inserirUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuario,
    selectusuarioById,
    selectLastId,
    updateSenhaUsuario
}