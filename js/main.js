/*globals RouteLookup, RouteDisplay, RouteInterpreter*/

(function () {
  'use strict';

  var lookup = new RouteLookup(),
    mapDisplay = new RouteDisplay($('<div/>').attr('id', 'map-canvas').prependTo($('body'))[0]),
    interpreter = new RouteInterpreter(),
    $root = $('body');

  $root.addClass('no-route').removeClass('loading');

  lookup.addRouteProcessor(mapDisplay);
  lookup.addRouteProcessor(interpreter);

  function showError(text) {
    $('form').find('.error').remove();
    $('form').append($('<p/>').addClass('error').text(text));
  }

  $('form').on('submit', function (e) {
    e.preventDefault();

    var postcode = $('#postcode').val();
    if (postcode) {
      lookup.getRouteForPostcode(postcode);
    } else {
      showError('Please enter a postcode');
    }
  });

  lookup.onRouteError(function () {
    $root.addClass('no-route');
    showError('There was an error with your route, please try again.');
  });

  interpreter.onNewData(function (interpretation) {
    $root.removeClass('no-route');
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

    $directionsPanel.append($('<a/>').attr({href: '#'}).text('Start Again').click(function (e) {
      e.preventDefault();
      $root.addClass('no-route');
    }));
  });

}());