function animalImageDisplay(url) {
    if (url) {
        $("#animalImage").attr("src", url);
        $("#animalImage").show();
    } else {
        $("#animalImage").hide();
    }
}

function changeAnimal() {
    $("#previousWeatherSelect").val(["any"]);

    switch ($("#selectAnimal").val()) {
        case '-1':
            $("#weatherSelect").val(["any"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            animalImageDisplay();
            break;
        case '0':
            //Black Sheep
            $("#weatherSelect").val(["Fair Skies"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            animalImageDisplay("https://i.imgur.com/L9e3UsS.png");
            break;
        case '1':
            //Crab
            $("#weatherSelect").val(["Rain"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", false);
            $("#timeBox16").prop("checked", false);
            animalImageDisplay("https://i.imgur.com/5FLBwZa.png");
            break;
        case '2':
            //Yellow Cob
            $("#weatherSelect").val(["Fog"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            animalImageDisplay("https://i.imgur.com/FOL35sx.png");
            break;
        case '3':
            //Twinkle
            $("#weatherSelect").val(["Fog"]);
            $("#timeBox0").prop("checked", false);
            $("#timeBox8").prop("checked", false);
            $("#timeBox16").prop("checked", true);
            animalImageDisplay("https://i.imgur.com/Rmw0s6q.png");
            break;
        case '4':
            //Paissa
            $("#weatherSelect").val(["Fair Skies"]);
            $("#timeBox0").prop("checked", false);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", false);
            animalImageDisplay("https://i.imgur.com/tT3x5Oq.png");
            break;
        case '5':
            //Black Choco
            $("#weatherSelect").val(["Clear Skies"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            animalImageDisplay("https://i.imgur.com/Cr5eAH6.png");
            break;
        case '6':
            //Grand Buffalo
            $("#weatherSelect").val(["Clouds"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            animalImageDisplay("https://i.imgur.com/c0ImA0I.png");
            break;
        case '7':
            //Goob
            $("#weatherSelect").val(["Clouds"]);
            $("#timeBox0").prop("checked", false);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", false);
            animalImageDisplay("https://i.imgur.com/rRwffw9.png");
            break;
        case '8':
            //Alligator
            $("#weatherSelect").val(["Showers"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", false);
            animalImageDisplay("https://i.imgur.com/2nYd7tD.png");
            break;
        case '9':
            //Gold Backz
            $("#weatherSelect").val(["Rain"]);
            $("#timeBox0").prop("checked", true);
            $("#timeBox8").prop("checked", true);
            $("#timeBox16").prop("checked", true);
            animalImageDisplay("https://i.imgur.com/4EXhuhd.png");
            break;
    }
    findWeather();
}

function findWeather() {
    $("#weatherDiv").hide();
    var weatherStartTime = WeatherFinder.getWeatherTimeFloor(new Date()).getTime();
    var weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
    var zone = 'Island Sanctuary';
    var targetWeather = $("#weatherSelect").val();
    var targetPrevWeather = $("#previousWeatherSelect").val();
    var tries = 0;
    var matches = [];
    var weather = WeatherFinder.getWeather(weatherStartTime, zone);
    var prevWeather = WeatherFinder.getWeather(weatherStartTime - 1, zone);
    while (tries < 1000 && matches.length < 30) {
        var weatherMatch = false;
        var prevWeatherMatch = false;
        var timeMatch = false;
        for (var i in targetWeather) {
            if (targetWeather[i] === "any" || targetWeather[i] === weather) {
                weatherMatch = true;
                break;
            }
        }
        for (var j in targetPrevWeather) {
            if (targetPrevWeather[j] === "any" || targetPrevWeather[j] === prevWeather) {
                prevWeatherMatch = true;
                break;
            }
        }
        if ($("#timeBox" + weatherStartHour).is(":checked")) {
            timeMatch = true;
        }
        if (weatherMatch && prevWeatherMatch && timeMatch) {
            var weatherDate = moment(weatherStartTime).format('llll');
            var chance = WeatherFinder.calculateForecastTarget(weatherStartTime)
            matches.push({prevWeather, weather, weatherStartHour, weatherDate, chance});
        }
        weatherStartTime += (8 * 175 * 1000); // Increment by 8 Eorzean hours
        weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
        prevWeather = weather;
        weather = WeatherFinder.getWeather(weatherStartTime, zone);
        tries++;
    }
    if (matches.length > 0) {
        fillTable(matches);
    } else {
        clearTable();
        $("#weatherDiv").show();
    }
}

function fillTable(weatherEvents) {
    console.info(weatherEvents)
    clearTable();
    for (var weatherEvent of weatherEvents) {
        var {prevWeather, weather, weatherStartHour, weatherDate, chance} = weatherEvent;
        $("#tableBody").append(`<tr><td>${prevWeather}</td><td>${weather}</td><td>${weatherStartHour}:00</td><td>${weatherDate}</td><td>${chance}</td></tr>`);
    }
}

function clearTable() {
    $("#tableBody tr").remove();
}

function init() {
    var weathers = WeatherFinder.weatherLists['Island Sanctuary'];
    var selects = $("#weatherSelect").add("#previousWeatherSelect");
    for (var w in weathers) {
        selects.append('<option value="' + weathers[w] + '">' + weathers[w] + '</option>');
    }
    var localTimeZone = moment().tz(moment.tz.guess()).format('z');
    $('#tableHeader').append(`                  
    <tr id="weatherTableHeaderRow">
    <th>Previous Weather</th>
    <th>Current Weather</th>
    <th>Eorzea Time</th>
    <th>Local Time (${localTimeZone})</th>
    <th>Chance</th>
    </tr>`);
}

$(window).load(function () { init(); });