<script setup lang="ts">
interface Option {
  value: string | number;
  label: string;
}

interface Props {
  modelValue: string | number;
  options: Option[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  placeholder: "Seleccione...",
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-semibold text-gray-800 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="handleChange"
      class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 outline-none focus:border-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
