'use strict';

myApp.controller('PlaylistCtrl', function ($scope) {

    $scope.playItem = function(item){
        console.log('play ' + item);
        $scope.playlist.curPlaying  = item; 
    };

    $scope.playlist = {};

    $scope.playlist.curPlaying = {
        'image' : 'http://assets.podomatic.net/mymedia/thumb/pro/2910419/1400x1400_7967045.jpg',
        'url' : 'http://dunktankpodcast.podomatic.com/',
        'name' : 'Dunk Tank Podcast',
        'title' : 'Avi Liberman',
        'description' : 'After a 3 week hiatus from The Dunk Tank, Chet goes to see 4 doctors and then gets sick, Dunkleman takes 2 steps forward then 1 step back, and guest Avi Liberman talks poker, touring in Israel, and breaks down the process of putting together a late night talk show set. For more on the podcast, follow us on twitter @DunkTankPodcast and visit our website www.DunkTankPodcast.com.',
        'audio' : 'http://dunktankpodcast.podomatic.com/enclosure/2013-07-01T00_00_00-07_00.m4a',
        'type' : 'audio/mp4'
    }; 

    $scope.playlist.playlist = [
        {
            'image' : 'http://assets.podomatic.net/mymedia/thumb/pro/2910419/1400x1400_7967045.jpg',
            'url' : 'http://dunktankpodcast.podomatic.com/',
            'name' : 'Dunk Tank Podcast',
            'title' : 'Avi Liberman',
            'description' : 'After a 3 week hiatus from The Dunk Tank, Chet goes to see 4 doctors and then gets sick, Dunkleman takes 2 steps forward then 1 step back, and guest Avi Liberman talks poker, touring in Israel, and breaks down the process of putting together a late night talk show set. For more on the podcast, follow us on twitter @DunkTankPodcast and visit our website www.DunkTankPodcast.com.',
            'audio' : 'http://dunktankpodcast.podomatic.com/enclosure/2013-07-01T00_00_00-07_00.m4a',
            'type' : 'audio/mp4'
        },
        {
            'image' : 'http://media.npr.org/images/podcasts/2013/primary/planet_money.png',
            'url' : 'http://www.npr.org/planetmoney',
            'name' : 'Planet Money',
            'title' : '#286: Libertarian Summer Camp',
            'description' : 'On today"s Planet Money, we travel to a place where people are trying to live without government interference. A place where you can use bits of silver to buy uninspected bacon. A place where a 9-year-old will sell you alcohol.',
            'audio' : 'http://podcastdownload.npr.org/anon.npr-podcasts/podcast/510289/199086839/npr_199086839.mp3',
            'type' : 'audio/mpeg'
        }
    ]; 
});
