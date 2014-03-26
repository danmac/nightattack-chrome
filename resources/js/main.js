/* main javascript */

// initialise the app
onload = function() {
        
    // initialise the menu
    initMenu();
    document.getElementById('menu-button').onclick = function() {
        toggleMenu();
    }
    
    // initialise the playlist
    initPlaylist(settings.ytPlaylistUrl);
    document.getElementById('playlist-button').onclick = function() {
        togglePlaylist();
    };
    
    // TODO init user settings
}

/***************************************
*  Menu
***************************************/

var initMenu = function() {
    // load Menu Items
    var menu = [
        {label: 'Live Player', handler: livePlayer},
        {label: 'Chat Realm', handler: launchChat}
    ];
    
    for (var i=0;i<menu.length;i++) {
        var mItem = new MenuItem(menu[i].label,menu[i].handler);
        document.getElementById('menu-list-frame').appendChild(mItem.getElement());
    }
}

var toggleMenu = function() {
    // toggle the menu
    var menuFrame = document.getElementById('menu-list-frame');
    if(menuFrame.style.display == '' || menuFrame.style.display == 'none') {
        document.getElementById('player-frame').style.left = '200px';
        menuFrame.style.display = 'block';
        document.getElementById('playlist-frame').style.display = 'none';
    } else {
        document.getElementById('player-frame').style.left = '0px';
        menuFrame.style.display = 'none';
    }
}

var MenuItem = function(label, clickHandler) {
    this.label = label; // menu label
    this.clickHandler = clickHandler; // function that happens on click
    
    // create the element
    this.element = document.createElement('a');
    this.element.className = 'menu-item';
    this.element.onclick = function() {
        clickHandler();
        toggleMenu();
    };
    this.element.innerHTML = this.label;
    this.element.href = '#';
    
    this.getElement = function() {
        return this.element;
    }
}

/*****************************************
*  Live Player
*****************************************/

var liveUrls = [
    {
        name: 'DailyMotion',
        url: 'http://www.dailymotion.com/embed/video/x1a389a'
    }
];

var livePlayer = function() {
    // create a live webview within the player-frame
    var livePlayer = document.createElement('webview');
    
    // set the properties of the webview
    livePlayer.id = "live-player";
    livePlayer.className = "player";
    livePlayer.setAttribute('allowfullscreen', true);
    var liveUrl = "";
    for (var i=0; i<liveUrls.length; i++) {
        if(liveUrls[i].name == settings.liveFeed) {
            liveUrl = liveUrls[i].url;
        }
    }
    livePlayer.src = liveUrl;
    
    // console.log(livePlayer); // debug
    document.getElementById('player-frame').innerHTML = '';
    document.getElementById('player-frame').appendChild(livePlayer);
}

/*****************************************
*  Playlist classes
******************************************/

var initPlaylist = function(feed) { // changed to use yoututbe API
    // get the rss feed
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            // get the JSON parsed
            var json = JSON.parse(xhr.responseText);
            items = json.items;
            console.log(items);
            var plist = new Playlist(items);
            plist.buildPlaylist('playlist-frame');
        }
    }
    xhr.open("GET", feed, true);
    xhr.send();
}

var Playlist = function(json) {
    // get the playlist based on rss feed
    this.buildPlaylist = function(elId) {
        var el = document.getElementById(elId);
        el.innerHTML = '';
        // add a refresh button
        var plRefresh = document.createElement('a');
        plRefresh.id = "refresh-button";
        plRefresh.href = "#";
        plRefresh.innerHTML = "Refresh List";
        plRefresh.onclick = function() {
            initPlaylist(settings.ytPlaylistUrl);
        }
        el.appendChild(plRefresh);
        for(var i=0; i<json.length; i++) {
            var title = json[i].snippet.title;
            var vidUrl = "http://www.youtube.com/embed/" + json[i].snippet.resourceId.videoId + "?autoplay=1";
            console.log(title + ', ' + vidUrl);
            var plItem = new PlaylistItem(vidUrl, title);
            el.appendChild(plItem.getElement());
        }
    }
};

var PlaylistItem = function(vidUrl, title, clickHandler) {
    this.vidUrl = vidUrl;
    this.title = title;
    this.clickHandler = clickHandler;
    this.getElement = function() {
        var el = document.createElement('a');
        el.href = this.vidUrl;
        el.class = 'playlist-item';
        el.onclick = function(event) {
            event.preventDefault();
            playVideo(el.href);
            togglePlaylist();
        };
        el.innerHTML = this.title;
        return el;
    }
};

var togglePlaylist = function() {
    var player = document.getElementById('player-frame');
    var playlist = document.getElementById('playlist-frame');
    
    if(playlist.style.display == 'none' || playlist.style.display == '') { // show the playlist
        player.style.left = "-200px";
        playlist.style.display = "block";
        document.getElementById('menu-list-frame').style.display = 'none';
    }
    else {
        player.style.left = "0px";
        playlist.style.display = "none";
    }
}

/****************************************
*  Play videos
*****************************************/

var playVideo = function(url) {
    // add player
    // console.log(url);
    // clear the player-frame
    var player = document.getElementById('player-frame');
    player.innerHTML = '';
    var vidEl = document.createElement('webview');
    vidEl.src = url;
    player.appendChild(vidEl);
}

var launchChat = function() {
    // add chat launcher
    var options = {
		'bounds': {
			'width': 640,
			'height': 392
		},
        'resizable': true
	}
    chrome.app.window.create("webview.html?" + settings.chatUrl + "?nick=" + settings.chatName + "&channels=" +
        encodeURI(settings.chatChannels) + "&prompt=1&uio=MTA9dHJ1ZQ49", options);
}

var launchCal = function() {
    var options = {
        'bounds': {
            'width': 640,
            'height': 360
        }
    }
    chrome.app.window.create("webview.html?" + settings.calUrl + settings.locale, options);
}