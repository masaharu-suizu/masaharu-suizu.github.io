# 目次

- [readコマンドで受け取った文字列をsudoのパスワード認証に使う方法](#readコマンドで受け取った文字列をsudoのパスワード認証に使う方法)
- [ACLの確認の仕方](#aclの確認の仕方)
- [NFSの移設時の確認の仕方](#nfsの移設時の確認の仕方)
- [コマンドに対して補完機能を設定する方法](#コマンドに対して補完機能を設定する方法)





# readコマンドで受け取った文字列をsudoのパスワード認証に使う方法

```console
$ bash
$ read -sp "Please input your password: " _password; echo -e
$ echo ${_password}  |  sudo -S -k コマンド
```
この方法だと.bash_historyにパスワードの情報が残らない。
[TOPへ戻る](#目次)





# ACLの確認の仕方

```console:ACLの確認の仕方
$ bash
$ destination_host='hogehoge.co.jp'
$ destination_port=443
$ curl -v telnet://${destination_host}:${destination_port} --connect-timeout 30
```

```console:他のコマンドとの組み合わせ
$ cat ./host_list.txt | xargs -I@ bash -c "curl -v -sS telnet://@:22 --connect-timeout 30; echo -e ''" | tee ./result.log
```

[TOPへ戻る](#目次)





# NFSの移設時の確認の仕方

cpコマンドやrsyncコマンドを実行した後に

* ファイルがコピーされているか
* Owner、Group、Permissionがコピー元と同じか

を確認する時に叩くコマンド

```console
$ bash
$ diff <(cd /{path}/{to}; find ./hoge/ | sort | xargs stat -c %n:%a:%U:%G) <(cd /{path}/{to}; find ./fuga/ | sort | xargs stat -c %n:%a:%U:%G)
```

[TOPへ戻る](#目次)





# コマンドに対して補完機能を設定する方法

例) sshコマンドに対して補完機能を設定

```bash:~/.bashrc

declare -a SERVER_LIST=($(grep 'HostName' ~/.ssh/config | awk {'print $2'}))

_ssh_completion(){
    local args=$(echo ${SSH_SERVER_LIST[@]})
    COMPREPLY=( `compgen -W "${args}" -- ${COMP_WORDS[COMP_CWORD]}` );
}
complete -F _ssh_completion ssh

```

[TOPへ戻る](#目次)