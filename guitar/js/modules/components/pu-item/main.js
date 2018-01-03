(function() {(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  }
  else if (typeof define === 'function' && define.amd) {
    define([], factory);
  }
  else {
    var globalAlias = 'PuItem';
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

  var _bundleExports = undefined;NovaExports.__fixedUglify="script>";NovaExports.exports={"stylesheet":":host{display:block;width:100%;overflow:hidden}.pu_ul{float:left;white-space:nowrap}.pu_ul .pu_li:first-child{margin-left:0}.pu_ul .pu_li{display:inline-block;width:300px;vertical-align:middle;margin-left:10px}.pu_wrap{width:100%}","template":"\r\n        <p>{{pu_name}}</p>\r\n        <nova-swipable direction=\"horizontal\" class=\"pu_wrap\">\r\n            <ul class=\"pu_ul clearfix\">\r\n\r\n            </ul>\r\n        </nova-swipable>\r\n    "};
        var host = 'http://7xledv.com1.z0.glb.clouddn.com';
        var errImg = '';
        var puItem = NovaExports({
            is: 'pu-item',
            props: {
                pu_name: {
                    type: String,
                    value: ''
                },
                pu_src: {
                    type: Array,
                    value: []
                }
            },
            createdHandler: function() {
                var me = this;
                var $me = $(me);
                me.loaded = 0;
                me.loadImg();
            },
            loadImg: function() {
                var me = this;
                var $ul = $(me).find('.pu_ul');
                var swipable = $(me).find('.pu_wrap')[0];
                if (me.loaded < me.pu_src.length) {
                    var img = new Image();
                    var pu = me.pu_src[me.loaded];
                    img.src = host + pu.src + '-n'; // -n为压缩后的图片
                    img.onload = function() {
                        var li = '<li class="pu_li pu-item" data-id="' + pu.id + '" data-num="' + me.loaded + '">';
                        li += '<img src="' + img.src + '"/>';
                        li += '</li>';
                        $ul.append(li);
                        swipable.refresh();
                        me.loaded += 1;
                        me.loadImg();
                    };
                    img.onerror = function() {
                        var li = '<li class="pu_li error">';
                        li += '</li>';
                        me.pu_src[me.loaded].err = true;
                        $ul.append(li);
                        swipable.refresh();
                        me.loaded += 1;
                        me.loadImg();
                    }
                }
            }
        });
    

  return _bundleExports;
}));}).call(window)