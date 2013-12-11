chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('chromeindex.html', {
        id : 'PodRad.io',
        frame : 'native',
        'bounds': {
            'width': 1200,
            'height': 600
        }
    });
});