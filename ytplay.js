(function(root) {
    var defaultOpts = {
        width : 640,
        height : 360,
        playerVars : {
            autoplay : 1,
            playsinline : 1
        }
    };

    function isIos() {
        return (/iP(hone|od|ad)/.test(navigator.platform));
    }

    function isNewerIos() {
        // This CSS property was only added in iOS 10
        return 'object-position' in document.head.style;
    }

    function loadApi() {
        var script = document.createElement('script');
        script.src = '//www.youtube.com/iframe_api';
        document.head.appendChild(script);
    }

    function Ytplay(element, opts) {
        if (typeof element !== 'object') {
            throw new Error("ytplay: invalid element given");
        }

        opts = opts || defaultOpts;
        this.opts = opts;
        this.player = null;

        for (var key in defaultOpts) {
            this.opts[key] = key in opts ? opts[key] : defaultOpts[key];
        }

        this.log('Initialized ytplay with', element, opts);
        this.element = element;
        this._setupCallback();
        loadApi();
    }

    Ytplay.prototype = {
        getElement : function() {
            return this.element;
        },

        getPlayer : function() {
            return this.player;
        },

        log : function() {
            if (this.debug) {
                console.log.apply(console, arguments);
            }
        },

        play : function(id) {
            if (isIos() && !isNewerIos()) {
                // Older versions of iOS need this
                this.player.cueVideoById(id);
            } else {
                this.player.loadVideoById(id);
            }
        },

        _setupCallback : function() {
            var self = this;

            window.onYouTubeIframeAPIReady = function() {
                self.player = new YT.Player(self.element, self.opts);

                if (self.opts.onReady) {
                    self.opts.onReady(self.player);
                }
            }
        }
    };

    // Export for CommonJS, AMD or regular global
    if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = Ytplay;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Ytplay;
        });
    } else {
        root.Ytplay = Ytplay;
    }
})(this);