/**
 * FCC Translate Editor
 */

var LANG = 'Ru';
 
var translate_json = null;
 
function zip(desc, trans) {
    var result = [];
    for (var n = 0; n < desc.length; n++) {
      if(n<trans.length){
        val = trans[n];
      } else {
        val = "";
      }
        result.push([desc[n], val]);
    }
    return result;
}
 
$(document).ready(function(){
  
  var speller = new Speller(
    { url: "/speller",
      lang: "ru", options: Speller.IGNORE_LATIN + Speller.IGNORE_URLS,
      spellDlg: { width: 500, height: 320 }
    }
  );
   
 
 $.getJSON('/get_data', function ( data ) {
   translate_json = data;
   data.challenges.forEach(function( el ) {
     var description = zip(el.description, el['description'+LANG]);
     var text = $('<div></div>')
      .addClass('description');
     description.forEach(function (desc){
       text
        .append(
          $('<pre><pre>').text(desc[0])
        )
        .append(
          $('<textarea></textarea>')
            .addClass('col-md-12')
            .text(desc[1])
        );
     });
     var li = $('<li></li>').append(
       $('<a></a>')
        .text(el.name)
        .attr('href','#')
        .click(function (){
          $('#sandbox')
            .empty()
            .append(
              $('<h4></h4>')
                .text('Name:')
            )
            .append(
              $('<pre></pre>')
                .text(el.name)
            )
            .append(
              $('<textarea></textarea>')
                .addClass('col-md-12')
                .text(el['name'+LANG])
            )
            .append(
              $('<h4></h4>')
                .text('Description:')
            )
            .append(text)
            .append(
              $('<button></button>')
                .text('Spell check')
                .addClass('btn')
                .addClass('btn-success')
                .click(function () {
                  speller.check($('textarea', $('#sandbox')));
                })
            )
            .append(
              $('<button></button>')
                .text('Save')
                .addClass('btn')
                .addClass('btn-primary')
                .click(function () {
                  var name = '';
                  var descriptions = []
                  
                  $('#sandbox > textarea').each(function(){
                    name = $(this).val();
                  })
                  
                  $('#sandbox > * >textarea').each(function(){
                    descriptions.push($(this).val());
                  })
                  
                  if (name == '') {
                    $('#sandbox')
                      .append(
                        $('<div></div>')
                          .addClass('alert')
                          .addClass('alert-danger')
                          .text('Name not translated')
                      )
                  }
                  
                  descriptions.forEach(function (val, idx) {
                    if (val == '') {
                      $('#sandbox')
                        .append(
                          $('<div></div>')
                            .addClass('alert')
                            .addClass('alert-danger')
                            .text('Description #'+idx+' not translated')
                        );
                    }
                  });
                  
                  if(!$('.alert-danger').length)
                  {
                    el['name'+LANG] = name;
                    el['description'+LANG] = descriptions;
                    
                    $.ajax({
                        url: '/post_data',
                        async: false,
                        processdata: true, //True or False
                        crossDomain: true, 
                        type: 'POST',
                        dataType: 'json', 
                        contentType: 'application/json', 
                        data: JSON.stringify(data),
                        success: function (res) {
                          $('#sandbox').empty();
                        }
                    });
                  }
                  
                })
            )
            .append(
              $('<button></button>')
                .text('Cancel')
                .addClass('pull-right')
                .addClass('btn')
                .addClass('btn-default')
                .click(function () {
                  $('#sandbox').empty();
                })
            );
        })
     ).appendTo($('#challenges-list > ul'));
     
     if (el['name'+LANG] != '') {
       li.prepend(
         $('<span></span>')
          .addClass('label')
          .addClass('label-success')
          .text(LANG)
       );
     }
   }, this);
 });
});