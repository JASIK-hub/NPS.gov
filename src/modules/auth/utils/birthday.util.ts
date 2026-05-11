export function getBirthdayFromIin(iin: string): Date | null {
  if (!/^\d{12}$/.test(iin)) return null;

  const yearShort = iin.substring(0, 2);
  const month = parseInt(iin.substring(2, 4)) - 1;
  const day = parseInt(iin.substring(4, 6));
  const centuryDigit = parseInt(iin.charAt(6));

  let yearPrefix = "";
  switch (centuryDigit) {
    case 1: case 2:
      yearPrefix = "18";
      break;
    case 3: case 4:
      yearPrefix = "19";
      break;
    case 5: case 6:
      yearPrefix = "20";
      break;
    default:
      yearPrefix = parseInt(yearShort) > 30 ? "19" : "20"; 
  }

  const fullYear = parseInt(`${yearPrefix}${yearShort}`);

  const date = new Date(Date.UTC(fullYear, month, day));

  if (
    date.getUTCFullYear() === fullYear &&
    date.getUTCMonth() === month &&
    date.getUTCDate() === day
  ) {
    return date;
  }

  return null;
}