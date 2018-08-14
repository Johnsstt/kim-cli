import { join, basename } from 'path';
import chalk from 'chalk'
import vfs from 'vinyl-fs';
import through from 'through2';
import leftPad from 'left-pad';
import {renameSync} from 'fs';
import { sync as emptyDir } from 'empty-dir';


const cwd = join(__dirname, '../template', 'app');
const dest = process.cwd();
const projectName = basename(dest);
console.log('dest-val：', dest);



function info(type, message) {
    console.log(`${chalk.green.bold(leftPad(type, 12))}  ${message}`);
}

function error(message) {
    console.error(chalk.red(message));
}

function success(message) {
    console.log(chalk.green(message));
}

function init({demo, install}) {    
    /**
     * 判断当前文件夹是否存在或是空文件夹
     */
    if(!emptyDir(dest)) {
        error('Existing files here, please run init command in an empty folder! ')
        process.exit(1);
    }
    
    

    console.log(`Creating a new kimi app in ${dest}`);
    console.log();

    vfs.src(['**/*', '!node_modules/**/*'], {cwd: cwd, cwdbase: true, dot: true})
    .pipe(template(dest, cwd))
    .pipe(vfs.dest(dest))
    .on('end', function(){
        info('rename', 'gitignore -> .gitignore');
        renameSync(join(dest, 'gitignore'), join(dest, '.gitignore'));
        if(install) {
            info('run', 'npm install');
            printSuccess();
            console.log(chalk.blue.bold('初始化的值：install'));
        } else {
            printSuccess();
        }
    })
    .resume();
}

function printSuccess () {
    success(`
        Success! Created ${projectName} at ${dest}.

        
        In the current directory, you can run the following commands:
          * npm start: starts the dev server.
          * npm run build: bundles the app into dist for production.       
          * npm test: run test.
           
          
        suggest that you begin by typing:
        cd ${dest}
        npm install or cnpm install
        npm start
    happy hacking!
    `);
}


function template(dest, cwd) {    
    return through.obj(function(file, enc, cb) {        
        if(!file.stat.isFile()) {
            return cb();
        }
        info('create', file.path.replace(cwd + '/', ''))
        this.push(file);
        cb();
    });
}

module.exports = init;


