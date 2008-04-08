// Classy.js contains class-based conveniences

// Validator: Simple client-side form validation.
//
// Usage: Add the class name "required" to any required fields.
// When the user attempts to submit the form, any required
// fields left blank will have the class name "err" added to
// them, which you can style appropriately.
var Validator = {
  findForms: function() {
    Validator.forms = $$('.required').pluck('form').uniq();
    Validator.forms.invoke('observe', 'submit', Validator.performCheck)
  },
  
  performCheck: function(event) {
    var form = event.element();
    var requiredInputs = form.select('.required');
    if ( requiredInputs.any(Validator.blank) ) {
      requiredInputs.invoke('addClassName', 'err');
      event.stop();
    }
  },
  
  blank: function(element) {
    return $F(element).empty();
  }
}

Event.observe(document, 'dom:loaded', Validator.findForms)

// Confirmable: Simple action confirmation controls
//
// Usage: Add the class name "confirmable" to any link or form that needs confirmation.
// When the user attempts to click/submit the "confirmable" element, the element's title
// attribute will be used as a confirmation message. If the user clicks "Cancel", the
// event will be stopped. Otherwise, it will be allowed to continue.
//
// Note: This script requires event_delegations.js and form_submit_bubbler.js
var Confirmable = {
  setup: function() {
    $$('body')[0].delegators('form:submitted', { 'form.confirmable': Confirmable.submitted });
    $$('body')[0].delegators('click', { 'a.confirmable': Confirmable.clicked });
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
}

Event.observe(document, 'dom:loaded', Confirmable.setup);