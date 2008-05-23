// Extensions to Numbers
Object.extend(Number.prototype, {
  // Seconds to a more readable format: 0:12 or something like that.
  toDuration: function() {
    var seconds = this + 0;
    var h = parseInt(seconds / 3600);
    var m = parseInt((seconds % 3600) / 60);
    var s = parseInt(seconds % 60).toPaddedString(2);
    m = (h > 0) ? m.toPaddedString(2) : m;    
    var resultString = (m + ':' + s);
        
    if (h > 0) { resultString = h + ':' + resultString; }
    return resultString;
  },
  
  // Bytes to kilobytes
  kilobytes: function() {
    return Math.ceil(this / 1000);
  }
});