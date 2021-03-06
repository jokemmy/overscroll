
import pick from 'object.pick';
import compose from './utils/compose';

const noop = () => {};

export function handler( name ) {
  return function( scope ) {
    const { mode } = scope;
    const wrap = function( func ) {
      func.call( scope.target, pick( scope.overscroll, [
        'scrollTop',
        'scrollLeft',
        'scrollHeight',
        'scrollWidth',
        'clientHeight',
        'clientWidth'
      ].concat( mode === 'scroll' ? [] : [ 'section', 'positions' ])));
    };
    scope.handleCache = scope.handleCache || {};
    scope.handleCache[name] = noop;
    const initialHandler = scope[name] ? scope[name] : noop;
    scope[name] = function() {
      scope.handleCache[name]();
      wrap( initialHandler );
    };
    return ( callback ) => {
      scope.handleCache[name] = scope.handleCache[name] !== noop
        ? compose( wrap( callback ), scope.handleCache[name])
        : wrap( callback );
    };
  };
}

export const handleDestroy = handler( 'onDestroy' );
export const handleBeforeScroll = handler( 'onBeforeScroll' );
export const handleAfterScroll = handler( 'onAfterScroll' );
export const handleScroll = handler( 'onScroll' );
export const handleInit = handler( 'onInit' );
