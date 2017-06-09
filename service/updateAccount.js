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
    model.once("updateAccountService",updateFactory);
}

function updateFactory(model){
    console.log(model.accounts+"AAAAAAACCCOOUNTS")
    //new createCredentials(model);
}

function createCredentials(model){
    
    var updateProperty={
                        "mod"       : "guard",
                        "operation" : "create",
                        "data"      : {	
                                        "key"   : guardKey,
                                        "schema": "Primary",
                                        "data"  : {
                                                        
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
                body=JSON.parse(body);
                model.emit(globalCallBackRouter,model)
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
                model.info="Error while creating User Account : User Account \n"+body;
                model.emit(globalCallBackRouter,model)
        }
    }) 

}

//exports
module.exports.init=init;