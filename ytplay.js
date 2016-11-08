(function(root) {
    var defaultOpts = {
        width : 640,
        height : 360,
        playerVars : {
            autoplay : 1,
            playsinline : 1
        }
    };

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
        this.setupCallback();
        this.loadApi();
    }

    Ytplay.prototype = {
        getElement : function() {
            return this.element;
        },

        isIos : function() {
            return (/iP(hone|od|ad)/.test(navigator.platform));
        },

        isNewerIos : function() {
            // This CSS property was only added in iOS 10
            return 'object-position' in document.head.style;
        },

        loadApi : function() {
            var script = document.createElement('script');
            script.src = '//www.youtube.com/iframe_api';
            document.head.appendChild(script);
        },

        log : function() {
            if (this.debug) {
                console.log.apply(console, arguments);
            }
        },

        play : function(id) {
            if (this.isIos() && !this.isNewerIos()) {
                // Older versions of iOS need this
                this.player.cueVideoById(id);
            } else {
                this.player.loadVideoById(id);
            }
        },

        setupCallback : function() {
            var self = this;

            window.onYouTubeIframeAPIReady = function() {
                self.player = new YT.Player(self.element, self.opts);
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