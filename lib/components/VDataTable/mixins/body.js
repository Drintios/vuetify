import ExpandTransitionGenerator from '../../transitions/expand-transition';
import { getObjectValueByPath } from '../../../util/helpers';
/* @vue/component */
export default {
    methods: {
        genTBody: function genTBody() {
            var children = this.genItems();
            return this.$createElement('tbody', children);
        },
        genExpandedRow: function genExpandedRow(props) {
            var children = [];
            if (this.isExpanded(props.item)) {
                var expand = this.$createElement('div', {
                    class: 'v-datatable__expand-content',
                    key: getObjectValueByPath(props.item, this.itemKey)
                }, [this.$scopedSlots.expand(props)]);
                children.push(expand);
            }
            var transition = this.$createElement('transition-group', {
                class: 'v-datatable__expand-col',
                attrs: { colspan: this.headerColumns },
                props: {
                    tag: 'td'
                },
                on: ExpandTransitionGenerator('v-datatable__expand-col--expanded')
            }, children);
            return this.genTR([transition], { class: 'v-datatable__expand-row' });
        },
        augmentRow: function augmentRow(row) {
            var tds = row.tag === 'td' ? [row] : this.hasTag(row, 'td') ? row : row[0].children;
            var i = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = tds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var td = _step.value;

                    if (this.headers[i].fixed === true && td.tag === 'td') {
                        td.data = td.data || {};
                        td.data.class = ((td.data['class'] || '') + ' fixed-column').trim();
                        td.data.style = {
                            left: this.getFixedColumnLeft(i) + 'px'
                        };
                        if (this.headers[i + 1] && !this.headers[i + 1].fixed) {
                            td.data.class += ' last-fixed-column';
                        }
                        i++;
                    }
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
        },
        genFilteredItems: function genFilteredItems() {
            if (!this.$scopedSlots.items) {
                return null;
            }
            var rows = [];
            for (var index = 0, len = this.filteredItems.length; index < len; ++index) {
                var item = this.filteredItems[index];
                var props = this.createProps(item, index);
                var row = this.$scopedSlots.items(props);
                this.augmentRow(row);
                rows.push(this.hasTag(row, 'td') ? this.genTR(row, {
                    key: this.itemKey ? getObjectValueByPath(props.item, this.itemKey) : index,
                    attrs: { active: this.isSelected(item) }
                }) : row);
                if (this.$scopedSlots.expand) {
                    var expandRow = this.genExpandedRow(props);
                    rows.push(expandRow);
                }
            }
            return rows;
        },
        genEmptyItems: function genEmptyItems(content) {
            if (this.hasTag(content, 'tr')) {
                return content;
            } else if (this.hasTag(content, 'td')) {
                return this.genTR(content);
            } else {
                return this.genTR([this.$createElement('td', {
                    class: {
                        'text-xs-center': typeof content === 'string'
                    },
                    attrs: { colspan: this.headerColumns }
                }, content)]);
            }
        }
    }
};
//# sourceMappingURL=body.js.map