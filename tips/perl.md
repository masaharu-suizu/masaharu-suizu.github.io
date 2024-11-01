# 目次

- [モジュールのversionの調べ方](#モジュールのversionの調べ方)
- [配列を文字列に変更する](#配列を文字列に変更する)




# モジュールのversionの調べ方

```console
$ # perl -M'モジュール名' -le 'print $モジュール名::VERSION'
$ perl -M'Test' -le 'print $Test::VERSION'
```

[TOPへ戻る](#目次)





# 配列を文字列に変更する

```perl
#!/usr/bin/env perl

use Data::Dumper;
use strict;
use utf8;
use warnings;

my %hash = (
    'key_1' => {
        'key_1_1' => '1_1',
    },
    'key_2' => {
        'key_2_1' => '2_1',
        'key_2_2' => '2_2',
        'key_2_3' => '2_3',
    },↲
);↲

# @see https://metacpan.org/pod/Data::Dumper
$Data::Dumper::Terse  = 1;
$Data::Dumper::Indent = 0;

my $string = Dumper \%hash;

print $string;
```

Perlで配列や連想配列の内容を文字列にしてlogとかに出したい時、やり方は色々あるがDumperを使うのが簡単だし可読性も高そう。

[TOPへ戻る](#目次)