#include <cstdio>
#include <cstdlib>
#include <Windows.h>


#define OID_802_3_PERMANENT_ADDRESS      0x01010101
#define IOCTL_NDIS_QUERY_GLOBAL_STATS    0x00170002


int GetMac()
{
	int nError = -1;

	HKEY hKey = NULL;
	HKEY hKey2 = NULL;
	TCHAR szKey[MAX_PATH] = { 0 }, szBuffer[MAX_PATH] = { 0 };
	TCHAR szServiceName[MAX_PATH];
	TCHAR szFileName[MAX_PATH] = {0};
	DWORD dwRet = 0;
	DWORD dwType = 0;
	DWORD cbData = 0;
	DWORD cName = _countof(szBuffer);
	if ( RegOpenKey(HKEY_LOCAL_MACHINE,("SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\NetworkCards\\"), &hKey) != ERROR_SUCCESS ){
		return nError;
	}

	for (int i=0; RegEnumKeyEx(hKey,i,szBuffer,&cName,NULL,NULL,NULL,NULL)==ERROR_SUCCESS; ++i, cName = _countof(szBuffer)) {
		strcpy(szKey, "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\NetworkCards\\");
		strcat(szKey, szBuffer);
		if ( RegOpenKey(HKEY_LOCAL_MACHINE,szKey,&hKey2)!=ERROR_SUCCESS ){
			continue;
		}

		dwType = REG_SZ;
		cbData = MAX_PATH * sizeof(TCHAR);
		if (RegQueryValueEx(hKey2, ("ServiceName"), NULL, &dwType, (LPBYTE)szServiceName, &cbData) == ERROR_SUCCESS) {
			RegCloseKey(hKey2);
			strcpy(szFileName, "\\\\.\\");
			strcat(szFileName, szServiceName);
			HANDLE hFile = CreateFile(szFileName, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
			if (hFile != INVALID_HANDLE_VALUE) {
				DWORD dwInBuff = OID_802_3_PERMANENT_ADDRESS;
				BYTE outBuff[MAX_PATH];
				dwRet = DeviceIoControl(hFile, IOCTL_NDIS_QUERY_GLOBAL_STATS, &dwInBuff, sizeof(dwInBuff), outBuff, sizeof(outBuff), &cbData, NULL);

				CloseHandle(hFile);
				hFile = INVALID_HANDLE_VALUE;

				if (dwRet) {
					printf("MAC addr:%02X:%02X:%02X:%02X:%02X:%02X\n",
						outBuff[0],
						outBuff[1],
						outBuff[2],
						outBuff[3],
						outBuff[4],
						outBuff[5]);
					nError = 0;
					
				}
			}
		}
		else{
			//¶ÁÈ¡Ê§°Ü¹Ø±Õ¾ä±ú
			RegCloseKey(hKey2);
		}

	}//end for

	if (hKey != NULL){
		RegCloseKey(hKey);
	}
	return nError;
}


int main()
{
	/*
	* using DeviceIoControl to get MAC address 
	*/
	GetMac();
	system("pause");
	return 0;
}