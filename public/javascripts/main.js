(function($) {
    $.noConflict();
    $(document).ready(function() {

      //When document is ready begin the amazing front-end fu!

      //vars
      var companyFinderAutocomplete = $("#companySearch");
      var shareAmountSlider = $('#amountShares');


      window.game = new Game(gameId);
      //Init with company card AAPL


      game.sliderValue;
      if(gameId){
        game.init(gameId);
      } else {
        game.init(0);
      }

      game.companyCard = new companyCard(["APPLE", "AAPL"], "AAPL");
                game.companyCard.getData(function(data) {
                    game.companyCard.setData(data, function(bindingData) {
                        game.companyCard.bindView($("#companyCard"), bindingData, function() {

                        });
                    })
                });
        //Slider
        $(".slider").slider({
            min: 0,
            max: 1000,
            step: 1,
            slide: function(event, ui) {
                $("#orderAmount").html( "Stock: " + ui.value);
                game.sliderValue = ui.value;
            }
        }).before("<div style='text-align: center;' id='orderAmount'>Stock: 0</div>");

        //Autocomplete
        //Shizzy jQuery ui autocomplete
        companyFinderAutocomplete.autocomplete({
            minLength: 1,
            source: function(req, res) {
                $.getJSON("/ajax/list/", function(data) {
                    var newList = {};
                    for (var i in data) {
                        if( (data[i]["name"] + " | " + i).toUpperCase().search(req.term.toUpperCase()) !== -1 ) {
                            var tempList = {};
                            tempList["label"] =	data[i]["name"] + " | " + i;
                            tempList["value"] = i;
                            newList[i] = (tempList);
                        }
                    }
                    res(newList);
                });
            },
            select: function(event, ui) {
                game.companyCard = new companyCard(ui.item, ui.item.value);
                game.companyCard.getData(function(data) {
                    game.companyCard.setData(data, function(bindingData) {
                        game.companyCard.bindView($("#companyCard"), bindingData, function() {

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

    //Valuation Graph
    var data = [];
    var lengthLimit = 50;

    var valueGraphOptions = {
        series: {
            color: 'red',
            lines: {
                show: true
            },
            points: {
                show: false
            }
        },
        xaxis: {
            show: false
        }
    }

    /**
    * Append a value to the graph, removing an older value if necessary to fit.
    *
    * @param {Number} value - the value on the y-axis of the new point
    */
    window.pushGraphValue = function(value) {
        data.push(value);
        if (data.length > lengthLimit) {
            data.splice(0, data.length - lengthLimit);
        }

        var plottableData = [[]];
        for (var i = 0; i < data.length; i++)
        {
            plottableData[0].push([i, data[i]]);
        }

        $('#valueGraph').plot(
            plottableData,
            valueGraphOptions
        );
    }

    window.pushGraphValue(10000);
    window.pushGraphValue(10000);

    //Background Towers, powered by isomer

    var backgroundTowersCanvas = document.getElementById('backgroundTowers');

    function fitCanvasToWindow(canvas) {
        var win = $(window);

        canvas.width = win.width() * 2;
        canvas.height = win.height() * 2;
    }

    $(window).on('resize', fitCanvasToWindow.bind(null, backgroundTowersCanvas));
    fitCanvasToWindow(backgroundTowersCanvas);

    var Color = Isomer.Color;
    var Prism = Isomer.Shape.Prism;
    var Point = Isomer.Point;

    var canvasTowers = new Isomer(backgroundTowersCanvas);
    var greenColor = new Color(149, 195, 63);

    var positions = [[1, 1], [4, 1], [1, 4], [7, 1], [1, 7], [7, 4], [4, 7], [7, 7]];

    // convert co-ords to Point objects
    for (var positionsIndex in positions)
    {
        var value = positions[positionsIndex];
        positions[positionsIndex] = new Point(value[0], value[1], 1);
    }

    var colors    = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [0, 255, 255], [255, 0, 255], [128, 0, 255], [255, 128, 0]];
    //  colors    = [red,         green,       blue,        yellow,        cyan,        , pink,          purple       , orange       ];

    // convert RGBs to Color Objects
    for (var colorIndex in colors)
    {
        var value = colors[colorIndex];
        colors[colorIndex] = new Color(value[0], value[1], value[2]);
    }

    /**
    * Render towers with Isomer to show visual proof.
    *
    * @param {Object} towers - towers in JSON Object form { stockId: stockValue }
    */
    window.renderTowers = function(towers) {
        // clear screen
        backgroundTowersCanvas.getContext('2d').clearRect(0, 0, backgroundTowersCanvas.width, backgroundTowersCanvas.height);

        // render ground
        canvasTowers.add(Isomer.Shape.Prism(Isomer.Point.ORIGIN, 9, 9, 1), greenColor);

        // not ready to continue
        if (window.game.gameData.companyId == null)
        {
            return;
        }

        // render towers
        var maxHeight = 0;
        for (var towerName in towers)
        {
            maxHeight = Math.max(maxHeight, towers[towerName]);
        }

        // TODO resolve rendering glitch where further towers draw over closer ones; it's all about the order
        var index = 0;
        for (var towerName in towers)
        {
            var value = towers[towerName];
            var height = (value / maxHeight) * 8;

            if (towerName === window.game.gameData.companyId)
            {
                canvasTowers.add(Prism(new Point(3, 3, 1), 3, 3, height));
                continue;
            }

            if (index >= positions.length) // out of room :(
            {
                continue;
            }

            canvasTowers.add(Prism(positions[index], 1, 1, height), colors[index]);

            index++;

            // TODO render windows; we want to know that they're buildings!
        }

        // TODO render tower labels, maybe use a color key?
    }

    renderTowers({});
})(jQuery)
