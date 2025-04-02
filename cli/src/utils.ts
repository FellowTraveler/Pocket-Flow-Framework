import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Generates a file from a template.
 * @param templateType 'node' or 'flow'
 * @param name The name of the component (e.g., MyNode, MyFlow)
 * @param targetDir The directory where the file should be created
 */
export async function generateFromTemplate(
  templateType: 'node' | 'flow',
  name: string,
  targetDir: string
): Promise<void> {
  const templateFileName = `${templateType}.template.ts`;
  const templatePath = path.resolve(__dirname, '../templates', templateFileName);

  if (!(await fs.pathExists(templatePath))) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  const templateContent = await fs.readFile(templatePath, 'utf-8');

  // Basic PascalCase and camelCase conversion (can be improved)
  const pascalCaseName = name.charAt(0).toUpperCase() + name.slice(1);
  const camelCaseName = name.charAt(0).toLowerCase() + name.slice(1);

  const content = templateContent
    .replace(/{{NodeName}}/g, pascalCaseName) // For Node template
    .replace(/{{nodeName}}/g, camelCaseName)   // For Node template (lowercase variable)
    .replace(/{{FlowName}}/g, pascalCaseName); // For Flow template

  const fileExtension = templateType === 'node' ? '.node.ts' : '.flow.ts';
  const outputFileName = `${pascalCaseName}${fileExtension}`;
  const outputPath = path.resolve(targetDir, outputFileName);

  if (await fs.pathExists(outputPath)) {
    console.warn(`File already exists: ${outputPath}. Skipping.`);
    return;
  }

  await fs.ensureDir(targetDir); // Ensure directory exists
  await fs.writeFile(outputPath, content);
  console.log(`Successfully created ${templateType}: ${outputPath}`);
}
