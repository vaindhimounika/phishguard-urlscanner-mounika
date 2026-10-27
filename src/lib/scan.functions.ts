import { createServerFn } from "@tanstack/react-start";
import { analyze } from "./engine";

export const scanUrl = createServerFn({ method: "POST" })
  .inputValidator((d: { url: string }) => {
    if (typeof d?.url !== "string" || d.url.length < 3 || d.url.length > 2048) throw new Error("Invalid URL");
    return d;
  })
  .handler(async ({ data }) => {
    try {
      return analyze(data.url);
    } catch {
      throw new Error("Could not parse that URL");
    }
  });
