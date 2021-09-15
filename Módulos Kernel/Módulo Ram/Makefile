# Make File 

# File To Build As A Loadable Module Kernel
obj-m += rammodule.o

# Run Targets
all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

# Run Clean
clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

# Target Test
test:
	
	sudo dmesg -C
	sudo insmod rammodule.ko
	cat /proc/rammodule
	sudo rmmod rammodule
	sudo dmesg