//Should probably namespace this
var ashiba = {
  'getDom' : function(){
    var dom = {}; 
    var inputs = $('input');
    for(i=0;i<inputs.length;i++){
      if(!!inputs[i].id){
        var element = inputs[i];
        if(element.type === "text" ||
           element.type === "range"||
           element.type === "date"){
          dom[element.id] = {};
          dom[element.id]['value'] = element.value;
        } else if(element.type === "checkbox"){
          dom[element.id] = {};
          dom[element.id]['checked'] = element.checked;
        }
      }
    }
    var selects = $('select');
    for(i=0;i<selects.length;i++){
      if(!!selects[i].id){
        var element = selects[i];
        dom[element.id] = {};
        dom[element.id]['value'] = element.value;
      }
    }

    return JSON.stringify(dom);
  },

  'setDom' : function (jsonResponse){
    var domObj = jsonResponse["dom_changes"];
    Object.getOwnPropertyNames(domObj).forEach(function(element_name){
      var element = document.getElementById(element_name);
      Object.getOwnPropertyNames(domObj[element_name]).forEach(function(property){
        console.log("Element name: " + element_name + '\n'
                  + "    Property: " + property + '\n'
                  + "       Value: " + domObj[element_name][property] + '\n'
        );
        element[property] = domObj[element_name][property];
      });
    });
  },

  'eventHandlerFactory' : function (objName, eventName){
    return function(){
      $.ajax({
        url: "event/" + objName + "/" + eventName,
        type: 'POST',
        data: ashiba.getDom(),
        dataType: 'json'
      }).done(function(data){
        console.log("AJAX success, setting DOM elements: "
            + JSON.stringify(data));
        ashiba.setDom(data);
      }).fail(function(data){
        debugStr = data.responseText
        console.log("AJAX failure: " + debugStr)
        alert(debugStr) 
      });
    };
  }
}

$(document).ready(function(){
  // Nice-ify sliders
  $('input[type="range"]').after(function(){
    return ('&nbsp;<output for="' + this.id +'">' +
                    this.value +'</output>');
  }).on('change', function(){
    $('output[for="'+ this.id +'"]').val(this.value);
  });

});
