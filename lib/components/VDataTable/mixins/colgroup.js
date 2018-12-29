/* @vue/component */
export default {
    methods: {
        genTColgroup: function genTColgroup() {
            if (!this.headers.every(function (header) {
                return header.width;
            })) return; // Exit we don't have width specified for all cols
            var children = this.genCols();
            return this.$createElement('colgroup', children);
        },
        genCols: function genCols() {
            var columns = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.headers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var header = _step.value;

                    columns.push(this.$createElement('col', {
                        attrs: { width: header.width }
                    }));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return columns;
        }
    }
};
//# sourceMappingURL=colgroup.js.map