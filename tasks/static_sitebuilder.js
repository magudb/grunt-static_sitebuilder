/*
 * grunt-static_sitebuilder
 * https://github.com/magudb/grunt-static_sitebuilder
 *
 * Copyright (c) 2014 Magnus Udbjørg
 * Licensed under the MIT license.
 */

'use strict';
var dust  = require('dustjs-linkedin');
var dustjsHelper = require('dustjs-helpers');
var fs = require('fs');
module.exports = function(grunt) {

var preloadLayouts =  function(){
  grunt.file.recurse("layouts", function callback(abspath, rootdir, subdir, filename) {
        var layout  = grunt.file.read(abspath);
        var name = rootdir+'/'+filename.replace('.dust','');     
        var compiled = dust.compile(layout, name);
        dust.loadSource(compiled);
    });
};

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('static_sitebuilder', 'Using grunt generate static html pages', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    
    preloadLayouts();
    

    this.files.forEach(function(f) {
     
    f.src.forEach(function(dataFile) {
       
         var json = grunt.file.readJSON(dataFile);
       
         var template  = grunt.file.read(json.template);
        
          var compiled = dust.compile(template, json.output);

          dust.loadSource(compiled);

          dust.render(json.output, json.data, function(err, html_out) { 
            if(err){
                throw err;
              }  
            grunt.log.writeln('File "' + f.dest + '/' + json.output + '" created.');  
            grunt.file.write( f.dest + '/' + json.output, html_out);
          });

        

    });
   
      // Print a success message.


     
    });
  });

};
