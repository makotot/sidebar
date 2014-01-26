module.exports = function (grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    path: {
      src: 'src',
      build: 'build'
    },

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['<%= path.src %>/**/*.hbs'],
        tasks: ['assemble', 'htmlhint']
      },
      js: {
        files: '<%= path.src %>/js/*.js',
        tasks: ['newer:copy:js', 'jshint']
      },
      sass: {
        files: '<%= path.src %>/sass/**/*.sass',
        tasks: ['sass', 'newer:copy:sass', 'csslint']
      },
      json: {
        files: '<%= path.src %>/data/*.json',
        tasks: ['assemble']
      }
    },

    connect: {
      livereload: {
        options: {
          port: 9001,
          hostname: '0.0.0.0',
          base: './',
          open: false,
          middleware: function (connect, options) {
            return [
              require('connect-livereload')(),
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: ['<%= path.src %>/js/*.js']
    },

    assemble: {
      options: {
        layoutdir: '<%= path.src %>/layouts/',
        layout: 'default.hbs',
        partials: ['<%= path.src %>/templates/includes/*.hbs'],
        flatten: true,
        data: '<%= path.src %>/data/*.{json,yml}'
      },
      pages: {
        options: {
          layout: 'default.hbs'
        },
        files: [
          {
            expand: true,
            cwd: '<%= path.src %>/pages/',
            src: 'index.hbs',
            dest: '.'
          }
        ]
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.src %>/sass',
          src: '*.sass',
          dest: '<%= path.src %>/css',
          ext: '.css'
        }]
      }
    },

    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },

    copy: {
      bower: {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'bower_components/**/*.js',
            dest: 'js/lib'
          },
          {
            expand: true,
            flatten: true,
            src: 'bower_components/**/*.css',
            dest: 'css/lib'
          },
          {
            expand: true,
            flatten: true,
            src: 'bower_components/**/*.map',
            dest: 'js/lib'
          }
        ]
      },

      js: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= path.src %>/js/*.js',
            dest: 'js/'
          }
        ]
      },
      sass: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= path.src %>/css/*.css',
            dest: 'css/'
          }
        ]
      },

      build: {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'js/sidebar.js',
            dest: '<%= path.build %>/'
          },
          {
            expand: true,
            flatten: true,
            src: 'css/sidebar.css',
            dest: '<%= path.build %>/'
          }
        ]
      }
    },

    uglify: {
      my_target: {
        files: {
          '<%= path.build %>/sidebar.min.js': ['js/sidebar.js']
        }
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: 'sidebar.css',
        dest: '<%= path.build %>',
        ext: '.min.css'
      }
    },

    htmlhint: {
      options: {
        htmlhintrc: '.htmlhintrc',
        force: true
      },
      html: {
        src: ['*.html']
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      src: ['css/*.css']
    },

    version: {
      files: ['bower.json', 'sidebar.jquery.json']
    }

  });

  require('jit-grunt')(grunt, {
    bower: 'grunt-bower-task',
    version: 'grunt-sync-version'
  });

  grunt.registerTask('default', ['assemble', 'sass', 'lint']);
  grunt.registerTask('install', ['newer:bower:install', 'newer:copy']);
  grunt.registerTask('lint', ['jshint', 'htmlhint', 'csslint']);
  grunt.registerTask('compile', ['assemble', 'sass', 'newer:copy:js', 'newer:copy:sass']);
  grunt.registerTask('serve', ['compile', 'lint', 'connect', 'watch']);
  grunt.registerTask('sync', ['version']);
  grunt.registerTask('build', ['uglify', 'cssmin', 'copy:build']);

};
