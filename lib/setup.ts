import * as childProcess from "child_process";
import * as fs from "fs-extra";

export const NODE_LAMBDA_LAYER_DIR = `${process.cwd()}/bundle`;
export const NODE_LAMBDA_LAYER_RUNTIME_DIR_NAME = "nodejs";

const getModulesInstallDirName = (): string => {
  return `${NODE_LAMBDA_LAYER_DIR}/${NODE_LAMBDA_LAYER_RUNTIME_DIR_NAME}`;
};

const copyPackageJson = (): void => {
  fs.mkdirsSync(getModulesInstallDirName());
  ["package.json", "package-lock.json"].map(file =>
    fs.copyFileSync(
      `${process.cwd()}/${file}`,
      `${getModulesInstallDirName()}/${file}`
    )
  );
};

export const bundleNpm = (): void => {
  copyPackageJson();

  childProcess.execSync(
    `npm --prefix ${getModulesInstallDirName()} install --production`,
    {
      stdio: ["ignore", "ignore", "ignore"],
      env: { ...process.env },
      shell: "bash"
    }
  );
};
