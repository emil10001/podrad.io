/**
 * Created by ejf3 on 12/7/13.
 */
'use strict';

myService.service('PlayListService', function ($rootScope, Constants) {
    this.playlist = {};

    this.playlist.curPlaying = {};

    this.playlist.playlist = [
        {
            'image': 'http://assets.podomatic.net/mymedia/thumb/pro/2910419/1400x1400_7967045.jpg',
            'url': 'http://dunktankpodcast.podomatic.com/',
            'name': 'Dunk Tank Podcast',
            'title': 'Avi Liberman',
            'description': 'After a 3 week hiatus from The Dunk Tank, Chet goes to see 4 doctors and then gets sick, Dunkleman takes 2 steps forward then 1 step back, and guest Avi Liberman talks poker, touring in Israel, and breaks down the process of putting together a late night talk show set. For more on the podcast, follow us on twitter @DunkTankPodcast and visit our website www.DunkTankPodcast.com.',
            'audio': 'http://dunktankpodcast.podomatic.com/enclosure/2013-07-01T00_00_00-07_00.m4a',
            'type': 'audio/mp4'
        },
        {
            'image': 'http://media.npr.org/images/podcasts/2013/primary/planet_money.png',
            'url': 'http://www.npr.org/planetmoney',
            'name': 'Planet Money',
            'title': '#286: Libertarian Summer Camp',
            'description': 'On today"s Planet Money, we travel to a place where people are trying to live without government interference. A place where you can use bits of silver to buy uninspected bacon. A place where a 9-year-old will sell you alcohol.',
            'audio': 'http://podcastdownload.npr.org/anon.npr-podcasts/podcast/510289/199086839/npr_199086839.mp3',
            'type': 'audio/mpeg'
        }
    ];

    var self = this;

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
        this.playlist.playlist = this.playlist.playlist.filter(function (val) {
            return val["audio"] !== item.audio;
        });
        if (!!localStorage["curPlayingAudio"] === item.audio)
            localStorage[item.audio] = "";

        console.log('remove', this.playlist.playlist);
    };

    this.addItem = function (item) {
        this.playlist.playlist.push(item);
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
        var audio = localStorage["curPlayingAudio"];
        var progress = localStorage[audio];

        self.playlist.curPlaying = self.playlist.playlist.filter(function (val) {
            return val["audio"] === audio;
        })[0];
        if (!self.playlist.curPlaying) {
            self.playlist.curPlaying = {};
            return;
        }
        self.playlist.curPlaying.progress = progress;
        console.log('init', self.playlist.curPlaying);

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
            return;
        }
        self.playlist.curPlaying.progress = progress;
        console.log('init', self.playlist.curPlaying);

        $rootScope.$broadcast(Constants.INIT_PLAY);
    }

    $rootScope.$on(Constants.INIT_PODS, init);
    $rootScope.$on(Constants.NEXT_POD, nextPod);

});