import { DependencyContainer } from "./dependency-container";
import { DEPENDENCIES, Dependency } from "./dependencies";

export const dependencyContainer = new DependencyContainer();

export { DEPENDENCIES };

export const getDependency = <T>(dependency: Dependency): T => {
  return dependencyContainer.get<T>(dependency);
};
