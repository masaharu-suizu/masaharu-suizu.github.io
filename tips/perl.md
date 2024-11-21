# 目次

- [モジュールのversionの調べ方](#モジュールのversionの調べ方)
- [配列を文字列に変更する](#配列を文字列に変更する)
- [tailコマンドでログ監視するときに特定の文字を含むログを色付きで表示させるスクリプト](#tailコマンドでログ監視するときに特定の文字を含むログを色付きで表示させるスクリプト)




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
    },
);

# @see https://metacpan.org/pod/Data::Dumper
$Data::Dumper::Terse  = 1;
$Data::Dumper::Indent = 0;

my $string = Dumper \%hash;

print $string;
```

Perlで配列や連想配列の内容を文字列にしてlogとかに出したい時、やり方は色々あるがDumperを使うのが簡単だし可読性も高そう。

[TOPへ戻る](#目次)





# tailコマンドでログ監視するときに特定の文字を含むログを色付きで表示させるスクリプト

`rcg.pl`

```perl
#!/usr/bin/perl
use strict;
use warnings;
use utf8;

# @see https://perldoc.perl.org/Term/ANSIColor.html
use Term::ANSIColor qw(:constants);

my %setting = ();
my $reset = RESET;
my @regexList = ();

# check arguments
my $isInvalid = (@ARGV == 0) || ($ARGV[0] eq '') || (@ARGV % 2 != 0);
if ($isInvalid) {
    &printErrMsg();
    exit 1;
}

# preparation
while (my $regex = shift) {
    my $color = shift;
    my $isInvalid = ($regex eq '') || ($color eq '');
    if ($isInvalid) {
        &printErrMsg();
        exit 1;
    }
    $setting{$regex} = eval($color);
    push(@regexList, $regex);
}

# operation
while(<>) {
    foreach my $regex(@regexList) {
        my $color = $setting{$regex};
        s/($regex)/${color}${1}${reset}/g;
    }
    print;
}

##
# function for use Term::ANSIColor
#
# @param string $msg message
##
sub printMsgOnRed($) {
    my ($msg) = @_;
    print BOLD WHITE ON_RED ${msg}, RESET, "\n";
}

##
# function for output error message
##
sub printErrMsg() {
    &printMsgOnRed("Argument is incorrect. Please check again.");
    &printMsgOnRed("Usage: perl rcg.pl [regex] [color] [regex] [color] ...");
    &printMsgOnRed("e.g ) tail -f /usr/local/var/log/error.log | perl rcg.pl '.*ERR.*' 'BOLD WHITE ON_RED'");
}

exit 0;
```

[TOPへ戻る](#目次)