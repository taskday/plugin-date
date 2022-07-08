<template>
  <span>
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
          <option value="">Not repeated</option>
          <option value="days">Daily</option>
          <option value="weeks">Weekly</option>
          <option value="months">Monthly</option>
          <option value="years">Yearly</option>
        </VFormSelect>
      </VDropdownItems>
    </VDropdown>
  </span>
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

interface State {
  version: 1;
  start: number;
  ending: null | string;
  frequency: null | "days" | "weeks" | "months" | "years";
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
        try {
          return JSON.parse(state.value);
        } catch {
          return {
            version: 1,
            start: 0,
            ending: null,
            frequency: null,
          };
        }
      })()
    );

    const formatted = ref("");
    const start = ref("");
    const frequency = ref<string|null>("");

    const nextDate = (start: number|null, frequency: string|null) => {
      if (!start || !frequency || isNaN(start)) {
        return null;
      }

      let date = timestampToDate(start);

      if (['days', 'weeks', 'months', 'years'].includes(frequency)) {
        while (
          Temporal.PlainDate.compare(date, Temporal.Now.plainDateISO()) < 0
        ) {
          date = date.add(Temporal.Duration.from({ [frequency]: 1 }));
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

      if (data.value.start && !isNaN(data.value.start)) {
        start.value = timestampToDate(data.value.start).toString();
      }
    });

    function timestampToDate(timestamp: number) {
      return new Temporal.Instant(
        BigInt(timestamp) * BigInt(1000000)
      )
        .toZonedDateTimeISO(Temporal.Now.timeZone())
        .toPlainDate();
    }

    function saveData() {
      if (typeof data.value !== "object") {
        data.value = { version: 1, start: 0, ending: null, frequency: null };
      }
      
      if (start.value) {
        data.value.start = new Date(start.value).getTime();
      }

      if (['days', 'weeks', 'months', 'years'].includes(frequency.value)) {
        data.value.frequency = <typeof data.value.frequency> frequency.value;
      } else {
        data.value.frequency = null;
      }

      if (state.value !== JSON.stringify(data.value)) {
        state.value = JSON.stringify(data.value);
        onChange();
      }
    }

    function updateFormat() {
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

        if ((['days', 'weeks', 'months', 'years'].includes(data.value.frequency ?? ''))) {
          date = nextDate(data.value.start, data.value.frequency) || date;
        }
        0
        formatted.value = formatter.format(date);
    }

    return { start, frequency, formatted, timestampToDate };
  },
});
</script>
