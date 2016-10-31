module.exports = function() {
    var root = './src';
    var config = {
        root : root,
        index: root + '/index.html',
        excludeBower: ['!**/bootstrap.js', '!**/jquery.js'],
        js: [root + '/**/app.module.js' ,             
             root + '/**/*.js' ,
             '!' + root + '/**/config_test.js',
              '!' + root + '/**/config_QA.js',
               '!' + root + '/**/config_prod.js',
                '!' + root + '/**/*.spec.js'
             ],
             jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        css : [root + '/styles/css/site.css'],
        lessBaseFolder : [root + '/styles/less/site.less'],
        less: [root + '/styles/less/site.less'],
        build : './build/'
    }
    return config;
   

};