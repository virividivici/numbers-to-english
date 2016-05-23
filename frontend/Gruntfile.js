
module.exports = function(grunt) {

  // ------------------------------------------------------------------------
  // Application modules to use.

  var app_modules = [
    'forms',
    'provisioning',
    'platform'
  ]


  // ------------------------------------------------------------------------
  // Build list of JS files in the order to concatenate.

  var vendor_files = [
    'src/js/vendor/es5-shim.js',
    'src/js/vendor/jquery.min.js',
    'src/js/vendor/underscore-min.js',
    'src/js/vendor/angular.min.js',
    'src/js/vendor/angular-route.min.js',
    'src/js/vendor/angular-sanitize.min.js',
    'src/js/vendor/ui-bootstrap-custom-0.10.0.js',
    'src/js/vendor/ui-bootstrap-custom-helpers.js',
    'src/js/vendor/ui-bootstrap-custom-tpls-0.10.0.js'
  ]


  var js_files = [
    'src/js/plugins.js',

    'src/js/app/common/forecastModule.js',
    'src/js/app/common/config/*.js',
    'src/js/app/common/services/*.js',
    'src/js/app/common/controllers/*.js',
    'src/js/app/common/directives/*.js'
  ]

  app_modules.forEach(function(module_name) {
    js_files.push('src/js/app/modules/' + module_name + '/*.js')
    js_files.push('src/js/app/modules/' + module_name + '/**/*.js')
  })

  js_files.push('src/js/main.js')

  // console.log(vendor_files.join('\n'))
  // console.log(js_files.join('\n'))


  // ------------------------------------------------------------------------
  // Project configuration.

  grunt.initConfig({
    meta: {
      package: grunt.file.readJSON('package.json'),

      asset_dir: '../app/assets/js'
    },

    watch: {
      css: {
        files: 'src/scss/**/*.s[ac]ss',
        tasks: [ 'compass' ],
      },
      vendor: {
        files: 'src/js/vendor/**/*.js',
        tasks: [ 'vendor' ],
      },
      js: {
        files: 'src/js/!(vendor)/**/*.js',
        tasks: [ 'main' ],
      }
    },


    compass: {
      options: {
        config: 'config.rb',
        force: false
      },
      dist: {
        options: {
          environment: 'development',
          outputStyle: 'nested',
          noLineComments: false
        }
      },
      production: {
        options: {
          environment: 'production',
          outputStyle: 'compressed',
          noLineComments: true
        }
      }
    },


    // Run in development to concantenate ONLY
    concat: {
      options: {
        sourceMap: true
      },
      vendor: {
        src: vendor_files,
        dest: '<%= meta.asset_dir %>/vendor.min.js'
      },
      main: {
        src: js_files,
        dest: '<%= meta.asset_dir %>/main.js',
      }
    },


    uglify: {
      options: {
        banner: '/*! <%= meta.package.name %> - v<%= meta.package.version %> */',
        compress: {
          drop_console: false
        },
        sourceMap: true,
        mangle: false,
        unused: false,
        drop_debugger: false,
        ie_proof: true
      },

      main: {
        files: {
          '<%= meta.asset_dir %>/main.min.js': '<%= meta.asset_dir %>/main.js'
        }
      }
    }
  })


  // ------------------------------------------------------------------------
  // Plugin task loading.

  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-newer')


  // ------------------------------------------------------------------------
  // Task definitions.

  grunt.registerTask('vendor', [
    'newer:concat:vendor',
  ])


  grunt.registerTask('main', [
    'concat:main',
    'uglify:main'
  ])


  grunt.registerTask('build', [
    'newer:compass',
    'newer:concat:vendor',
    'newer:concat:main',
    'newer:uglify:main'
  ])

  grunt.registerTask('build:force', [
    'compass',
    'concat',
    'uglify'
  ])

  grunt.registerTask('rebuild', [
    'build:force',
    'watch'
  ])

  grunt.registerTask('default', [
    'build',
    'watch'
  ])
}
