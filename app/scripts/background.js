chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('chromeindex.html', {
        'bounds': {
            'width': 1200,
            'height': 600
        }
    });
});