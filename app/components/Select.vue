<script setup lang="ts" generic="T">
defineProps<{ options: T[], valueLabel: (option: string) => string, valueKey: (option: T) => string }>()
const selected = defineModel<string>({ default: '' })
</script>

<template>
  <SelectRoot v-model="selected">
    <SelectTrigger
      flex="~ items-center justify-between" border="~ input" rounded-8 bg-background px-12 py-8 text="12 start placeholder:muted-foreground" disabled:cursor-not-allowed disabled:op-50 focus:outline-none focus:ring-2 ring="hocus:2 hocus:offset-2 hocus:ring offset-background" aria-label="Filtrar" v-bind="$attrs"
    >
      <SelectValue placeholder="Sin filtrar">
        {{ valueLabel(selected || '') }}
      </SelectValue>
      <Icon name="ph:caret-down-duotone" size-16 shrink-0 text-foreground op-50 />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        relative z-50 max-h-384 min-h-128 of-hidden border rounded-8 bg-popover text-popover-foreground shadow-md
        class="data-[state=closed]:animate-out data-[state=open]:animate-in data-[side=bottom]:translate-y-1 data-[side=right]:translate-x-4 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-8 data-[side=left]:slide-in-from-right-8 data-[side=right]:slide-in-from-left-8 data-[side=top]:slide-in-from-bottom-8 data-[side=left]:-translate-x-4 data-[side=top]:-translate-y-4"
      >
        <SelectScrollUpButton flex="~ items-center justify-center" cursor-default py-4>
          <Icon name="ph:caret-up-duotone" text-16 />
        </SelectScrollUpButton>
        <SelectViewport h="$radix-select-trigger-height" w-full p-4 min-w="$radix-select-trigger-width">
          <SelectItem v-for="option, i in options" :key="i" :value="valueKey(option)" flex="~ items-center " text="12 hocus:accent-foreground" relative w-full cursor-default select-none rounded-4 py-6 pl-32 pl-8 pr-2 pr-8 outline-none focus:bg-accent class="data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <span absolute left-2 text-14 flex="~ items-center justify-center">
              <SelectItemIndicator>
                <Icon name="ph:check-duotone" text-16 />
              </SelectItemIndicator>
            </span>
            <SelectItemText ml-16>
              <slot name="option" :option="option" />
            </SelectItemText>
          </SelectItem>
        </SelectViewport>
        <SelectScrollDownButton flex="~ items-center justify-center" cursor-default py-4>
          <Icon name="ph:caret-down-duotone" text-16 />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
