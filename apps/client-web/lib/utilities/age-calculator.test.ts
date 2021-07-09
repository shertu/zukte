import {calculateAgeFromBirthdate} from './age-calculator';

test('How old am I?', () => {
  const dateOfBirth: Date = new Date('1996-10-06');
  expect(calculateAgeFromBirthdate(dateOfBirth)).toEqual(24);
});
