# Make File 

# File To Build As A Loadable Module Kernel
obj-m += rammodule.o

# Const 
KDIR := /lib/modules/$(shell uname -r)/build
PWD := $(shell pwd)

# Run Targets
all:
	make -C $(KDIR) M=$(PWD) modules

# Run Clean
clean:
	make -C $(KDIR) M=$(PWD) clean

# Target Test
test:
	
	sudo dmesg -C
	sudo insmod rammodule.ko
	cat /proc/rammodule
	sudo rmmod rammodule
	sudo dmesg