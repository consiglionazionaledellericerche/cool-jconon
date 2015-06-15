({
  /*
   * The top level directory that contains your app. If this option is used
   *  then it assumed your scripts are in a subdirectory under this path.
   *  This option is not required. If it is not specified, then baseUrl
   *  below is the anchor point for finding things. If this option is specified,
   *  then all the files from the app directory will be copied to the dir:
   *  output area, and baseUrl will assume to be a relative path under
   *  this directory.
   *
   *  Points to 'src/main/webapp/js' folder, which is the top level directory that contains all the javaScript
   */
  appDir: '${basedir}/src/main/resources/META-INF',
  /*
   * By default, all modules are located relative to this path. If baseUrl
   * is not explicitly set, then all modules are loaded relative to
   * the directory that holds the build file. If appDir is set, then
   * baseUrl should be specified as relative to the appDir.
   */
  baseUrl: './js',
  /*
   * The directory path to save the output. If not specified, then
   * the path will default to be a directory called "build" as a sibling
   * to the build file. All relative paths are relative to the build file.
   */
  dir: '${project.build.directory}/${project.build.finalName}/WEB-INF/classes/META-INF',
  /*
   *  How to optimize all the JS files in the build output directory.
   *  Right now only the following values
   *  are supported:
   *  - "uglify": (default) uses UglifyJS to minify the code.
   *  - "closure": uses Google's Closure Compiler in simple optimization
   *  mode to minify the code. Only available if running the optimizer using
   *  Java.
   *  - "closure.keepLines": Same as closure option, but keeps line returns
   *  in the minified files.
   *  - "none": no minification will be done.
   */
  optimize: 'uglify2',
  generateSourceMaps: true,
  preserveLicenseComments: false,

  /*
   *  Set paths for modules. If relative paths, set relative to baseUrl above.
   *  If a special value of "empty:" is used for the path value, then that
   *  acts like mapping the path to an empty file. It allows the optimizer to
   *  resolve the dependency to path, but then does not include it in the output.
   *  Useful to map module names that are to resources on a CDN or other
   *  http: URL when running in the browser and during an optimization that
   *  file should be skipped because it has no dependencies.
   */

  paths: {
    'analytics': '${common.javascript.path}' + 'ws/templates/analytics',
    'bootstrap': '${common.javascript.path}' + 'thirdparty/bootstrap-cnr',
    'behave': '${common.javascript.path}' + 'thirdparty/behave',
    'bootstrap-fileupload': '${common.javascript.path}' + 'thirdparty/bootstrap-fileupload-cnr',
    'bootstrapTemplate': '${common.javascript.path}' + 'ws/templates/bootstrap',
    'datepicker': '${common.javascript.path}' + 'thirdparty/datepicker/bootstrap-datepicker-cnr',
    'datetimepicker': '${common.javascript.path}' + 'thirdparty/datetimepicker/bootstrap-datetimepicker',
    'cache': 'empty:',
    'common': 'empty:',
    'ckeditor': '${common.javascript.path}' + 'thirdparty/ckeditor/ckeditor',
    'ckeditor-jquery': '${common.javascript.path}' + 'thirdparty/ckeditor/adapters/jquery',
    'cnr/cnr': '${common.cnr.javascript.path}' + 'cnr/cnr',
    'cnr/cnr.ace': '${common.cnr.javascript.path}' + 'cnr/cnr.ace',
    'cnr/cnr.actionbutton': '${common.cnr.javascript.path}' + 'cnr/cnr.actionbutton',
    'cnr/cnr.advancedsearch': '${common.cnr.javascript.path}' + 'cnr/cnr.advancedsearch',
    'cnr/cnr.attachments': '${common.cnr.javascript.path}' + 'cnr/cnr.attachments',
    'cnr/cnr.bulkinfo': '${common.cnr.javascript.path}' + 'cnr/cnr.bulkinfo',
    'cnr/cnr.criteria': '${common.cnr.javascript.path}' + 'cnr/cnr.criteria',
    'cnr/cnr.node': '${common.cnr.javascript.path}' + 'cnr/cnr.node',
    'cnr/cnr.search': '${common.cnr.javascript.path}' + 'cnr/cnr.search',
    'cnr/cnr.searchfilter': '${common.cnr.javascript.path}' + 'cnr/cnr.searchfilter',
    'cnr/cnr.style': '${common.cnr.javascript.path}' + 'cnr/cnr.style',
    'cnr/cnr.tree': '${common.cnr.javascript.path}' + 'cnr/cnr.tree',
    'cnr/cnr.ui': '${common.cnr.javascript.path}' + 'cnr/cnr.ui',
    'cnr/cnr.ui.authority': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.authority',
    'cnr/cnr.ui.checkbox': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.checkbox',
    'cnr/cnr.ui.city': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.city',
    'cnr/cnr.ui.country': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.country',
    'cnr/cnr.ui.datepicker': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.datepicker',
    'cnr/cnr.ui.datetimepicker': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.datetimepicker',
    'cnr/cnr.ui.duedate': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.duedate',
    'cnr/cnr.ui.group': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.group',
    'cnr/cnr.ui.priority': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.priority',
    'cnr/cnr.ui.radio': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.radio',
    'cnr/cnr.ui.select': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.select',
    'cnr/cnr.ui.tree': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.tree',
    'cnr/cnr.ui.widgets': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.widgets',
    'cnr/cnr.ui.wysiwyg': '${common.cnr.javascript.path}' + 'cnr/cnr.ui.wysiwyg',
    'cnr/cnr.url': '${common.cnr.javascript.path}' + 'cnr/cnr.url',
    'cnr/cnr.user': '${common.cnr.javascript.path}' + 'cnr/cnr.user',
    'cnr/cnr.validator': '${common.cnr.javascript.path}' + 'cnr/cnr.validator',
    'datepicker-i18n': 'empty:',
    'datetimepicker-i18n': 'empty:',
    'fileupload': '${common.javascript.path}' + 'thirdparty/jquery.fileupload',
    'header': 'ws/header',
    'handlebars': '${common.javascript.path}' + 'thirdparty/handlebars',
    'i18n': 'empty:',
    'jquery': '${common.javascript.path}' + 'thirdparty/jquery',
    'jquery.ui.widget': '${common.javascript.path}' + 'thirdparty/jquery.ui.widget',
    'json': '${common.javascript.path}' + 'thirdparty/require/json-cnr',
//    'css': '${common.javascript.path}' + 'thirdparty/require/css-cnr', NON FUNZIONA, VERIFICARE
    'jstree': 'empty:',
    'moment': '${common.javascript.path}' + 'thirdparty/moment/moment',
    'moment-i18n': 'empty:',
    'modernizr': '${common.javascript.path}' + 'thirdparty/modernizr-custom',
    'noty': '${common.javascript.path}' + 'thirdparty/noty/jquery.noty',
    'noty-layout': '${common.javascript.path}' + 'thirdparty/noty/layouts/topRight',
    'noty-theme': '${common.javascript.path}' + 'thirdparty/noty/themes/default',
    'search': '${common.javascript.path}' + 'thirdparty/search',
    'searchjs': '${common.javascript.path}' + 'thirdparty/jquery.search',
    'select2': '${common.javascript.path}' + 'thirdparty/select2-cnr',
    'select2-i18n': 'empty:',
    'stemmer': '${common.javascript.path}' + 'thirdparty/stemmer',
    'text': '${common.javascript.path}' + 'thirdparty/require/text',
    'validate': '${common.javascript.path}' + 'thirdparty/jquery.validate-cnr',
    'ws/header.common': '${common.javascript.path}' + 'ws/header.common'
  },

  shim: {
    'ckeditor-jquery': {
      deps: ['ckeditor']
    },
    'validate': {
      deps: ['jquery']
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'modernizr': {
      exports: 'Modernizr'
    },
    'datepicker-i18n': {
      deps: ['jquery', 'datepicker']
    },
    'datetimepicker-i18n': {
      deps: ['jquery', 'datetimepicker']
    },
    'noty-layout': {
      deps: ['noty']
    },
    'noty-theme': {
      deps: ['noty']
    },
    searchjs: {
      exports: 'searchjs',
      deps: ['jquery', 'search', 'stemmer']
    }
  },

  /*
   * If set to true, any files that were combined into a build layer will be
   * removed from the output folder.
   */
  removeCombined: false,

  /*
   * When the optimizer copies files from the source location to the
   * destination directory, it will skip directories and files that start
   * with a ".". If you want to copy .directories or certain .files, for
   * instance if you keep some packages in a .packages directory, or copy
   * over .htaccess files, you can set this to null. If you want to change
   * the exclusion rules, change it to a different regexp. If the regexp
   * matches, it means the directory will be excluded.
   *
   */
  fileExclusionRegExp: "/^\./",

  //for each module, excludeShallow: []
  modules: [
    {
      name: 'ws/home/main.get'
    },
    {
      name: 'ws/application/application'
    },
    // commentato per problemi causati da ckeditor
    //{
    //  name: 'ws/call/call'
    //},
    {
      name: 'ws/call/search'
    },
    {
      name: 'ws/faq/faq.get'
    },
    {
      name: 'ws/helpdesk/main.get'
    },
    {
      name: 'ws/my-applications/main.get'
    },
    {
      name: 'ws/security/login'
    },
    {
      name: 'ws/security/create'
    },
    {
      name: 'ws/security/change-password'
    }
  ]
})