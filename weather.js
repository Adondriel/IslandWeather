function changeAnimal(e) {
    $("#previousWeatherSelect").val(["any"]);

    switch ($("#selectAnimal").val()) {
        case '-1':
            $("#weatherSelect").val(["any"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            break;
        case '0':
            //Black Sheep
            $("#weatherSelect").val(["Fair Skies"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            var targetImage = "https://i.imgur.com/L9e3UsS.png";
            break;
        case '1':
            //Crab
            $("#weatherSelect").val(["Rain"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", false);
            $("#timeBox16").prop("checked", false);
            var targetImage = "https://i.imgur.com/5FLBwZa.png";
            break;
        case '2':
            //Yellow Cob
            $("#weatherSelect").val(["Fog"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            var targetImage = "https://i.imgur.com/FOL35sx.png";
            break;
        case '3':
            //Twinkle
            $("#weatherSelect").val(["Fog"]);
            $("#timeBox0").prop("checked", false);
            $("#timeBox8").prop("checked", false);
            $("#timeBox16").prop("checked", true);
            var targetImage = "https://i.imgur.com/Rmw0s6q.png";
            break;
        case '4':
            //Paissa
            $("#weatherSelect").val(["Fair Skies"]);
            $("#timeBox0").prop("checked", false);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", false);
            var targetImage = "https://i.imgur.com/tT3x5Oq.png";
            break;
        case '5':
            //Black Choco
            $("#weatherSelect").val(["Clear Skies"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            var targetImage = "https://i.imgur.com/Cr5eAH6.png";
            break;
        case '6':
            //Grand Buffalo
            $("#weatherSelect").val(["Clouds"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            var targetImage = "https://i.imgur.com/c0ImA0I.png";
            break;
        case '7':
            //Goob
            $("#weatherSelect").val(["Clouds"]);
            $("#timeBox0").prop("checked", false);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", false);
            var targetImage = "https://i.imgur.com/rRwffw9.png";
            break;
        case '8':
            //Alligator
            $("#weatherSelect").val(["Showers"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", false);
            var targetImage = "https://i.imgur.com/2nYd7tD.png";
            break;
        case '9':
            //Gold Backz
            $("#weatherSelect").val(["Rain"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            var targetImage = "https://i.imgur.com/4EXhuhd.png";
            break;
    }
    findWeather();
}

var displayWeather = function () {
    $("#weatherDiv").text(WeatherFinder.getWeather(new Date(), 'Island Sanctuary'));
}

function findWeather() {
    $("#weatherDiv").text('');
    $("#weatherTableHeaderRow ~ tr").remove()
    var weatherStartTime = WeatherFinder.getWeatherTimeFloor(new Date()).getTime();
    var weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
    var zone = 'Island Sanctuary';
    var targetWeather = $("#weatherSelect").val();
    var targetPrevWeather = $("#previousWeatherSelect").val();
    console.info(targetWeather, targetPrevWeather);
    var tries = 0;
    var matches = 0;
    var weather = WeatherFinder.getWeather(weatherStartTime, zone);
    var prevWeather = WeatherFinder.getWeather(weatherStartTime - 1, zone);
    while (tries < 1000 && matches < 30) {
        var weatherMatch = targetWeather == null;
        var prevWeatherMatch = targetPrevWeather == null;
        var timeMatch = false;
        for (var i in targetWeather) {
            if (targetWeather[i] == "" || targetWeather[i] === "any" || targetWeather[i] == weather) {
                weatherMatch = true;
                break;
            }
        }
        for (var i in targetPrevWeather) {
            if (targetPrevWeather[i] == "" || targetPrevWeather[i] === "any" || targetPrevWeather[i] == prevWeather) {
                prevWeatherMatch = true;
            }
        }
        if ($("#timeBox" + weatherStartHour).is(":checked")) {
            timeMatch = true;
        }
        if (weatherMatch && prevWeatherMatch && timeMatch) {
            var weatherDate = moment(weatherStartTime).format('llll');
            $("#weatherTable").append('<tr><td>' + prevWeather + '</td><td>' + weather + '</td><td>' + weatherStartHour + ':00</td><td>' + weatherDate + '</td><td>' + WeatherFinder.calculateForecastTarget(weatherStartTime) + '</td></tr>');
            matches++;
        }
        weatherStartTime += 8 * 175 * 1000; // Increment by 8 Eorzean hours
        weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
        prevWeather = weather;
        weather = WeatherFinder.getWeather(weatherStartTime, zone);
        tries++;
    }
    if (matches == 0) {
        $("#weatherDiv").append("Couldn't find the desired conditions over the next 1000 weather cycles (~16 Earth days).  Make sure you have selected at least one time period.<br/>");
    }
}

function populateWeather() {
    var weathers = WeatherFinder.weatherLists['Island Sanctuary'];
    console.log(weathers);
    var selects = $("#weatherSelect").add("#previousWeatherSelect");
    selects.empty();
    selects.append('<option value="any" selected="selected">Any</option>');
    for (var w in weathers) {
        selects.append('<option value="' + weathers[w] + '">' + weathers[w] + '</option>');
    }
}

$(window).load(function () { populateWeather(); });