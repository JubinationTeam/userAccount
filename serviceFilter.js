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
    
    console.log(model.req.body.newTags+"BBBBOOOODDDDDYYYYY")
    
    var body={
                    "mod"       : "guard",
                    "operation" : "read",
                    "data"      : {	
                                    "key"   : guardKey,
                                    "schema": "Lead",
                                    "pageNo": "1",
                                    "data"  : {
                                                "email"     :model.req.body.data.email,
                                               // "email"     : "bil123456778@gmail.com"
//                                            "email"     : "bil1234567gyjgfyjugfyujgyi78@gmail.com"
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
//                        model.info=JSON.parse(body)
                        body=JSON.parse(body)
                         if(body.data.length==0&&body.data instanceof Array){
                             console.log("MAIL ID DOES NOT EXIST")
                             email=false
                              mobileReadFunction()
                             console.log(body)
                         }
                         else{
                             console.log("MAIL ID DOES EXIST")
                             email=true
                             mobileRead()
                         }
//                        model.email=true
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
    console.log("IM IN EMAIL READ")
    var body={
                    "mod"       : "guard",
                    "operation" : "read",
                    "data"      : {	
                                    "key"   : guardKey,
                                    "schema": "Primary",
                                    "pageNo": "1",
                                    "data"  : {
                                                "mobile"     :model.req.body.data.mobile,
//                                                "mobile"     : "9820072155"
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
//                        model.info=JSON.parse(body)  
//                        model.info=JSON.parse(body)  
                        body=JSON.parse(body)
                        console.log(body)
                         if(body.data.length==0&&body.data instanceof Array){
                             console.log("MOBILE DOES NOT EXIST")
                             mobile=false
                             serviceCallDecision()
                         }
                         else{
                             console.log("MOBILE DOES EXIST")
                             mobile=true
                             serviceCallDecision()
                         }
//                        model.email=true
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

function serviceCallDecision(){
    console.log(email+" "+mobile)
    if(email||mobile){
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