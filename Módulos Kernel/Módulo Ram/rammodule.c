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
int writeFile(struct seq_file* file, void *auxiliary) {
     
    // Sys Information Struct
    struct sysinfo information;
    
    // Obtain Sys Informartion
    si_meminfo(&information);

    // Write In File Values 
    seq_printf(file, "Memoria Ram Total:  %8lu MB\n", information.totalram * 4 / 1024);
    seq_printf(file, "Memoria Ram En Uso: %8lu MB\n", (information.totalram - information.freeram) * 4 / 1024);   
    seq_printf(file, "Memoria Ram Libre:  %8lu MB\n", information.freeram * 4 / 1024);
    seq_printf(file, "Pocentaje De Memoria Ram En Uso: %8lu", (((information.totalram - information.freeram) * 100%) / information.totalram) * 100), "Porciento");  

    // Return File 
    return 0;

}

// Action When Opening The File
static int atOpen(struct inode* inode, struct file* file) {

    // Open File
    return single_open(file, writeFile, NULL);

}

// File Operations
static struct file_operations fileOperations = {

    .open = atOpen,
    .read = seq_read

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