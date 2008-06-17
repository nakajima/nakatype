Element.addMethods({
 /**
  * Element.updateWithFade(@element, content) -> @element
  * 
  * - @element(Element): Element which should be updated
  * - content(String|Element): New content for element.
  *
  * Does pretty much the same thing as Element#update, except
  * for the fact that it fades the element before updating the
  * content, and appears the element upon completion.
  **/
  updateWithFade: function(element, content) {
    element = $(element);
    element.fade({
      duration: .2,
      afterFinish: function() {
        element.update(content);
        element.appear({ duration: .2 });
      }
    });
    return element;
  }
});
