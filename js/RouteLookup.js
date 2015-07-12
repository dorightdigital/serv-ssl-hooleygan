var RouteLookup = (function (mapsApi) {
  'use strict';

  var initialised = false, fnsOnInit = [], directionsService = new mapsApi.DirectionsService();
  google.maps.event.addDomListener(window, 'load', function () {
    initialised = true;
    _.each(fnsOnInit, function (fn) {
      fn();
    });
  });

  function RouteLookup() {
    this.dataProcessors = [];

    this.runWhenReady = function (fn) {
      if (initialised) {
        fn();
      } else {
        fnsOnInit.push(fn);
      }
    };
  }

  _.extend(RouteLookup.prototype, {
    getRouteForPostcode: function (home) {
      var self = this;
      this.runWhenReady(function () {
        var waypts = [
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
            unitSystem: mapsApi.UnitSystem.IMPERIAL,
            optimizeWaypoints: false,
            travelMode: mapsApi.TravelMode.DRIVING
          };

        directionsService.route(request, function (response, status) {
          if (status === mapsApi.DirectionsStatus.OK) {
            _.invoke(self.dataProcessors, 'processRoute', response);
          } else {
            throw new Error(['Response not OK', status, response]);
          }
        });
      });
    },
    addRouteProcessor: function (dp) {
      this.dataProcessors.push(dp);
    }
  });

  return RouteLookup;
}(google.maps));
