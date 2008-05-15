var Benchmark = {
  measure: function(fn) {
    var tests = $A(arguments).slice(1) || 1;
    var results = [];
    tests.times(function() {
      var startTime = new Date().getTime();
      fn();
      var endTime = new Date().getTime();
      var res = endTime - startTime;
      results.push(res);
    });
    console.info('Elapsed time: ' + (results.mean() / 1000) + ' seconds.');
  }
};