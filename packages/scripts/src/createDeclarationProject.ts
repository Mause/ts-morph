import { IndentationText, NewLineKind, Project } from "ts-morph";
import { printDiagnostics } from "./utils";

export interface CreateDeclarationProjectOptions {
  tsConfigFilePath: string;
}

export function createDeclarationProject(opts: CreateDeclarationProjectOptions) {
  const project = new Project({
    tsConfigFilePath: opts.tsConfigFilePath,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      newLineKind: NewLineKind.LineFeed,
    },
    compilerOptions: {
      declaration: true,
    },
  });

  const emitResult = project.emitToMemory({ emitOnlyDtsFiles: true });

  if (emitResult.getDiagnostics().length > 0) {
    printDiagnostics(emitResult.getDiagnostics());
    process.exit(1);
  }

  const declarationProject = new Project({
    tsConfigFilePath: opts.tsConfigFilePath,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      newLineKind: NewLineKind.LineFeed,
    },
    skipAddingFilesFromTsConfig: true,
  });

  for (const file of emitResult.getFiles())
    declarationProject.createSourceFile(file.filePath, file.text, { overwrite: true });

  return declarationProject;
}
