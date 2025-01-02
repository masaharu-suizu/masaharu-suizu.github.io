# 目次

- [テキストエディタ](#テキストエディタ)
- [PHPのEOLに関して](#phpのeolに関して)
- [RFC](#rfc)
- [フレームワーク](#フレームワーク)
- [コーディング規約](#コーディング規約)
- [コメントの書き方](#コメントの書き方)
- [テストコード](#テストコード)
- [静的解析ツール](#静的解析ツール)
- [メモリ使用量をlogに出力する](#メモリ使用量をlogに出力する)
- [PHPのKnowledgeサイト](#phpのknowledgeサイト)


# テキストエディタ
12年間色々なものを試してみた。
- Vim
- Sublime Text
- Atom
- Visual Studio Code
- Eclipse
- NetBeans
- PhpStorm

最終的には<b>PhpStorm</b>に落ち着いた。<br>
機能が充実しているし、プラグインも充実している。<br>
他のエディタを使っていた時よりもコードを読み書きする時の効率が良くなった。<br>
有償なのだが、お金を払う価値は十分あると思う。<br>

[TOPへ戻る](#目次)

# PHPのEOLに関して
php.netから[PHP公式のサポート期限](https://www.php.net/supported-versions.php)を確認することができる。<br>
ただ、`yum`や`apt`などのパッケージ管理システムを利用してインストールされたPHPの場合は若干事情が異なる。<br>
通常、最新のVerよりもやや古いVerがインストールされることになるのだが、各ディストリビューションでバックポートが行われるのでCVEなどの脆弱性はそれによって対応される。<br>
パッケージ管理システムを用いた場合のサポート期間に関しては、各ディストリビューションのリポジトリを確認する必要がある。<br>

[TOPへ戻る](#目次)

# RFC
[PHPのRFC](https://wiki.php.net/rfc)。
将来の導入される機能やPHPの方向性の話し合いの結果などを見ることができる。<br>

[TOPへ戻る](#目次)

# フレームワーク
昔と比べると新規サービスをPHPで開発することは減ってきているのかもしれない。<br>
もし新規サービスをPHPで開発する場合、フレームワークの選択肢の第一候補は[Laravel](https://laravel.com/)になるのではないだろうか。<br>
ただ、EOLの長さを考えると[Symfony](https://symfony.com/)も捨てがたいと個人的には思う。<br>
Symfonyはx.4がLTS版となり、リリースからEOLまで4年間も期間がある。<br>
https://symfony.com/releases<br>
EOL対応で苦しむチームは多いし面倒くさい作業だと思う。<br>
なのでSymfonyも候補として加えてみてはいかがでしょうか。<br>

[TOPへ戻る](#目次)

# コーディング規約
今は[PSR-12](https://www.php-fig.org/psr/psr-12/)が主流になっているのではないかと思う。(昔は色々と存在したんだけどね。)<br>
何も考えずこれに従っても良いかもしれない。<br>
理由としては、
- IDEにはPSRの規約に沿っているかチェックする機能が備わっていることが多い
- [PHP_CodeSniffer](https://github.com/PHPCSStandards/PHP_CodeSniffer/)や[PHP Stan](https://github.com/phpstan/phpstan)などの静的解析ツールにもPSRの規約に沿っているかチェックする機能が備わっている

ちなみに所属していたチームでは基本的にはPSR-12を守りつつ、チーム独自のルールを加えていた。<br>

[TOPへ戻る](#目次)

# コメントの書き方
コメントの書き方は[PSR-5](https://github.com/php-fig/fig-standards/blob/master/proposed/phpdoc.md)が参考になると思う。<br>
そして、`@param`などのタグに関しては[PSR-19](https://github.com/php-fig/fig-standards/blob/master/proposed/phpdoc-tags.md)を参考にするとよい。<br>
なお、コメントの粒度に関してはPSRでは定義されていないので、チームで話し合ってほしい。<br>

[TOPへ戻る](#目次)

# テストコード
自分はそんなにテスト界隈に詳しいわけではないし、そんなにノウハウを持っているわけではないのだが、[PHPUnit](https://phpunit.de/index.html)が最も一般的だと思う。(違ったらごめんなさい)<br>
自分はPhpStormにAI Assistantプラグインを追加してAIにテストコードを書いてもらっている。<br>
AI Assistantプラグインも有償でお金がかかってしまうのだけれども、生産性が上がるので札束で殴るやり方もありだと思う。<br>

[TOPへ戻る](#目次)

# 静的解析ツール
昔は色々と使っていたんだけどメンテナンスされなくなったり、後発品で良いものも出てきた。<br>
個人的には[PHPStan](https://phpstan.org/user-guide/getting-started)だけで良いのではないかと感じている。<br>
PHPStan + IDEでコード内のかなりの数の問題を検知してくれると思う。<br>
自分はあらかじめlocal環境にPHPStanを入れておいてIDEと連携させている。<br>
IDEと連携させていない場合は、[Gitフック](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA-Git-%E3%83%95%E3%83%83%E3%82%AF)の機能を使ってcommitしようとしたときにPHPStanを走らせてもいいと思う。<br>

[TOPへ戻る](#目次)

# メモリ使用量をlogに出力する
PHPには[memory_get_peak_usage](https://www.php.net/manual/ja/function.memory-get-peak-usage.php)という関数があり、システムが割り当てた実際のメモリの大きさがどれくらいだったかを知ることができる。<br>
php.iniのメモリの設定がデフォルトのままになっていて、メモリ不足で処理が落ちしまい、php.iniを更新したり、[ini_set](https://www.php.net/manual/ja/function.ini-set.php)でmemory_limitを上げたという人はそれなりにいるのではないだろうか？<br>
メモリ使用量の情報をlogに出力しておくとこの事態を事前に防げる。<br>
うちのチームの場合は、php.iniやmemory_limitで設定している値に対してメモリ使用量が80%を超えた場合、warningレベルのlogを出力するようにしていた。<br>

[TOPへ戻る](#目次)

# PHPのKnowledgeサイト
- [PHP The Right Way](https://phptherightway.com/)

[TOPへ戻る](#目次)
