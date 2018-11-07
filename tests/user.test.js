import { getFirstName, isValidPassword } from "../src/utils/user";

test("Should return firstName given fullName", () => {
  const firstName = getFirstName("Ander Mira");

  expect(firstName).toBe("Ander");
});

test("Should return firstName given firstName", () => {
  const firstName = getFirstName("Ander");

  expect(firstName).toBe("Ander");
});

test("Should reject password shorter than 8 characters", () => {
  const isValid = isValidPassword("lala");

  expect(isValid).toBe(false);
});

test("Should reject password that contains the word password", () => {
  const isValid = isValidPassword("{Passwordgoo");

  expect(isValid).toBe(false);
});

test("Should correctly validate a valid password", () => {
  const isValid = isValidPassword("christianboobobo");

  expect(isValid).toBe(true);
});
