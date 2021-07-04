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
`gdb`事实上提供了这样的功能！，即`target record-full`指令
同样以随机数例子
* 执行后
* ![](https://github.com/djh-sudo/MISC/blob/main/Concurrency/src/res3.png)
* 反向执行`rsi`
* ![](https://github.com/djh-sudo/MISC/blob/main/Concurrency/src/res4.png)
## 模拟
* 如果两个线程分别对共享变量`x`执行`x++`,结果会是怎样的呢？
* 事实上，看似一条指令，实则可能被拆分为多个指令，一般而言，在一个时钟周期内，只能一次访存，即执行一条`x = store(t)`或者`t = load(x)`,或者寄存器的一些运算
* 因此，我们将`x++`拆解为三个步骤，模拟1-3个线程执行过程
```python
import itertools
'''
 n is the thread number
'''
n = 1
x = 0
exec_array = ["load","t++","store"]
raw_res = []
res = []
dic = {}
seq = {}
for i in range(n):
    for j in exec_array:
        raw_res.append("p" + str(i) +" " + j)
    dic["t" + str(i)] = 0
res = list(itertools.permutations(raw_res,len(raw_res)))

for i in res:
    for k in range(n):
        dic["t" + str(k)] = 0
        seq["t" + str(k)] = 0
    x = 0
    i = list(i)
    index = False
    for j in i:
        key = "t" + j[1]
        if j.__contains__("load") and seq[key] is 0:
            dic[key] = x
            seq[key] = 1
        elif j.__contains__("++") and seq[key] is 1:
            dic[key] = dic[key] + 1
            seq[key] = 2
        elif j.__contains__("store") and seq[key] is 2:
            x = dic[key]
            seq[key] = 3
        else: index = True
    if index is False:
        print("x = " + str(x) + " " + str(i))

'''
    analysis
    This script is low-efficient,when n is 4,The memory will upper!
    This is because n! is very large when n is a little big
'''

```
## 结果及分析
* `n = 1`时，结果为
```C
x = 1 ['p0 load', 'p0 t++', 'p0 store']
```
显然，单线程是安全的，执行结果也没有二义性

* `n = 2`时，结果为
```C
x = 2 ['p0 load', 'p0 t++', 'p0 store', 'p1 load', 'p1 t++', 'p1 store']
x = 1 ['p0 load', 'p0 t++', 'p1 load', 'p0 store', 'p1 t++', 'p1 store']
x = 1 ['p0 load', 'p0 t++', 'p1 load', 'p1 t++', 'p0 store', 'p1 store']
x = 1 ['p0 load', 'p0 t++', 'p1 load', 'p1 t++', 'p1 store', 'p0 store']
x = 1 ['p0 load', 'p1 load', 'p0 t++', 'p0 store', 'p1 t++', 'p1 store']
x = 1 ['p0 load', 'p1 load', 'p0 t++', 'p1 t++', 'p0 store', 'p1 store']
x = 1 ['p0 load', 'p1 load', 'p0 t++', 'p1 t++', 'p1 store', 'p0 store']
x = 1 ['p0 load', 'p1 load', 'p1 t++', 'p0 t++', 'p0 store', 'p1 store']
x = 1 ['p0 load', 'p1 load', 'p1 t++', 'p0 t++', 'p1 store', 'p0 store']
x = 1 ['p0 load', 'p1 load', 'p1 t++', 'p1 store', 'p0 t++', 'p0 store']
x = 1 ['p1 load', 'p0 load', 'p0 t++', 'p0 store', 'p1 t++', 'p1 store']
x = 1 ['p1 load', 'p0 load', 'p0 t++', 'p1 t++', 'p0 store', 'p1 store']
x = 1 ['p1 load', 'p0 load', 'p0 t++', 'p1 t++', 'p1 store', 'p0 store']
x = 1 ['p1 load', 'p0 load', 'p1 t++', 'p0 t++', 'p0 store', 'p1 store']
x = 1 ['p1 load', 'p0 load', 'p1 t++', 'p0 t++', 'p1 store', 'p0 store']
x = 1 ['p1 load', 'p0 load', 'p1 t++', 'p1 store', 'p0 t++', 'p0 store']
x = 1 ['p1 load', 'p1 t++', 'p0 load', 'p0 t++', 'p0 store', 'p1 store']
x = 1 ['p1 load', 'p1 t++', 'p0 load', 'p0 t++', 'p1 store', 'p0 store']
x = 1 ['p1 load', 'p1 t++', 'p0 load', 'p1 store', 'p0 t++', 'p0 store']
x = 2 ['p1 load', 'p1 t++', 'p1 store', 'p0 load', 'p0 t++', 'p0 store']
```
显然只有首位两种情况是安全的，其它都不是可串行化调度

* `n = 3`时，部分结果为
```C
x = 3 ['p0 load', 'p0 t++', 'p0 store', 'p1 load', 'p1 t++', 'p1 store', 'p2 load', 'p2 t++', 'p2 store']
...
x = 3 ['p0 load', 'p0 t++', 'p0 store', 'p2 load', 'p2 t++', 'p2 store', 'p1 load', 'p1 t++', 'p1 store']
...
x = 3 ['p2 load', 'p2 t++', 'p2 store', 'p0 load', 'p0 t++', 'p0 store', 'p1 load', 'p1 t++', 'p1 store']
...
x = 3 ['p2 load', 'p2 t++', 'p2 store', 'p1 load', 'p1 t++', 'p1 store', 'p0 load', 'p0 t++', 'p0 store']
```
仅有6种调度能够得到正确的结果，其余结果均为1或者2

* 由此可见，在多线程中，若任由线程之间并发，结果将会不可预见，这还是保证指令之间是有序的情况，在实际中，为了进一步提高效率，可能会交换某些指令，例如在超标量流水技术中，一个时钟周期内可以执行多条指令，指令之间不再有序；同时在`Cache`没有命中的时候，cpu同样可能不会等待，将缺失的指令放入等待队列，转而执行下一步，凡此种种，都使得多线程的编程难度大大提升！

## Reference
https://www.bilibili.com/video/BV1N741177F5?p=4
