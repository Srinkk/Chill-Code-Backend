#include <bits/stdc++.h>
using namespace std;

void isKthBitSet(int n, int k)
{
	if (n & (1 << k))
		cout << "Yes";
	else
		cout << "No";
}

// Driver code
int main()
{
	int n, k;
	cin >> n;
	cin >> k;

	// Function call
	isKthBitSet(n, k);
	return 0;
}