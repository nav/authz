// https://stackoverflow.com/a/39835908/225548
export const pluralize = (count, noun, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;
