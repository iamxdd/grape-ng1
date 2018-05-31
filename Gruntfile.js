
'use strict';

module.exports = function(grunt) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    grapecomps: 'grunt-grape-auto-components'
  });

  /**
   * Load in our build configuration file.
   */
  var userConfig = {
    dist: 'dist',
    src: require('./bower.json').appPath || 'app',
    vendorFiles: {
      js: [
        './vendor/jquery/dist/jquery.min.js', 
        './vendor/angular/angular.min.js',
        './vendor/bootstrap/dist/js/bootstrap.min.js',
        './vendor/angular-sanitize/angular-sanitize.min.js',
        './vendor/angular-ui-router/release/angular-ui-router.min.js',
        './vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
        './vendor/angular-ui-select/dist/select.min.js',
        './vendor/typeahead.js/dist/typeahead.bundle.min.js',
        './vendor/angular-typeahead/dist/angular-typeahead.min.js',
        './vendor/angular-busy/dist/angular-busy.min.js',
        './vendor/angular-datepicker/dist/angular-datepicker.min.js',
        './vendor/tinymce/tinymce.min.js',
        './vendor/moment/min/moment-with-locales.min.js',
        './vendor/moment-timezone/builds/moment-timezone-with-data.min.js',
        './vendor/angular-ui-tinymce/dist/tinymce.min.js',
        './vendor/ng-table/dist/ng-table.min.js',
        './vendor/toastr/toastr.min.js',
        './vendor/requirejs/require.js',
        './vendor/underscore/underscore.js',
        './vendor/oclazyload/dist/ocLazyLoad.require.js',
      ],
      css: [
        './vendor/bootstrap/dist/css/bootstrap.css',
        './vendor/angular-bootstrap/ui-bootstrap-csp.css',
        './vendor/sweetalert/dist/sweetalert.css',
        './vendor/angular-busy/angular-busy.css',
        './vendor/angular-datepicker/dist/angular-datepicker.css',
        './vendor/ng-table/dist/ng-table.css',
        './vendor/toastr/toastr.css',
        './vendor/font-awesome/css/font-awesome.css',
        './vendor/angular-ui-select/dist/select.css',
        './vendor/ng-dialog/css/ngDialog.min.css',
        './vendor/ng-dialog/css/ngDialog-theme-default.min.css',
        './vendor/nsPopover/bin/nsPopover.css',
        '<%= src %>/theme/{,*/}*.css'
      ]
    }
  };
  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {

    grape: userConfig,
    /**
     * We read in our `package.json` file so we can access the package name and version. It's already there, so
     * we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),
    /**
     * The banner is the comment that is placed at the top of our compiled source files. It is first processed
     * as a Grunt template, where the `<%=` pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' + ' * @appName    <%= pkg.name %>\n' + ' * @version    <%= pkg.version %>\n' + ' * @date       <%= grunt.template.today("yyyy-mm-dd") %>\n' + ' * @homepage   <%= pkg.homepage %>\n' + ' * @copyright  <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' + ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' + ' */\n'
    },
    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= grape.dist %>/{,*/}*',
            '!<%= grape.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= grape.src %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'newer:jscs:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      compass: {
        files: ['<%= grape.src %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'postcss:server']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      json:{
        files:['<%= grape.src %>/config/{,*/}*.json'],
        tasks: ['newer:grapecomps:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= grape.src %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '.tmp/scripts/{,*/}*.js',
          '<%= grape.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= grape.src %>/scripts/{,*/}*.js'
        ]
      }
    },

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= grape.src %>/scripts/{,*/}*.js'
        ]
      }
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({browsers: ['last 1 version']})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/vendor',
                connect.static('./vendor')
              ),
              connect().use(
                '/styles',
                connect.static('.tmp/styles')
              ),
              connect().use(
                '/fonts',
                connect.static('.tmp/styles/fonts')
              ),
              connect.static(userConfig.src)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/vendor',
                connect.static('./vendor')
              ),
              connect.static(userConfig.src)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= grape.dist %>'
        }
      }
    },
    

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= grape.src %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= grape.src %>/images',
        javascriptsDir: '<%= grape.src %>/scripts',
        fontsDir: '<%= grape.src %>/styles/fonts',
        importPath: './vendor',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= grape.dist %>/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true,
          debugInfo: true
        }
      }
    },

    useminPrepare: {
      html: '<%= grape.src %>/index.html',
      options: {
        dest: '<%= grape.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglify'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= grape.dist %>/{,*/}*.html'],
      css: ['<%= grape.dist %>/styles/{,*/}*.css'],
      js: ['<%= grape.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= grape.dist %>',
          '<%= grape.dist %>/images',
          '<%= grape.dist %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy our project assets
     * (images, fonts, etc.) and javascripts into `grape.dist`, and then to copy the assets to `compileDir`.
     */
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= grape.src %>',
          dest: '<%= grape.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'templates/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= grape.dist %>/images',
          src: ['generated/*']
        }, {
          src: '<%= grape.src %>/boot.js',
          dest: '<%= grape.dist %>/boot.js'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= grape.src %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      server: {
        files:[
          {
            expand: true,
            cwd: '<%= grape.src %>/styles/fonts/',
            src: ['{,*/}*.*'],
            dest: '.tmp/styles/fonts/'
          }
        ]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= grape.src %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= grape.dist %>/assets/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= grape.src %>/assets/images',
          src: '{,*/}*.svg',
          dest: '<%= grape.dist %>/assets/images'
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server',
        'concat:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat:{
      dist:{
        files:[
          // {
          //   src: userConfig.vendorFiles.js,
          //   dest: '.tmp/scripts/vendor.js'
          // },
          {
            src:  userConfig.vendorFiles.css,
            dest: '.tmp/styles/vendor.css'
          }
        ]
      },
      server:{
        files:[
          {
            src:  userConfig.vendorFiles.css,
            dest: '.tmp/styles/vendor.css'
          }
        ]
      }
    },

    cssmin: {
      dist: {
        files: [
          {
            expand: false,
            src: '.tmp/styles/main.css',
            dest: '<%= grape.dist %>/styles/main.css'
          },
          {
            expand: false,
            src: '.tmp/styles/vendor.css',
            dest: '<%= grape.dist %>/styles/vendor.css'
          },
        ]
      }
    },

    // uglify: {
    //   dist: {
    //     files: [
    //       {
    //         src: '.tmp/concat/scripts/vendor.js',
    //         dest: '<%= grape.dist %>/scripts/vendor.js'
    //       },
    //     ]
    //   }
    // },

    grapecomps: {
      options:{
        base: '<%= grape.src %>',
        framework: '<%= grape.src %>/scripts/framework',
        scripts: '<%= grape.src %>/scripts',
        env: 'dev'
      },
      server:{
        files: [
          {
            src: '<%= grape.src %>/config/{,*/}*.json',
            dest: '<%= grape.src %>/components'
          }
        ]
      }
    },
    
    /**
     * Minifies RJS files and makes it production ready
     * Build files are minified and encapsulated using RJS Optimizer plugin
     */
    requirejs: {
      compile: {
        options: {
          baseUrl: "<%= grape.src %>",
          paths: {
            'domReady': '../vendor/domready/domReady',
            'text': '../vendor/text/text',
            'i18n': '../vendor/i18n/i18n'
          },
          out: '<%= grape.dist %>/bootstrap.js',
          name: 'bootstrap'
        },
        preserveLicenseComments: false,
        optimize: "uglify"
      }
    }
  };

  grunt.initConfig(taskConfig);

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'postcss:server',
      'grapecomps:server',
      'copy:server',
      'requirejs',
      'connect:livereload',
      'watch',
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'grapecomps:server',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin',
    'requirejs'
  ]);

  grunt.registerTask('default', ['build']);

};
