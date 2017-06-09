'use strict'

//node dependencies
var request = require('request');

//user defined dependencies

// event names
const callbackOperation="callbackOperation"

// global event emitter
var global;

var email,mobile;

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

// function to instantiate
function init(globalEmitter,globalCall,callback,url,key){
//    globalEmitter.on(globalCall,setup)
    console.log(globalCall)
    globalEmitter.on(globalCall,setup)
    global=globalEmitter;
    callbackRouter=callback;
    commonAccessUrl=url;
    guardKey=key
}

function setup(model)
{
    console.log("IM IN USER ACC SERVICE FILTER:::::::")
    model.once("service",serviceCallDecisionFactory);
}

function serviceCallDecisionFactory(model){    
    new emailRead(model)
}
                    
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
                       console.log(JSON.stringify(body)+"::::::::::::::::::"+model.req.body.data.email)
                         if(body.data.length>0&&(!!body.data) && (body.data.constructor === Array)){
                             model.email=true
                         }
                         
                        mobileRead(model)
                    }   
                    catch(err){
//                        model.info={error:err}
                        console.log(err)
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access User Account"}
                    global.emit(callbackRouter,model)
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access User Account"}
                    global.emit(callbackRouter,model)
            }      
            else{
                    model.info={error:"Error in Common Access [User Account] : Common Access"};
                    global.emit(callbackRouter,model)
            }
        
        }) 
}  

function mobileRead(model){
    console.log("IM IN MOBILE READ")
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
                        console.log(JSON.stringify(body)+"::::::::::::::::::"+model.req.body.data.mobile)
                         if(body.data.length>0&&(!!body.data) && (body.data.constructor === Array)){
                             model.mobile=true
                         }
                         serviceCallDecision(model)
                    }
                    catch(err){
//                        model.info={error:err}
                        console.log(err)
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access User Account"}
                    model.emit(callbackRouter,model)
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access User Account"}
                    model.emit(callbackRouter,model)
            }      
            else{
                    model.info={error:"Error in Common Access [User Account] : Common Access"};
                    model.emit(callbackRouter,model)
            }
  
        }) 
}

function serviceCallDecision(model){
    if(model.email||model.mobile){
        console.log("UPDATE ACCOUNT")
//        global.emit("updateAccount",model)
//        model.emit("updateAccountService",model)
    }
    else{
        console.log("CREATE ACCOUNT")
//        global.emit("createAccount",model)
//        model.emit("createAccountService",model)
    }
}

//exports
module.exports.init=init;