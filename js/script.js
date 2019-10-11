var slider_plugin = (function() {
  var fifi_slider = function(settings) {
    var _ = this;
    _.def = {
      target: $('.slider'),
      dotsWrapper: $('.dots-wrapper'),
      arrowLeft: $('.arrow-left'),
      arrowRight: $('.arrow-right'),
      transition: {
        speed: 300,
        easing: ''
      },
      swipe: true,
      autoHeight: true,
      afterChangeSlide: function afterChangeSlide() {}
    };
  }

  function init() {
    _.allSlides = 0;
    _.curSlide = 0;
    _.curLeft = 0;
    _.totalSlides = _.def.target.querySelectorAll('.slide').length;
    _.loadedCnt = 0;

    var cloneFirst = _.def.target.querySelectorAll('.slide')[0].cloneNode(true);
    _.sliderInner.appendChild(cloneFirst);
    var cloneLast = _.def.target.querySelectorAll('.slide')[_.totalSlides - 1].cloneNode(true);
    _.sliderInner.insertBefore(cloneLast, _.sliderInner.firstChild);

    _.curSlide++;
    _.allSlides = _.def.target.querySelectorAll('.slide');

    _.buildDots();
    _.setDot();
    _.initArrows();
    if (_.def.swipe) {
      addListenerMulti(_.sliderInner, 'mousedown touchstart', startSwipe);
    }
    _.isAnimating = false;
    
    _.init();
    $extendObj(_.def, settings);
    addListenerMulti(_.sliderInner, 'mousedown touchstart', startSwipe);  
    
    window.addEventListener("resize", on_resize(function() {
      _.updateSliderDimension();
    }), false);

    function on_resize(c, t) {
      onresize = function() {
        clearTimeout(t);
        t = setTimeout(c, 100);
      }
      return onresize;
    }
  }

  fifi_slider.prototype.buildDots = function () {
    var _ = this;
    for (var i = 0; i < _.totalSlides; i++) {
      var dot = document.createElement('li');
      dot.setAttribute('data-slide', i + 1);
      _.def.dotsWrapper.appendChild(dot);
    }
    _.def.dotsWrapper.addEventListener('click', function (e) {
      if (e.target && e.target.nodeName == "LI") {
        _.curSlide = e.target.getAttribute('data-slide');
        _.gotoSlide();
      }
    }, false);
  }

  fifi_slider.prototype.getCurLeft = function () {
    var _ = this;
    _.curLeft = parseInt(_.sliderInner.style.left.split('px')[0]);
  }

  fifi_slider.prototype.gotoSlide = function () {
    var _ = this;
    _.sliderInner.style.transition = 'left ' + _.def.transition.speed / 1000 + 's ' + _.def.transition.easing;
    _.sliderInner.style.left = -_.curSlide * _.slideW + 'px';
    addClass(_.def.target, 'isAnimating');
    setTimeout(function () {
      _.sliderInner.style.transition = '';
      removeClass(_.def.target, 'isAnimating');
    }, _.def.transition.speed);
    _.setDot();
    if (_.def.autoHeight) {
      _.def.target.style.height = _.allSlides[_.curSlide].offsetHeight + "px";
    }
    _.def.afterChangeSlide(_);
  }
  
  fifi_slider.prototype.initArrows = function () {
    var _ = this;
    if (_.def.arrowLeft != '') {
      _.def.arrowLeft.addEventListener('click', function () {
        if (!hasClass(_.def.target, 'isAnimating')) {
          if (_.curSlide == 1) {
            _.curSlide = _.totalSlides + 1;
            _.sliderInner.style.left = -_.curSlide * _.slideW + 'px';
          }
          _.curSlide--;
          setTimeout(function () {
            _.gotoSlide();
          }, 20);
        }
      }, false);
    }
    if (_.def.arrowRight != '') {
      _.def.arrowRight.addEventListener('click', function () {
        if (!hasClass(_.def.target, 'isAnimating')) {
          if (_.curSlide == _.totalSlides) {
            _.curSlide = 0;
            _.sliderInner.style.left = -_.curSlide * _.slideW + 'px';
          }
          _.curSlide++;
          setTimeout(function () {
            _.gotoSlide();
          }, 20);
        }
      }, false);
    }
  }
  
  fifi_slider.prototype.setDot = function () {
    var _ = this;
    var tardot = _.curSlide - 1;
    for (var j = 0; j < _.totalSlides; j++) {
      removeClass(_.def.dotsWrapper.querySelectorAll('li')[j], 'active');
    }
    if (_.curSlide - 1 < 0) {
      tardot = _.totalSlides - 1;
    } else if (_.curSlide - 1 > _.totalSlides - 1) {
      tardot = 0;
    }
    addClass(_.def.dotsWrapper.querySelectorAll('li')[tardot], 'active');
  }
  
  
  fifi_slider.prototype.updateSliderDimension = function () {
    var _ = this;
    _.slideW = parseInt(_.def.target.querySelectorAll('.slide')[0].offsetWidth);
    _.sliderInner.style.left = -_.slideW * _.curSlide + "px";
    if (_.def.autoHeight) {
      _.def.target.style.height = _.allSlides[_.curSlide].offsetHeight + "px";
    } else {
      for (var i = 0; i < _.totalSlides + 2; i++) {
        if (_.allSlides[i].offsetHeight > _.def.target.offsetHeight) {
          _.def.target.style.height = _.allSlides[i].offsetHeight + "px";
        }
      }
    }
    _.def.afterChangeSlide(_);
  }

  function $(elem) {
    return document.querySelector(elem);
  }
  
  function addListenerMulti(el, s, fn) {
    s.split(' ').forEach(function(e) {
      return el.addEventListener(e, fn, false);
    });
  }
  
  function $extendObj(_def, addons) {
    if (typeof addons !== "undefined") {
      for (var prop in _def) {
        if (addons[prop] != undefined) {
          _def[prop] = addons[prop];
        }
      }
    }
  }

  return fifi_slider;
})();
