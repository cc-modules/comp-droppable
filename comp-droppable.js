const EventUtil = require('util-events');
const ET = cc.Node.EventType;
cc.Class({
  name: 'Droppable',
  extends: cc.Component,
  properties: {
    tag: "",
    draggableClassName: {
      default: 'Draggable'
    },
    onEnter: {
      type: cc.Component.EventHandler,
      default: null
    },
    onDrop: {
      type: cc.Component.EventHandler,
      default: null
    },
    onExit: {
      type: cc.Component.EventHandler,
      default: null
    }
  },
  onLoad () {
    this._exit = true;
    this._other = null;
  },
  onCollisionEnter: function (other) {
    this._other = other;
    this._exit = false;
    // bind TOUCH_END event so that we'll be notified
    // when user release draggable
    other.node.on(ET.TOUCH_END, this._onTouchEnd, this);
    this._callHandler(this.onEnter);
  },
  onCollisionExit: function () {
    this._callHandler(this.onExit);
    this._dispose();
  },
  _onTouchEnd (e) {
    if (!this._exit) {
      // When TOUCH_END the draggable still intersect with droppable
      // call on drop handler
      this._callHandler(this.onDrop);
    }
    this._dispose();
  },
  _dispose () {
    // unbind touch end event on draggable
    if (this._other) {
      this._other.node.off(ET.TOUCH_END, this._onTouchEnd, this);
    }
    this._exit = true;
  },
  _callHandler (handler) {
    const other = this._other;
    const draggable = other.node.getComponent(this.draggableClassName);
    if (!draggable) return;
    const droppable = this.getComponent('Droppable');
    const args = [other.node, this.node, draggable, droppable];
    EventUtil.callHandler(handler, args)
  }
});