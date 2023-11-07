#include <bits/stdc++.h>
using namespace std;

void findFirstAndLast(int arr[], int n, int x)
{
	int first = -1, last = -1;
	for (int i = 0; i < n; i++) {
		if (x != arr[i])
			continue;
		if (first == -1)
			first = i;
		last = i;
	}
	if (first != -1)
		cout << first << " "<< last;
	else
		cout << "Not Found";
}


int main()
{
    int n;
    
    cin >> n;
    int x, i;
    int arr[n];
    
    cin >> x;
    for( i = 0 ; i < n; i++)
    {
        int r;
       
        cin >> r;
        arr[i] = r;
    }
    
	findFirstAndLast(arr, n, x);
	return 0;
}