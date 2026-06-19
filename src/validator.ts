/**
 * anvl-template-sdk — validator.ts
 * Validates a template directory before submission.
 */
import fs from "fs";
import path from "path";
import { TemplateManifestSchema, REQUIRED_CSS_VARS } from "./schema";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTemplate(templateDir: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. manifest.json
  const manifestPath = path.join(templateDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    errors.push("Missing manifest.json");
    return { valid: false, errors, warnings };
  }

  let manifest: unknown;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    errors.push("manifest.json is not valid JSON");
    return { valid: false, errors, warnings };
  }

  const parsed = TemplateManifestSchema.safeParse(manifest);
  if (!parsed.success) {
    parsed.error.errors.forEach((e) => errors.push(`manifest: ${e.path.join(".")} — ${e.message}`));
  }

  // 2. Required files
  const required = ["index.html", "style.css", "template.js", "preview.png"];
  required.forEach((f) => {
    if (!fs.existsSync(path.join(templateDir, f))) {
      errors.push(`Missing required file: ${f}`);
    }
  });

  // 3. CSS vars check
  const cssPath = path.join(templateDir, "style.css");
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, "utf8");
    REQUIRED_CSS_VARS.forEach((v) => {
      if (!css.includes(v)) {
        warnings.push(`style.css does not use CSS variable ${v} — user color customization may not work`);
      }
    });
  }

  // 4. ANVL_DATA usage check
  const jsPath = path.join(templateDir, "template.js");
  if (fs.existsSync(jsPath)) {
    const js = fs.readFileSync(jsPath, "utf8");
    if (!js.includes("ANVL_DATA")) {
      warnings.push("template.js does not reference window.ANVL_DATA — template may not render coin data");
    }
  }

  // 5. preview.png dimensions warning (can't check without canvas, just size)
  const previewPath = path.join(templateDir, "preview.png");
  if (fs.existsSync(previewPath)) {
    const size = fs.statSync(previewPath).size;
    if (size > 500 * 1024) warnings.push("preview.png is over 500KB — consider compressing it");
    if (size < 1024) errors.push("preview.png appears to be empty or corrupt");
  }

  return { valid: errors.length === 0, errors, warnings };
}
