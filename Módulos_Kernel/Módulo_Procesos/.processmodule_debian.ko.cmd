cmd_/home/cloud-native-distributedsystem/Módulos_Kernel/Módulo_Procesos/processmodule_debian.ko := ld -r -m elf_x86_64  -z max-page-size=0x200000 -T /usr/src/linux-headers-4.19.0-17-common/scripts/module-common.lds  --build-id  -o /home/cloud-native-distributedsystem/Módulos_Kernel/Módulo_Procesos/processmodule_debian.ko /home/cloud-native-distributedsystem/Módulos_Kernel/Módulo_Procesos/processmodule_debian.o /home/cloud-native-distributedsystem/Módulos_Kernel/Módulo_Procesos/processmodule_debian.mod.o ;  true
