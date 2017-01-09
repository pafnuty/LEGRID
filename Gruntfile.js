'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		// Banner strind
		pkg: grunt.file.readJSON('package.json'),
		banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("dd.mm.yyyy") %>\n' +
		'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

		// clean
		clean: {
			css: ['dist']
		},

		// less build
		less: {
			dist: {
				files: {
					'dist/legrid.css': 'src/legrid.less'
				}
			}
		},

		// postcss (autoprefixer, sorting, cssnano)
		postcss: {
			options: {
				map: false,
				processors: [
					require('autoprefixer')({
						browsers: ['last 2 versions']
					}),
					require('postcss-sorting')({
						'sort-order': 'csscomb'
					}),
					require('postcss-flexbugs-fixes'),
					require('cssnano')({
						dist: {
							files: {
								'dist/legrid.min.css': 'dist/legrid.css'
							}
						},
						removeComments: {
							removeAll: true
						}
					})
				]
			},
			dist: {
				// src: 'dist/legrid.css',
				files: {
					'dist/legrid.min.css': 'dist/legrid.css'
				}
			}
		},

		// add banner
		addbanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>',
					linebreak: false
				},
				files: {
					src: ['css/*.css']
				}
			}
		},

		// Watch
		watch: {
			less: {
				files: 'less/**/*.less',
				tasks: ['css']
			}
		}
	});

	// Load npm plugins to provide necessary tasks.
	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*']
	});

	// Default task.
	grunt.registerTask('default', ['css']);
	grunt.registerTask('css', ['less', 'postcss']);
};
