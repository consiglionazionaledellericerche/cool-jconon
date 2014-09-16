(function () {

  'use strict';

  function processData(x) {

    var d = [],
      q = _.groupBy(x, function (k) {
        return k;
      });

    _.each(q, function (v, k) {
      var a = [Number(k), v.length];
      d.push(a);
    });

    d.sort(function (a, b) {
      return a[0] - b[0];
    });

    return d;
  }


  // helper for returning the weekends in a period
  function weekendAreas(axes) {

    var markings = [],
      d = new Date(axes.xaxis.min),
      i;

    // go to the first Saturday

    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
    d.setUTCSeconds(0);
    d.setUTCMinutes(0);
    d.setUTCHours(0);

    i = d.getTime();

    // when we don't set yaxis, the rectangle automatically
    // extends to infinity upwards and downwards

    do {
      markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
      i += 7 * 24 * 60 * 60 * 1000;
    } while (i < axes.xaxis.max);

    return markings;
  }

  // draw actual chart
  function plot(target, d, symbol) {

    var i, options;

    // first correct the timestamps - they are recorded as the daily
    // midnights in UTC+0100, but Flot always displays dates in UTC
    // so we have to add one hour to hit the midnights in the plot

    for (i = 0; i < d.length; ++i) {
      d[i][0] += 60 * 60 * 1000;
    }

    options = {
      points: {
        show: true,
        symbol: symbol || 'circle',
        radius: 5
      },
      xaxis: {
        mode: 'time',
        tickLength: 5
      },
      grid: {
        markings: weekendAreas
      }
    };

    $.plot(target, [d], options);

  }

  angular
    .module('metaInfApp')
    .directive('timelineChart', function () {
      return {
        template: '<div class="timeline"></div>',
        restrict: 'E',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {
          var target = element.children()[0];

          scope.$watch(function () {
            return ngModel.$modelValue;
          }, function (timeSeries) {
            if (timeSeries) {
              var items = processData(timeSeries);
              plot(target, items, attributes.symbol);
            }
          });

        }
      };

    });

}());
