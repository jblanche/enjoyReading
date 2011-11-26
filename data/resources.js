var marginClasses = ['margin-x-narrow','margin-narrow', 'margin-medium', 'margin-wide', 'margin-x-wide'] ; 
var fontsizeClasses = ['size-x-small', 'size-small', 'size-medium', 'size-large', 'size-x-large'] ;
var styleClasses = ['style-newspaper', 'style-novel', 'style-ebook', 'style-terminal'] ;
/* Size */
var augmentSize = function(){
  var currentSize = getSize();
  var index = fontsizeClasses.indexOf(currentSize);
  var oldClass, newClass ;  
  if(index < fontsizeClasses.length -1){
    oldClass = fontsizeClasses[index];
    newClass = fontsizeClasses[index+1];
    $('#readInner').removeClass(oldClass);
    $('#readInner').addClass(newClass);
    self.port.emit('style', {rule: "size", value: newClass});
  }
};

var reduceSize = function(){
  var currentSize = getSize();
  var index = fontsizeClasses.indexOf(currentSize);
  if(index > 0){
    oldClass = fontsizeClasses[index];
    newClass = fontsizeClasses[index-1];
    $('#readInner').removeClass(oldClass);
    $('#readInner').addClass(newClass);
    self.port.emit('style', {rule: "size", value: newClass});
  }
};

var getSize = function(){
  var innerClasses = $('#readInner').attr('class').split(' ');
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
    $('#readInner').removeClass(oldClass);
    $('#readInner').addClass(newClass);
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
    $('#readInner').removeClass(oldClass);
    $('#readInner').addClass(newClass);
    self.port.emit('style', {rule: "margin", value: newClass});
  }
};

var getMargin = function(){
  var innerClasses = $('#readInner').attr('class').split(' ');
  var innerMarginClass = _.find(innerClasses, function(klass){
    return (klass.indexOf('margin-') > -1);
  });
  return innerMarginClass;
};


/* Styles */ 
var getStyle = function(){
  var bodyClasses = $('#readabilityBody').attr('class').split(' ');
  var bodyStyleClass = _.find(bodyClasses, function(klass){
    return (klass.indexOf('style-') > -1);
  });
  return bodyStyleClass;
};

var setStyle = function(newClass){
  var oldClass = getStyle();
  $('#readabilityBody').removeClass(oldClass);
  $('#readOverlay').removeClass(oldClass);
  $('#readabilityBody').addClass(newClass);
  $('#readOverlay').addClass(newClass);
  self.port.emit('style', {rule: "style", value: newClass});
  
};


self.port.on('click', function(urls) {
  // Is the CSS available yet ? 
  if($('#readability-link').length == 0){
    var link = $('<link />').attr({
      rel: 'stylesheet',
      id: 'readability-link',
      href: urls.css,
      type: 'text/css',
      media: 'all'
    });
    $('head').append(link);
  }
  
  //Is the plugin active ? 
  if($('#readabilityBody').length == 0){
    self.port.emit('ready');
    
    $("body").on("click", ".controls", function(event){
      switch(this.id){
        case 'augment-size':
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
      console.log(this.id, $('body').attr('class'));
    });
    
  }
  else{
    window.location.reload();
  }
  
});

