// Pass in a function, and how many times you want it to be called.
// Any arguments that the function requires need to be curried in there.
//
// NOTE: Only works in Firefox with Firebug enabled.
//
// Example:
//
//   var addAnElement = function() {
//     var li = new Element('li');
//     $('someList').insert(li);
//   }
//
//   Benchmark.measure(addAnElement, 100);
//
// TODO: Figure out effect currying has on accuracy.
// TODO: Allow custom name to be passed in, since "benchmark function" is boring
var Benchmark = {
  measure: function(fn) {
    var name = 'benchmark function';
    var tests = $A(arguments).slice(1)[0] || 1;
    console.time(name);
    tests.times(fn);
    console.timeEnd(name);
  }
};

(function() {
  if (!(console && console.time && console.timeEnd)) {
    Benchmark.measure = function() { throw('Firebug not found!'); };
  }
})();