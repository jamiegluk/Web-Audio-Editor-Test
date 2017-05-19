// Load Grunt
module.exports = function (grunt) {

  // Import modules
  tilde_importer = require('grunt-sass-tilde-importer');

	// Configure tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Copies all from src to build
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**', '!**/*.scss', '!**/*.sass', '!**/*.coffee' ],
          dest: 'build',
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**/*.css', '!**/*.{scss,sass}' ],
          dest: 'build',
        }]
      },
      scripts: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**/*.js', '!**/*.coffee' ],
          dest: 'build',
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**/*.html' ],
          dest: 'build',
        }]
      },
    },

    // Removes dev files from build
    clean: {
      build: {
        src: [ 'build' ]
      },
      styles: {
        src: [ 'build/**/*.css', '!build/**/*.min.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', '!build/**/*.min.js' ]
      },
      html: {
        src: [] //'build/**/*.html', '!build/index.html' ]
      },
    },

    // Compiles SASS to CSS
    sass: {
      build: {
        options: {
          sourcemap: 'none',
          outputStyle: 'compressed',
          importer: tilde_importer,
          includePaths: ['node_modules/material-components-web/node_modules'],
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.scss', '**/*.sass'],
          dest: 'build',
          ext: '.css'
        }]
      }
    },

    // Adds browser prefixes to compiled CSS files and minifies them too
    postcss: {
      build: {
        files: [{
          expand: true,
          cwd: 'build',
          src: [ '**/*.css', '!**/*.min.css' ],
          dest: 'build',
          ext: '.min.css'
        }]
      }
    },

    // Compile CoffeeScript files to JS
    coffee: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**/*.coffee' ],
          dest: 'build',
          ext: '.js'
        }]
      }
    },

    // Minifies JS files
    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: [ '**/*.js', '!**/*.min.js' ],
          dest: 'build',
          ext: '.min.js'
        }]
      }
    },

    // Minifies HTML files
    minifyHtml: {
      build: {
        options: {
          empty: true,
          conditionals: true
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: [ '**/*.html' ],
          dest: 'build',
          ext: '.html'
        }]
      }
    },

    // Automatically applies changes
    watch: {
      copy: {
        files: [ 'src/**', '!src/**/*.{scss,sass,css}', '!src/**/*.{coffee,js}', '!src/**/*.html' ],
        tasks: [ 'copy' ]
      },
      styles: {
        files: ['src/**/*.{scss,sass,css}','src/_partials/**/*.{scss,sass}'],
        tasks: [ 'styles' ]
      },
      scripts: {
        files: [ 'src/**/*.{coffee,js}' ],
        tasks: [ 'scripts' ],
      },
      html: {
        files: [ 'src/**/*.html' ],
        tasks: [ 'html' ]
      }
    },

    // Dev server
    connect: {
      server: {
        options: {
          port: 4000,
          base: 'build',
          hostname: '*'
        }
      }
    },

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-minify-html');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Define tasks
  grunt.registerTask(
    'styles',
    'Compiles the styles.',
    [ 'copy:styles', 'sass', 'postcss', 'clean:styles' ]
  );

  grunt.registerTask(
    'scripts',
    'Compiles the JavaScript files.',
    [ 'copy:scripts', 'coffee', 'uglify', 'clean:scripts' ]
  );

  grunt.registerTask(
    'html',
    'Compiles the HTML files.',
    [ 'copy:html', 'minifyHtml', 'clean:html' ]
  );

  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean:build', 'copy', 'styles', 'scripts', 'html' ]
  );

  grunt.registerTask(
    'default',
    'Watches the project for changes, automatically builds them and runs a server.',
    [ 'build', 'connect', 'watch' ]
  );

}; // END
