module.exports = (grunt) => {

	const pkg = grunt.file.readJSON('package.json')
	const banner = `${pkg.title} — ${pkg.description}
Version: ${pkg.version}
Date: ${grunt.template.today('dd.mm.yyyy')}
Author: ${pkg.author.name}
HomePage: ${pkg.homepage}
License: ${pkg.license}`

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
						require('autoprefixer')(),
						require('postcss-sorting')({
							'sort-order': 'csscomb'
						}),
						require('postcss-merge-rules')(),
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
			},
			dev: {
				files: 'src/**/*.less',
				tasks: ['dev']
			}
		}
	})

	// Load npm plugins to provide necessary tasks.
	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*']
	})

	// Default task.
	grunt.registerTask('default', ['css'])
	grunt.registerTask('dev', ['less', 'css_mqpacker'])
	grunt.registerTask('css', ['less', 'css_mqpacker', 'postcss'])
}
