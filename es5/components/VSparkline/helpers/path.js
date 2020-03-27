'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.genPath = genPath;

var _math = require('./math');

/**
 * From https://github.com/unsplash/react-trend/blob/master/src/helpers/DOM.helpers.js#L18
 */
function genPath(points, radius) {
    var start = points.shift();
    return 'M' + start.x + ' ' + start.y + points.map(function (point, index) {
        var next = points[index + 1];
        var prev = points[index - 1] || start;
        var isCollinear = next && (0, _math.checkCollinear)(next, point, prev);
        if (!next || isCollinear) {
            return 'L' + point.x + ' ' + point.y;
        }
        var threshold = Math.min((0, _math.getDistance)(prev, point), (0, _math.getDistance)(next, point));
        var isTooCloseForRadius = threshold / 2 < radius;
        var radiusForPoint = isTooCloseForRadius ? threshold / 2 : radius;
        var before = (0, _math.moveTo)(prev, point, radiusForPoint);
        var after = (0, _math.moveTo)(next, point, radiusForPoint);
        return 'L' + before.x + ' ' + before.y + 'S' + point.x + ' ' + point.y + ' ' + after.x + ' ' + after.y;
    }).join('');
}
//# sourceMappingURL=path.js.map