# Hello-World
C语言Hello-World从源文件到可执行文件过程

目前的`IDE`，如`Visual Studio`,将源程序的编译链接都集成在了一起，我们很难观察到每一步的过程，即使是一行`gcc`命令其实也包含了很多信息。

源程序变为可执行过程大致可以分为下面几个步骤。实验工具安装`gcc`工具的`linux`操作系统。这里的实验环境是`Deepin-15(VMware)`

下面我们以经典的`hello world`为例
```C
#include<stdio.h>
int main(){
	printf("hello world!\n");//ouput hello world
	return 0;
}
```
## 预编译`Propressing`
* `gcc -E hello.c -o hello.i`

`-E`参数表示只进行预编译，预编译过程处理的规则主要包括
#### 1.将所有的#define删除，并且展开宏定义
#### 2.处理`#include`，将被包含的文件插入到该预编译指令的位置，这个过程会递归进行，因为`#include`可能还会包含`#include`，处理完之后你会发现，一个`#include`中有好多东西
#### 3.删除所有注释
#### 4.添加行号和文件名标识，如`#2 "hello.c" 2`,这一过程主要是编译时编译器产生调试用的行号信息以及编译报错信息，可以追溯到具体某一行
#### 5.保留所有的 `#program`
预编译产生的文件`hello.i`如下所示(截取部分)
```C
# 1 "hello.c"
# 1 "<built-in>"
# 1 "<command-line>"
# 31 "<command-line>"
# 1 "/usr/include/stdc-predef.h" 1 3 4
# 32 "<command-line>" 2
# 1 "hello.c"
# 1 "/usr/include/stdio.h" 1 3 4
# 27 "/usr/include/stdio.h" 3 4
# 1 "/usr/include/features.h" 1 3 4
# 364 "/usr/include/features.h" 3 4
# 1 "/usr/include/x86_64-linux-gnu/sys/cdefs.h" 1 3 4
# 415 "/usr/include/x86_64-linux-gnu/sys/cdefs.h" 3 4
# 1 "/usr/include/x86_64-linux-gnu/bits/wordsize.h" 1 3 4
# 416 "/usr/include/x86_64-linux-gnu/sys/cdefs.h" 2 3 4
# 365 "/usr/include/features.h" 2 3 4
# 388 "/usr/include/features.h" 3 4
# 1 "/usr/include/x86_64-linux-gnu/gnu/stubs.h" 1 3 4
# 10 "/usr/include/x86_64-linux-gnu/gnu/stubs.h" 3 4
# 1 "/usr/include/x86_64-linux-gnu/gnu/stubs-64.h" 1 3 4
# 11 "/usr/include/x86_64-linux-gnu/gnu/stubs.h" 2 3 4
# 389 "/usr/include/features.h" 2 3 4
# 28 "/usr/include/stdio.h" 2 3 4

...(此处省略许多行)

# 2 "hello.c" 2

# 2 "hello.c"
int main(){
 printf("hello world!\n");
 return 0;
}

```
* 从上面的结果可以看到，`#include`被展开了，并且确实删去了所有的注释信息，程序部分基本没有什么变化
## 编译`Compilation`

* `gcc -S hello.i -o hello.s`
编译过程时把预处理的文件进行一系列的语法分析，词法分析，语义分析以及优化，最后产生汇编代码，这是程序构建最核心的部分

下面是得到的汇编程序
```asm
	.file	"hello.c"
	.section	.rodata
.LC0:
	.string	"hello world!"
	.text
	.globl	main
	.type	main, @function
main:
.LFB0:
	.cfi_startproc
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register 6
	leaq	.LC0(%rip), %rdi
	call	puts@PLT
	movl	$0, %eax
	popq	%rbp
	.cfi_def_cfa 7, 8
	ret
	.cfi_endproc
.LFE0:
	.size	main, .-main
	.ident	"GCC: (Debian 6.3.0-18+deb9u1) 6.3.0 20170516"
	.section	.note.GNU-stack,"",@progbits
```
当然，也可以将这两步合并到一起
*  `gcc -S hello.c -o hello.s`
## 汇编`Assembly`
* `gcc hello.s -o hello.o`

汇编会将汇编代码变成可以执行的机器指令，基本是逐句翻译汇编代码即可。

此时的文件也可以称为目标文件(OBJ),已经是一个二进制文件。

## 链接`Linkling`
经过链接，目标文件可以进一步变为可执行文件，一般后缀为.out。
但是在这个实例中，我们发现经过`gcc hello.c -o hello.out`和上述 `gcc hello.s -o hello.o`得到的目标文件内容是一样的。
其`hash`值`(md5)`均为`0688c874b7971c99670ba063497937c3`.
