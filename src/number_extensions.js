// Extensions to Numbers
Object.extend(Number.prototype, {
  // Seconds to a more readable format: 0:12 or something like that.
  toDuration: function() {
    var seconds = this + 0;
    h = parseInt(seconds / 3600);
    m = parseInt((seconds % 3600) / 60);
    s = parseInt(seconds % 60).toPaddedString(2);
    var resultString = '';
    resultString = resultString + (m + ':' + s);
    return (h > 0) ? (h + ':' + resultString) : resultString;
  },
  
  // Bytes to kilobytes
  kilobytes: function() {
    return Math.ceil(this / 1000);
  }
});