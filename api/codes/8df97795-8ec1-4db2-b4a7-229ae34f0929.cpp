#include<bits/stdc++.h>
using namespace std;
int f(int n){
    if(n==1 || n==0)
    return n;
    return n*f(n-1);
}
int main(){
    cout<<f(10);
    return 0;
}