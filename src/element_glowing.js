var GlowingElement = Class.create({
  glowColor: '#fff', // Element glows to this color
  afterGlow: .2, // Delay before element fades back to original color
  glowSpeed: .2, // Duration of glow transition
  fadeSpeed: .4, // Duration of de-glow transition
  illumination: 8,
  
  initialize: function(element, options) {
    this.element = $(element);
    this.options = options || { };
    Object.extend(this, options);
    this.originalColor = this.element.getStyle('color');
    this.element.setStyle({
      textShadow: '0px 0px 0px #fff',
      color: this.originalColor
    });
    this.setupBehaviors();
  },

  setupBehaviors: function() {
    this.behaviors = { };
    this.behaviors['start'] = this.start.bind(this);
    this.behaviors['stop'] = this.stop.bind(this);
    this.behaviors['fade'] = this.fade.bind(this);
    this.element.observe('mouse:enter', this.behaviors['start']);
    this.element.observe('mouse:leave', this.behaviors['stop']);
    
    this.behaviors['illuminate'] = (function(target) {
      return Prototype.Browser.Gecko ?  (Prototype.K) : function(i) {
        target.element.setStyle('text-shadow: 0px 0px ' + (target.illumination * i) + 'px #076796');
        return i;
      };
    })(this);
    
    this.behaviors['deluminate'] = (function(target) {
      return Prototype.Browser.Gecko ? (Prototype.K) : function(i) {
        target.element.style['text-shadow'] = '0px 0px ' + (target.illumination - (target.illumination * i * 2)) + 'px #076796';
        target.element.style['cursor'] = 'pointer';
        return i;
      };
    })(this);
  },
  
  start: function() {
    new Effect.Morph(this.element, {
      style: { color: this.glowColor, textShadow: '4px' },
      duration: this.glowSpeed,
      transition: this.behaviors['illuminate'],
      fps: 30,
      afterFinish: function() {
        this.element.addClassName('glowing');
        delete(this.effect);
      }.bind(this)
    });
  },
  
  stop: function() {
    if (this.effect) { this.effect.cancel(); }
    var delay = this.element.hasClassName('glowing') ? (this.afterGlow * 1000) : 0;
    window.setTimeout(this.behaviors['fade'], delay);
  },
  
  fade: function() {
    this.effect = new Effect.Morph(this.element, {
      style: { color: this.originalColor },
      duration: this.fadeSpeed,
      transition: this.behaviors['deluminate'],
      queue: 'front',
      fps: 90,
      afterFinish: function() {
        this.element.removeClassName('glowing');
        delete(this.effect);
      }.bind(this)
    });
  }
});

Element.addMethods({
  addGlow: function(element, options) {
    new GlowingElement(element, options);
    return element;
  }
});