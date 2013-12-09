/**
 * Created by ejf3 on 12/8/13.
 */
'use strict';

myService.service('SubscriptionService', function ($rootScope, Constants, IDB) {
    var self = this;
    this.myPods = [];
    this.podIds = [];
    this.fullPods = {};

    var defaultPodIds = [
        CryptoJS.MD5('http://www.npr.org/rss/podcast.php?id=510289').toString(CryptoJS.enc.Hex),
        CryptoJS.MD5('http://dunktankpodcast.podomatic.com/rss2.xml').toString(CryptoJS.enc.Hex),
        CryptoJS.MD5('http://feeds.feedburner.com/freakonomicsradio').toString(CryptoJS.enc.Hex),
        CryptoJS.MD5('ohttp://www.theskepticsguide.org/feed/rss.aspx?feed=SGU').toString(CryptoJS.enc.Hex)
    ];
    var defaultPods = [
        {'id': defaultPodIds[0],
            'name': 'Planet Money',
            'url': 'http://www.npr.org/rss/podcast.php?id=510289' },
        {'id': defaultPodIds[1],
            'name': 'Dunk Tank w/ Brian and Chet',
            'url': 'http://dunktankpodcast.podomatic.com/rss2.xml'},
        {'id': defaultPodIds[2],
            'name': 'Freakonomics',
            'url': 'http://feeds.feedburner.com/freakonomicsradio'},
        {'id': defaultPodIds[3],
            'name': 'Skeptics Guide to the Universe',
            'url': 'http://www.theskepticsguide.org/feed/rss.aspx?feed=SGU'}
    ];

    this.deletePod = function (toDelete) {
        IDB.remove("pods", toDelete.id);
    };

    this.addPod = function (newPod) {
        console.log('adding podcast ' + newpod.name + ':' + newpod.url);
        IDB.put("pods", newPod);
    };

    this.update = function (data) {
        $rootScope.$apply(function () {
            console.log('update, apply', data);
            self.fullPods = data;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    self.myPods.push(data[key]);
                    self.podIds.push(key);
                }
            }
            if (self.myPods.length <= 0)
                IDB.batchInsert('pods', defaultPods);
            else
                $rootScope.$broadcast("updatePods");
        });
    }

    var dbupdate = function (event, args) {
        console.log("pods DBUPDATE");
        console.log('args', args);
        var dbname = args[0],
            storeName = args[1],
            data = args[2];
        console.log('update', dbname, storeName, data);
        if (dbname === dbParams.name && 'pods' === storeName)
            self.update(data);
    };

    var getAll = function (event, data) {
        console.log("pods DBGETALL");
        var dbname = data[0],
            storeName = data[1],
            transaction = data[2];
        console.log('getAll', dbname, storeName, transaction);
        if (dbname === dbParams.name && 'pods' === storeName)
            getAllPods(transaction);
    };

    var getAllPods = function (transaction) {
        console.log('getAllPods', transaction);
        if (transaction instanceof IDBTransaction)
            IDB.getInit(transaction, 'pods');
        else
            IDB.getAll('pods');
    };

    var postInitDb = function (event, data) {
        var dbname = data[0],
            transaction = data[1];
        console.log('postInit', dbname, transaction);
        if (dbname !== dbParams.name)
            return;

        getAllPods(transaction);
    };

    $rootScope.$on('failure', function () {
        console.log('failed to open db')
    });
    $rootScope.$on('dbopenupgrade', postInitDb);
    $rootScope.$on('dbopen', postInitDb);

    $rootScope.$on('getinit', dbupdate);
    $rootScope.$on('getall', dbupdate);
    $rootScope.$on('remove', getAll);
    $rootScope.$on('put', getAll);
    $rootScope.$on('batchinsert', getAll);

});