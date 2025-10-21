export default function formatDate(isoString) {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
