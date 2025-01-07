const fs = require("fs");
const { execSync } = require("child_process");

const packageJson = require("./package.json");

const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

const getLatestVersion = (pkg) => {
  try {
    const version = execSync(`npm show ${pkg} version`).toString().trim();
    return version;
  } catch (error) {
    console.error(`Failed to fetch version for ${pkg}:`, error.message);
    return null;
  }
};

const updateDependencies = (deps) => {
  const updatedDeps = {};
  for (const [pkg, version] of Object.entries(deps)) {
    const latestVersion = getLatestVersion(pkg);
    if (latestVersion) {
      updatedDeps[pkg] = `^${latestVersion}`;
      console.log(`Updated ${pkg} to version ^${latestVersion}`);
    } else {
      updatedDeps[pkg] = version; // Keep the original version if fetch fails
    }
  }
  return updatedDeps;
};

packageJson.dependencies = updateDependencies(dependencies);
packageJson.devDependencies = updateDependencies(devDependencies);

fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
console.log("Dependencies updated successfully in package.json");
