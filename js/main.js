/*globals RouteLookup, RouteDisplay, RouteInterpreter*/

(function () {
  'use strict';

  var lookup = new RouteLookup(),
    mapDisplay = new RouteDisplay($('<div/>').attr('id', 'map-canvas').prependTo($('body'))[0]),
    interpreter = new RouteInterpreter();

  lookup.addRouteProcessor(mapDisplay);
  lookup.addRouteProcessor(interpreter);

  $('form').on('submit', function (e) {
    e.preventDefault();

    lookup.getRouteForPostcode($('#postcode').val());
  });

  interpreter.onNewData(function (interpretation) {
    var $directionsPanel = $('#directions_panel');
    function addItem(key, label, parent) {
      parent = parent || interpretation;
      $directionsPanel.append($('<p/>').text(label + ': ' + parent[key]));
    }
    function addTimeItem(key, label) {
      addItem(key, label, interpretation.times);
    }

    $directionsPanel.html($('<h1/>').text('Your Hooleygan Plan'));
    addItem('totalTimeText', 'Total Time');
    addItem('totalDistanceText', 'Total Distance');
    $directionsPanel.append($('<h1/>').text('Breakdown'));
    addTimeItem('leaveHome', 'Leave Home');
    addTimeItem('arriveAtTooting', 'Arrive at Tooting');
    addTimeItem('leaveTooting', 'Leave Tooting');
    addTimeItem('arriveAtHooley', 'Arrive at Hooley');
    addTimeItem('leaveHooley', 'Leave Hooley');
    addTimeItem('arriveAtHome', 'Arrive at Home');

  });

}());