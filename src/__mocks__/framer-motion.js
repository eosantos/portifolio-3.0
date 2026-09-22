// src/__mocks__/framer-motion.js
/* eslint-disable @typescript-eslint/no-require-imports, react/display-name */
const React = require('react');

function createMockMotionValue(initial) {
  var value = initial;
  var subscribers = new Set();
  return {
    get: function () {
      return value;
    },
    set: function (v) {
      value = v;
      subscribers.forEach(function (cb) {
        cb(v);
      });
    },
    onChange: function (cb) {
      subscribers.add(cb);
      return function () {
        subscribers.delete(cb);
      };
    },
    interpolate: function (fn) {
      return {
        get: function () {
          return fn(0);
        },
        interpolate: function () {
          return '';
        }
      };
    }
  };
}

function createMotionComponent(tag) {
  return function (props) {
    var children = props.children;
    var rest = {};
    for (var key in props) {
      if (key !== 'children') rest[key] = props[key];
    }
    return React.createElement(tag, rest, children);
  };
}

module.exports = {
  motion: {
    div: createMotionComponent('div'),
    h1: createMotionComponent('h1'),
    h2: createMotionComponent('h2'),
    h3: createMotionComponent('h3'),
    p: createMotionComponent('p'),
    span: createMotionComponent('span'),
    section: createMotionComponent('section'),
    article: createMotionComponent('article'),
    button: createMotionComponent('button'),
    img: createMotionComponent('img'),
    header: createMotionComponent('header'),
    nav: createMotionComponent('nav'),
    a: createMotionComponent('a')
  },
  AnimatePresence: function (props) {
    return React.createElement(React.Fragment, {}, props.children);
  },
  useScroll: function () {
    return {
      scrollY: createMockMotionValue(0),
      scrollYProgress: createMockMotionValue(0)
    };
  },
  useTransform: function (source, input, output) {
    return {
      get: function () {
        return output[0];
      },
      interpolate: function (fn) {
        return fn(output[0]);
      }
    };
  },
  useSpring: function (value /*, config */) {
    return value;
  }
};
