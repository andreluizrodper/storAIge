<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="`'w-[280px] justify-start text-left font-normal',
            ${!value && 'text-muted-foreground'}`"
      >
        <CalendarIcon class="md:mr-2 h-4 w-4" />
        <div class="hidden md:flex">
          <template v-if="value.start">
            <template v-if="value.end">
              {{ dateStartFormated }} -
              {{ dateEndFormated }}
            </template>

            <template v-else>
              {{ dateStartFormated }}
            </template>
          </template>
          <template v-else> Pick a date </template>
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="w-auto p-0">
      <RangeCalendar
        v-model="value"
        initial-focus
        :number-of-months="2"
        @update="($event) => $emit('update', $event)"
      />
    </PopoverContent>
  </Popover>
</template>

<script>
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

import { Calendar as CalendarIcon } from "lucide-vue-next";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default {
  emits: ["updateDates"],
  props: {
    dateStart: {
      type: Date,
      default: () => DateTime.now().startOf("week").toJSDate(),
    },
    dateEnd: {
      type: Date,
      default: () => DateTime.now().endOf("week").toJSDate(),
    },
  },
  watch: {
    value() {
      if (!this.value.start || !this.value.end) return;
      this.$emit("updateDates", {
        start: DateTime.fromISO(this.value.start?.toString() ?? ""),
        end: DateTime.fromISO(this.value.end?.toString() ?? ""),
      });
    },
  },
  components: {
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button,
    CalendarIcon,
    RangeCalendar,
  },
  computed: {
    dateStartFormated() {
      return this.df.format(
        new CalendarDate(
          this.dateStart.getFullYear(),
          this.dateStart.getMonth() + 1,
          this.dateStart.getDate()
        ).toDate(getLocalTimeZone())
      );
    },
    dateEndFormated() {
      return this.df.format(
        new CalendarDate(
          this.dateEnd.getFullYear(),
          this.dateEnd.getMonth() + 1,
          this.dateEnd.getDate()
        ).toDate(getLocalTimeZone())
      );
    },
  },
  data() {
    return {
      df: new DateFormatter("pt-BR", {
        dateStyle: "medium",
      }),
      value: {
        start: new CalendarDate(
          this.dateStart.getFullYear(),
          this.dateStart.getMonth() + 1,
          this.dateStart.getDate()
        ),
        end: new CalendarDate(
          this.dateEnd.getFullYear(),
          this.dateEnd.getMonth() + 1,
          this.dateEnd.getDate()
        ),
      },
    };
  },
};
</script>
