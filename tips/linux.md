# 目次

- [readコマンドで受け取った文字列をsudoのパスワード認証に使う方法](#readコマンドで受け取った文字列をsudoのパスワード認証に使う方法)
- [ACLの確認の仕方](#aclの確認の仕方)
- [NFSの移設時の確認の仕方](#nfsの移設時の確認の仕方)
- [コマンドに対して補完機能を設定する方法](#コマンドに対して補完機能を設定する方法)
- [sshのagentに関して](#sshのagentに関して)
    - [コマンドをたたいて使う場合](#コマンドをたたいて使う場合)
    - [立ち上げたものを再利用する場合](#立ち上げたものを再利用する場合)






# readコマンドで受け取った文字列をsudoのパスワード認証に使う方法

下記の方法だと.bash_historyにパスワードの情報が残らない。

```console
$ bash
$ read -sp "Please input your password: " _password; echo -e
$ echo ${_password}  |  sudo -S -k コマンド
```

[TOPへ戻る](#目次)





# ACLの確認の仕方

pingできるがtelnetができない場合はACLを疑う。

```console:ACLの確認の仕方
$ bash
$ destination_host='hogehoge.co.jp'
$ destination_port=443
$ curl -v telnet://${destination_host}:${destination_port} --connect-timeout 30
```

ACLが開いていないと上記のコマンドがtimeoutになる。

```console:他のコマンドとの組み合わせ
$ cat ./host_list.txt | xargs -I@ bash -c "curl -v -sS telnet://@:22 --connect-timeout 30; echo -e ''" | tee ./result.log
```

ACLのlogにdenyが出ていればACLの問題。

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





# sshのagentに関して

## コマンドをたたいて使う場合

```

$ ssh-agent bash
$ ps
$ ssh-add -l
$ SSH_USER='user'
$ SSH_HOST='hoge'
$ SSH_PRIVATE_KEY='path/to'
$ ssh-add ${SSH_PRIVATE_KEY}
$ ssh -A ${SSH_USER}@${SSH_HOST}

```

`ps`ではssh-agentが立ち上がったかプロセスを確認している。<br>
`~/.ssh/config`でagent転送の設定を入れておけば`ssh -A`のAオプションは不要。<br>

`~/.ssh/config`の設定例

```

Host *
  ServerAliveInterval 60

Host hoge.fuga
  HostName hoge.fuga
  User masaharu
  ForwardAgent yes

```

## 立ち上げたものを再利用する場合

`.bash_profile`に立ち上げたものを再利用するロジックを書いておけばよさそう。

```

mkdir -p /tmp/`date +%Y%m%d`
SSH_AGENT_FILE="/tmp/`date +%Y%m%d`/.ssh-agent"
test -f "${SSH_AGENT_FILE}" && source "${SSH_AGENT_FILE}"
if ! ssh-add -l > /dev/null 2>&1; then
    # Pleaes set file path
    SSH_PRIVATE_KEY="path/to"

    ssh-agent > "${SSH_AGENT_FILE}"
    source "${SSH_AGENT_FILE}"
    ssh-add "${SSH_PRIVATE_KEY}"
fi

```

これに関しては色々な書き方が出来そう。

[TOPへ戻る](#目次)