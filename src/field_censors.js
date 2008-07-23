(function() {
  var CensoredField = Class.create({
    initialize: function(element, terms) {
      this.terms = terms;
      this.element = element;
      this.element.observe('keypress', this.checkForTerms.bind(this));
    },
    
    checkForTerms: function(event) {
      if (matches = this.element.matchesTerms(this.terms)) {
        this.element.fire('field:censored', { terms: matches });
      }
    }
  });
  
  Object.extend(Form.Element.Methods, {
    censor: function(element) {
      element = $(element);
      var terms = $A(arguments).slice(1);
      new CensoredField(element, terms);
      return element;
    },

    matchesTerms: function(element, terms) {
      element = $(element);
      var value = $F(element);
      var matchTerm = function(term) { return value.include(term); }
      var matches = $A(terms).select(matchTerm);
      return (matches.length < 1) ? false : matches;
    }
  });
  
  Element.addMethods();
})();