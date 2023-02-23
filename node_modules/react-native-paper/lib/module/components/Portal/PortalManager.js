function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      portals: []
    });
    _defineProperty(this, "mount", (key, children) => {
      this.setState(state => ({
        portals: [...state.portals, {
          key,
          children
        }]
      }));
    });
    _defineProperty(this, "update", (key, children) => this.setState(state => ({
      portals: state.portals.map(item => {
        if (item.key === key) {
          return {
            ...item,
            children
          };
        }
        return item;
      })
    })));
    _defineProperty(this, "unmount", key => this.setState(state => ({
      portals: state.portals.filter(item => item.key !== key)
    })));
  }
  render() {
    return this.state.portals.map(_ref => {
      let {
        key,
        children
      } = _ref;
      return /*#__PURE__*/React.createElement(View, {
        key: key,
        collapsable: false /* Need collapsable=false here to clip the elevations, otherwise they appear above sibling components */,

        pointerEvents: "box-none",
        style: StyleSheet.absoluteFill
      }, children);
    });
  }
}
//# sourceMappingURL=PortalManager.js.map