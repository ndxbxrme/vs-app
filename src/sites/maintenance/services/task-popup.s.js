// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance').factory('MaintenanceTaskPopup', function($timeout) {
    var cancelBubble, elem, getOffset, hidden, moveToElem, task;
    task = null;
    elem = null;
    hidden = true;
    cancelBubble = false;
    getOffset = function(elm) {
      var offset;
      offset = {
        left: 0,
        top: 0
      };
      while (elm && elm.tagName !== 'BODY') {
        offset.left += elm.offsetLeft;
        offset.top += elm.offsetTop;
        elm = elm.offsetParent;
      }
      return offset;
    };
    moveToElem = function() {
      var calendarOffset, elemLeft, offset, pointerBottom, pointerDisplay, pointerLeft, pointerTop, popupHeight, popupWidth;
      if (elem) {
        offset = getOffset(elem);
        offset.top += elem.clientHeight;
        offset.left -= +$('.maintenance-calendar-dir').width();
        elemLeft = offset.left;
        popupWidth = $('.maintenance-task-popup-dir').width();
        popupHeight = $('.maintenance-task-popup-dir .popup').height();
        calendarOffset = getOffset($('.maintenance-calendar-dir')[0]);
        pointerTop = '.75rem';
        pointerBottom = 'auto';
        if (offset.top + popupHeight > calendarOffset.top + $('.maintenance-calendar-dir').height()) {
          offset.top -= elem.clientHeight + popupHeight + 48;
          pointerTop = 'auto';
          pointerBottom = '.75rem';
        }
        if (offset.left + (popupWidth + 20) > window.innerWidth) {
          offset.left = window.innerWidth - (popupWidth + 10);
        }
        offset.left -= 20;
        if (offset.left < 2) {
          offset.left = 2;
        }
        if (window.innerWidth < 410) {
          offset.left = 2;
        }
        $('.maintenance-task-popup-dir').css(offset);
        pointerLeft = elemLeft - offset.left + 10;
        pointerDisplay = 'block';
        if (pointerLeft + 40 > popupWidth) {
          pointerDisplay = 'none';
        }
        return $('.maintenance-task-popup-dir .pointer').css({
          top: pointerTop,
          bottom: pointerBottom,
          left: pointerLeft,
          display: pointerDisplay
        });
      }
    };
    window.addEventListener('resize', moveToElem);
    return {
      setTask: function(_task) {
        return task = _task;
      },
      getTask: function() {
        return task;
      },
      show: function(_elem) {
        console.log('showing');
        hidden = false;
        elem = _elem[0];
        return $timeout(function() {
          return moveToElem();
        });
      },
      hide: function() {
        return hidden = true;
      },
      getHidden: function() {
        return hidden;
      },
      cancelBubble: cancelBubble
    };
  });

}).call(this);
