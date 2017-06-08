'use strict'

//data access
//var genericDataAccess=require('jubi-mongoose-data-access');

//controller
var controllerInit=require('jubi-express-controller').init;

//services
var serviceFilter=require('./serviceFilter.js').init;
var createAccount=require('./service/createAccount.js').init;
var updateAccount=require('./service/updateAccount.js').init;

//global event emitter
const EventEmitter = require('events');
class GlobalEmitter extends EventEmitter {   }
const globalEmitter = new GlobalEmitter();
globalEmitter.setMaxListeners(3);

//url variables
const postUrlDef='/:type';
const getUrlDef='/';

//valid url's
var validRequestEntities={
                            "post":["userAccount/"],
                            "get":[]
                         };

const globalDataAccessCall='dataAccessCall';
const globalCallBackRouter='callbackRouter';

//variables required by controller init function
var routerInitModel={
        'globalEmitter':globalEmitter,
        'postUrlDef':postUrlDef,
        'getUrlDef':getUrlDef,
        'validRequestEntities':validRequestEntities,
        'callbackName':'callbackRouter',
        'nextCall':'service'
    };

//variables required by data access init function
var dataAccessInitModel={
        'globalEmitter':globalEmitter,
        'nextCall':'dataAccessCall'
        
    };
  
const commonAccessUrl="https://ancient-shore-46511.herokuapp.com/commonAccess/";
const guardKey="5923f40e07b1c909d06487ad";

//instantiating Handler,Service layer and Data Access layer

function init(){
    controllerInit(routerInitModel);
    serviceFilter(globalEmitter,'userAccount',globalCallBackRouter,commonAccessUrl,guardKey)
    createAccount(globalEmitter,'createAccount',globalCallBackRouter,commonAccessUrl,guardKey)
    updateAccount(globalEmitter,'updateAccount',globalCallBackRouter,commonAccessUrl,guardKey)
    //genericDataAccess(dataAccessInitModel);
}

//exports
module.exports.init=init;