# 用`C++`语言实现`Client`和`Server`之间的通信
```C/
/*******************************需要的头文件*******************************/
#include<winsock2.h>	/*1*/
#include<iostream>
#include<assert.h>
#include<cstdlib>
#include<cstdio>
#define XECHO_PORT_NUMBER 123456
using namespace std;

#pragma comment (lib,"ws2_32")	/*2*/
/*******************************服务器发送子函数*******************************/
static void echo_server(SOCKET fd,SOCKADDR_IN addr) {
	char* const buffer = new char[8192];	/*3*/
	cout << "a new connection start ipv4 " << inet_ntoa(addr.sin_addr) <<" port "<< ntohs(addr.sin_port)<<endl;	/*4*/
	do {
		int i = recv(fd, buffer, 8181, 0);	/*5*/
		if (i <= 0) {
			break;
		}
		/*想要字符串输出，就需要0结尾构成一个字符串*/
		buffer[i] = 0;
		/*handle the buffer 这里只是简单演示一个处理例子，大小写互换，之后返回给客户端*/
		cout << "rev buffer " << buffer << endl;
		i = 0;
		while (buffer[i]) {
			if (buffer[i] >= 'a' && buffer[i] <= 'z') {
				buffer[i] = buffer[i] + 'A' - 'a';
			}
			else if (buffer[i] >= 'A' && buffer[i] <= 'Z') {
				buffer[i] = buffer[i] + 'a' - 'A';
			}
			i++;
		}
		i = send(fd, buffer, i, 0);	/*6*/
		if (i == SOCKET_ERROR) {
			break;
		}
	} while (true);
	delete[] buffer;
	cout << "disconnection ipv4 " << inet_ntoa(addr.sin_addr) << " port " << ntohs(addr.sin_port) << endl;
}
/******************************* 服务器端 *******************************/
static void Server() {
	SOCKET lfd = socket(PF_INET, SOCK_STREAM, 0);
	//int socket(int af, int type, int protocol);
	SOCKADDR_IN addr;
	addr.sin_family = AF_INET;
	addr.sin_addr.S_un.S_addr = INADDR_ANY;
	addr.sin_port = htons(XECHO_PORT_NUMBER);
	int i = bind(lfd, (const sockaddr*) &addr, sizeof(SOCKADDR_IN));	/*7*/
	assert(i == NOERROR);
	if (i != NO_ERROR) {
		cout << "fail to bind the port with error :" << WSAGetLastError();
		closesocket(lfd);
		exit(-1);
	}
	cout << "Server is running..." << endl;
	listen(lfd, 100000);	/*8*/
	do {
	//accept the incoming tcp
		i = sizeof(SOCKADDR_IN);
		SOCKET id = accept(lfd,(sockaddr*) &addr,&i);	/*9*/
		//一个套接口接收一个链接
		if (id != INVALID_SOCKET) {
			echo_server(id, addr);
		}
		else {
		}
	} while (true);
	closesocket(lfd);
	return;
}
/******************************* 客户端 *******************************/
static void echo_client(const char* ipv4) {
	SOCKET id = socket(PF_INET, SOCK_STREAM, 0);
	SOCKADDR_IN addr;
	addr.sin_family = AF_INET;
	addr.sin_port = htons(XECHO_PORT_NUMBER);
	addr.sin_addr.S_un.S_addr = inet_addr(ipv4);	`/*10*/
	int i = connect(id, (const sockaddr*)& addr, sizeof(SOCKADDR_IN));	/*11*/
	if (i != NO_ERROR) {
		cout << "connection failed!" << endl;
		exit(-1);
	}
	else {
		cout << "connection successfully!" << endl;
		char buffer[8192];
		do {
			cout << "please input echo :";
			gets_s(buffer);
			i = (int)strlen(buffer);
			if (i == 0) {
				continue;
			}
			buffer[i] = 0;
			if (stricmp(buffer, "exit") == 0 || stricmp(buffer,"quit") == 0) {
				cout << "by by..." << endl;
				break;
			}
			else if (i != send(id, buffer, i, 0)) {
				cout << "send failed!" << endl;
				break;
			}
			i = recv(id, buffer, 8192, 0);
			if (i <= 0) {
				cout << "recive nothing..." << endl;
				break;
			}
			cout<<"rev " << buffer << endl;
		} while (true);
		closesocket(id);
		exit(-1);
		return;
	}
}
/******************************* 提示端 *******************************/
void usage() {	
	cout << "server -s" << endl;
	cout << "client -c[ipv4]" << endl;
}
/******************************* 主函数 *******************************/
int main(int argc, char* argv[]) {
	WSADATA foo;
	WSAStartup(0x0202, &foo);
	if (argc <= 1) {
		usage();
	}
	else if (argc == 2 && stricmp(argv[1], "-s") == 0){	/*12*/
		Server();
	}
	else if (stricmp(argv[1], "-c") == 0) {
		char* ipv4 = (char*)"127.0.0.1";
		if (argc == 3) {
			ipv4 = argv[2];
			assert(ipv4 != nullptr);
		}
		echo_client(ipv4);
	}
	else {
		usage();
	}
	WSACleanup();
	return 0;
}
```
### 这其中用到了一些函数和接口
* 1.`<winsock2.h>`头文件是`Windows`平台下网络编程的头文件

* 2.`#pragma comment (lib,"ws2_32")`是告诉编译器，在动态链接的时候，需要额外链接的库，这里如果使用`Visual Studio 2019`也可以在项目属性中配置，不过在代码中这是一种更加合理和常用的形式。
同时，`#pragma`不同于`#include`,在预编译时，`include`会被通过递归解析方式展开，而`#pragma`会被保留，目的就是告诉编译器需要链接那些`dll`。
这里如果不加这句话，在静态编译时，可以通过，生成`obj`文件，但是一旦执行，会报错，例如一些符号找不到，或者未定义，因为这些都在这个动态链接库中。

* 3.`char* const buffer`这是`C++`一种常见的用法，表示一个常指针，即指针指向的变量不可以修改，但其内容可以修改。

* 4.`inet_ntoa`函数作用为将网络地址转化为点分十进制输出
`ntohs`函数，其含义为`network to host`将网络字节顺序转化为主机字节顺序，这里其实是一种规定，或者说协议，物理主机(CPU)有差异，为了保证网络上传输的内容是一致的，需要把主机字节转化为网络字节，
处理数据时再将网络字节转化为主机字节。

* 5.`recv`函数，不论是客户还是服务器应用程序都用`recv`函数从TCP连接的另一端接收数据。
* * 该函数的第一个参数指定接收端套接字描述符`(SOCKET)`；
* * 第二个参数指明一个缓冲区`(buffer)`，该缓冲区用来存放`recv`函数接收到的数据；
* * 第三个参数指明buf的长度`(length of buffer)`；
* * 第四个参数一般置`0`。
* * 返回值为`copy`字节数
* 6.`sned`函数
* * 该函数的第一个参数指定发送端套接字描述符`(SOCKET)`;
* * 第二个参数指明一个存放应用程序要发送数据的缓冲区`buffer`;
* * 第三个参数指明实际要发送的数据的字节数`(length of buffer)`;
* * 第四个参数一般置`0`;
* * 由此可以看出两个函数的对称性，参数的含义和位置都是一一对应的。
* 7.`bind`函数其实是把套接字描述符与地址绑定在一起，一般服务器需要显示绑定，如果不绑定，操作系统会自动随机绑定一个，所以客户端可以不做此操作。
* 8.`listen`函数的第2个参数实则为最大连接数量，这里其实因为是简单测试，所以任意填写即可
* 9.`int accept(int sockfd, void *addr, int *addrlen);`函数，服务器端收到一个套接字连接，通过返回值能够知道是否连接成功
* 10.`inet_addr`会将点分十进制转化为一个长整型数据，在用户端输入点分十进制会比较方便，但实际中，在网络编程中需要转化为一个标准数据格式发送，否则计算机无法识别。
* 11.`connect`函数和bind的参数是类似的，作用是客户端主动连接服务器，服务器在这里是一个被动等待端。
* 12`stricmp`是字符串比较函数，但是对大小写不敏感。
## 问题
上面这种方式属于阻塞形式的通信，在`do-while()`循环中，服务器一次只能够为一个客户端服务，这不满足一般意义上的服务器的功能，因此了解CS通信原理后，需要对代码做简单修改。
```C
	do {
		i = sizeof(SOCKADDR_IN);
		SOCKET fd = accept(id, (sockaddr*)& addr, &i);
		HANDLE h = CreateThread(NULL, 0, echo_server, (LPVOID)fd, 0, NULL);
		CloseHandle(h);
		//echo_server(fd,addr);//单线程阻塞方式
	} while (true);
```
在原有的`//echo_server(fd,addr);`函数的调用位置，修改为`CreateThread`,即每次连接都新建立一个线程，而不是阻塞方式占据`CPU`。
```C
CreateThread`函数的原型为`HANDLE CreateThread(
                    LPSECURITY_ATTRIBUTES lpThreadAttributes,
                    DWORD dwStackSize,
                    LPTHREAD_START_ROUTINE lpStartAddress,
                    LPVOID lpParameter,
                    DWORD dwCreationFlags,
                    LPDWORD lpThreadID
                   );
```
其中各个参数的含义大致如下
* 1 `lpThreadAttrivutes`,一般设置为`NULL`,用于定义新线程的安全属性
* 2 `dwStackSize`,分配字节数表示线程堆栈大小，默认值为`0`
* 3 `lpStartAddress`,指向线程函数的地址
* 4 `lpParameter`,传递给线程函数的参数
* 5`dwCreationFlags`,一般为0
* 6`lpThreadID`,创建线程的`id`编号,一般为`NULL`
