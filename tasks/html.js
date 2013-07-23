/*
 * grunt-html
 * https://github.com/jzaefferer/grunnt-html
 *
 * Copyright (c) 2012 Jörn Zaefferer
 * Licensed under the MIT license.
 */

var htmllint = require('../lib/htmllint');

module.exports = function(grunt) {
  "use strict";

  grunt.registerMultiTask('htmllint', 'Validate html files', function() {
    var done = this.async(),
      files = grunt.file.expand(this.filesSrc),
      options = this.options();

    htmllint(grunt, files, function(error, result) {
      if (error) {
        grunt.log.error(error);
        done(false);
        return;
      }
      if (!result.length) {
        grunt.log.writeln(files.length + ' file(s) valid');
        done();
        return;
      }
      if (options.partials) {
          result = filterPartials(result);
      }
      grunt.log.writeln(result.join('\n'));
      done(false);
    });
  });

  var PARTIALS_IGNORE = [
    'Start tag seen without seeing a doctype first',
    'Element "head" is missing a required instance of child element'
  ];

  function filterPartials(output) {
    return (output || []).filter(function (current) {
      return (PARTIALS_IGNORE.filter(function (ignore) {
        return current.indexOf(ignore) >= 0;
      })).length === 0;
    });
  }

};
