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
内联汇编产生的随机数并不相同，程序运行的结果每次并不是唯一的！
