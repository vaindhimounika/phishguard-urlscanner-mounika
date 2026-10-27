import { describe, expect, it } from "vitest";
import { analyze } from "@/lib/engine";

describe("phishing engine", () => {
  it("flags fake SBI KYC link as dangerous", () => {
    expect(analyze("http://sbi-kyc-update.xyz/login/verify").verdict).toBe("DANGEROUS");
  });
  it("keeps official SBI site safe", () => {
    expect(analyze("https://www.sbi.co.in").verdict).toBe("SAFE");
  });
});
