/**
 * Created by ejf3 on 12/7/13.
 */
'use strict';

myUtils.factory('LocalWrapper', function () {
    function LocalWrapper() {}

    LocalWrapper.get = function(key, callback) {
        if (!callback || callback === null || callback === undefined){
            callback = function(results){console.log('results',results); };
        }

        if (!!chrome){
            chrome.storage.sync.get(key,callback);
        } else {
//            callback(localStorage[key]);
        }
    };

    LocalWrapper.set = function (key, val, callback) {
        var newSomething = {};
        newSomething[key] = val;
        console.log('set',newSomething);
        if (!callback){
            callback = function(){};
        }

        if (!!chrome){
            chrome.storage.sync.set(newSomething,callback);
        } else {
            localStorage[key] = val;
            callback();
        }

    };

    LocalWrapper.remove = function(key, callback){
        var newSomething = {};
        newSomething[key] = "";
        console.log('remove',newSomething);
        if (!callback){
            callback = function(){};
        }

        if (!!chrome){
            chrome.storage.sync.set(newSomething,callback);
        } else {
            localStorage[key] = "";
            callback();
        }
    }

    return LocalWrapper;
});