import { randomBytes } from "crypto";

export const generateIdentificationNo = () => {
  const randomValue = randomBytes(5).readUIntBE(0, 5);
  const uniquePart = Date.now() + randomValue;
  const randomNumber = uniquePart.toString().slice(-10).padStart(10, "0");
  return `#${randomNumber}`;
};
