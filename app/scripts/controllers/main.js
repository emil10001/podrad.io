'use strict';

myApp.controller('MainCtrl', function ($scope) {
    var analytics = analytics || null;
    if (!!analytics) {
        // You'll usually only ever have to create one service instance.
        var service = analytics.getService('podradio_chrome_app');

        // You can create as many trackers as you want. Each tracker has its own state
        // independent of other tracker instances.
        var tracker = service.getTracker('UA-41722344-2');  // Supply your GA Tracking ID.

        service.getConfig().addCallback(
            /** @param {!analytics.Config} config */
                function (config) {
                var permitted = myApp.askUser('Allow anonymous usage tracking?');
                config.setTrackingPermitted(permitted);
                if (permitted)
                    tracker.sendAppView('main');
            });
    }
});
