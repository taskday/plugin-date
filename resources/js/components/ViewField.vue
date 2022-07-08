<script lang="ts" setup>
import { Temporal, Intl } from "@js-temporal/polyfill";
import { onMounted, ref } from "vue";

let props = defineProps<{ value: string | null }>();

const data = ref<State>(JSON.parse(props.value ?? 'null'));
const formatted = ref("-");

function timestampToDate(timestamp: number) {
  return new Temporal.Instant(BigInt(timestamp) * BigInt(1000000))
    .toZonedDateTimeISO(Temporal.Now.timeZone())
    .toPlainDate();
}

function updateFormat() {
  if (props.value) {

    if (!data.value.start || isNaN(data.value.start)) {
      formatted.value = "-";
      return;
    }

    let formatter = new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      weekday: "short",
      month: "short",
      timeZone: Temporal.Now.timeZone(),
    });

    let date = timestampToDate(data.value.start);

    formatted.value = formatter.format(date);
  }
}

onMounted(() => {
  updateFormat()
}) 
</script>

<template>
  <span>
    {{ formatted }} {{ data.frequency ? `every ${data.frequency}` : '' }}
  </span>
</template>
