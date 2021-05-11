# 网路爬虫(`Spider`)
### 通过`c++`程序抓取`url`对应的页面程序

##  框架1(自顶向下原则)
 ```C
 void spider(const char* purl) {
	  SOCKET fd = connectServer(purl);                      //建立`socket`连接
	  char* buffer = new char[BUFFER_SIZE];                 //动态分配一个缓冲区buffer大小
	  int i = buildHttpRequest(purl, buffer, BUFFER_SIZE);  //构造一个http请求
	  i = httpSender(fd, buffer, i);                        //发送http请求
	  i = httpReceiver(fd, buffer, BUFFER_SIZE);            //接收http请求
	  httpParser(purl, buffer, i);                          //处理接收的内容[*]
	  closesocket(fd);                                      //关闭socket
	  delete[] buffer;                                      //释放动态内存
	  return;
}
 ```
## 框架2(自顶向下和自底向上结合)
* 1 建立连接
```C
SOCKET connectServer(const char*purl) {
	string host = pickHost(purl);                           //通过url获取主机号
	ULONG ipv4 = nameResolver(host.c_str());                //地址解析
	return wrapper(ipv4);                                   //给定一个ipv4返回一个socket
}
```
其中，`pickHost`, `nameResolver`以及`wrapper`是进一步分割的子模块。
* 2 建立一个http请求
```C
int buildHttpRequest(const char*purl,char*buffer,int idbuffer) {
	string host = pickHost(purl);                   //获取主机名
  
	char* p = (char*)strstr(purl, "://");           //返回http://之后的字串
	p += 3;
	p = strstr(p,"/");                              //http之后的第一个/为请求的域名
  
	int i = sprintf(buffer,
				"GET %s HTTP/1.1\r\n"
				"Host: %s\r\n"
				"Accept-Type: */*\r\n"
				"User-Agent: spider V01\r\n"
				"Connection: close\r\n\r\n",
				p,host.c_str()
	);
	return i;
}
```
#### (1)其中，`strstr()`函数返回字符串中子串首次出现的地址
#### (2)`sprintf()`函数与`printf()`函数类似，前者是一般情况，通过格式化输出，将内容输出到指定位置，失败将会返回负数，成功返回对应写入的字符数
#### (3)上面的常量字符串中的内容,实则为一个`http`请求头
* 3 `http`发送请求函数
```C
int httpSender(SOCKET fd, char* buffer, int idbuffer) {
	return send(fd, buffer, idbuffer, 0);
}
```
这里其实与`send()`函数直接调用没有任何区别,但是通过封装一层，可以在调用前完成参数的检查,保证传入的参数的正确性
* 4 `http`接收响应函数
```C
int httpReceiver(SOCKET fd, char* buffer, int idbuffer) {
	int ttl = 0;
	do {
		int i = recv(fd, buffer, idbuffer, 0);    //接收数据，i表示接收到的字符数
		if (i <= 0) {
			break;
		}
		else {
			ttl += i;
			idbuffer -= i;
			buffer += i;
		}
	} while (idbuffer > 0);
	return ttl;                                 //返回接收到的字符数
}
```
* 5 `http`数据处理[*]
对于收到的`http`数据如何处理，就是具体应用做的事情了,演示中只是把数据存储在本地和打印至屏幕终端，
```C
void httpParser(const char* purl, char* buffer, int idbuffer) {
	//处理数据
	FILE* fp = fopen("temp.txt", "wb");
	fwrite(buffer, 1, idbuffer, fp);
	fclose(fp);
	buffer[idbuffer] = 0;
	cout << "reveive data " << endl << buffer << endl;;
	return;
}
```
## 框架3(自底向上)
* 1.给定一个`ipv4`返回一个socket(默认端口为80)
```C
SOCKET wrapper(const ULONG ipv4) {
	SOCKET fd = socket(PF_INET, SOCK_STREAM, 0);
	SOCKADDR_IN addr;
	int i;
	addr.sin_family = AF_INET;
	addr.sin_port = htons(80);
	addr.sin_addr.S_un.S_addr = ipv4;

	i = connect(fd, (const sockaddr*)& addr, sizeof(SOCKADDR_IN));
	if (i == NOERROR) {
		return fd;
	}closesocket(fd);
	return INVALID_SOCKET;
}
```
* 2.根据主机名解析对应的地址
```C
ULONG nameResolver(const char* phost) {
	hostent* p = gethostbyname(phost);
	if (p) {
		return *(ULONG*)p->h_addr_list[0];
	}
	return 0;
}
```
* 3.根据`url`返回主机名
```C
string pickHost(const char*purl) {
	const char* pbegin = strstr(purl, "://");
	if (!pbegin) {
		return "";
	}
	else {
		char* pend = (char*)strstr(&pbegin[3], "/");
		pbegin += 3;
		*pend = 0;
		string hostname = pbegin;
		*pend = '/';
		cout << "host " << hostname.c_str() << endl;
		return hostname;
	}
}
```
