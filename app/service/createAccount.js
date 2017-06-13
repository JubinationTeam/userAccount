'use strict'

//node dependencies
var request = require('request');
var bcrypt = require('bcryptjs');

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
 
//function to setup the model's event listener 
function setup(model)
{
    model.once("createAccountService",createUserAccountFactory);
}

//function to create a new 'createUserAccount' function for each model
function createUserAccountFactory(model){
    new createUserAccount(model);
}

//function to generate user credentials and create user account
function createUserAccount(model){

model.req.body.data.password="abcd"

var salt="$2a$10$QEqrvn/5vJyMDeupkSKbCe6rRQzGmsDq4Yn5Oa4"

 bcrypt.hash(model.req.body.data.password, salt, function(err, hash) {
        
     if(err){
         model.info=err
         model.emit(globalCallBackRouter,model)
     }
     else{
            model.req.body.data.password=hash
            
            //specifying the leadId
            model.req.body.data.tags[0].leadId=model.req.body.data.leadId
                  
            var createProperty={
                                "mod"       : "guard",
                                "operation" : "create",
                                "data"      : {	
                                                "key"   : guardKey,
                                                "schema": "Primary",
                                                "data"  : {
                                                            "name"      :  model.req.body.data.name,
                                                            "mobile"    :  model.req.body.data.mobile,
                                                            "email"     :  model.req.body.data.email,
                                                            "address"   :  model.req.body.data.address,
                                                            "password"  :  model.req.body.data.password,
                                                            "dob"       :  model.req.body.data.dob,
                                                            "gender"    :  model.req.body.data.gender,
                                                            "age"       :  model.req.body.data.age,
                                                            "city"      :  model.req.body.data.city,
                                                            "pincode"   :  model.req.body.data.pincode,
                                                            "tags"      :  model.req.body.data.tags
                                                         }
                                            } 
                            };

            var createRequestParams     = {
                                    url     : commonAccessUrl,
                                    method  : 'POST',
                                    headers : headers,
                                    body    : JSON.stringify(createProperty)
                            }
                        request(createRequestParams, function (error, response, body){
                            
                            if(body){
                                    try{
                                        model.info=JSON.parse(body)
                                        model.emit(globalCallBackRouter,model)
                                    }
                                    catch(err){
                                        model.info={error:err,
                                                        place:"User Account APi : Create Account : Error while parsing"}
                                        model.emit(globalCallBackRouter,model)
                                    }
                            }
                            else if(response){
                                    model.info={error:response,
                                                        place:"User Account APi : Create Account : Error in response"}
                                    model.emit(globalCallBackRouter,model)
                            }
                            else if(error){
                                    model.info={error:error,
                                                        place:"User Account APi : Create Account : Request Error"}
                                    model.emit(globalCallBackRouter,model)
                            }
                            else{
                                    model.info={error:"Error while creating User Account : User Account \n"+body,
                                                        place:"User Account APi : Create Account"}
                                    model.emit(globalCallBackRouter,model)
                            }
                        }) 

        }
     
    });
}

//exports
module.exports.init=init;