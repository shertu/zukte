/**
 * Calculates the current age for the specified birth date.
 *
 * @param {Date} dateOfBirth
 * @return {number}
 */
export function calculateAgeFromBirthdate(dateOfBirth: Date): number {
  const dateToday: Date = new Date();
  let age: number = dateToday.getFullYear() - dateOfBirth.getFullYear();
  const m = dateToday.getMonth() - dateOfBirth.getMonth();
  if (m < 0 || (m === 0 && dateToday.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
}
