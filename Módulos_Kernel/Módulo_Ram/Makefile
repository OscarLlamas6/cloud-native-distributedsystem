# Make File 

# File To Build As A Loadable Module Kernel
obj-m += rammodule_debian.o

# Const 
KDIR := /lib/modules/$(shell uname -r)/build
PWD := $(shell pwd)

# Run Targets
all:
	make -C $(KDIR) M=$(PWD) modules

# Run Clean
clean:
	make -C $(KDIR) M=$(PWD) clean