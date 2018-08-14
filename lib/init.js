'use strict';

var _path = require('path');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _leftPad = require('left-pad');

var _leftPad2 = _interopRequireDefault(_leftPad);

var _fs = require('fs');

var _emptyDir = require('empty-dir');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = (0, _path.join)(__dirname, '../template', 'app');
var dest = process.cwd();
var projectName = (0, _path.basename)(dest);
console.log('dest-val：', dest);

function info(type, message) {
    console.log(_chalk2.default.green.bold((0, _leftPad2.default)(type, 12)) + '  ' + message);
}

function error(message) {
    console.error(_chalk2.default.red(message));
}

function success(message) {
    console.log(_chalk2.default.green(message));
}

function init(_ref) {
    var demo = _ref.demo,
        install = _ref.install;

    /**
     * 判断当前文件夹是否存在或是空文件夹
     */
    if (!(0, _emptyDir.sync)(dest)) {
        error('Existing files here, please run init command in an empty folder! ');
        process.exit(1);
    }

    console.log('Creating a new kimi app in ' + dest);
    console.log();

    _vinylFs2.default.src(['**/*', '!node_modules/**/*'], { cwd: cwd, cwdbase: true, dot: true }).pipe(template(dest, cwd)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
        info('rename', 'gitignore -> .gitignore');
        (0, _fs.renameSync)((0, _path.join)(dest, 'gitignore'), (0, _path.join)(dest, '.gitignore'));
        if (install) {
            info('run', 'npm install');
            printSuccess();
            console.log(_chalk2.default.blue.bold('初始化的值：install'));
        } else {
            printSuccess();
        }
    }).resume();
}

function printSuccess() {
    success('\n        Success! Created ' + projectName + ' at ' + dest + '.\n        In the current directory, you can run the following commands:\n          * npm start: starts the dev server.\n          * npm run build: bundles the app into dist for production.       \n          * npm test: run test.\n        suggest that you begin by typing:\n        cd ' + dest + '\n        npm install or cnpm install\n        npm start\n    happy hacking!\n    ');
}

function template(dest, cwd) {
    return _through2.default.obj(function (file, enc, cb) {
        if (!file.stat.isFile()) {
            return cb();
        }
        info('create', file.path.replace(cwd + '/', ''));
        this.push(file);
        cb();
    });
}

module.exports = init;