module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		path: {
			src: 'src'
		},

		watch: {
			options: {
				livereload: true
			},
			html: {
				files: ['<%= path.src %>/**/*.hbs'],
				tasks: ['newer:assemble']
			},
			js: {
				files: '<%= path.src %>/js/*.js',
				tasks: ['newer:copy:js', 'newer:jshint']
			},
			sass: {
				files: '<%= path.src %>/css/sass/**/*.sass',
				tasks: ['newer:sass']
			},
			json: {
				files: '<%= path.src %>/data/*.json',
				tasks: ['newer:assemble']
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
					cwd: '<%= path.src %>/css/sass',
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
						src: '<%= path.src %>/js/*.js',
						dest: 'js/'
					}
				]
			}
		}

	});

	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', 'assemble']
	});

	grunt.registerTask('default', ['newer:assemble', 'newer:sass', 'newer:jshint']);
	grunt.registerTask('install', ['newer:bower:install', 'newer:copy']);
	grunt.registerTask('lint', ['newer:jshint']);
	grunt.registerTask('compile', ['newer:assemble', 'newer:sass']);
	grunt.registerTask('serve', ['compile', 'newer:jshint', 'connect', 'watch']);
	grunt.registerTask('build', []);
};
