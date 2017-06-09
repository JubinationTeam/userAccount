'use strict'

//node dependencies
var request = require('request');
var eventEmitter = require('events');
var bcrypt = require('bcryptjs');

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
    model.once("createAccountService",createCredentialsFactory);
}

function createCredentialsFactory(model){
    new createCredentials(model);
}

function createCredentials(model){

model.req.body.data.password="abcd"

var salt="$2a$10$QEqrvn/5vJyMDeupkSKbCe6rRQzGmsDq4Yn5Oa4"

 bcrypt.hash("B4c0/\/", salt, function(err, hash) {
        
     if(err){
         console.log(err)
     }
     else{
            console.log(hash)
            model.req.body.data.password=hash
                
            var updateProperty={
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
                                                            "stage"     :  "",
                                                            "tags"      :  model.req.body.data.tags     
                                                         }
                                            } 
                            };

            console.log(updateProperty.data.data.tags)

            var updateRequestParams     = {
                                    url     : commonAccessUrl,
                                    method  : 'POST',
                                    headers : headers,
                                    body    : JSON.stringify(updateProperty)
                            }
                    //    request(updateRequestParams, function (error, response, body){
                    //        
                    //        if(body){
                    //                body=JSON.parse(body);
                    //                model.emit(globalCallBackRouter,model)
                    //        }
                    //        else if(response){
                    //                model.info=response;
                    //                model.emit(globalCallBackRouter,model)
                    //        }
                    //        else if(error){
                    //                //console.logg(error);
                    //                model.info=error;
                    //                model.emit(globalCallBackRouter,model)
                    //        }
                    //        else{
                    //                model.info="Error while creating User Account : User Account \n"+body;
                    //                model.emit(globalCallBackRouter,model)
                    //        }
                    //    }) 

        }
     
    });
}





//exports
module.exports.init=init;