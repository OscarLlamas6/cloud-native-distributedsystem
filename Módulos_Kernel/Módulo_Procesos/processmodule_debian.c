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
    long numberCpu;
    long numberProcess;
    struct task_struct *task_list_child;
    struct list_head *list;
    struct task_struct *task;

    // Each Process
    for_each_process(task) {

        // Obtain Porcent
        numberCpu += task->usage.counter;

        // Each Child Process
        list_for_each(list, &task->children) {

            // Obtain Child Processs
            task_list_child = list_entry(list, struct task_struct, sibling);

            // Obtain Porcent
            numberCpu += task_list_child->usage.counter;
            
            // Count Process
            numberProcess++;

        }
        
        // Count Process
        numberProcess++;

    }  

    // Operation 
    porcent = numberCpu / 10 * 100 / numberProcess;


    // Write In File Values
    seq_printf(file, "%8ld,", porcent);  
    //seq_printf(file, "%8ld,", numberCpu);
    seq_printf(file, "%8ld", numberProcess);        
  
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

    open: atOpen,
    read: seq_read

};

// Load Module
static int load_module(void) {

    // Print Title
    printk(KERN_INFO "mod: Bienvenido Al Módulo Kernel De Procesos - Grupo 18\n");

    // Create Proccess
    proc_create("processmodule", 0, NULL, &fileOperations);
    
    // Return 
    return 0;

}

static void unload_module(void) {
    
    // Print Title
    printk(KERN_INFO "mod: Gracias Por Utilizar Nuestro Modulo Kernel De Procesos - Grupo 18\n");

    // Remove Proccess
    remove_proc_entry("processmodule", NULL);

}

// Module Initialization
module_init(load_module);

// Module Exit
module_exit(unload_module);