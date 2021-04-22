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
		int i = recv(fd, buffer, 8181, 0);
		/*
		不论是客户还是服务器应用程序都用recv函数从TCP连接的另一端接收数据。该函数的第一个参数指定接收端套接字描述符；
		第二个参数指明一个缓冲区，该缓冲区用来存放recv函数接收到的数据；
		第三个参数指明buf的长度；
		第四个参数一般置0。
		返回值为copy字节数
		*/
		if (i <= 0) {
			break;
		}
		buffer[i] = 0;
		/*handle the buffer*/
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
		i = send(fd, buffer, i, 0);
		/*
		    该函数的第一个参数指定发送端套接字描述符；
			 第二个参数指明一个存放应用程序要发送数据的缓冲区；
			 第三个参数指明实际要发送的数据的字节数；
			第四个参数一般置0。
		*/
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

	int i = bind(lfd, (const sockaddr*) &addr, sizeof(SOCKADDR_IN));
	assert(i == NOERROR);
	if (i != NO_ERROR) {
		cout << "fail to bind the port with error :" << WSAGetLastError();
		closesocket(lfd);
		exit(-1);
	}
	cout << "Server is running..." << endl;
	listen(lfd, 100000);
	do {
	//accept the incoming tcp
		i = sizeof(SOCKADDR_IN);
		SOCKET id = accept(lfd,(sockaddr*) &addr,&i);
		//int accept(int sockfd, void *addr, int *addrlen);
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
	addr.sin_addr.S_un.S_addr = inet_addr(ipv4);
	//inet_addr 将点分十进制转化为一个长整型数据
	int i = connect(id, (const sockaddr*)& addr, sizeof(SOCKADDR_IN));
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
	else if (argc == 2 && stricmp(argv[1], "-s") == 0){
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
