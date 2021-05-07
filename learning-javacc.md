# `JAVA CC`
* `JAVA CC`即`JAVA Compiler Compiler`,及`JAVA`编译器的编译器(简称`CC`)。有了`CC`，就可以很方便的制作编译器。

### 基本用法
```java
options {
 [JavaCC option]
}
PARSER_BEGIN(解析器类名)
package [package name];
import [libname];
public class [Interpreter name] {
 any Java code ...
}
PARSER_END([Interpreter name])

description of scanner ...

description of Interpreter ...
```
* 配置好`JAVA CC`之后，可以在`IDEA`中编写后缀为`.jj`的代码，`demo`如下
```java cc
options {
 STATIC = false;
}

PARSER_BEGIN(Adder)

import java.io.*;
class Adder {
 static public void main(String[] args) {
 for (String arg : args) {
 try {
      System.out.println(evaluate(arg));
 }
      catch (ParseException ex) {
           System.err.println(ex.getMessage());
        }
     }
 }
 static public long evaluate(String src) throws ParseException {
    Reader reader = new StringReader(src);
    return new Adder(reader).expr();
  }
}

PARSER_END(Adder)

SKIP: { <[" ","\t","\r","\n"]> }
TOKEN: {
 <INTEGER: (["0"-"9"])+>
}
long expr():
{
 Token x, y;
}
{
 x=<INTEGER> "+" y=<INTEGER> <EOF>
 {
 return Long.parseLong(x.image) + Long.parseLong(y.image);
 }
}
```
* 在`cmd`中,执行
```
javacc Adder.jj
```
* 结果
```java
E:\JAVA_workspace\src>javacc Adder.jj
Java Compiler Compiler Version 5.0 (Parser Generator)
(type "javacc" with no arguments for help)
Reading from file Adder.jj . . .
File "TokenMgrError.java" is being rebuilt.
File "ParseException.java" is being rebuilt.
File "Token.java" is being rebuilt.
File "SimpleCharStream.java" is being rebuilt.
Parser generated successfully.
```
![]()
此时产生了`Adder.java`文件
之后编译`java`文件
* `javac Adder.java`
产生`class`文件
最后在命令行执行
* `java Adder "1+2020" `
* 结果
`2021`
