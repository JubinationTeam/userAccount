'use strict'

//node dependencies
var request = require('request');

// event names
const callbackOperation="callbackOperation"

// global event emitter
var global;

//Guard Access Variables
var commonAccessUrl;
var guardKey;

//callback variable
var callbackRouter;

//request headers constant
const headers     = {
                    'User-Agent':'Super Agent/0.0.1',
                    'Content-Type':'application/json'
                }

//function to instantiate
function init(globalEmitter,globalCall,callback,url,key){
    globalEmitter.on(globalCall,setup)
    global=globalEmitter;
    callbackRouter=callback;
    commonAccessUrl=url;
    guardKey=key
}

//function to setup the model's event listener    
function setup(model)
{
    model.once("service",emailReadFactory);
}

//function to create a new 'emailRead' function for each model 
function emailReadFactory(model){  
    model.accounts=[];
    new emailRead(model)
}
    
//function to read Primary schema of Guard module by the email parameter of the lead 
function emailRead(model){             
    
    var body={
                    "mod"       : "guard",
                    "operation" : "read",
                    "data"      : {	
                                    "key"   : guardKey,
                                    "schema": "Primary",
                                    "pageNo": "1",
                                    "data"  : {
                                                "email"     :model.req.body.data.email
                                            }  
                                }

                }
      
      var options     = {
                            url     : commonAccessUrl,
                            method  : 'POST',
                            headers : headers,
                            body    : JSON.stringify(body)
                    }
    
    request(options, function (error, response, body){
         
             if (body){
                     try{
                         body=JSON.parse(body)
                         if(body.data.length>0&&(!!body.data) && (body.data.constructor === Array)){
                                model.accounts.push(body.data[0]);
                                if(model.req.body.data.mobile==body.data.mobile){
                                    return serviceCallDecision(model);
                                }
                         }
                        mobileRead(model);
                    }   
                    catch(err){
                        model.info={error:err,
                                place:"User Account Module : Read by Email Function"}
                        model.emit(callbackRouter,model)

                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"User Account Module : Read by Email Function"}
                    model.emit(callbackRouter,model)
            }
            else if(error){
                    model.info={error:error,
                                place:"User Account Module : Read by Email Function"}
                    model.emit(callbackRouter,model)
            }      
            else{
                    model.info={error:"Error in User Account Module : Read by Email Function"};
                    model.emit(callbackRouter,model)
            }
        
        }) 
}  

//function to read Primary schema of Guard module by the mobile parameter of the lead 
function mobileRead(model){
    var body={
                    "mod"       : "guard",
                    "operation" : "read",
                    "data"      : {	
                                    "key"   : guardKey,
                                    "schema": "Primary",
                                    "pageNo": "1",
                                    "data"  : {
                                                "mobile"     :model.req.body.data.mobile
                                            }  
                                }

                }
    
      var options     = {
                            url     : commonAccessUrl,
                            method  : 'POST',
                            headers : headers,
                            body    : JSON.stringify(body)
                    }
    
    request(options, function (error, response, body){
        
             if (body){
                     try{ 
                        body=JSON.parse(body)
                         if(body.data.length>0&&(!!body.data) && (body.data.constructor === Array)){
                             model.accounts.push(body.data[0]);
                         }
                         serviceCallDecision(model);
                    }
                    catch(err){
                        model.info={error:err,
                                place:"User Account Module : Read by Mobile Function"}
                        model.emit(callbackRouter,model)
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"User Account Module : Read by Mobile Function"}
                    model.emit(callbackRouter,model)
            }
            else if(error){
                    model.info={error:error,
                                place:"User Account Module : Read by Mobile Function"}
                    model.emit(callbackRouter,model)
            }      
            else{
                    model.info={error:"Error in User Account Module : Read by Mobile Function"};
                    model.emit(callbackRouter,model)
            }
  
        }) 
}

//function to create an account for a new user or update the account of an existing user
function serviceCallDecision(model){
    if(model.accounts.length==0){
        global.emit("createAccount",model)
        model.emit("createAccountService",model)
    }
    else{
        global.emit("updateAccount",model)
        model.emit("updateAccountService",model)
    }
}

//exports
module.exports.init=init;