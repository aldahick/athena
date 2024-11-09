import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { getModuleDir } from "../packages/utils/src/module-utils.js";

interface PackageInfo {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const getAllDependencies = (pkg: PackageInfo) =>
  Object.keys(pkg.dependencies ?? {}).concat(
    Object.keys(pkg.devDependencies ?? {}),
  );

const getOnlyDependencies = (links: Map<string, string[]>, filter: string) => {
  const filteredDeps = new Set<string>([
    filter.startsWith("@athenajs/") ? filter : `@athenajs/${filter}`,
  ]);
  for (const name of filteredDeps) {
    const linkDeps = links.get(name);
    if (!linkDeps) {
      throw new Error(`Package not found: ${name}`);
    }
    for (const dep of linkDeps) {
      filteredDeps.add(dep);
    }
  }
  return filteredDeps;
};

/**
 * @param filter if provided, only this package and its dependencies will be returned in layers
 * @returns layers of independent packages - i.e. build each layer's packages in parallel
 */
const getDependencyLayers = (
  packages: PackageInfo[],
  filter?: string,
): string[][] => {
  const allPackageNames = new Set(packages.map((p) => p.name));
  // key: package name, value: any linked (Athena) dependencies
  const links = new Map(
    packages.map((pkg) => [
      pkg.name,
      getAllDependencies(pkg).filter((name) => allPackageNames.has(name)),
    ]),
  );
  const packageNames = filter
    ? getOnlyDependencies(links, filter)
    : allPackageNames;

  const layers: string[][] = [];
  const remaining = packages.filter(({ name }) => packageNames.has(name));
  while (remaining.length) {
    const newLayer: string[] = [];
    for (const [index, pkg] of remaining.entries()) {
      const allDependencies = Object.keys(pkg.dependencies ?? {}).concat(
        Object.keys(pkg.devDependencies ?? {}),
      );
      const linkDependencies = allDependencies.filter(
        (name) =>
          packageNames.has(name) &&
          remaining.some((depRemain) => depRemain.name === name),
      );
      if (!linkDependencies.length) {
        newLayer.push(pkg.name);
        remaining.splice(index, 1);
      }
    }
    layers.push(newLayer);
  }
  return layers;
};

const build = async (pkg: { dir: string; info: PackageInfo }) =>
  new Promise<void>((resolve, reject) => {
    const build = spawn("pnpm", ["build"], {
      cwd: pkg.dir,
      // pass stdout/err directly to console
      stdio: "inherit",
    });
    build.on("error", reject);
    build.on("exit", (code) => {
      if (code === 0) {
        console.log(`Built package ${pkg.info.name}`);
        resolve();
      } else {
        reject(
          new Error(
            `Package build for ${pkg.info.name} exited with code ${code}`,
          ),
        );
      }
    });
  });

const main = async ([targetName]: string[]) => {
  const packagesDir = path.resolve(getModuleDir(import.meta), "../packages");
  const packageNames = await fs.readdir(packagesDir);
  const packages = await Promise.all(
    packageNames.map(async (packageName) => ({
      dir: path.join(packagesDir, packageName),
      info: JSON.parse(
        await fs.readFile(
          path.join(packagesDir, packageName, "package.json"),
          "utf8",
        ),
      ) as PackageInfo,
    })),
  );
  const layers = getDependencyLayers(
    packages.map(({ info }) => info),
    targetName,
  );
  const allStart = performance.now();
  for (const layer of layers) {
    await Promise.all(
      layer.map(async (name) => {
        const pkg = packages.find((p) => p.info.name === name);
        if (!pkg) {
          throw new Error(`Package not found: ${name}`);
        }
        console.log(`Building ${name}...`);
        const start = performance.now();
        await build(pkg);
        const end = performance.now();
        console.log(`Built ${name} in ${Math.floor(end - start)}ms`);
      }),
    );
  }
  const duration = ((performance.now() - allStart) / 1000).toFixed(1);
  console.log(`Built all packages in ${duration} seconds`);
};

await main(process.argv.slice(2));
