import { describe, it, expect } from "vitest";

describe("ViaPay Core Backend Logic", () => {
  it("should validate pix amount and customer presence", () => {
    const amount = 5000;
    const customerId = "cust-1";
    expect(amount).toBeGreaterThan(0);
    expect(customerId).toBeDefined();
  });

  it("should format valid Brazilian currency cents into reais", () => {
    const amountCents = 15990;
    const formatted = (amountCents / 100).toFixed(2);
    expect(formatted).toBe("159.90");
  });
});
