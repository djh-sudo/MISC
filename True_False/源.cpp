#include<iostream>
#include<vector>
#include<cmath>
#include<string>
#include<set>

using namespace std;
vector<char>s1;
vector<char>s2;
int temp;
vector<char>::iterator it;
vector<vector<int>> Binary;
vector<char>c;
set<char>Alpha;
vector<int>number;

void Standard()//使得每次下标访问时候，都是其第顶层元素
{
	if (s1.size() == 0)
		temp = 0;
	else
		temp = s1.size() - 1;
}
string char_trans_char(char c)
{
	if (c == '^')
		return "∧";
	if (c == 'V')
		return "∨";
	if (c == '!')
		return  "￢";
	if (c == '>')
		return "→";
	if (c == '(')
		return "(";
	if (c == ')')
		return ")";
	if (c == '=')
		return"<=>";
	else
	{
		cout << "CHAR ERROR!" << endl;
		exit(1);
	}
}
char num_trans_Alf(int n)
{
	if (n == 0)
		return  'F';
	else
		return 'T';
}
int Cmp(char c1, char c2)//比较函数
{
	int k1, k2;
	char c[5] = { '=','>','V','^','!' };//等级越高，值越大，前者大，返回为真！
	for (int i = 0; i < 5; i++)
	{
		if (c1 == c[i])
			k1 = i;
		if (c2 == c[i])
			k2 = i;
	}
	return k1 >= k2;
}
void Judge(char c1)//判断函数
{
	Standard();
	{
		if ((Cmp(c1, s1[temp])))
			s1.push_back(*it);
		else
		{
			while ((!s1.empty() && s1[temp] != '(') && !Cmp(c1, s1[temp]))
			{
				s2.push_back(s1[temp]);
				s1.pop_back();
				temp--;
			}
			s1.push_back(*it);
		}
	}
}
void Add_new(char c1)
{
	if (Alpha.count(c1) == 0)
	{
		Alpha.insert(c1);
		c.push_back(c1);
	}
		return;
	return;
}
void set_T(vector<int>& t, int n)//n为周期长度
{
	for (int i = 0; i < n/2; i++)
	{
		t.push_back(1);
	}
	for (int i = 0; i < n / 2; i++)
		t.push_back(0);
}
void B_Return(int n)//n为变元个数
{
	long long u = pow(2, n);
	vector<int>temp;
	for (int i = 0; i < n; i++)//一共要给n个变元赋值
	{
		temp.clear();
		for (int j = 0; j < (long long)pow(2, i); j++)
			set_T(temp,(long long)pow(2,n-i));
		Binary.push_back(temp);
	}
}
void Transmit(vector<char>stack)//中缀转后缀
{
	for (it = stack.begin(); it != stack.end();)
	{
		Standard();
		if ((*it) >= 'A' && (*it) <= 'Z' && (*it) != 'V')
		{
			s2.push_back((*it));
			Add_new(*it);
		}
		else
		{
			if ((*it) != '^' && (*it) != 'V' && (*it) != '!' && (*it) != '(' && (*it) != ')' && (*it) != '=' && (*it) != '>')
			{
				cout << "ERROR INPUT\n EXIT!" << endl;//符号输入有误
				exit(1);
			}
			if (s1.empty() || (*it) == '(' || (!s1.empty() && ((s1[temp]) == '(')))
				s1.push_back(*it);
			else
				switch (*it)
				{
				case('!'):
				{
					Judge('!');
					break;
				}
				case('^'):
				{
					Judge('^');
					break;
				}
				case(')'):
				{
					Standard();
					while (s1[temp] != '(' && s1.size() != 0)
					{
						s2.push_back(s1[temp--]);
						s1.pop_back();
					}
					if (s1[temp] == '(')
						s1.pop_back();
					else
					{
						cout << "ERROR INPUT!\nEXITING!" << endl;
						exit(1);
					}
					break;
				}
				case('V'):
				{
					Standard();
					Judge('V');
					break;
				}
				case('='):
				{
					Standard();
					Judge('=');
					break;
				}
				case('>'):
				{
					Standard();
					Judge('>');
					break;
				}
				}
		}
	if (it != stack.end())
		it++;
	}
	while (!s1.empty())
	{

		for (int i = s1.size() - 1; i >= 0; i--)
		{
			s2.push_back(s1[i]);
			s1.pop_back();
		}
	}
	B_Return(Alpha.size());
}
void Standard_R(vector<vector<int>>&R)//访问其最顶层的元素
{
	if (R.size() == 0)
		temp = 0;

	else
		temp = R.size() - 1;
}
void OR(vector<int> a1, vector<int> a2)
{
	number.clear();
	for (int i = 0; i < a1.size(); i++)
		number.push_back(a1[i] || a2[i]);
}
void AND(vector<int> a1, vector<int> a2)
{
	number.clear();
	for (int i = 0; i < a1.size(); i++)
		number.push_back(a1[i] && a2[i]);
}
void NOT(vector<int> a1)
{
	number.clear();
	for (int i = 0; i < a1.size(); i++)
		number.push_back(!a1[i]);
}
void EQUAL(vector<int> a1, vector<int> a2)
{
	number.clear();
	for (int i = 0; i < a1.size(); i++)
		number.push_back((a1[i] || !a2[i]) && (!a1[i] || a2[i]));
}
void ARROW(vector<int> a1, vector<int> a2)
{
	number.clear();
	for (int i = 0; i < a1.size(); i++)
		number.push_back(!a1[i] || a2[i]);
}
void Simplfy(vector<vector<int>>&s)
{
	s.pop_back();
	s.pop_back();
	s.push_back(number);
	s1.pop_back();
	s1.pop_back();
	s1.push_back('a');
}
vector<int>& Find(char d)
{
	int tem=0;
	int i=0;
	for (; i < c.size(); i++)
		if (d == c[i])
		{
			tem = i;
			break;
		}
	if (i >= c.size())
	{
		cout << "FIND_ERROR!" << endl;
		exit(1);
	}
	return Binary[tem];
}
void Calculate()
{
	vector<vector<int>> R;
	R.clear();
	s1.clear();
	for (vector<char>::iterator it = s2.begin(); it != s2.end(); it++)
	{
		if (*it >= 'A' && *it <= 'Z' && *it != 'V')
		{
			s1.push_back(*it);
			R.push_back(Find(*it));
		}
		else
		{
			if (!s1.empty())
			{
				switch (*it)
				{
				case('!'):
				{
					Standard_R(R);
					NOT(R[temp]);
					R.pop_back();
					R.push_back(number);
					break;
				}
				case('V'):
				{
					Standard_R(R);
					OR(R[temp],R[temp-1]);
					Simplfy(R);
					break;
				}
				case('^'):
				{
					Standard_R(R);
					AND(R[temp], R[temp - 1]);
					Simplfy(R);
					break;
				}
				case('='):
				{
					Standard_R(R);
					EQUAL(R[temp-1], R[temp]);
					Simplfy(R);
					break;
				}
				case('>'):
				{
					Standard_R(R);
					ARROW(R[temp - 1], R[temp]);
					Simplfy(R);
					break;
				}
				}
			}
		}
	}
	number.clear();
	for (int i = 0; i < R[0].size(); i++)
		number.push_back(R[0][i]);
}
void Display(vector<char>&stack)
{
	for (int i = 0; i < c.size(); i++)
	{
		cout << c[i] << "	";
	}
	for (int u = 0; u < stack.size(); u++)
	{
		if (stack[u] >= 'A' && stack[u] <= 'Z'&&stack[u]!='V')
			cout << stack[u];
		else
			cout << char_trans_char(stack[u]);
	}	
	cout << endl;
	for (int i = 0; i < (long long)pow(2, c.size()); i++)
	{
		for (int k = 0; k < c.size(); k++)
			cout << num_trans_Alf(Binary[k][i])<< "	";
		cout << num_trans_Alf(number[i]) << endl;
	}
	return;
}
string Output(vector<char> c1,int n)
{
	string s = "";
	int k = 0;
	s += "(";
	for (; k < c1.size(); k++)
	{
			if (Binary[k][n] == 0)
				s += char_trans_char('!');
			s += c[k];
			if (k < c.size() - 1)
				s += char_trans_char('^');
	}	
	s += ")";
	return s;
}
string Output_1(vector<char> c1, int n)
{
	string s = "";
	int k = 0;
	s += "(";
	for (; k < c1.size(); k++)
	{
		if (Binary[k][n] == 1)
			s += char_trans_char('!');
		s += c[k];
		if (k < c.size() - 1)
			s += char_trans_char('V');
	}
	s += ")";
	return s;
}
void Or()//主析取范式
{
	int count = 0;
	for (int i = 0; i < (long long)pow(2, c.size()); i++)
	{
		if (number[i] == 1)
		{
			if (count != 0)
				cout << char_trans_char('V');
			count++;
			cout << Output(c, i);
		}
	}
	if (count == 0)
		cout << "F 该式子为永假式，不存在主析取范式" << endl;
	cout << endl;
}
void AND()
{
	int count = 0;
	for (int i = 0; i < (long long)pow(2, c.size()); i++)
	{
		if (number[i] == 0)
		{
			if (count != 0)
				cout << char_trans_char('^');
			count++;
			cout << Output_1(c, i);
		}
	}
	if (count == 0)
		cout << "T 该式子为永真式，不存在主合取范式" << endl;
	cout << endl;
}
int main()
{
	cout << "本程序自动识别变元个数(限于大写字母个数，25个以内)"<<endl;
	cout << "在输入界面，使用！表示非,^ 表示合取,V表示析取,= 表示当且仅当,> 表示蕴含" << endl;
	cout << "必要时可以使用括号提高运算的优先级." << endl;
	cout << "请使用其他大写字母表示变元，不要使用V" << endl;
	vector<char>stack;
	Standard();
	stack.clear();
	s1.clear();
	s2.clear();
	char ch;
	ch = getchar();
	while (ch != '\n')
	{
		stack.push_back(ch);
		ch = getchar();
	}
	if (stack.empty())
		return 0;
	Transmit(stack);
	cout << endl;
	Calculate();
	Display(stack);
	cout << "主析取范式" << endl;
	Or();
	cout << "主合取范式" << endl;
	AND();
	stack.clear();
	s1.clear();
	s2.clear();
	system("pause");
	return 0;
}