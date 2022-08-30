var WeatherFinder = {

    getWeather(timeMillis, zone) {
        return this.weatherChances[zone](this.calculateForecastTarget(timeMillis));
    },

    calculateForecastTarget: function (timeMillis) {
        // Thanks to Rogueadyn's SaintCoinach library for this calculation.
        // lDate is the current local time.

        var unixSeconds = parseInt(timeMillis / 1000);
        // Get Eorzea hour for weather start
        var bell = unixSeconds / 175;

        // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
        var increment = (bell + 8 - (bell % 8)) % 24;

        // Take Eorzea days since unix epoch
        var totalDays = unixSeconds / 4200;
        totalDays = (totalDays << 32) >>> 0; // Convert to uint

        // 0x64 = 100
        var calcBase = totalDays * 100 + increment;

        // 0xB = 11
        var step1 = ((calcBase << 11) ^ calcBase) >>> 0;
        var step2 = ((step1 >>> 8) ^ step1) >>> 0;

        // 0x64 = 100
        return step2 % 100;
    },

    getEorzeaHour: function (timeMillis) {
        var unixSeconds = parseInt(timeMillis / 1000);
        // Get Eorzea hour
        var bell = (unixSeconds / 175) % 24;
        var result = Math.floor(bell);
        if (result === 23) {
            result = 0;
        } else if (result === 7) {
            result = 8;
        } else if (result === 15) {
            result = 16;
        }
        return result;
    },

    getWeatherTimeFloor: function (date) {
        var unixSeconds = parseInt(date.getTime() / 1000);
        // Get Eorzea hour for weather start
        var bell = (unixSeconds / 175) % 24;
        var startBell = bell - (bell % 8);
        var startUnixSeconds = unixSeconds - (175 * (bell - startBell));
        return new Date(startUnixSeconds * 1000);
    },

    weatherChances: {
        "Island Sanctuary": function (chance) {
            if ((chance -= 25) < 0) { return "Clear Skies"; }
            else if ((chance -= 45) < 0) { return "Fair Skies"; }
            else if ((chance -= 10) < 0) { return "Clouds"; }
            else if ((chance -= 10) < 0) { return "Rain"; }
            else if ((chance -= 5) < 0) { return "Fog"; }
            else { return "Showers"; }
        }
    },

    weatherLists: {
        "Island Sanctuary": ["Clear Skies", "Fair Skies", "Clouds", "Rain", "Fog", "Showers"],
    }
};
