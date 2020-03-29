module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            app: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dest/all.min.js': ['index.js', 'app.js', 'cache.js', 'cacheAggregate.js', 'database.js']
                }
            },
            source_map: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        cwd: 'static/',
                        src: [
                            '**/*.js',
                            '!**/service.js',
                            '!**/sw.js',
                            '!**/*.min.js',
                            '!mod/boostrap/*',
                            '!mod/boostrap/js/*',
                            '!mod/jquery-3.4.1/jquery-3.4.1.js',
                            '!mod/jquery-3.4.1/jquery-3.4.1.slim.js'],
                        dest: 'static/dist/',
                        expand: true,
                        flatten: false,
                        ext: '.min.js'
                    }
                ]
            },
            build: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        src: [
                            'static/**/*.js',
                            '!static/**/service.js',
                            '!static/**/sw.js',
                            '!static/**/*.min.js',
                            '!static/mod/boostrap/*',
                            '!static/mod/boostrap/js/*',
                            '!static/mod/jquery-3.4.1/jquery-3.4.1.js',
                            '!static/mod/jquery-3.4.1/jquery-3.4.1.slim.js'],
                        dest: 'static/dist/build.min.js'
                    }
                ]
            }
        },
        compress: {
            gzip_css: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: 'static/',
                src: ['**/*.css', '!**/*.min.css'],
                dest: 'static/dist/',
                ext: '.min.css.gz'
            }
        },
        cssmin: {
            min_css: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'static/',
                    src: ['**/*.css', '!**/*.min.css', '!**/*.gz.css'],
                    dest: 'static/dist/',
                    ext: '.min.css'
                }]
            },
            build: {
                options: {
                    sourceMap: true
                },
                files: [{
                    src: ['static/**/*.css', '!static/**/*.min.css', '!static/**/*.gz.css'],
                    dest: 'static/dist/build.min.css'
                }]
            }
        }
    });
}