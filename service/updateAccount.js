'use strict'

//node dependencies
var request = require('request');
var eventEmitter = require('events'); 

//function specific event instance
class eventClass extends eventEmitter{}
const event = new eventClass()

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
 
function setup(model)
{
    model.once("updateAccountService",decide);
}

function decide(model){
    console.log(JSON.stringify(model.accounts[0])+"++++++")
     if(model.accounts[0].tags[model.accounts[0].tags.length-1].leadId==model.req.body.data.leadId){
            model.accounts[0].tags[model.accounts[0].tags.length-1]=model.req.body.data.tags[0]
            console.log("IM IN UPDATE")
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
                                                    tags:model.primaryTags
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
                    body=JSON.parse(body);
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
                //console.logg(error);
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