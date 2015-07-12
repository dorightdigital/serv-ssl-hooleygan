var RouteInterpreter = (function () {
  'use strict';

  function timeToUnixTimestamp(time) {
    return new Date(['2015-01-01T', time, ':00Z'].join('')).getTime();
  }

  function unixTimestampToTime(timestamp) {
    var date = new Date(timestamp);

    function leftFill(i) {
      return i < 10 ? '0' + i : i;
    }

    return [date.getHours() % 12, leftFill(date.getMinutes())].join(':') + (date.getHours() >= 12 ? 'pm' : 'am');
  }

  var consts = {
    HOOLEY_ARRIVAL: timeToUnixTimestamp('22:30'),
    DELAY_AT_HOOLEY: 10 * 60 * 1000,
    DELAY_AT_TOOTING: 5 * 60 * 1000
  };

  function convertMetresToMiles(km) {
    return Math.round(km * 0.00621371192) / 10;
  }

  function convertSecondsToTime(seconds) {
    var hours = seconds / 60 / 60,
      roundedHours = Math.floor(hours),
      out = [roundedHours + (roundedHours === 1 ? ' Hour' : ' Hours')],
      leftoverMinutes = Math.floor((hours - roundedHours) * 60);

    if (leftoverMinutes > 1) {
      out.push(leftoverMinutes + ' Minutes');
    }
    return out.join(', ');
  }

  function RouteInterpreter() {
    this.newDataHandlers = [];
  }

  _.extend(RouteInterpreter.prototype, {
    onNewData: function (fn) {
      this.newDataHandlers.push(fn);
    },
    processRoute: function (data) {
      function addTimes(times, parent) {
        parent.times = {};
        _.each(times, function (i, k) {
          parent.times[k] = unixTimestampToTime(i);
        });
      }

      var route = data.routes[0],
        interpretedData = {
          totalTimeText: convertSecondsToTime(_.reduce(route.legs, function (memo, seg) {
            return memo + seg.duration.value;
          }, 0)),
          totalDistanceText: convertMetresToMiles(_.reduce(route.legs, function (memo, seg) {
            return memo + seg.distance.value;
          }, 0)) + ' Miles'
        },
        times = {
          leaveTooting: consts.HOOLEY_ARRIVAL - route.legs[1].duration.value * 1000,
          arriveAtHooley: consts.HOOLEY_ARRIVAL,
          leaveHooley: consts.HOOLEY_ARRIVAL + consts.DELAY_AT_HOOLEY
        };
      times.arriveAtTooting = times.leaveTooting - consts.DELAY_AT_TOOTING;
      times.leaveHome = times.arriveAtTooting - route.legs[0].duration.value * 1000;
      times.arriveAtHome = times.leaveHooley + route.legs[2].duration.value * 1000;

      addTimes(times, interpretedData);

      _.each(this.newDataHandlers, function (fn) {
        fn(interpretedData);
      });
    }
  });

  return RouteInterpreter;
}());