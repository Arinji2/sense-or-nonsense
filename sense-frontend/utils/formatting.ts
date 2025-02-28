//"DD-Jan, YYYY"
export function FormatDate1(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
//DD/MM
export function FormateDateDDMM(date: Date) {
  let day = date.toLocaleDateString("en-US", { day: "2-digit" });
  let month = date.toLocaleDateString("en-US", { month: "2-digit" });
  return `${day}/${month}`;
}
export function NameFormat(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
