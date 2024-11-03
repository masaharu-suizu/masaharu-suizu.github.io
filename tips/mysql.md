# 目次

- [ディスクの使用状況をテーブル毎に確認する](#ディスクの使用状況をテーブル毎に確認する)
- [テーブルの断片化を解消する](#テーブルの断片化を解消する)
- [バイナリlogの保持期間を確認するSQL](#バイナリlogの保持期間を確認するSQL)
- [バイナリlogのフォーマットを確認する](#バイナリlogのフォーマットを確認する)





# ディスクの使用状況をテーブル毎に確認する

```sql
SELECT  
    table_name
    , engine
    , FORMAT(table_rows, 0)     AS table_rows
    , FORMAT(avg_row_length, 0) AS avg_row_length
    , FORMAT(data_length, 0)    AS data_Byte
    , FORMAT(index_length, 0)   AS index_Byte
    , FORMAT(data_free, 0)      AS data_free_Byte
    , FORMAT((data_length + index_length + data_free), 0) AS all_Byte
FROM 
    information_schema.tables
WHERE
    table_schema=database()
ORDER BY
    (data_length + index_length + data_free) DESC;
```

[TOPへ戻る](#目次)





# テーブルの断片化を解消する

```console
OPTIMIZE TABLE テーブル名;
```

[TOPへ戻る](#目次)





# バイナリlogの保持期間を確認するSQL

```sql
SHOW GLOBAL VARIABLES like 'expire_logs_days';
```

[TOPへ戻る](#目次)





# バイナリlogのフォーマットを確認する

```sql
SHOW variables LIKE "binlog_format";
```

[TOPへ戻る](#目次)