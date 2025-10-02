const DAOArea=require('../../model/DAO/area/areaDAO.js')

const message =require('../../module/config.js')

const inserirArea = async (area, contentType) => {
    let dados = {}
    try {
        if (contentType && contentType.includes('application/json')) {

            if (area.area == ''                || area.area == undefined            || area.area == null             || area.area.length>100
            ){

                return message.ERROR_REQUIRED_FIELDS
            }else{
                let result = await DAOArea.inserirArea(area)
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

const atualizarArea = async (id, area, contentType) => {
    try {
        console.log(area)
        if (contentType == 'application/json') {
            if (area.area == ''                || area.area == undefined            || area.area == null             || area.area.length>100   
            ){
                return message.ERROR_REQUIRED_FIELDS
            }
            let result=await DAOArea.selectAreaById(id)
            if (result != false || typeof(result)== 'object') {
                if (result.length>0) {
                    area.id=parseInt(id)
                    
                    let result = await DAOArea.updateArea(area)
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

const excluirArea = async function (id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <= 0){
            return message.ERROR_REQUIRED_FIELDS //400
        }else{

            //função que verifica se ID existe no BD
            let results = await DAOArea.selectAreaById(parseInt(id))

            if(results != false || typeof(results) == 'object'){
                //se exestir, faremos o delete
                if(results.length > 0){
                    //delete    
                    let result = await DAOArea.deleteArea(parseInt(id))

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

const listarArea = async function () {
    try {
        let dados={}
        let result = await DAOArea.selectAllArea()
        if (result != false || typeof(result)=='object') {
        
            if(result.length>0){
                dados.status=true
                dados.status_code=200,
                dados.itens=result.length
                dados.Area=result
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

const buscarArea = async function (id) {
    let dados={}
    try {
        
        if (id == ''|| id == undefined|| id == null|| id<0 
        ) {
            return message.ERROR_REQUIRED_FIELDS //400
        }else{
            let result = await DAOArea.selectAreaById(id)
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
    inserirArea,
    listarArea,
    buscarArea,
    excluirArea,
    atualizarArea,
}