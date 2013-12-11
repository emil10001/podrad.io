/**
 * Created by ejf3 on 12/7/13.
 */
'use strict';

angular.module('angular-chrome-localstorage', [ 'ngResource' ])
    .service('LocalWrapper', function ($rootScope) {
        var chromeStore = null;
        (function(){
            if (!!chrome && !!chrome.storage) {
                chromeStore = chrome.storage.local;
            }
        })();

        this.syncEnabled = function(sync){
            if (sync)
                chromeStore = chrome.storage.sync;
            else
                chromeStore = chrome.storage.local;
        }

        this.get = function (key, EMIT_STR) {
            if (!!chromeStore) {
                chromeStore.get(key, function(data){
                    $rootScope.$emit(EMIT_STR, data);
                });
            } else {
                $rootScope.$emit(EMIT_STR, localStorage[key]);
            }
        };

        this.set = function (key, val, EMIT_STR) {
            var newSomething = {};
            newSomething[key] = val;

            if (!!chromeStore) {
                chromeStore.set(newSomething, function(){
                    if (!!EMIT_STR)
                        $rootScope.$emit(EMIT_STR);
                });
            } else {
                localStorage[key] = val;
                if (!!EMIT_STR)
                    $rootScope.$emit(EMIT_STR);
            }
        };

        this.remove = function (key, EMIT_STR) {
            var newSomething = {};
            newSomething[key] = "";

            if (!!chromeStore) {
                chromeStore.set(newSomething, function(){
                    if (!!EMIT_STR)
                        $rootScope.$emit(EMIT_STR);
                });
            } else {
                localStorage[key] = val;
                if (!!EMIT_STR)
                    $rootScope.$emit(EMIT_STR);
            }
        }

    });