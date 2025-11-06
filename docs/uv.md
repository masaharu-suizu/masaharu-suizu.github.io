# はじめに

本記事はv0.8.22のときの情報をもとにして書かれています。

# uvとは？

Rust製のPython用package & project manager。<br>
動きが高速。<br>
このツール1つでpip, pip-tools, pipx, poetry, pyenv, twine, virtualenvなどの置き換えができる。<br>
近年注目度が上がっている。

[GitHub](https://github.com/astral-sh/uv)

[Docs](https://docs.astral.sh/uv/)

# How to install uv

```
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

# How to update uv

```
$ uv self update
```

# Create project

```bash
uv init uv-sandbox
```

# install/uninstall packages

```bash
uv add ruff
uv remove ruff
```

```bash
# DEV環境とPROD環境でインストールするパッケージを分けたい場合
uv add ruff --dev
uv remove ruff --group dev
```

# confirm dependencies

```bash
uv tree
```

# How to install packages from lock file.

```bash
# DEV
# 初回
uv install
# 2回目以降。差分更新みたいな感じ。
uv sync
```

```bash
# PROD
# 初回
uv install --prod
# 2回目以降。差分更新みたいな感じ。
uv sync --prod
```


# How to install/uninstall packages as a tool

```bash
uv tool install ruff
ruff --version

uv tool uninstall ruff
```

## `uv add` vs `uv tool install`

| 項目       | `uv add <pkg>`      | `uv tool install <tool>` |
| ---------- | ------------------- | ------------------------ |
| lock管理   | `uv.lock` に記録    | 専用ツール環境で管理（lockには記録されない）<br>デフォルトのツールディレクトリ：`~/.local/share/uv/tools` |
| 影響範囲   | プロジェクト内      | PATHが通るので、プロジェクト外でも使用可能 |


```bash
# install後
$ ls -la ~/.local/share/uv/tools/
合計 16
drwxrwxr-x 3 ibukichi ibukichi 4096  9月 28 12:45 .
drwxrwxr-x 3 ibukichi ibukichi 4096  9月 28 12:45 ..
-rw-rw-r-- 1 ibukichi ibukichi    1  9月 28 12:45 .gitignore
-rwxrwxrwx 1 ibukichi ibukichi    0  9月 28 12:45 .lock
drwxrwxr-x 4 ibukichi ibukichi 4096  9月 28 12:45 ruff

$ ls -la ~/.local/bin/
合計 51824
drwxrwxr-x 2 ibukichi ibukichi     4096  9月 28 12:45 .
drwx------ 5 ibukichi ibukichi     4096  9月 20 17:18 ..
-rw-rw-r-- 1 ibukichi ibukichi      328  9月 20 17:18 env
-rw-rw-r-- 1 ibukichi ibukichi      165  9月 20 17:18 env.fish
lrwxrwxrwx 1 ibukichi ibukichi       50  9月 28 12:45 ruff -> /home/ibukichi/.local/share/uv/tools/ruff/bin/ruff
-rwxr-xr-x 1 ibukichi ibukichi 52686688  9月 24 04:55 uv
-rwxr-xr-x 1 ibukichi ibukichi   362448  9月 24 04:55 uvx

# uninstall後
$ ls -la ~/.local/bin/
合計 51824
drwxrwxr-x 2 ibukichi ibukichi     4096  9月 28 13:03 .
drwx------ 5 ibukichi ibukichi     4096  9月 20 17:18 ..
-rw-rw-r-- 1 ibukichi ibukichi      328  9月 20 17:18 env
-rw-rw-r-- 1 ibukichi ibukichi      165  9月 20 17:18 env.fish
-rwxr-xr-x 1 ibukichi ibukichi 52686688  9月 24 04:55 uv
-rwxr-xr-x 1 ibukichi ibukichi   362448  9月 24 04:55 uvx
```

# Python ver management

## Install/Uninstall Python

```bash
# install可能なPythonのリスト
$ uv python list
cpython-3.14.0rc3-linux-x86_64-gnu                 <download available>
cpython-3.14.0rc3+freethreaded-linux-x86_64-gnu    <download available>
cpython-3.13.7-linux-x86_64-gnu                    <download available>
cpython-3.13.7+freethreaded-linux-x86_64-gnu       <download available>
cpython-3.12.11-linux-x86_64-gnu                   <download available>
cpython-3.12.3-linux-x86_64-gnu                    /usr/bin/python3.12
cpython-3.12.3-linux-x86_64-gnu                    /usr/bin/python3 -> python3.12
cpython-3.11.13-linux-x86_64-gnu                   <download available>
cpython-3.10.18-linux-x86_64-gnu                   <download available>
cpython-3.9.23-linux-x86_64-gnu                    <download available>
cpython-3.8.20-linux-x86_64-gnu                    <download available>
pypy-3.11.13-linux-x86_64-gnu                      <download available>
pypy-3.10.16-linux-x86_64-gnu                      <download available>
pypy-3.9.19-linux-x86_64-gnu                       <download available>
pypy-3.8.16-linux-x86_64-gnu                       <download available>
graalpy-3.12.0-linux-x86_64-gnu                    <download available>
graalpy-3.11.0-linux-x86_64-gnu                    <download available>
graalpy-3.10.0-linux-x86_64-gnu                    <download available>
graalpy-3.8.5-linux-x86_64-gnu                     <download available>

# install後
$ uv python install 3.13
Installed Python 3.13.7 in 2.14s
 + cpython-3.13.7-linux-x86_64-gnu (python3.13)

$ ls -la ~/.local/share/uv/python/
合計 20
drwxrwxr-x 4 ibukichi ibukichi 4096  9月 28 13:58 .
drwxrwxr-x 3 ibukichi ibukichi 4096  9月 28 13:53 ..
-rw-rw-r-- 1 ibukichi ibukichi    1  9月 28 13:53 .gitignore
-rwxrwxrwx 1 ibukichi ibukichi    0  9月 28 13:53 .lock
drwxrwxr-x 2 ibukichi ibukichi 4096  9月 28 13:58 .temp
drwxrwxr-x 6 ibukichi ibukichi 4096  9月 28 13:58 cpython-3.13.7-linux-x86_64-gnu

$ ls -la ~/.local/bin/
合計 51828
drwxrwxr-x 2 ibukichi ibukichi     4096  9月 28 13:58 .
drwx------ 5 ibukichi ibukichi     4096  9月 20 17:18 ..
-rw-rw-r-- 1 ibukichi ibukichi      328  9月 20 17:18 env
-rw-rw-r-- 1 ibukichi ibukichi      165  9月 20 17:18 env.fish
lrwxrwxrwx 1 ibukichi ibukichi       84  9月 28 13:58 python3.13 -> /home/ibukichi/.local/share/uv/python/cpython-3.13.7-linux-x86_64-gnu/bin/python3.13
-rwxr-xr-x 1 ibukichi ibukichi 52686688  9月 24 04:55 uv
-rwxr-xr-x 1 ibukichi ibukichi   362448  9月 24 04:55 uvx

$ whereis python3 python3.13
python3: /usr/bin/python3 /usr/lib/python3 /etc/python3 /usr/share/python3 /usr/share/man/man1/python3.1.gz
python3.13: /home/ibukichi/.local/bin/python3.13
# python3はUbuntuにデフォルトでインストールされているもの、Python3.13はuvでインストールしたもの

# uninstall後
$ uv python uninstall 3.13
Searching for Python versions matching: Python 3.13
Uninstalled Python 3.13.7 in 68ms
 - cpython-3.13.7-linux-x86_64-gnu (python3.13)

$ ls -la ~/.local/share/uv/python/
合計 16
drwxrwxr-x 3 ibukichi ibukichi 4096  9月 28 14:07 .
drwxrwxr-x 3 ibukichi ibukichi 4096  9月 28 13:53 ..
-rw-rw-r-- 1 ibukichi ibukichi    1  9月 28 13:53 .gitignore
-rwxrwxrwx 1 ibukichi ibukichi    0  9月 28 13:53 .lock
drwxrwxr-x 2 ibukichi ibukichi 4096  9月 28 13:58 .temp

$ ls -la ~/.local/bin/
合計 51824
drwxrwxr-x 2 ibukichi ibukichi     4096  9月 28 14:07 .
drwx------ 5 ibukichi ibukichi     4096  9月 20 17:18 ..
-rw-rw-r-- 1 ibukichi ibukichi      328  9月 20 17:18 env
-rw-rw-r-- 1 ibukichi ibukichi      165  9月 20 17:18 env.fish
-rwxr-xr-x 1 ibukichi ibukichi 52686688  9月 24 04:55 uv
-rwxr-xr-x 1 ibukichi ibukichi   362448  9月 24 04:55 uvx

$ whereis python3 python3.13
python3: /usr/bin/python3 /usr/lib/python3 /etc/python3 /usr/share/python3 /usr/share/man/man1/python3.1.gz
python3.13:
```

## Upgrade installed Python

```bash
$ uv python upgrade 3.13
warning: `uv python upgrade` is experimental and may change without warning. Pass `--preview-features python-upgrade` to disable this warning
Installed Python 3.13.8 in 2.16s
 + cpython-3.13.8-linux-x86_64-gnu (python3.13)

$ uv python list 3.13
cpython-3.13.8-linux-x86_64-gnu    /home/ibukichi/.local/bin/python3.13 -> /home/ibukichi/.local/share/uv/python/cpython-3.13.8-linux-x86_64-gnu/bin/python3.13
cpython-3.13.8-linux-x86_64-gnu    /home/ibukichi/.local/share/uv/python/cpython-3.13.8-linux-x86_64-gnu/bin/python3.13
cpython-3.13.7-linux-x86_64-gnu    /home/ibukichi/.local/share/uv/python/cpython-3.13.7-linux-x86_64-gnu/bin/python3.13
```

## Remove installed Python

```bash
$ uv python list 3.13
cpython-3.13.8-linux-x86_64-gnu    /home/ibukichi/.local/bin/python3.13 -> /home/ibukichi/.local/share/uv/python/cpython-3.13.8-linux-x86_64-gnu/bin/python3.13
cpython-3.13.8-linux-x86_64-gnu    /home/ibukichi/.local/share/uv/python/cpython-3.13.8-linux-x86_64-gnu/bin/python3.13
cpython-3.13.7-linux-x86_64-gnu    /home/ibukichi/.local/share/uv/python/cpython-3.13.7-linux-x86_64-gnu/bin/python3.13

$ uv python uninstall 3.13.7
Searching for Python versions matching: Python 3.13.7
Uninstalled Python 3.13.7 in 131ms
 - cpython-3.13.7-linux-x86_64-gnu

$ uv python list 3.13
cpython-3.13.8-linux-x86_64-gnu    /home/ibukichi/.local/bin/python3.13 -> /home/ibukichi/.local/share/uv/python/cpython-3.13.8-linux-x86_64-gnu/bin/python3.13
cpython-3.13.8-linux-x86_64-gnu    /home/ibukichi/.local/share/uv/python/cpython-3.13.8-linux-x86_64-gnu/bin/python3.13
```

## Pin Python ver

```bash
uv python pin 3.13
```

## Run script sepecific Python ver

```bash
uv run --python 3.13 hoge.py
```
