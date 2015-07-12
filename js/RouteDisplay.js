var RouteDisplay = (function () {
  'use strict';
  function RouteDisplay(elem) {
    var mapOptions = {
        zoom: 6
      },
      map = new google.maps.Map(elem, mapOptions);
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(map);
  }

  _.extend(RouteDisplay.prototype, {
    processRoute: function (route) {
      this.directionsDisplay.setDirections(route);
    }
  });
  return RouteDisplay;
}());