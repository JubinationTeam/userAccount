'use strict'

//node dependencies
var request = require('request');

// event names
var globalDataAccessCall;
var globalCallBackRouter;

// global event emitter
var global;

//Guard Access Variables
var commonAccessUrl;
var guardKey;

//global variables
const headers     = {
                        'User-Agent':'Super Agent/0.0.1',
                        'Content-Type':'application/json'
                }

// function to instantiate
function init(globalEmitter,globalCall,callback,url,key){
    globalEmitter.on(globalCall,setup)
    global=globalEmitter;
    globalCallBackRouter=callback;
    commonAccessUrl=url;
    guardKey=key;
}
 
//function to create model's event listener 
function setup(model)
{
    model.once("updateAccountService",decide);
}

//function to update account based on the transaction 
function decide(model){
     if(model.accounts[0].tags[model.accounts[0].tags.length-1].leadId==model.req.body.data.leadId){
            model.req.body.data.tags[0].test="test"
            model.accounts[0].tags[model.accounts[0].tags.length-1]=model.req.body.data.tags[0]
     }
     else{
            model.accounts[0].push(model.req.body.data.tags[0])
     }
     model.primaryDocToUpdateId=model.accounts[0]._id
     updateAccount(model)
}
            
function updateAccount(model){
    
    var updateProperty={
                        "mod"       : "guard",
                        "operation" : "update",
                        "data"      : {	
                                        "key"   : guardKey,
                                        "schema": "Primary",
                                        "id"    :model.primaryDocToUpdateId,
                                        "data"  : {
                                                    tags:model.accounts[0].tags
                                                 }
                                    } 
                    };
    
    var updateRequestParams     = {
                            url     : commonAccessUrl,
                            method  : 'POST',
                            headers : headers,
                            body    : JSON.stringify(updateProperty)
                    }
    request(updateRequestParams, function (error, response, body){
        
        if(body){
                try{
                    model.info=JSON.parse(body)+": Account updated successfully for Lead Id :"+model.req.body.data.leadId;
                    model.emit(globalCallBackRouter,model)
                }
                catch(err){
                    model.info=err
                    model.emit(globalCallBackRouter,model)
                }
        }
        else if(response){
                model.info=response;
                model.emit(globalCallBackRouter,model)
        }
        else if(error){
                model.info=error;
                model.emit(globalCallBackRouter,model)
        }
        else{
                model.info="Error while updating User Account : User Account \n"+body;
                model.emit(globalCallBackRouter,model)
        }
    }) 

}

//exports
module.exports.init=init;