module.exports = function (grunt) {

	var path = require('path');

	var enviroments = [
		"dev", "stag", "prod"
	];


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		buildPath: grunt.option('buildPath') || "build",

		//cleans output folder
		clean: {
			build: {
				options: { force: true },
				src: [
					'<%= buildPath%>'
				]
			}
		},

		copy: {
			html: {
				files: [
					{ src: ['*.html'], cwd: '', dest: '<%= buildPath %>', expand: true }
				]
			},
			img: {
				files: [
					{ src: ['**/*'], cwd: 'images', dest: '<%= buildPath %>/images', expand: true }
				]
			},
			font: {
				files: [
					{ src: ['**/*'], cwd: 'css/fonts', dest: '<%= buildPath %>/css/fonts', expand: true }
				]
			}
		},

		//minifies javascript files
		uglify: {
			js: {
				files: [
					{
						expand: true,
						cwd: 'js',
						src: '**/*.js',
						dest: '<%= buildPath %>/js'
					}
				]
			}
		},

		cssmin: {
			css: {
				expand: true,
				cwd: 'css',
				src: '**/*.css',
				dest: '<%= buildPath %>/css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');


	var prodTask = ["clean:build", "uglify", "cssmin", "copy"];

	// dev tasks
	grunt.registerTask('prod', prodTask);
};