export const LANGUAGE_CONFIGS = {
    java: {
        id: 62,
        defaultCode: `public class Main {
    public static void main(String[] args) {
        // Your code starts here
        System.out.println("Hello, World!");
    }
}`,
        name: "Java"
    },
    python: {
        id: 71,
        defaultCode: `# Python code
print("Hello, World!")`,
        name: "Python"
    },
    cpp: {
        id: 54,
        defaultCode: `#include <iostream>
using namespace std;

int main() {
    // Your code starts here
    cout << "Hello, World!" << endl;
    return 0;
}`,
        name: "C++"
    },
    csharp: {
        id: 51,
        defaultCode: `using System;
class Program
{
    static void Main()
    {
        // Your code starts here
        Console.WriteLine("Hello, World!");
    }
}`,
        name: "C#"
    },
}
