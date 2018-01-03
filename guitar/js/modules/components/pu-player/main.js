(function() {(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  }
  else if (typeof define === 'function' && define.amd) {
    define([], factory);
  }
  else {
    var globalAlias = 'PuPlayer';
    var namespace = globalAlias.split('.');
    var parent = root;
    for ( var i = 0; i < namespace.length-1; i++ ) {
      if ( parent[namespace[i]] === undefined ) parent[namespace[i]] = {};
      parent = parent[namespace[i]];
    }
    parent[namespace[namespace.length-1]] = factory();
  }
}(this, function() {
  function _requireDep(name) {
    return {}[name];
  }

  var _bundleExports = undefined;NovaExports.__fixedUglify="script>";NovaExports.exports={"stylesheet":".now_img,.toolbar{width:100%}:host{position:absolute;display:none;background-color:#fff;left:0;top:0;overflow:hidden}:host.show{display:block}.toolbar{display:none;position:absolute;height:100%;background-color:rgba(0,0,0,.4);z-index:2}","template":"\r\n        <img class=\"now_img\" src=\"\">\r\n        <div class=\"toolbar\">\r\n            \r\n        </div>\r\n    "};
        var host = 'http://7xledv.com1.z0.glb.clouddn.com';
        var errImg = '';
        var puItem = NovaExports({
            is: 'pu-player',
            props: {
                pu_name: {
                    type: String,
                    value: ''
                },
                pu_src: {
                    type: Array,
                    value: [],
                    observer: '_pu_srcChanged'
                },
                now: {
                    type: Number,
                    value: 0,
                    observer: '_numChanged'
                },
                scale: {
                    type: Number,
                    value: 1
                }
            },
            createdHandler: function() {
                var self = this;
                this.isPlaying = false;
                this.bindEvents();
                this.offsetX = 0;
                this.offsetY = 0;
                var pos = (screen.height-screen.width)/2 + 'px';
                var $self = $(this).css({                    
                    width: screen.height + 'px',
                    height: screen.width + 'px',
                    transform: 'rotate(90deg) translate('+pos+','+pos+')'
                });
            },
            bindEvents: function() {
                var self = this;
                var $self = $(self);
                $self.on('touchstart', '.now_img', function(evt) {
                    var $this = $(this);
                    evt.preventDefault();
                    evt.stopPropagation();
                    var ifmoved = false;
                    var x = evt.touches[0].clientX - self.offsetX;
                    var y = evt.touches[0].clientY - self.offsetY;
                    var move = function move(evt){
                        self.offsetX = evt.touches[0].clientX-x;
                        self.offsetY = evt.touches[0].clientY-y;
                        ifmoved = true;
                        $this.css('transform', 'translate3D('+self.offsetY+'px,'+-self.offsetX+'px,0) scale('+self.scale+','+self.scale+')');
                    }
                   var touchend = function touchend(evt){
                        $this.off("touchmove", move);
                        $this.off("touchend", touchend);
                        if (self.isPlaying) {
                            self.showToolbar();
                        }
                    }
                    $this.on("touchmove", move);
                    $this.on("touchend", touchend);
                });
            },
            showToolbar: function() {

            },
            _pu_srcChanged: function() {
                this.loadImg();
            },
            _numChanged: function() {
                this.loadImg();
            },
            loadImg: function() {
                var self = this;
                var $self = $(this);
                $self.addClass('show')
                     .css({
                        top: window.scrollY + 'px',
                        left: window.scrollX + 'px'
                     });
                $(document.body).addClass('play');
                var $img = $self.find('.now_img');
                var pu = self.pu_src[self.now];
                if (pu) {
                    $img.attr('src', host+pu.src);
                } else {
                    $self.removeClass('show');
                    $(document.body).removeClass('play');
                }
            }
        });
    

  return _bundleExports;
}));}).call(window)