<script setup lang="ts">
interface Props {
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "time" | "email" | "tel";
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", props.type === "number" ? Number(target.value) : target.value);
};
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-semibold text-gray-800 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
      class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 placeholder-gray-400 outline-none focus:border-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
</template>
