const widgets = require("widget");
const tabs = require("tabs");
const { Hotkey } = require("hotkeys");
var data = require("self").data;
var ss = require("simple-storage");

var onClick = function() {
  worker = tabs.activeTab.attach({
      contentScriptFile: [
        data.url("jquery.js"),
        data.url("underscore.js"),
        data.url("readability.js"),
        data.url('resources.js')
      ]
    });
  console.log('size: ', ss.storage.size);
  worker.port.emit("click", {
    css: data.url('readability.css'), 
    storage: {
      size: ss.storage.size, 
      margin: ss.storage.margin,  
      style: ss.storage.style 
    }
  });
  
  worker.port.on("ready", function(){
    worker.port.emit("init");
  });
  
  worker.port.on('style', function(opts){
    console.log('SAVING', opts.rule, opts.value);
    ss.storage[opts.rule] = opts.value ; 
  });
};

var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://www.mozilla.org/favicon.ico",
  contentScriptWhen: "ready",
  hotkey: Hotkey({
    combo: "control-alt-r",
    onPress: onClick
  }),
  onClick: onClick
});

