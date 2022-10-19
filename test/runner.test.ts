import path from "path";
import fs from "fs";
import { test, expect } from "vitest";
import { Lox } from "../src/Lox";
import { TestReporter } from "./TestReporter";

export function findFiles(dir: string, ext: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    if (entry.isFile() && entry.name.endsWith(ext)) {
      return [entry.name];
    } else if (entry.isDirectory()) {
      return findFiles(`${dir}/${entry.name}`, ext).map(
        (fileName) => `${entry.name}/${fileName}`
      );
    }

    return [];
  });
}

export const testRunner = (dir: string): void => {
  for (const fileName of findFiles(dir, ".lox")) {
    test(fileName, () => {
      const filePath = `${dir}/${fileName}`;
      const content = fs.readFileSync(filePath, { encoding: "utf8" });

      const spec = { source: "", stdout: "", stderr: "" };
      let target: "source" | "stdout" | "stderr" = "source";

      for (const line of content.split("\n")) {
        if (line.startsWith("-- stdout --")) {
          target = "stdout";
        } else if (line.startsWith("-- stderr --")) {
          target = "stderr";
        } else {
          spec[target] += (spec[target] ? "\n" : "") + line;
        }
      }

      const testReporter = new TestReporter();
      const lox = new Lox(testReporter);
      lox.run(spec.source);

      expect(testReporter.stderr).toBe(spec.stderr);
      expect(testReporter.stdout).toBe(spec.stdout);
    });
  }
};

testRunner(path.join(__dirname, "../", "lox"));
