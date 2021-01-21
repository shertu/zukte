import {calculateAgeFromBirthdate} from '../../utilities/AgeCalculator';

test('How old am I?', () => {
  const dateOfBirth: Date = new Date('1996-10-06');
  expect(calculateAgeFromBirthdate(dateOfBirth)).toBe(24);
});
