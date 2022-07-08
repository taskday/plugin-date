interface State {
  version: 1;
  start: number;
  ending: null | string;
  frequency: null | "days" | "weeks" | "months" | "years";
}
