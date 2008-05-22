// Element Controls: Control elements with other elements.
// See http://github.com/nakajima/nakatype/wikis/element-controls-element_controls-js
(function() {
  Element.Controls = {
    disableMultiple: false,

    click: function(event) {
      function attempt(command) {
        var matches = command.match(/([a-zA-Z]+)_(\w+)/);
        var method = matches[1];
        var target = (matches[2] == 'self') ? event.element() : $(matches[2]);
        if ( target[method] ) {
          target[method].apply(target);
          event.stop();
        }
      }

      var element = event.element();
      var elementID = element.identify();
      var commands = Element.Controls.disableMultiple ? [elementID] : elementID.split('_and_');
      return commands.map(attempt);
    }
  }

  Event.observe(document, 'dom:loaded', function() {
    $$('body')[0].delegators('click', { '.control': Element.Controls.click });
  })
})();