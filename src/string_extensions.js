Object.extend(String.prototype, {
  // Make a string presentable for URLs.
  toPermalink: function() {
    return this.gsub(/\W+/, ' ').strip().dasherize().toLowerCase().gsub(/\ +/, '-');
  },
  
  // Removes all instances of a substring or regex pattern from a string.
  without: function(substring) {
    var _copy = this;
    var method = (typeof(substring) == 'string') ? 'replace' : 'gsub';
    return $A([_copy]).invoke(method, substring, '')[0];
  },
  
  // Downcases first letter of a string
  uncapitalize: function() {
    return this[0].toLowerCase() + this.slice(1);
  },

  // Capitalizes the first letter of each word in string.
  titleize: function() {
    var words = this.toLowerCase().gsub(/\W|\_/, ' ').split(/\s+/);
    return $A(words).invoke('capitalize').join(' ');
  },
  
  // Formats string the way that I think Javascript function names should
  // look: somethingLikeThis or maybeThis.
  toMethodName: function() {
    return this.titleize().without(/\s/).uncapitalize();
  }
});