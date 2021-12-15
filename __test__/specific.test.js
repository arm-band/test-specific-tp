const specific = require('../bin/specific');
const fs       = require('fs');
const path     = require('path');

test('Show error message', () => {
    const specificTPInstance = new specific();
    expect(specificTPInstance.showErrMsg(10)).toBe('引数の数は1つだけ指定してください。');
    expect(specificTPInstance.showErrMsg(11)).toBe('引数にファイル名に使用できない文字列が含まれています。');
    expect(specificTPInstance.showErrMsg(21)).toBe('指定されたファイルが存在しません。');
    expect(specificTPInstance.showErrMsg(99)).toBe('不明なエラーです。');
});
test('Check argvs (failed)', () => {
    const specificTPInstance = new specific();
    console.log(process.argv);
    if(process.argv.length === 3 && process.argv[2] === '--coverage') {
        process.argv.pop(); // argv[2] 削除
    }
    // 個数チェック (少な過ぎる)
    expect(specificTPInstance.argvsCheck(process.argv)).toBe(10);
    // ファイル名チェック
    process.argv[2] = '/permission.txt';
    expect(specificTPInstance.argvsCheck(process.argv)).toBe(11);
    process.argv[2] = '~';
    expect(specificTPInstance.argvsCheck(process.argv)).toBe(11);
    // 個数チェック (多過ぎる)
    process.argv[2] = 'permission.txt';
    process.argv[3] = 'hoge';
    expect(specificTPInstance.argvsCheck(process.argv)).toBe(10);
});
test('Check argvs (suceeded)', () => {
    // 成功パターン
    const specificTPInstance = new specific();
    process.argv.pop(); // argv[3] 削除
    process.argv[2] = 'permission.txt';
    expect(specificTPInstance.argvsCheck(process.argv)).toBe(0);
    process.argv[2] = 'permission.log.txt';
    expect(specificTPInstance.argvsCheck(process.argv)).toBe(0);
});
test('File read (failed)', () => {
    // 失敗パターン
    const specificTPInstance = new specific();
    const srcFilename        = 'no_exist_permission.txt';
    const srcFilepath        = path.join(
        path.join(
            __dirname, '__test__'
        ),
        'src'
    );
    expect(specificTPInstance.isExistFile(srcFilename, srcFilepath)).toBe(21);
});

test('File read (suceeded)', () => {
    // 成功パターン
    const specificTPInstance = new specific();
    const srcFilename        = 'permission.txt';
    const srcFilepath        = path.join(__dirname, 'src');
    expect(specificTPInstance.isExistFile(srcFilename, srcFilepath)).toBe(0);
});
test('Check code (failed)', () => {
    // 失敗パターン
    const specificTPInstance = new specific();
    expect(specificTPInstance.codeCheck(99)).toBe(false);
});
test('Check code (suceeded)', () => {
    // 成功パターン
    const specificTPInstance = new specific();
    expect(specificTPInstance.codeCheck(0)).toBe(true);
});
test('File string parse (suceeded)', () => {
    // 成功パターン
    const specificTPInstance = new specific();
    const srcFilename = 'permission.txt';
    const srcFilepath = path.join(__dirname, 'src');
    expect(specificTPInstance.parseSyntax(srcFilename, srcFilepath)).toEqual(expect.stringMatching(/.+/i));
});
test('Output file equal (suceeded)', () => {
    // 成功パターン
    const specificTPInstance = new specific();
    const srcFilename        = 'permission.txt';
    const srcFilepath        = path.join(__dirname, 'src');
    const assertFilepath     = path.join(__dirname, 'assert');
    const distFilename       = 'permission_extracted.txt';
    const distFilepath       = path.join(__dirname, 'dist');
    // サンプル(正解)ファイルの内容を取得
    const assertData         = fs.readFileSync(path.join(assertFilepath, distFilename), 'UTF-8');
    // ディレクトリの作成
    fs.mkdirSync(distFilepath);
    // ファイル読み込み・処理
    const buffer             = specificTPInstance.parseSyntax(srcFilename, srcFilepath);
    // 書き込み処理
    const response           = specificTPInstance.writeFile(srcFilename, buffer, distFilepath);
    // ディレクトリを舐める
    const writtenFiles       = fs.readdirSync(distFilepath);
    // ファイルの内容を取得
    const writtenData        = fs.readFileSync(path.join(distFilepath, distFilename), 'UTF-8');
    expect(response).toBeUndefined;                       // 関数の返り値
    expect(writtenFiles.length).toBe(1);                  // 作成されたファイル数
    expect(writtenData).toBe(assertData);                 // 作成されたファイルの内容
    // 後始末
    fs.unlinkSync(path.join(distFilepath, distFilename)); // 作成したファイルの削除
    fs.rmdirSync(distFilepath);                           // 作成したディレクトリの削除
});
