#include <linux/build-salt.h>
#include <linux/module.h>
#include <linux/vermagic.h>
#include <linux/compiler.h>

BUILD_SALT;

MODULE_INFO(vermagic, VERMAGIC_STRING);
MODULE_INFO(name, KBUILD_MODNAME);

__visible struct module __this_module
__attribute__((section(".gnu.linkonce.this_module"))) = {
	.name = KBUILD_MODNAME,
	.init = init_module,
#ifdef CONFIG_MODULE_UNLOAD
	.exit = cleanup_module,
#endif
	.arch = MODULE_ARCH_INIT,
};

#ifdef CONFIG_RETPOLINE
MODULE_INFO(retpoline, "Y");
#endif

static const struct modversion_info ____versions[]
__used
__attribute__((section("__versions"))) = {
	{ 0xf5e5fdc6, "module_layout" },
	{ 0xe36b56ef, "seq_read" },
	{ 0xdf16207f, "remove_proc_entry" },
	{ 0x2b4a4033, "proc_create" },
	{ 0x7c32d0f0, "printk" },
	{ 0xb4e9f18c, "single_open" },
	{ 0x8e96ac1c, "seq_printf" },
	{ 0xee1f4973, "init_task" },
	{ 0xbdfb6dbb, "__fentry__" },
};

static const char __module_depends[]
__used
__attribute__((section(".modinfo"))) =
"depends=";


MODULE_INFO(srcversion, "AB23FB6E5D5C5DA2846F23E");
