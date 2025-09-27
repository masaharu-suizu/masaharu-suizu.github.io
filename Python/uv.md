# uv

## uvとは？
Rust製のPython用package & project manager。<br>
動きが高速。<br>
このツール1つでpip, pip-tools, pipx, poetry, pyenv, twine, virtualenvなどの置き換えができる。<br>
近年注目度が上がっている。

[GitHub](https://github.com/astral-sh/uv)

[Docs](https://docs.astral.sh/uv/)

## How to install uv

```
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

## How to update

```
$ uv self update
```

## How to install/uninstall packages in the project

```bash
uv init uv-sandbox
cd $_
uv add ruff --dev
# uv add ruff にすると他のパッケージマネージャーと同様にPROD用の依存関係に追加される
uv remove ruff
# --dev でaddしたパッケージもオプションを付けなくてもこれで消える
```

## How to install packages from lock file.

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


## How to install packages as a tool

```bash
uv tool install ruff
ruff --version
```

### `uv add` vs `uv tool install`

| 項目       | `uv add <pkg>`      | `uv tool install <tool>` |
| -------- | ------------------- | ------------------------ |
| lock管理 | `uv.lock` に記録       | 専用ツール環境で管理（lockには記録されない）<br>デフォルトのツールディレクトリ：`~/.local/share/uv/tools` |
| 影響範囲   | プロジェクト内             | 複数プロジェクト横断可能             |
