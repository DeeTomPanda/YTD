function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import * as React from 'react';
export default class PortalConsumer extends React.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "key", void 0);
  }
  componentDidMount() {
    this.checkManager();
    this.key = this.props.manager.mount(this.props.children);
  }
  componentDidUpdate() {
    this.checkManager();
    this.props.manager.update(this.key, this.props.children);
  }
  componentWillUnmount() {
    this.checkManager();
    this.props.manager.unmount(this.key);
  }
  checkManager() {
    if (!this.props.manager) {
      throw new Error('Looks like you forgot to wrap your root component with `Provider` component from `react-native-paper`.\n\n' + "Please read our getting-started guide and make sure you've followed all the required steps.\n\n" + 'https://callstack.github.io/react-native-paper/getting-started.html');
    }
  }
  render() {
    return null;
  }
}
//# sourceMappingURL=PortalConsumer.js.map