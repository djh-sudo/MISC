# Program is equal to Finite State Machine
## 程序是有限状态机吗？
如果每条程序的执行结果是唯一确定的，那么程序的确可以看作一个有限状态机，但事实上，有些指令的运行结果并不是确定、唯一的
```C
#include<stdio.h>
#include<stdint.h>
int main(){
        uint64_t val;
        asm volatile ("rdrand %0":"=r"(val));
        printf("random returns %017lx\n",val);
        return 0;
}
```
* 内联汇编产生的随机数并不相同，程序运行的结果每次并不是唯一的！
* ![](https://github.com/djh-sudo/MISC/blob/main/Concurrency/src/res1.png)
* ##  `gdb`调试结果，执行语句前后，`rax`寄存器值发生变化
* ![](https://github.com/djh-sudo/MISC/blob/main/Concurrency/src/res2.png)
如此一来，状态机会变得非常大，其分支节点会有很多，事实上，不确定性更多来自于系统调用`syscall`！但内存和寄存器的数量是有限的，即使是时间，由于计算机的存储以及精度有限，其状态也是有限。
`X86-64`的寄存器有`16`个`64`位的寄存器
* * `rax,rbx,rcx,rdx,rsi,rdi,rbp,rsp`
* * `r8,r9,r10,r11,r12,r13,r14,r15`
* `PC`指针/状态寄存器
* * `rip,rflags,cs,ds,es,fs,gs`

## 并发(`Concurrency`)
在超标量(`superscalar`)处理器仲，允许我们在一个时钟周期内执行多条指令，例如两条无关的赋值指令，在状态图看来，就像是在结点之间跳跃
## 应用(`Time-Travel debugging`)
记录下每次调试的状态，可以跳转到程序任何时间上的状态，可以记录下每次的增量(`delta`)
`gdb`事实上提供了这样的功能！-`target record-full`指令

