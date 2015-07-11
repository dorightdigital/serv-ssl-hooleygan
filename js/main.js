(function () {
  'use strict';

  var directionsDisplay,
    directionsService = new google.maps.DirectionsService(),
    map;

  function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var $wrapper = $('<div/>').attr('id', 'map-canvas').prependTo($('body')),
      mapOptions = {
        zoom: 6
      };
    map = new google.maps.Map($wrapper[0], mapOptions);
    directionsDisplay.setMap(map);
  }

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

  $('form').on('submit', function (e) {
    e.preventDefault();
    var home = $('#postcode').val(),
      waypts = [
        {
          location: 'Cranmer Terrace, London SW17 0RE, United Kingdom',
          stopover: true
        },
        {
          location: 'Esso, 83 Brighton Rd, Coulsdon, Greater London CR5 3EG',
          stopover: true
        }
      ],
      request = {
        origin: home,
        destination: home,
        waypoints: waypts,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING
      };

    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var route = response.routes[0],
          panelMarkup,
          miles,
          time;

        panelMarkup = _.map(route.legs, function (routeSegment) {
          return [
            '<b>Route Segment:</b><br>',
            routeSegment.start_address + ' to ',
            routeSegment.end_address + '<br>',
            routeSegment.distance.text + '<br>',
            routeSegment.duration.text + '<br><br>'
          ].join('');
        }).join('');
        panelMarkup += '<br/><h1>Total</h1>';

        miles = convertMetresToMiles(_.reduce(route.legs, function (memo, seg) {
          return memo + seg.distance.value;
        }, 0));

        time = convertSecondsToTime(_.reduce(route.legs, function (memo, seg) {
          return memo + seg.duration.value;
        }, 0));
        panelMarkup += miles + ' miles<br/>';
        panelMarkup += time;

        $('#directions_panel').html(panelMarkup);
      }
    });
  });

  google.maps.event.addDomListener(window, 'load', initialize);

}());