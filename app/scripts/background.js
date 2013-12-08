chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('chromeindex.html', {
        'bounds': {
            'width': 990,
            'height': 700
        }
    });
});