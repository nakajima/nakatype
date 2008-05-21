// Classy.js contains class-based conveniences

Event.observe(document, 'dom:loaded', function() {
  var Classy = { }; // Setup the namespace
  Object.extend(Classy, {

    // Validator: Simple client-side form validation.
    //
    // Usage: Add the class name "required" to any required fields.
    // When the user attempts to submit the form, any required
    // fields left blank will have the class name "err" added to
    // them, which you can style appropriately.
    Validator: {
      // TODO: Use event delegation for this.
      findForms: function() {
        Classy.Validator.forms = $$('.required').pluck('form').uniq();
        Classy.Validator.forms.invoke('observe', 'submit', Classy.Validator.performCheck);
      },

      performCheck: function(event) {
        function isBlank(element) { return $F(element).blank(); }     
        var form = event.element();
        var requiredInputs = form.select('.required');
        if ( requiredInputs.any(isBlank) ) {
          requiredInputs.invoke('addClassName', 'err');
          event.stop();
        }
      }
    },

    // Confirmable: Simple action confirmation controls
    //
    // Usage: Add the class name "confirmable" to any link or form that needs confirmation.
    // When the user attempts to click/submit the "confirmable" element, the element's title
    // attribute will be used as a confirmation message. If the user clicks "Cancel", the
    // event will be stopped. Otherwise, it will be allowed to continue.
    //
    // Note: This script requires event_delegations.js and form_submit_bubbler.js
    Confirmable: {
      setup: function() {
        var body = $$('body')[0];
        body.delegators('form:submitted', { 'form.confirmable': Classy.Confirmable.submitted });
        body.delegators('click', { 'a.confirmable': Classy.Confirmable.clicked });
      },

      submitted: function(event) {
        var element = event.element();
        var message = element.readAttribute('title');
        if ( !confirm(message) ) { event.stop(); event.memo['originalEvent'].stop(); }
      },

      clicked: function(event) {
        var element = event.element();
        var message = element.readAttribute('title');
        if ( !confirm(message) ) { event.stop(); }
      }
    },

    // Defaultable: Simple default text behaviors
    //
    // Usage: Add the class name "defaultify" to text fields or textareas. When a user
    // element, the default text will be cleared, allowing for user input. When the element
    // loses focus, if the user has entered text, the text will remain. Otherwise, the 
    // default text will be restored.
    Defaultable: Class.create({
      initialize: function(element) {
        this.element = $(element);
        this.value = $F(element);
        this.setupBehaviors();
      },

      setupBehaviors: function() {
        this.element.observe('focus', this.clear.bindAsEventListener(this));
        this.element.observe('blur', this.restore.bindAsEventListener(this));
      },

      clear: function(event) {
        var value = $F(this.element);          
        if ( value.blank() || (value == this.value) ) {
          this.element.removeClassName('hasContent');
          this.element.clear();
        }
      },

      restore: function(event) {
        var value = $F(this.element);
        if ( value.blank() ) {
          this.element.removeClassName('hasContent');
          this.element.value = this.value;
        }
        else { this.element.addClassName('hasContent'); }
      }
    })
  });

  Classy.Validator.findForms();
  Classy.Confirmable.setup();
  $$('.highlightify').invoke('highlight');
  $$('.fadify').invoke('fade');
  $$('.pulsate').invoke('pulsate');
  $$('textarea.defaultify').each(function(element) { new Classy.Defaultable(element); });
  $$('input[type=text].defaultify').each(function(element) { new Classy.Defaultable(element); });
});