module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    shell: {
      options: {
        stdout: true
      },
      selenium: {
        command: './selenium/start',
        options: {
          stdout: false,
          async: true
        }
      },
      protractor_install: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager update'
      },
      npm_install: {
        command: 'npm install'
      }
    },

    connect: {
      options: {
        base: 'app/'
      },
      webserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      devserver: {
        options: {
          port: 8888
        }
      },
      testserver: {
        options: {
          port: 9999
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    protractor: {
      options: {
        keepAlive: true,
        configFile: "./test/protractor.conf.js"
      },
      singlerun: {},
      auto: {
        keepAlive: true,
        options: {
          args: {
            seleniumPort: 4444
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/{,*/}*.js'
      ]
    },

    concat: {
      styles: {
        dest: './app/assets/app.css',
        src: [
          'app/styles/adf.css',
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'bower_components/components-font-awesome/css/font-awesome.min.css',
          'bower_components/pure/pure-min.css',
          'app/styles/app.css',
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        dest: './app/assets/app.js',
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/jquery-ui/ui/jquery.ui.core.js',
          'bower_components/jquery-ui/ui/jquery.ui.widget.js',
          'bower_components/jquery-ui/ui/jquery.ui.mouse.js',
          'bower_components/jquery-ui/ui/jquery.ui.sortable.js',

          'bower_components/angular/angular.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/showdown/compressed/showdown.js',
          'bower_components/showdown/compressed/extensions/github.js',
          'bower_components/showdown/compressed/extensions/twitter.js',
          'bower_components/angular-markdown-directive/markdown.js',
          'bower_components/angular-local-storage/angular-local-storage.js',
          'bower_components/angular-bootstrap/ui-bootstrap.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',

          'app/scripts/adf/adf.js',
          'app/scripts/adf/structures.js',
          'app/scripts/adf/provider.js',
          'app/scripts/adf/sortable.js',
          'app/scripts/adf/widget-content.js',
          'app/scripts/adf/widget.js',
          'app/scripts/adf/dashboard.js',
          //
          'app/scripts/structures.js',
          // TODO: rename
          'app/scripts/sample.js',
          'app/scripts/sample-01.js',

          // Widgets
          'app/scripts/widgets/news/news.js',
          'app/scripts/widgets/weather/weather.js',
          'app/scripts/widgets/linklist/linklist.js',
          'app/scripts/widgets/markdown/markdown.js',
          'app/scripts/widgets/linklist/linklist.js',
          'app/scripts/widgets/randommsg/randommsg.js'
        ]
      },
    },

    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['bower_components/components-font-awesome/fonts/*'], dest: 'app/fonts/'},
        ]
      }
    },

    watch: {
      options : {
        livereload: 7777
      },
      assets: {
        files: ['app/styles/**/*.css','app/scripts/**/*.js'],
        tasks: ['concat']
      },
      protractor: {
        files: ['app/scripts/**/*.js','test/e2e/**/*.js'],
        tasks: ['protractor:auto']
      }
    },

    open: {
      devserver: {
        path: 'http://localhost:8888'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },

    karma: {
      unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: true,
        singleRun: false
      },
      unit_coverage: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/scripts/*.js': ['coverage']
        },
        coverageReporter: {
          type : 'lcov',
          dir : 'coverage/'
        }
      },
    },

    coveralls: {
      options: {
        debug: true,
        coverage_dir: 'coverage/',
        //dryRun: true,
        force: true,
        recursive: true
      }
    }
  });

  //single run tests
  grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['connect:testserver','protractor:singlerun']);

  //autotest and watch tests
  grunt.registerTask('autotest', ['karma:unit_auto']);
  grunt.registerTask('autotest:unit', ['karma:unit_auto']);
  grunt.registerTask('autotest:e2e', ['connect:testserver','shell:selenium','watch:protractor']);

  //coverage testing
  grunt.registerTask('test:coverage', ['karma:unit_coverage','coveralls']);
  grunt.registerTask('coverage', ['karma:unit_coverage','open:coverage','connect:coverage']);

  //installation-related
  grunt.registerTask('install', ['update','shell:protractor_install']);
  grunt.registerTask('update', ['shell:npm_install', 'concat']);

  //defaults
  grunt.registerTask('default', ['dev']);

  //development
  grunt.registerTask('dev', ['update', 'copy', 'connect:devserver', 'open:devserver', 'watch:assets']);

  //server daemon
  grunt.registerTask('serve', ['connect:webserver']);
};
