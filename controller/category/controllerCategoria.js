const DAOCategoria=require('../../model/DAO/category/categoryDAO.js')

const message =require('../../module/config.js')

const inserirCategoria = async (categoria, contentType) => {
    let dados = {}

    try {
        if (contentType && contentType.includes('application/json')) {

            if (categoria.categoria == ''                || categoria.categoria == undefined            || categoria.categoria == null             || categoria.categoria.length>100
            ){

                return message.ERROR_REQUIRED_FIELDS
            }else{
                let result = await DAOCategoria.inserirCategoria(categoria)
                if (result) {
                    return message.SUCESS_CREATED_ITEM
                }else{
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        }else{
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarCategoria = async (id, categoria, contentType) => {
    try {
        if (contentType == 'application/json') {
            if (categoria.categoria == ''                || categoria.categoria == undefined            || categoria.categoria == null             || categoria.categoria.length>100   
            ){
                


                return message.ERROR_REQUIRED_FIELDS
            }
            let result=await DAOCategoria.selectCategoriaById(id)
            if (result != false || typeof(result)== 'object') {
                if (result.length>0) {
                    categoria.id=parseInt(id)
                    
                    let result = await DAOCategoria.updateCategoria(categoria)
                    if (result) {
                        return message.SUCESS_UPDATED_ITEM
                    }else{
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return message.ERROR_NOT_FOUND
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
       return message.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

const excluirCategoria = async function (id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <= 0){
            return message.ERROR_REQUIRED_FIELDS //400
        }else{

            //função que verifica se ID existe no BD
            let results = await DAOCategoria.selectCategoriaById(parseInt(id))

            if(results != false || typeof(results) == 'object'){
                //se exestir, faremos o delete
                if(results.length > 0){
                    //delete    
                    let result = await DAOCategoria.deleteCategoria(parseInt(id))

                    if(result){
                        return message.SUCCESS_DELETED_ITEM
                    }else{
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return message.ERROR_NOT_FOUND
                }
                
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarCategoria = async function () {
    try {
        let dados={}
        let result = await DAOCategoria.selectAllCategoria()
        if (result != false || typeof(result)=='object') {
        
            if(result.length>0){
                dados.status=true
                dados.status_code=200,
                dados.itens=result.length
                dados.categoria=result
                return dados
            }else{
                return message.ERROR_NOT_FOUND
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
        //chama a funcao para retornar categorias cadastradas
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER ///500
    }
}

const buscarCategoria = async function (id) {
    let dados={}
    try {
        
        if (id == ''|| id == undefined|| id == null|| id<0 
        ) {
            return message.ERROR_REQUIRED_FIELDS //400
        }else{
            let result = await DAOCategoria.selectcategoriaById(id)
            if (result != false || typeof(result)=='object'){
                if (result.length>0) {
                    dados={
                        status:true,
                        status_code:200,
                        categoria:result
                    }
                    return dados
                }else{
                    return message.ERROR_NOT_FOUND//404
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}
/*const buscarGrupoCategoria = async function (id) {
    let dados={}
    try {
        
        if (id == ''|| id == undefined|| id == null|| id<0 
        ) {
            return message.ERROR_REQUIRED_FIELDS //400
        }else{
            let result = await DAOEventoCategoria.selectEventoByIdCategoria(id)
            if (result != false || typeof(result)=='object'){
                if (result.length>0) {
                    dados={
                        status:true,
                        status_code:200,
                        categoria:result
                    }
                    return dados
                }else{
                    return message.ERROR_NOT_FOUND//404
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}*/


module.exports={
    inserirCategoria,
    listarCategoria,
    buscarCategoria,
    excluirCategoria,
    atualizarCategoria,
}