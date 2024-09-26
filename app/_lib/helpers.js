export function convertDateToLocale(dateString) {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formattedDate;
}
