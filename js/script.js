/**
	Startpage Reworked
	==================

	by Christian Brassat,
	reusing code by Jukka Svahn
*/

/**
	Released under MIT License
	
	Copyright (c) 2010 Jukka Svahn, Christian Brassat
	<http://rahforum.biz>
	<http://crshd.cc>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Settings */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var settings = {
    "navigation": {
        "newWindow": true
    },

    "search": {
        "ShowSearch": true
    },

    "clock": {
        "showClock": true
    },

    "animation": {
        "hideLinks": true
    },

    "icons": {
        "showIcons": false
    }
};

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Clock */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function updateClock() {
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();

    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
    currentHours = (currentHours > 24) ? currentHours - 24 : currentHours;
    currentHours = (currentHours == 0) ? 24 : currentHours;

    // Compose the string for display
    var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " "


    $("#clock")
        .html(currentTimeString);
}

$(document)
    .ready(function() {

        var shortcuts = {};

        /*  Get Links  */
        var linkString = $('body')
            .text();

        /*  Clear Page  */
        $('body')
            .empty();

        /*  Create Array from linkString  */
        var linkArray = linkString.split("\n");

        /*  Go thru Array  */
        var i;
        var count = 1;
        var html = '';

        for (i in linkArray) {

            /*  Get line  */
            var line = jQuery.trim(linkArray[i]);

            // If line is empty, skip
            if (!line) continue;

            /*  If it doesn't contain "://", it's not a URL */
            if (/:\/\//.test(line) != true) {
                if (count > 1) {
                    html = html + '</div>';
                }
                html = html + '<div class="block"><h1>' + line + '</h1><ul>';
                count++;
                continue;
            }

            /*  Split URL, Title and icon (if any) */
            var lineArray = line.split(" || ");
            var url = lineArray[0];
            var title = lineArray[1];

            var icon = "";
            if (lineArray[3]) {
                icon = lineArray[3];
            }

            /*  Add to shortcuts array *\
            \*=========================*/
            if (lineArray[2]) {
                shortcuts[lineArray[2]] = "'" + url + "'";
            }

            /* Prepares HTML code for showing icon */
            var iconHtml = '';
            if (settings.icons.showIcons && icon) {
                iconHtml = '<img src="' + icon + '"/>';
            }

            /*  Add HTML code  */
            if (settings.navigation.newWindow) {
                html = html + '<li>' + iconHtml + '<a href="' + url + '" target="_blank">' + title + '</a></li>'
            } else {
                html = html + '<li>' + iconHtml + '<a href="' + url + '">' + title + '</a></li>'
            }
        }

        /*  Add generated content to page  */
        html = html + '</ul></div>';
        $('body')
            .append(html);

        /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        /* Animation */
        /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

        /*  Hide lists  */
        if (settings.animation.hideLinks) {
            $('ul')
                .slideUp();

            /*  Show on hover  */
            $('.block')
                .mouseenter(function() {
                    $('ul', this)
                        .stop()
                        .slideDown();
                });

            /*  Hide on unhover  */
            $('.block')
                .mouseleave(function() {
                    $('ul', this)
                        .stop()
                        .slideUp();
                });
        }

        /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        /* Search */
        /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */        

        if (settings.search.ShowSearch) {
            $('body')
                .append(form);
            var form = document.createElement("form");
            form.setAttribute("class", "search");
            form.setAttribute("id", "js-search");
            form.setAttribute("autocomplete", "off");
            var input = document.createElement("input");
            input.setAttribute("class", "search__text");
            input.setAttribute("id", "js-search-text");
            input.setAttribute("contenteditable", "true");
            input.setAttribute("type", "text");
            input.setAttribute("placeholder", "🔍");            
            input.setAttribute("autofocus", "")
            form.appendChild(input);
            document.body.appendChild(form);
            var pre = document.createElement("help")
            help.setAttribute("class", "help");
            help.setAttribute("id", "js-help");

        }

        /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        /* Clock */
        /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

        if (settings.clock.showClock) {
            // Add empty '#clock' div
            $('body')
                .append('<div id="clock"></div>');

            // Update clock
            setInterval('updateClock()', 1000);
        }

        /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        /* Keybindings */
        /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        var typed = '';
        var shortcutArray = Object.keys(shortcuts);
        var typedDate = new Date();

        // Check if we typed a keybinding
        function hasSubstring(element) {
            var index = typed.indexOf(element);
            if (index >= 0) {
                var sliced = typed.slice(index, typed.length);
                typed = ''; // Clean typed, so that we can watch for the next keybinding
                if (settings.navigation.newWindow) {
                    window.open(eval(shortcuts[sliced]));
                } else {
                    window.location.replace(eval(shortcuts[sliced]));
                }
            }
        }

    });


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Search
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
$(document).ready(function() {
    var Cmdr = {
        searchForm: document.getElementById('js-search'),
        searchText: document.getElementById('js-search-text'),
        searchHelp: document.getElementById('js-help'),

        init: function(opts) {
            Cmdr.default = opts.default;
            Cmdr.commands = opts.commands;
            Cmdr.searchForm.addEventListener('submit', Cmdr.search, false);
        },

        search: function(e) {
            var q = Cmdr.searchText.value;

            if (q === '?') {
                Cmdr.commands.forEach(function(command) {
                    Cmdr.searchHelp.innerHTML += command.key + ': ' + command.name + '\n';
                });

                Cmdr.searchHelp.style.height = Math.ceil(Cmdr.commands.length / 2) + 'rem';
                Cmdr.searchText.value = '';
            } else {
                Cmdr.location = Cmdr.default+encodeURIComponent(q);
                q = q.split(':');

                Cmdr.commands.forEach(function(command) {
                    if (q[0] === command.key) {
                        Cmdr.location = command.url;

                        if (q[1] && command.search) {
                            q.shift();
                            var searchText = encodeURIComponent(q.join(':')
                                .trim());
                            Cmdr.location = command.url + command.search + searchText;
                        }
                    }
                });
                window.location.href = Cmdr.location;
            }
            e.preventDefault();
        }
    };
    Cmdr.init({
        default: 'https://www.google.com/search?q=',
        commands: [{
                key: 'a',
                name: 'Amazon',
                url: 'https://www.amazon.com',
                search: '/s/?field-keywords='
            },
            {
                key: 'c',
                name: 'Coinbase',
                url: 'https://www.coinbase.com'
            },
            {
                key: 'd',
                name: 'Drive',
                url: 'https://drive.google.com',
                search: '/drive/search?q='
            },
            {
                key: 'f',
                name: 'Facebook',
                url: 'https://www.facebook.com',
                search: '/search/top/?q='
            },
            {
                key: 'g',
                name: 'GitHub',
                url: 'https://github.com',
                search: '/search?q='
            },
            {
                key: 'h',
                name: 'Hacker News',
                url: 'https://hn.algolia.com',
                search: '/?query='
            },
            {
                key: 'i',
                name: 'Inbox',
                url: 'https://inbox.google.com',
                search: '/search/'
            },
            {
                key: 'k',
                name: 'Keep',
                url: 'https://keep.google.com',
                search: '/#search/text='
            },
            {
                key: 'p',
                name: 'Product Hunt',
                url: 'https://www.producthunt.com',
                search: '/search?q='
            },
            {
                key: 'r',
                name: 'Reddit',
                url: 'https://www.reddit.com',
                search: '/search?q='
            },
            {
                key: 's',
                name: 'SoundCloud',
                url: 'https://soundcloud.com',
                search: '/search?q='
            },
            {
                key: 't',
                name: 'Twitter',
                url: 'https://twitter.com',
                search: '/search?q='
            },
            {
                key: 'y',
                name: 'YouTube',
                url: 'https://www.youtube.com',
                search: '/results?search_query='
            },
            {
                key: 'Y',
                name: 'YTS',
                url: 'https://yts.ag'
            },
            {
                key: '3',
                name: 'localhost:3000',
                url: 'http://localhost:3000'
            },
            {
                key: '9',
                name: 'localhost:9000',
                url: 'http://localhost:9000'
            },
        ]
    });
})();