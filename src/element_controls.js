/*
  - Nakatype Element Controls -

  Rather abstract, yet convenient module for making elements act as controls
  for other elements. To create a control, just give an element the class
  name "control" then give it an id that will describe its action.

  For example:

    <a href="#" id="show_menu" class="control">Show the menu</a>
    <ul id="menu" style="display:none">
      <li>Option 1</li>
      <li>Option 2</li>
      <li>Option 3</li>
      <li><a href="#" id="hide_menu" class="control">Cancel</a></li>
    </ul>

  In the above example, the "show_menu" link, when clicked, will show the ul
  with the id of "menu". Clicking the "hide_menu" link will hide it again.

  To create an element that controls itself, use the special word "self" instead
  of a target element's id attribute. When clicked, the following element will be 
  highlighted, assuming the script.aculo.us effects.js library has been included:
  
    <a href="#" id="highlight_self" class="control">Highlight Me</a>

  This script has one more trick. You can create controls that perform multiple
  actions by splitting the commands with "_and_". Longer ids tend to get ugly with
  this syntax, but it works well if your ids are short and sweet.
  
  Example:
  
    <div id="options">
      <a href="#" id="show_menu_and_hide_options" class="control">Show the menu</a>
    </div>
    <ul id="menu" style="display:none">
      <li>Option 1</li>
      <li>Option 2</li>
      <li>Option 3</li>
      <li><a href="#" id="hide_menu_and_show_options" class="control">Cancel</a></li>
    </ul>
  
  Note: Unfortunately, this syntax means you'll run into trouble if you have any elements
  that have ids that include the substring '_and_'. To get around this problem, you can 
  disable support for multiple actions by setting the Element.Controls.disableMultiple 
  option to true.
*/

Element.addMethods({
  Controls: {
    disableMultiple: false,
    
    click: function(event) {
      function attempt(command) {
        var matches = command.match(/([a-zA-Z]+)_(\w+)/);
        var method = matches[1];
        var target = (matches[2] == 'self') ? event.element() : $(matches[2]);
        if ( target[method] ) {
          target[method].apply(target);
          event.stop();
        };      
      }

      var element = event.element();
      var elementID = element.identify()
      var commands = Element.Controls.disableMultiple ? [elementID] : elementID.split('_and_');
      return commands.map(attempt);
    }
  }
})

Event.observe(document, 'dom:loaded', function() {
  $$('body')[0].delegators('click', { '.control': Element.Controls.click });
})