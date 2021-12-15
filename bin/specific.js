import * as fs from 'fs';

export class specificTP {
    constructor() {
        this.argvs    = process.argv;
        this.filename = '';
        this.code     = 0;
        this.encode   = 'UTF-8';
        this.errMsg   = {
            10: '引数の数は1つだけ指定してください。',
            11: '引数にファイル名に使用できない文字列が含まれています。',
            21: '指定されたファイルが存在しません。',
            99: '不明なエラーです。',
        };
        this.dir      = {
            src:  './src/',
            dist: './dist/',
        }
        this.bufStr   = '';
    }
    showErrMsg(code) {
        return this.errMsg[code];
    }
    argvsCheck(argvs) {
        if(argvs.length !== 3) {
            // 0 は node.js のパス, 1 は実行 js のパスが自動的に入るので、引数1つ指定は合計3つ
            return 10;
        }
        else if(/^.*[\\|/|:|;|\*|?|\"|'|<|>|\|~|\^].*$/.test(argvs[2])) {
            return 11;
        }
        else {
            return 0;
        }
    }
    isExistFile(filename, filepath = this.dir.src) {
        try {
            console.log(`${filepath}${filename}`)
            fs.statSync(`${filepath}${filename}`);
            return 0;
        } catch(err) {
            if(err.code === 'ENOENT') {
                return 21;
            }
        }
    }
    codeCheck(code) {
        if(code !== 0) {
            console.log(this.showErrMsg(code));
            return false;
        }
        return true;
    }
    parseSyntax(filename, filepath = this.dir.src) {
        const buf = fs.readFileSync(
            `${filepath}${filename}`,
            this.encode
        );
        const bufExcludeCR = buf.replace(/\r/g, '');
        const bufArray     = bufExcludeCR.split("\n");
        let   bufDist      = '';
        for(let i = 0; i < bufArray.length; i++) {
            if(/^((?!.*(-rw-r--r--|drwxr-xr-x|合計)).*)$/.test(bufArray[i])) {
                bufDist += `${bufArray[i]}\n`;
            }
        }
        return bufDist;
    }
    writeFile(filename, bufStr, filepath = this.dir.dist) {
        const filenameAray = filename.split(/\.(?=[^.]+$)/);
        fs.writeFileSync(
            `${filepath}${filenameAray[0]}_extracted.${filenameAray[1]}`,
            bufStr
        );
        return 0;
    }
    main() {
        if(!this.codeCheck(this.argvsCheck(this.argvs))) {
            return false;
        }
        this.filename = this.argvs[2];
        if(!this.codeCheck(this.isExistFile(this.filename))) {
            return false;
        }
        this.bufStr = this.parseSyntax(this.filename);
        this.writeFile(this.filename, this.bufStr);
    }
}
