import React from 'react';
import EventEmitter from 'events';

const HooksEventEmitter = new EventEmitter();

// https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/
export const { useState, useEffect } = (function() {
  const hooks = [];
  let currentHook = 0;
  HooksEventEmitter.on('render', () => (
    currentHook = 0
  ));
  return {
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      const deps = hooks[currentHook];
      const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true;
      if (hasNoDeps || hasChangedDeps) {
        hooks[currentHook] = depArray;
        callback();
      }
      currentHook++;
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue;
      const setStateHookIndex = currentHook;
      const setState = (newState) => {
        const result = (hooks[setStateHookIndex] = newState);
        HooksEventEmitter.emit('requestRender');
        return result;
      };
      return [hooks[currentHook++], setState];
    },
  }
})();

const register = (Child, render, ...extras) => {
  class CustomHooksComponent extends React.Component {
    constructor(props) {
      super(props);
      this.requested = false;
      HooksEventEmitter.on('requestRender', this.onRequestRender.bind(this));
      HooksEventEmitter.on('render', () => this.setState({}));
    }
    onRequestRender() {
      if (!this.requested) {
        this.requested = true;
        requestAnimationFrame(
          () => {
            this.requested = false;
            HooksEventEmitter.emit('render');
          },
        );
      }
    }
    render() {
      return (
        <Child
        />
      );
    }
  } 
  return render(<CustomHooksComponent />, ...extras);
};

export default {
  register,
};
