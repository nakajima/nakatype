// My implementation of tooltips.
//
// Partly inspired by Cooltips (http://www.wildbit.com/labs/cooltips). My
// implementation differs in that instead of passing style options, it just
// adds the class name "hint" to tooltip elements, so they can be styled via CSS.
var HelpHint = Class.create({
  delay: 200, // Time to wait before display tooltip
  offset: 5, // Distance to offset tooltip from mouse pointer
  bindToMouse: true, // The tooltip element moves with the mouse
  elementCursor: 'pointer', // I think it's ugly to have the text selector for a tooltip.
  
  initialize: function(element, options) {
    this.on = false;
    this.options = options || { };
    Object.extend(this, this.options);
    this.element = $(element);
    this.text = this.element.readAttribute('title');
    if ( this.text == null || this.text.blank() ) { this.text = "<span class='nil'>(no information provided)</span>"; }
    this.setupHint();
    this.setupBehaviors();
    if ( this.elementCursor ) { this.element.setStyle({ cursor: this.elementCursor }); }
  },
   
  setupHint: function() {
    this.element.writeAttribute('title', '');
    this.element.addClassName('hasHint');
    this.tip = new Element('div', { 'class': 'hint', 'style': 'display:none' });
    this.tip.update(this.text);
    $(document.body).insert({ top:this.tip });
    this.tip.absolutize();
  },
  
  setupBehaviors: function() {
    this.behaviors = { };
    this.behaviors['show'] = this.show.bind(this);
    this.behaviors['hide'] = this.hide.bind(this);
    this.behaviors['move'] = this.move.bind(this);
    this.behaviors['fade'] = this.fade.bind(this);
    this.behaviors['appear'] = this.appear.bind(this);
    this.behaviors['observeMove'] = this.observeMove.bind(this);
    this.element.observe('mouseover', this.behaviors['show']);
    this.element.observe('mouseout', this.behaviors['hide']);
  },
  
  killBehaviors: function() {
    this.element.stopObserving(this.behaviors['show']);
    this.element.stopObserving(this.behaviors['hide']);
    this.element.stopObserving(this.behaviors['move']);
  },
  
  appear: function() {
    this.appearFX = new Effect.Appear(this.tip, { duration: 0.2 });
    this.on = true;
  },
  
  fade: function() {
    this.tip.fade({ duration: 0.2 });
  },
  
  show: function(event) {
    if (!this.on) {
      this.behaviors['observeMove'](true);
      var pointer = event.pointer();
      this.tip.setStyle({
        top: (pointer.y + this.offset) + 'px',
        left: (pointer.x + this.offset) + 'px'
      });
      
      this.timeout = window.setTimeout(this.behaviors['appear'], this.delay);
    }
  },
  
  hide: function(event) {
    if ( this.on ) {
      this.appearFX.cancel();
      this.behaviors['observeMove'](false);
      this.behaviors['fade']();
    }
    
    HelpHint._clearTimeout(this.timeout);
    this.on = false;
  },
  
  observeMove: function(shouldObserve) {
    if (!this.bindToMouse) { return this.observeMove = Prototype.K; }
    if (shouldObserve) { this.element.observe('mousemove', this.behaviors['move']); }
    else { this.element.stopObserving('mousemove', this.behaviors['move']); }
  },
  
  move: function(event) {
    var pointer = event.pointer();
    this.tip.setStyle({
      top: (pointer.y + this.offset) + 'px',
      left: (pointer.x + this.offset) + 'px'
    });
  }
});

Object.extend(HelpHint, {
  // This lets me curry the options as I iterate over elements to add
  // in Element#tipSection()
  add: function(options, element) {
    return element.makeToolTip(options);
  },
  
  _clearTimeout: function(timer) {
		clearTimeout(timer);
		clearInterval(timer);
		return null;
	}
});

Element.addMethods({
  // Adds tooltip behavior to the element.
  makeToolTip: function(element, options) {
    element = $(element);
    options = options || { };
    new HelpHint(element, options);
    return element;
  },
  
  // Useful if you have an element that contains a collection of elements
  // with tooltips.
  tipSection: function(element, options) {
    var options = options || { };
    var element = $(element);
    var targets = element.descendants().select(function(e) { return e.hasAttribute('title'); });
    targets.each(HelpHint.add.curry(options));
    return element;
  }
});