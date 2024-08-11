export function getInitLocale(): string {
  if (navigator.language.toUpperCase().startsWith("EN")) {
    return "en";
  } else if (navigator.language.toUpperCase() === "DE-CH") {
    return "ch";
  } else if (navigator.language.toUpperCase().startsWith("DE")) {
    return "de";
  } else {
    return "en";
  }
}
