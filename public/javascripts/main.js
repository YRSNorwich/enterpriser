

(function($) {
    $.noConflict();
    $(document).ready(function() {
      //When document is ready begin the amazing front-end fu!

      //vars
      var companyFinderAutocomplete = $("#companySearch");

      //Autocomplete

      companyFinderAutocomplete.autocomplete({
        source: "data",
        messages: {
          noResults: '',
          results: function() {}
        },
        focus: function (event, ui) {
            $(".ui-helper-hidden-accessible").hide();
              event.preventDefault();
        }

      })
    });





    
})(jQuery)
