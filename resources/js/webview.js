/* chat functions */

onload = function() {
    var url = location.search;
    var webview = document.createElement('webview');
    webview.src = url.substring(1);
    webview.addEventListener('newwindow', function(e) {
        e.preventDefault();
        var options = {
            'bounds': {
                'width':1024,
                'height':768                
            }
        }
        chrome.app.window.create('webview.html?' + e.targetUrl,options);
    });
    document.getElementById('webview-frame').appendChild(webview);
}