module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
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
                            '!mod/jquery@3.4.1/jquery-3.4.1.js',
                            '!mod/jquery@3.4.1/jquery-3.4.1.slim.js'],
                        dest: 'static/dist/',
                        expand: true,
                        flatten: false,
                        ext: '.min.js'
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
            }
        }
    });
}