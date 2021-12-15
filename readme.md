# Specific TP (Traditional Permission)

## Abstract

特殊なパーミッションを設定したファイル・ディレクトリの一覧を抽出してリストアップするスニペット。

## Usage

### Prepare

1. `git clone httsp://github.com/arm-band/test_specific_traditional_permission.git`
2. `yarn`
3. Linuxマシン上で `ls -alstR ./ > /PATH/TO/DIRECTORY/PEMISSION_LIST.txt` 等として特定ディレクトリ以下のパーミッションの一覧をファイルとして出力する
4. 1.のファイルをローカルにダウンロードし、 1.でクローンしたプロジェクトの `Src/` 下に配置する

### Using

1. `yarn start PEMISSION_LIST.txt`

`src/` ディレクトリ下で指定した名前のファイルを参照し、ファイルの一般的な権限 (`-rw-r--r--`) またはディレクトリの一般的な権限 (`drwxr-sr-x`, `drwxr-xr-x`) 以外のパーミッションが指定されているものをリストアップします。