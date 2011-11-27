var marginClasses = ['margin-x-narrow','margin-narrow', 'margin-medium', 'margin-wide', 'margin-x-wide'] ; 
var fontsizeClasses = ['size-x-small', 'size-small', 'size-medium', 'size-large', 'size-x-large'] ;
var styleClasses = ['style-newspaper', 'style-novel', 'style-ebook', 'style-terminal'] ;

var $ = document.getElementById ; 
var $$ = document.querySelectorAll ; 

/* Listen for Escape keypress */
var listenForKeystroke = function(){
  var listener = window.addEventListener("keyup", function(event){
    if(event.keyCode === 27){ //ESCAPE KEY
      console.log('ESCAPE');
      window.location.reload();
    }
  });
}


/* Size */
var augmentSize = function(){
  var currentSize = getSize();
  var index = fontsizeClasses.indexOf(currentSize);
  var oldClass, newClass ;  
  if(index < fontsizeClasses.length -1){
    oldClass = fontsizeClasses[index];
    newClass = fontsizeClasses[index+1];
    $('readInner').classList.remove(oldClass);
    $('readInner').classList.add(newClass);
    self.port.emit('style', {rule: "size", value: newClass});
  }
};

var reduceSize = function(){
  var currentSize = getSize();
  var index = fontsizeClasses.indexOf(currentSize);
  if(index > 0){
    oldClass = fontsizeClasses[index];
    newClass = fontsizeClasses[index-1];
    $('readInner').classList.remove(oldClass);
    $('readInner').classList.add(newClass);
    self.port.emit('style', {rule: "size", value: newClass});
  }
};

var getSize = function(){
  var innerClasses = $('readInner').className.split(' ');
  var innerSizeClass = _.find(innerClasses, function(klass){
    return (klass.indexOf('size-') > -1);
  });
  return innerSizeClass;
};

/* Margin */
var augmentMargin = function(){
  var currentMargin = getMargin();
  var index = marginClasses.indexOf(currentMargin);
  var oldClass, newClass ;  
  if(index < marginClasses.length -1){
    oldClass = marginClasses[index];
    newClass = marginClasses[index+1];
    $('readInner').classList.remove(oldClass);
    $('readInner').classList.add(newClass);
    self.port.emit('style', {rule: "margin", value: newClass});
  }
};

var reduceMargin = function(){
  var currentMargin = getMargin();
  var index = marginClasses.indexOf(currentMargin);
  var oldClass, newClass ;  
  if(index > 0){
    oldClass = marginClasses[index];
    newClass = marginClasses[index-1];
    $('readInner').classList.remove(oldClass);
    $('readInner').classList.add(newClass);
    self.port.emit('style', {rule: "margin", value: newClass});
  }
};

var getMargin = function(){
  var innerClasses = $('readInner').className.split(' ');
  var innerMarginClass = _.find(innerClasses, function(klass){
    return (klass.indexOf('margin-') > -1);
  });
  return innerMarginClass;
};


/* Styles */ 
var getStyle = function(){
  var bodyClasses = $('readabilityBody').className.split(' ');
  var bodyStyleClass = _.find(bodyClasses, function(klass){
    return (klass.indexOf('style-') > -1);
  });
  return bodyStyleClass;
};

var setStyle = function(newClass){
  var oldClass = getStyle();
  $('readabilityBody').classList.remove(oldClass);
  $('readOverlay').classList.remove(oldClass);
  $('readabilityBody').classList.add(newClass);
  $('readOverlay').classList.add(newClass);
  self.port.emit('style', {rule: "style", value: newClass});
  
};


self.port.on('click', function(urls) {
  //position: fixed;top: 10px;right: 10px;width: 200px;height: 50px;background: rgba(125, 125, 125, 0.9);border-radius: 5px;padding: 10px;color: white;text-align: center;line-height: 50px;
  
  
  // Is the CSS available yet ? 
  if(!$('readability-link')){
    
    var link = content.document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'readability-link';    
    link.href = urls.css;
    link.type = 'text/css';
    link.media = 'all';
    if(content.document.createElement('div').insertAdjacentHTML !== undefined){
      document.querySelector('head').insertAdjacentHTML("beforeend", new XMLSerializer().serializeToString(link));
    }
    else{
      document.querySelector('head').appendChild(link)
    }
    listenForKeystroke();
  }
  
  //Is the plugin active ? 
  if(!$('readabilityBody')){
    self.port.emit('ready');
    window.addEventListener("click", function(event){
      switch(event.target.id){
        case 'augment-size':
          console.log('augmentSize');
          augmentSize();
          break;
        case 'reduce-size':
          reduceSize();
          break;

        case 'augment-margin':
          augmentMargin();
          break;
        case 'reduce-margin':
          reduceMargin();
          break;

        case 'newspaper':
          setStyle('style-newspaper');
          break;
        case 'novel':
          setStyle('style-novel');
          break;
        case 'ebook':
          setStyle('style-ebook');
          break;
        case 'terminal':
          setStyle('style-terminal');
          break;
      }
    });
    
  }
  else{
    window.location.reload();
  }
  
});

