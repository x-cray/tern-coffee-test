CoffeeScript.compileWithReverseMap = function(code, options) {
  var currentColumn, currentLine, err, fragment, fragments, js, newLines, _j, _len1;

  var reverseMap = {};

  if (!options) options = {};

  var parser = this.require("./parser").parser;
  var lexer = new (this.require("./lexer").Lexer);
  var helpers = this.helpers;

  try {
    fragments = (parser.parse(lexer.tokenize(code, options))).compileToFragments(options);
    console.log(fragments);
    currentLine = 0;
    currentColumn = 0;

    js = "";
    var accumulatedX = 0;

    for (_j = 0, _len1 = fragments.length; _j < _len1; _j++) {
      fragment = fragments[_j];

      if (fragment.type!="Block" && fragment.locationData) {
        var sy = fragment.locationData.first_line;
        var sx = fragment.locationData.first_column;

        if (!reverseMap[sy])
          reverseMap[sy] = {};

        reverseMap[sy][sx] = {
          y: currentLine,
          x: accumulatedX,
          l: fragment.code.length
        };
      }

      newLines = helpers.count(fragment.code, "\n");
      currentLine += newLines;
      currentColumn = fragment.code.length - (newLines ? fragment.code.lastIndexOf("\n") : 0);

      if (newLines) accumulatedX = 0;
      accumulatedX += currentColumn;

      js += fragment.code;
    }

    return {
      js: js,
      reverseMap: reverseMap
    };
  } catch (_error) {
    err = _error;
    if (options.filename) {
      err.message = "In " + options.filename + ", " + err.message;
    }
    throw err;
  }
}
