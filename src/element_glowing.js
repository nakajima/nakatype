var GlowingElement = Class.create({
  glowColor: '#fff', // Element glows to this color
  afterGlow: .2, // Delay before element fades back to original color
  glowSpeed: .2, // Duration of glow transition
  fadeSpeed: .7, // Duration of de-glow transition
  
  initialize: function(element, options) {
    this.element = $(element);
    this.options = options || { };
    Object.extend(this, options);
    this.originalColor = this.element.getStyle('color');
    this.element.setStyle('color: ' + this.originalColor);
    this.setupBehaviors();
  },

  setupBehaviors: function() {
    this.behaviors = { };
    this.behaviors['start'] = this.start.bind(this);
    this.behaviors['stop'] = this.stop.bind(this);
    this.behaviors['fade'] = this.fade.bind(this);
    this.element.observe('mouse:enter', this.behaviors['start']);
    this.element.observe('mouse:leave', this.behaviors['stop']);
  },
  
  start: function() {
    this.effect = new Effect.Morph(this.element, {
      style: { color: this.glowColor },
      duration: this.glowSpeed,
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
      queue: 'front',
      afterFinish: function() {
        this.element.removeClassName('glowing');
        delete(this.effect);
      }.bind(this)
    });
  }
});

Element.addMethods({
  addGlow: function(element, options) {
    element = $(element);
    new GlowingElement(element, options);
    return element;
  }
});