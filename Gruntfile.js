module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['uglify:app', 'cssmin:app', 'copy:app', 'compress:app'])
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            app: {
                files: [
                    {
                        expand: true,
                        src: ['static/mod/fa-5.0.6/webfonts/**'],
                        dest: 'static/dist/webfonts/',
                        flatten: true,
                        filter: 'isFile',
                    },
                ],
            },
        },
        uglify: {
            app: {
                options: {
                    compress: {
                        dead_code: true
                    },
                    sourceMap: true
                },
                files: [
                    {
                        src: [
                            'static/mod/jquery-3.4.1/jquery-3.4.1.js',
                            'static/mod/jquery-3.4.1/jquery-ui.js',
                            'static/mod/slick-1.8.1/slick.js',
                            'static/mod/bootstrap/js/bootstrap.js',
                            'static/js/custom.js',
                            'static/js/dpe.js',
                            'static/service.js'
                        ],
                        dest: 'static/dist/bundle.min.js'
                    },
                    {
                        src: [
                            'static/mod/videojs/videojs.js',
                            'static/mod/videojs/ads/contrib.min.js',
                            'static/mod/videojs/ads/videojs-ima.js',
                            'static/mod/videojs/videojs-logo.js',
                            'static/mod/videojs/resume.js',
                            'static/mod/videojs/core.js'
                        ],
                        dest: 'static/dist/baka.min.js'
                    },
                    {
                        src: 'static/sw.js',
                        dest: 'static/sw.min.js'
                    }
                ]
            }
        },
        compress: {
            app: {
                options: {
                    mode: 'gzip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'static/dist/',
                        src: ['**/*.css'],
                        dest: 'static/dist/',
                        ext: '.min.css.gz'
                    },
                    {
                        expand: true,
                        cwd: 'static/dist/',
                        src: ['**/*.js'],
                        dest: 'static/dist/',
                        ext: '.min.js.gz'
                    },
                    {
                        src: 'static/sw.min.js',
                        dest: 'static/sw.min.js.gz'
                    }
                ]
            }
        },
        cssmin: {
            app: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        src: [
                            'static/mod/fa-5.0.6/css/fontawesome-all.css',
                            'static/mod/jquery-3.4.1/jquery-ui.css',
                            'static/mod/bootstrap/css/bootstrap.css',
                            'static/css/custom.css',
                            'static/mod/slick-1.8.1/slick.css'
                        ],
                        dest: 'static/dist/app.min.css'
                    },
                    {
                        src: [
                            'static/mod/videojs/videojs.css',
                            'static/mod/videojs/vsplugins.css',
                            'static/mod/videojs/resume.css'
                        ],
                        dest: 'static/dist/baka.min.css'
                    },
                    {
                        src: [
                            'static/css/animate.css',
                            'static/css/style01.css',
                            'static/css/style04.css'
                        ],
                        dest: 'static/dist/calendar.min.css'
                    }
                ]
            }
        }
    });
}