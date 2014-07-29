

(function($) {
    $.noConflict();
    $(document).ready(function() {
      //When document is ready begin the amazing front-end fu!

      //vars
      var companyFinderAutocomplete = $("#companySearch");

      //Autocomplete
      //Shizzy jQuery ui autocomplete
      companyFinderAutocomplete.autocomplete({
        source: function(req, res) {
          $.getJSON("http://127.0.0.1:3000/ajax/list/", function(data) {
            res(data);
          })
        },
        select: function(event, ui) {
          companyFinderAutocomplete.val(ui.item.title);
          return false;
        },
        messages: {
          noResults: '',
          results: function() {}
        },
        focus: function (event, ui) {
              //Set content to value just for sake of niceness
              companyFinderAutocomplete.val(ui.item.title);
              $(".ui-helper-hidden-accessible").hide();
              event.preventDefault();
              return false;
        }

      })
    });






})(jQuery)
