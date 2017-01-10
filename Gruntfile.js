'use strict';

module.exports = function (grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var banner = pkg.title + ' — ' + pkg.description + '\n'
		+ 'Version: ' + pkg.version + '\n'
		+ 'Date: ' + grunt.template.today('dd.mm.yyyy') + '\n'
		+ 'Author: ' + pkg.author.name + '\n'
		+ 'HomePage: ' + pkg.homepage + '\n'
		+ 'License: ' + pkg.licenses[0]['name'];

	grunt.initConfig({

		// less build
		less: {
			dist: {
				files: {
					'dist/legrid.css': 'src/legrid.less'
				}
			}
		},

		// media queries packer
		css_mqpacker: {
			main: {
				options: {
					map: false,
					sort: false
				},
				expand: true,
				src: 'dist/legrid.css'
			}
		},

		// postcss (autoprefixer, sorting, cssnano)
		postcss: {
			dist: {
				options: {
					map: false,
					processors: [
						require('autoprefixer')({
							browsers: ['last 2 versions']
						}),
						require('postcss-sorting')({
							'sort-order': 'csscomb'
						}),
						require('postcss-move-media'),
						require('postcss-flexbugs-fixes'),
						require('postcss-banner')({
							banner: banner,
							important: true
						})
					]
				},
				src: 'dist/legrid.css',
				dest: 'dist/legrid.css'
			},
			compress: {
				options: {
					map: false,
					processors: [
						require('cssnano')({
							removeComments: {
								removeAll: true
							}
						})
					]
				},
				src: 'dist/legrid.css',
				dest: 'dist/legrid.min.css'
			}
		},

		// Watch
		watch: {
			less: {
				files: 'src/**/*.less',
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
	grunt.registerTask('css', ['less', 'css_mqpacker', 'postcss']);
};
