

(function($) {
    $.noConflict();
    $(document).ready(function() {
      //When document is ready begin the amazing front-end fu!

      //vars
      var companyFinderAutocomplete = $("#companySearch");

      //Autocomplete
      //Shizzy jQuery ui autocomplete



      companyFinderAutocomplete.autocomplete({
        minLength: 1,
        source: function(req, res) {


          $.getJSON("http://127.0.0.1:3000/ajax/list/", function(data) {
            var newList = [];
            for (var i in data) {
              if( data[i].search(req.term) !== -1 ) {
                newList.push(data[i]);
              } else {

              }
            }
            console.log(newList);
            res(newList);

          });
        },
        select: function(event, ui) { },
        messages: {
          noResults: '',
          results: function() {}
        },
        focus: function (event, ui) {
              //Set content to value just for sake of niceness
              companyFinderAutocomplete.val(ui.item.label);
              $(".ui-helper-hidden-accessible").hide();
              event.preventDefault();
              return false;
        }

      })
    });






})(jQuery)
