(function($) {
    $.noConflict();
    $(document).ready(function() {
      //When document is ready begin the amazing front-end fu!

      //vars
      var companyFinderAutocomplete = $("#companySearch");
      var shareAmountSlider = $('#amountShares');

      var testGame = new Game(gameId);
      testGame.init(gameId);



      //Slider
      $(".slider").slider({
        min: 0,
        max: 1000,
        step: 1,
        slide: function(event, ui) {
          $("#orderAmount").html( "Stock: " + ui.value);
        }
      }).before("<div style='text-align: center;' id='orderAmount'>Stock: 0</div>");

      //Autocomplete
      //Shizzy jQuery ui autocomplete
      companyFinderAutocomplete.autocomplete({
        minLength: 1,
        source: function(req, res) {
          $.getJSON("http://127.0.0.1:3000/ajax/list/", function(data) {
            var newList = {};
            for (var i in data) {
              if( (data[i]["name"] + " | " + i).toUpperCase().search(req.term.toUpperCase()) !== -1 ) {
                var tempList = {};
                tempList["label"] =  data[i]["name"] + " | " + i;
                tempList["value"] = i;
                newList[i] = (tempList);
              } else { }
            }
            res(newList);
          });
        },
        select: function(event, ui) {
          var newCompany = new companyCard(ui.item, ui.item.value);
          newCompany.getData(function(data) {
            newCompany.setData(data, function(bindingData) {
              newCompany.bindView($("#companyCard"), bindingData, function() {

              });
            })
          });
        },
        messages: {
          noResults: '',
          results: function() {}
        },
        focus: function (event, ui) {
              //Set content to value just for sake of niceness
              console.log(ui.item);
              //companyFinderAutocomplete.val(ui.item.value);
              $(".ui-helper-hidden-accessible").hide();
              event.preventDefault();
              return false;
        }
      })
    });
})(jQuery)
