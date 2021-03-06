import {
  getSettings as editorSupportGetSettings,
  JestSettings,
  Options,
  ProjectWorkspace,
  Runner,
} from "jest-editor-support";
import { ProjectConfig } from "../repo";

const getSettings = (projectConfig: ProjectConfig): Promise<JestSettings> => {
  return editorSupportGetSettings(convertToWorkspace(projectConfig));
};

const createRunner = (projectConfig: ProjectConfig, options: Options) => {
  return new Runner(convertToWorkspace(projectConfig), options);
};

const convertToWorkspace = (projectConfig: ProjectConfig): ProjectWorkspace => {
  let jestCommand = projectConfig.jestCommand;
  let pathToConfig: string;

  if (projectConfig.jestConfig) {
    // jest config file exists.
    // quote the config file in case there is space chars.
    pathToConfig = `"${projectConfig.jestConfig}"`;
  } else {
    // no jest config file.
    // set pathToConfig to undefined.  This is a type error that should be fixed in jest-editor-support.
    pathToConfig = (undefined as unknown) as string;
  }

  // set the pathToJest to the Jest executable name and set the root path to the Jest executable folder.
  // jest-editor-support will use the root path for the cwd and pathToJest as the command of the process to get Jest
  // settings.  This overcomes issues with whitespace in the path of the command too.
  return {
    localJestMajorVersion: 20,
    pathToConfig,
    pathToJest: jestCommand,
    rootPath: projectConfig.jestExecutionDirectory,
  };
};

export { createRunner, getSettings };
