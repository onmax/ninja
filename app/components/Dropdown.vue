<script setup lang="ts">
defineProps<{ options: { label: string, href: string, icon: string }[] }>()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger outline-none>
      <slot />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent z-50 min-w-128 overflow-hidden border rounded-8 bg-popover p-4 text-popover-foreground shadow-md class="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-8 data-[side=left]:slide-in-from-right-4 data-[side=right]:slide-in-from-left-8 data-[side=top]:slide-in-from-bottom-8">
        <!-- <DropdownMenuLabel px-2 py-1.5 pl-8 text-sm font-semibold>
          <slot />
        </DropdownMenuLabel> -->
        <DropdownMenuItem
          v-for="({ icon, label, href }) in options" :key="label"
          class="relative flex cursor-default select-none items-center gap-16 rounded-sm px-8 py-6 text-14 outline-none transition-colors data-[disabled]:pointer-events-none hocus:bg-accent hocus:text-accent-foreground data-[disabled]:opacity-50"
        >
          <NuxtLink :to="href" flex="~ items-center">
            <div size-24 flex="~ items-center justify-center" rounded-4>
              <Icon :name="icon" size-16 shrink-0 />
            </div>
            <span>
              {{ label }}
            </span>
          </NuxtLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
