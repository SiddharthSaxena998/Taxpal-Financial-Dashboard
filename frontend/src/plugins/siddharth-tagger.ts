import type { Plugin } from "vite";

export function siddharthTagger(): Plugin {
  return {
    name: "siddharth-tagger",
    enforce: "pre",
    transform(code, id) {
      if (!id.match(/\.(jsx|tsx)$/)) return;

      const tagComment = `/* Tagged by Siddharth Tagger: ${id.split("/").pop()} */\n`;
      return {
        code: tagComment + code,
        map: null,
      };
    },
  };
}