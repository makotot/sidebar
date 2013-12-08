module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		path: {
		},

		watch: {
			options: {
				livereload: true
			},
			html: {
				files: ['src/**/*.hbs', 'src/templates/includes/**/*.hbs'],
				tasks: ['assemble']
			},
			js: {
				files: 'src/js/*.js',
				tasks: ['copy:js', 'jshint']
			},
			sass: {
				files: 'src/css/sass/**/*.sass',
				tasks: ['sass']
			},
			json: {
				files: 'src/data/*.json',
				tasks: ['assemble']
			}
		},

		connect: {
			livereload: {
				options: {
					port: 9001,
					hostname: '0.0.0.0',
					base: './',
					open: true,
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
				reporter: require('jshint-table-reporter')
			},
			all: ['src/js/*.js']
		},

		assemble: {
			options: {
				layout: 'src/layouts/default.hbs',
				partials: ['src/templates/includes/*.hbs'],
				flatten: true,
				data: 'src/data/*.{json,yml}'
			},
			pages: {
				files: {
					'.': ['src/pages/*.hbs']
				}
			}
		},

		sass: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/css/sass',
					src: '*.sass',
					dest: 'css',
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
						src: 'src/js/*.js',
						dest: 'js/'
					}
				]
			}
		}

	});

	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', 'assemble']
	});

	grunt.registerTask('default', ['assemble', 'sass', 'jshint']);
	grunt.registerTask('install', ['bower:install', 'copy']);
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('server', ['assemble', 'sass', 'jshint', 'connect', 'watch']);
	grunt.registerTask('build', []);
};
