// Simulates onsubmit event bubbling using the 'form:submitted' custom event.
// Adds the original trigger event to the custom event's memo object using the
// key 'originalEvent' so it can be halted by the custom handler.
var Bubbler = {
  submittableInput: function(element) {
    var element = $(element);
    return ( element.match('input[type=text]') || element.match('input[type=password]') );
  },

  submitButton: function(element) {
    var element = $(element);
    return ( element.match('input[type=submit]') || element.match('input[type=image]') );
  },

  Behaviors: {        
    keypress: function(event) {
      if ( event.keyCode == 13 ) {
        var element = event.element();
        if ( Bubbler.submittableInput(element) ){
          element.form.fire('form:submitted', { 'originalEvent': event });
        }
      }
    },

    click: function(event) {
      var element = event.element();      
      if ( Bubbler.submitButton(element) ) {
        element.form.fire('form:submitted', { 'originalEvent': event });
      }
    }
  }
};

Event.observe(document, 'keypress', Bubbler.Behaviors.keypress);
Event.observe(document, 'click', Bubbler.Behaviors.click);