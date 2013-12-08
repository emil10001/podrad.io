/**
 * Created by ejf3 on 12/7/13.
 */
'use strict';

myService.service('PlayListService', function ($rootScope, Constants, IDB) {
    this.playlist = {};
    this.playlist.curPlaying = {};
    this.playlist.playlist = [];
    var self = this;

    var dbParams = {
        name: 'podradio',
        version: 1,
        options: [
            {
                storeName: 'playlist',
                keyPath: 'created_at',
                indexes: [
                    { name: 'audio', unique: true },
                    { name: 'url', unique: false }
                ]
            }
        ]
    };
    IDB.openDB(dbParams.name, dbParams.version, dbParams.options);

    this.getCurAudio = function () {
        if (!!this.playlist.curPlaying.progress)
            return this.playlist.curPlaying.audio + "#t=" + this.playlist.curPlaying.progress;
        else
            return this.playlist.curPlaying.audio;
    };

    this.getCurType = function () {
        return this.playlist.curPlaying.type;
    };

    this.removeItem = function (item) {
        IDB.remove("playlist", item.created_at);
        this.playlist.playlist = this.playlist.playlist.filter(function (val) {
            return val["audio"] !== item.audio;
        });
        if (!!localStorage["curPlayingAudio"] === item.audio)
            localStorage[item.audio] = "";

        console.log('remove', this.playlist.playlist);
    };

    this.addItem = function (item) {
        var myItem = {};
        myItem.created_at = new Date().getTime();
        myItem.image = item.image;
        myItem.url = item.url;
        myItem.name = item.name;
        myItem.title = item.title;
        myItem.description = item.description;
        myItem.audio = item.audio;
        myItem.type = item.type;

        this.playlist.playlist.push(myItem);
        IDB.put("playlist", myItem);
    };

    this.updateCurPlaying = function (item) {
        if (this.playlist.curPlaying.audio === item.audio)
            return;

        if (!!localStorage[item.audio])
            item.progress = localStorage[item.audio];
        else
            item.progress = 0;

        this.playlist.curPlaying = item;

        // keep track of current audio track and progress
        localStorage["curPlayingAudio"] = item.audio;
        localStorage[item.audio] = item.progress;
    };

    this.updateProgress = function (progress) {
        this.playlist.curPlaying.progress = progress;

        // keep track of progress
        localStorage[this.playlist.curPlaying.audio] = progress;
    };

    var init = function () {
        console.log('init before anything');
        if (self.playlist.playlist.length <= 0) {
            console.log('init self.playlist.playlist.length <= 0');
            return;
        }

        var audio = localStorage["curPlayingAudio"];
        var progress = localStorage[audio];

        self.playlist.curPlaying = self.playlist.playlist.filter(function (val) {
            return val["audio"] === audio;
        })[0];
        if (!self.playlist.curPlaying) {
            self.playlist.curPlaying = {};
            console.log('self.playlist.curPlaying');
        } else {
            self.playlist.curPlaying.progress = progress;
            console.log('init', self.playlist.curPlaying);
        }

        $rootScope.$broadcast(Constants.INITTED);
    };

    var nextPod = function () {
        if (self.playlist.playlist.length <= 0)
            return;

        var nextAudio = self.playlist.playlist[0].audio;

        if (!nextAudio)
            return;

        localStorage["curPlayingAudio"] = nextAudio;

        var audio = localStorage["curPlayingAudio"];
        var progress = localStorage[audio];

        self.playlist.curPlaying = self.playlist.playlist.filter(function (val) {
            return val["audio"] === audio;
        })[0];
        if (!self.playlist.curPlaying) {
            self.playlist.curPlaying = {};
            $rootScope.$broadcast(Constants.INITTED);
            return;
        }
        self.playlist.curPlaying.progress = progress;
        console.log('init', self.playlist.curPlaying);

        $rootScope.$broadcast(Constants.INIT_PLAY);
    }

    this.update = function (data) {
        $rootScope.$apply(function () {
            console.log('update, apply');
            self.playlist.playlist = data;
            init();
        });
    }

    var dbupdate = function (event, args) {
        console.log("Playlist DBUPDATE");
        console.log('args', args);
        var dbname = args[0],
            storeName = args[1],
            data = args[2];
        console.log('update', dbname, storeName, data);
        if (dbname === dbParams.name && 'playlist' === storeName)
            self.update(data);
    };

    var getAll = function (event, data) {
        console.log("Playlist DBGETALL");
        var dbname = data[0],
            storeName = data[1],
            transaction = data[2];
        console.log('getAll', dbname, storeName, transaction);
        if (dbname === dbParams.name && 'playlist' === storeName)
            getAllPlaylists(transaction);
    };

    var getAllPlaylists = function (transaction) {
        console.log('getAllPlaylists', transaction);
        if (transaction instanceof IDBTransaction)
            IDB.getInit(transaction, 'playlist');
        else
            IDB.getAll('playlist');
    };

    var postInitDb = function (event, data) {
        var dbname = data[0],
            transaction = data[1];
        console.log('postInit', dbname, transaction);
        if (dbname !== dbParams.name)
            return;

        getAllPlaylists(transaction);
    };

    $rootScope.$on('failure', function () {
        console.log('failed to open db')
    });
    $rootScope.$on('dbopenupgrade', postInitDb);
    $rootScope.$on('dbopen', postInitDb);

    $rootScope.$on('getinit', dbupdate);
    $rootScope.$on('getall', dbupdate);


    $rootScope.$on(Constants.INIT_PODS, init);
    $rootScope.$on(Constants.NEXT_POD, nextPod);

});