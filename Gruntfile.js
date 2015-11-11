module.exports = function(grunt) {

  grunt.initConfig({
    less: {
          development: {
            files: { "public/app-content/css/app.css" : "public/app-content/less/app.less" }
          }
        },watch: {
            js: {
                files: ['public/app-content/less/app.less'],
                    tasks: ['default'],
                }
        }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['less']);

};
