// Imports 

// Inizialization
#include <linux/init.h>

// Functions
#include <linux/module.h>

// Processs File System Constants/Structures
#include <linux/proc_fs.h>

// Files Manage
#include <linux/seq_file.h>

// Memory Manage
#include <linux/mm.h>

// Cpu Proccess
#include <linux/sched/signal.h>

// Module Identification
MODULE_LICENSE("GPL");
MODULE_AUTHOR("Grupo 18");
MODULE_DESCRIPTION("Proyecto No.1 - Sistemas Operativos 1");
MODULE_VERSION("1.0.0");

// Write File, Params File Pointer, V Pointer
int writeFile(struct seq_file* file, void *v) {
     
    // Declaratiosn 
    long porcent;
    long freeRam;
    long useRam;
    long totalRam;
    
    // Sys Information Struct
    struct sysinfo information;
    
    // Obtain Sys Informartion
    si_meminfo(&information);

    // Porcent And Values
    freeRam = (information.freeram * information.mem_unit) / (1000 * 1000);
    totalRam = (information.totalram * information.mem_unit) / (1000 * 1000);
    useRam = (totalRam - freeRam); 
             
    porcent = (useRam * 100 / totalRam); 

    // Write In File Values 
    seq_printf(file, "\n\nMódulo Kernel RAM - Grupo 18");
    seq_printf(file, "\n");
    seq_printf(file, "\n");
    seq_printf(file, "  Memoria Ram Total:  %8ld MB\n", totalRam);
    seq_printf(file, "  Memoria Ram En Uso: %8ld MB\n", useRam);   
    seq_printf(file, "  Memoria Ram Libre:  %8ld MB\n", freeRam);
    seq_printf(file, "  Porcentaje De Memoria Ram Utilizada: %8ld Porciento\n\n\n", porcent);  
  
    // Return File 
    return 0;

}

// Action When Opening The File
static int atOpen(struct inode* inode, struct file* file) {

    // Open File
    return single_open(file, writeFile, NULL);

}

// File Operations
static struct proc_ops fileOperations = {

    .proc_open = atOpen,
    .proc_read = seq_read

};

// Load Module
static int load_module(void) {

    // Print Title
    printk(KERN_INFO "mod: Bienvenido Al Módulo Kernel De RAM - Grupo 18\n");

    // Create Proccess
    proc_create("rammodule", 0, NULL, &fileOperations);
    
    // Return 
    return 0;

}

static void unload_module(void) {
    
    // Print Title
    printk(KERN_INFO "mod: Gracias Por Utilizar Nuestro Modulo Kernel De RAM - Grupo 18\n");

    // Remove Proccess
    remove_proc_entry("rammodule", NULL);

}

// Module Initialization
module_init(load_module);

// Module Exit
module_exit(unload_module);