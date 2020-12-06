/*
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

// Settings
const settings = {
  navigation: {
    newWindow: true,
  },
  search: {
    ShowSearch: true,
  },
  clock: {
    showClock: false,
  },
  animation: {
    hideLinks: true,
  },
  icons: {
    showIcons: false,
  },
};

// Clock
function updateClock() {
  const currentTime = new Date();
  let currentHours = currentTime.getHours();
  let currentMinutes = currentTime.getMinutes();
  let currentSeconds = currentTime.getSeconds();

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
  currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
  currentHours = currentHours > 24 ? currentHours - 24 : currentHours;
  currentHours = currentHours === 0 ? 24 : currentHours;

  // Compose the string for display
  const currentTimeString = `${currentHours}:${currentMinutes}:${currentSeconds} `;
  $("#clock").html(currentTimeString);
}

// html
$(document).ready(() => {
  var i;
  const shortcuts = {};

  // Get Links
  const linkString = $("body").text();

  // Clear Page
  $("body").empty();

  // Create Array from linkString
  const linkArray = linkString.split("\n");

  // Go thru Array
  let count = 1;
  let html = '<div class="flex-center">' + "";
  for (i in linkArray) {
    // Get line
    const line = jQuery.trim(linkArray[i]);

    // If line is empty, skip
    if (!line) {
      continue;
    }

    // If it doesn't contain "://", it's not a URL
    if (/:\/\//.test(line) !== true) {
      if (count > 1) {
        html = `${html}</div>`;
      }
      html = `${html}<div class="block"><h1>${line}</h1><ul>`;
      count += 1;
      continue;
    }

    // Split URL, Title and icon (if any)
    const lineArray = line.split(" || ");
    const url = lineArray[0];
    const title = lineArray[1];
    let icon = "";
    if (lineArray[3]) {
      icon = lineArray[3];
    }

    // Add to shortcuts array
    if (lineArray[2]) {
      shortcuts[lineArray[2]] = `'${url}'`;
    }

    // Prepares HTML code for showing icon
    let iconHtml = "";
    if (settings.icons.showIcons && icon) {
      iconHtml = `<img src="${icon}"/>`;
    }

    // Add HTML code
    if (settings.navigation.newWindow) {
      html = `${html}<li>${iconHtml}<a href="${url}" target="_blank">${title}</a></li>`;
    } else {
      html = `${html}<li>${iconHtml}<a href="${url}">${title}</a></li>`;
    }
  }

  // Add generated content to page
  html = `${html}</ul></div>` + "</div>";
  $("body").append(html);

  // Hide lists
  if (settings.animation.hideLinks) {
    $("ul").slideUp();

    // Show on hover
    $(".block").mouseenter(function () {
      $("ul", this).stop().slideDown();
    });

    // Hide on unhover
    $(".block").mouseleave(function () {
      $("ul", this).stop().slideUp();
    });
  }

  // Search
  if (settings.search.ShowSearch) {
    $("body").append(form);
    var form = document.createElement("form");
    form.setAttribute("class", "search");
    form.setAttribute("id", "js-search");
    form.setAttribute("autocomplete", "off");
    const pre = document.createElement("pre");
    pre.setAttribute("class", "help");
    pre.setAttribute("id", "js-help");
    form.appendChild(pre);
    const arrow = document.createElement("arrow");
    arrow.setAttribute("class", "arrow");
    pre.appendChild(arrow);
    var i = document.createElement("i");
    i.setAttribute("class", "fa fa-caret-down");
    i.setAttribute("aria-hidden", "true");
    arrow.append(i);
    const input = document.createElement("input");
    input.setAttribute("class", "search__text");
    input.setAttribute("id", "js-search-text");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Search the web");
    input.setAttribute("autofocus", "");
    form.appendChild(input);
    document.body.appendChild(form);
    const button = document.createElement("button");
    button.setAttribute("class", "button");
    form.appendChild(button);
    var i = document.createElement("i");
    i.setAttribute("class", "fal fa-search fa-sm");
    i.setAttribute("aria-hidden", "true");
    button.appendChild(i);
  }
  const toggle =
    '<div class="toggle-container"><input type="checkbox" id="switch" name="theme" /><label for="switch">Toggle</label></div>';
  $("body").append(toggle);

  // Clock
  if (settings.clock.showClock) {
    // Add empty '#clock' div
    $("body").append('<div id="clock"></div>');

    // Update clock
    setInterval("updateClock()", 1000);
  }

  // Keybindings
  let typed = "";
  const shortcutArray = Object.keys(shortcuts);
  const typedDate = new Date();

  // Check if we typed a keybinding
  function hasSubstring(element) {
    const index = typed.indexOf(element);
    if (index >= 0) {
      const sliced = typed.slice(index, typed.length);
      typed = ""; // Clean typed, so that we can watch for the next keybinding
      if (settings.navigation.newWindow) {
        window.open(eval(shortcuts[sliced]));
      } else {
        window.location.replace(eval(shortcuts[sliced]));
      }
    }
  }
});

// Search
$(document).ready(() => {
  const Cmdr = {
    searchForm: document.getElementById("js-search"),
    searchText: document.getElementById("js-search-text"),
    searchHelp: document.getElementById("js-help"),
    init(opts) {
      Cmdr.default = opts.default;
      Cmdr.commands = opts.commands;
      Cmdr.searchForm.addEventListener("submit", Cmdr.search, false);
    },
    search(e) {
      let q = Cmdr.searchText.value;
      if (q === "?") {
        Cmdr.commands.forEach((command) => {
          Cmdr.searchHelp.innerHTML += `${command.key}: ${command.name}\n`;
        });
        Cmdr.searchHelp.style.opacity = "1";
        Cmdr.searchText.value = "";
      } else {
        Cmdr.location = Cmdr.default + encodeURIComponent(q);
        q = q.split(":");
        Cmdr.commands.forEach((command) => {
          if (q[0] === command.key) {
            Cmdr.location = command.url;
            if (q[1] && command.search) {
              q.shift();
              const searchText = encodeURIComponent(q.join(":").trim());
              Cmdr.location = command.url + command.search + searchText;
            }
          }
        });
        window.location.href = Cmdr.location;
      }
      e.preventDefault();
    },
  };
  Cmdr.init({
    default: "https://www.google.com/search?q=",
    commands: [
      {
        key: "a",
        name: "Amazon",
        url: "https://www.amazon.com",
        search: "/s/?field-keywords=",
      },
      {
        key: "c",
        name: "Codepen",
        url: "https://www.codepen.io",
        search: "/search/pens?q=",
      },
      {
        key: "d",
        name: "Drive",
        url: "https://dropbox.com",
        search: "/search/personal?path=%2F&query=",
      },
      {
        key: "f",
        name: "Facebook",
        url: "https://www.facebook.com",
        search: "/search/top/?q=",
      },
      {
        key: "g",
        name: "GitHub",
        url: "https://github.com",
        search: "/search?q=",
      },
      {
        key: "h",
        name: "Hacker News",
        url: "https://hn.algolia.com",
        search: "/?query=",
      },
      {
        key: "i",
        name: "Inbox",
        url: "https://inbox.google.com",
        search: "/search/",
      },
      {
        key: "l",
        name: "Library Genesis²ᵐ",
        url: "http://gen.lib.rus.ec",
        search: "/search.php?req=",
      },
      {
        key: "p",
        name: "Prisguiden",
        url: "https://www.prisguiden.no",
        search: "/sok?q=",
      },
      {
        key: "r",
        name: "Reddit",
        url: "https://www.reddit.com",
        search: "/search?q=",
      },
      {
        key: "s",
        name: "SoundCloud",
        url: "https://soundcloud.com",
        search: "/search?q=",
      },
      {
        key: "t",
        name: "Twitter",
        url: "https://twitter.com",
        search: "/search?q=",
      },
      {
        key: "y",
        name: "YouTube",
        url: "https://www.youtube.com",
        search: "/results?search_query=",
      },
      {
        key: "R",
        name: "rutracker",
        url: "https://rutracker.org",
        search: "/forum/tracker.php?nm=",
      },
      {
        key: "3",
        name: "localhost:3000",
        url: "http://localhost:3000",
      },
      {
        key: "9",
        name: "localhost:9000",
        url: "http://localhost:9000",
      },
    ],
  });
});

// Dark mode
$(document).ready(() => {
  const checkbox = document.querySelector("input[name=theme]");
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      trans();
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      trans();
      document.documentElement.setAttribute("data-theme", "dark");
    }
  });
  const trans = () => {
    document.documentElement.classList.add("transition");
    window.setTimeout(() => {
      document.documentElement.classList.remove("transition");
    }, 1000);
  };
});
// Autofocus search on-load
$(function () {
  $("input").focus();
});
