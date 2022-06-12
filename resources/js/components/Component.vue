<template>
  <div>
    <VDropdown>
      <VDropdownButton
        class="text-sm text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
      >
        <span :key="start">{{ formatted }}</span>
      </VDropdownButton>
      <VDropdownItems align="bottom-start">
        <VFormInput
          type="date"
          v-model="start"
        />
        <VFormSelect v-model="frequency" class="mt-2">
          <option value="days">Daily</option>
          <option value="weeks">Weekly</option>
          <option value="months">Monthly</option>
          <option value="years">Monthly</option>
        </VFormSelect>
      </VDropdownItems>
    </VDropdown>
  </div>
</template>

<script lang="ts">
import { Temporal, Intl } from "@js-temporal/polyfill";
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  useField,
  VDropdown,
  VDropdownButton,
  VDropdownItems,
  VDropdownItem,
  VTabs,
  VTabsList,
  VTabItem,
  VTabsPanels,
  VTabsPanel,
  VFormInput,
  VFormSelect,
} from "taskday";
import { computed } from "@vue/reactivity";

interface State {
  version: 1;
  start: number;
  ending: null | string;
  frequency: "days" | "weeks" | "months" | "years";
}

export default defineComponent({
  components: {
    VDropdown,
    VDropdownButton,
    VDropdownItems,
    VDropdownItem,
    VTabs,
    VTabsList,
    VTabItem,
    VTabsPanels,
    VTabsPanel,
    VFormInput,
    VFormSelect,
  },
  setup() {
    const { state, onChange } = useField();

    const data = ref<State>(
      (() => {
        return JSON.parse(state.value);
      })()
    );

    const formatted = ref("");
    const start = ref("");
    const frequency = ref("");

    const nextDate = (start: number|null) => {
      if (!start) {
        return null;
      }

      let date = new Temporal.Instant(
        BigInt(start) * BigInt(1000000)
      )
        .toZonedDateTimeISO(Temporal.Now.timeZone())
        .toPlainDate();

      if (['days', 'weeks', 'months', 'years'].includes(data.value.frequency)) {
        while (
          Temporal.PlainDate.compare(date, Temporal.Now.plainDateISO()) < 0
        ) {
          date = date.add(Temporal.Duration.from({ [data.value.frequency]: 1 }));
        }
      }

      return date;
    };

    watch(() => frequency.value, () =>{
      saveData();
      updateFormat();
    })

    watch(
      () => start.value,
      () => {
        saveData();
        updateFormat();
      }
    );

    onMounted(() => {
      frequency.value = data.value.frequency;
      start.value = new Temporal.Instant(
        BigInt(data.value.start) * BigInt(1000000)
      )
        .toZonedDateTimeISO(Temporal.Now.timeZone())
        .toPlainDate()
        .toString();
    });

    function saveData() {
      if (typeof data.value !== "object") {
        data.value = { version: 1, start: 0, ending: null, frequency: "days" };
      }
      data.value.start = new Date(start.value).getTime();
      data.value.frequency = frequency.value as any;
      state.value = JSON.stringify(data.value);
      onChange();
    }

    function updateFormat() {
        if (!data.value.start || !(['days', 'weeks', 'months', 'years'].includes(data.value.frequency)) ) {
          return "-";
        }

        let formatter = new Intl.DateTimeFormat(undefined, {
          day: "numeric",
          weekday: "short",
          month: "short",
          timeZone: Temporal.Now.timeZone(),
        });

        formatted.value = formatter.format(nextDate(data.value.start));
    }

    return { start, frequency, formatted };
  },
});
</script>
