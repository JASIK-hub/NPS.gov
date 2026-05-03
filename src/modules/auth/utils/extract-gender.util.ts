import { UserGender } from "src/modules/user/enums/user-gender.enum";

export function extractGenderFromIin(iin: string): UserGender | null {
  if (!iin || iin.length !== 12) return null;

  const genderDigit = parseInt(iin.charAt(6)); 

  if ([1, 3, 5].includes(genderDigit)) {
    return UserGender.MALE;
  } else if ([2, 4, 6].includes(genderDigit)) {
    return UserGender.FEMALE;
  }

  return null;
}