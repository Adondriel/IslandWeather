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
    var tries = 0;
    var matches = 0;
    var weather = WeatherFinder.getWeather(weatherStartTime, zone);
    var prevWeather = WeatherFinder.getWeather(weatherStartTime - 1, zone);
    while (tries < 1000 && matches < 30) {
       var weatherMatch = targetWeather == null;
       var prevWeatherMatch = targetPrevWeather == null;
       var timeMatch = false;
       for (var i in targetWeather) {
          if (targetWeather[i] == "" || targetWeather[i] == weather) {
             weatherMatch = true;
             break;
          }
       }
       for (var i in targetPrevWeather) {
          if (targetPrevWeather[i] == "" || targetPrevWeather[i] == prevWeather) {
             prevWeatherMatch = true;
          }
       }
       if ($("#timeBox" + weatherStartHour).is(":checked")) {
          timeMatch = true;
       }
       if (weatherMatch && prevWeatherMatch && timeMatch) {
          var weatherDate = moment(weatherStartTime).format('dddd MMMM Do YYYY, h:mm:ss a');
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
    selects.append('<option value="" selected="selected">Any</option>');
    for (var w in weathers) {
       selects.append('<option value="' + weathers[w] + '">' + weathers[w] + '</option>');
    }
 }

 $(window).load(function () { populateWeather(); });