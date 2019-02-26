'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../../../util/helpers');

/* @vue/component */
exports.default = {
    props: {
        disableKeys: Boolean
    },
    data: function data() {
        return {
            listIndex: -1,
            tiles: []
        };
    },
    watch: {
        isActive: function isActive(val) {
            if (!val) this.listIndex = -1;
        },
        listIndex: function listIndex(next, prev) {
            if (next in this.tiles) {
                var tile = this.tiles[next];
                tile.classList.add('v-list__tile--highlighted');
                this.$refs.content.scrollTop = tile.offsetTop - tile.clientHeight;
            }
            prev in this.tiles && this.tiles[prev].classList.remove('v-list__tile--highlighted');
        }
    },
    methods: {
        onKeyDown: function onKeyDown(e) {
            var _this = this;

            if (e.keyCode === _helpers.keyCodes.esc) {
                this.isActive = false;
            } else if (e.keyCode === _helpers.keyCodes.tab) {
                setTimeout(function () {
                    if (!_this.$refs.content.contains(document.activeElement)) {
                        _this.isActive = false;
                    }
                });
            } else {
                this.changeListIndex(e);
            }
        },
        changeListIndex: function changeListIndex(e) {
            if ([_helpers.keyCodes.down, _helpers.keyCodes.up, _helpers.keyCodes.enter].includes(e.keyCode)) e.preventDefault();
            // For infinite scroll and autocomplete, re-evaluate children
            this.getTiles();
            if (e.keyCode === _helpers.keyCodes.down && this.listIndex < this.tiles.length - 1) {
                this.listIndex++;
                // Allow user to set listIndex to -1 so
                // that the list can be un-highlighted
            } else if (e.keyCode === _helpers.keyCodes.up && this.listIndex > -1) {
                this.listIndex--;
            } else if (e.keyCode === _helpers.keyCodes.enter && this.listIndex !== -1) {
                this.tiles[this.listIndex].click();
            }
        },
        getTiles: function getTiles() {
            this.tiles = this.$refs.content.querySelectorAll('.v-list__tile');
        }
    }
}; /**
    * Menu keyable
    *
    * @mixin
    *
    * Primarily used to support VSelect
    * Handles opening and closing of VMenu from keystrokes
    * Will conditionally highlight VListTiles for VSelect
    */
// Utils
//# sourceMappingURL=menu-keyable.js.map