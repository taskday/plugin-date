<template>
  <ViewField v-if="readonly" :value="value" />
  <EditField v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import EditField from "./EditField.vue";
import ViewField from "./ViewField.vue";

export default defineComponent({
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: false,
    },
  },
  components: {
    ViewField,
    EditField,
  },
});
</script>
