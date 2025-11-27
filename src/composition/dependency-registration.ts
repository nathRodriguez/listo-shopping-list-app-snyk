import { Container } from "inversify";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DEPENDENCIES } from "./dependencies";

export function registerDependencies(container: Container) {
  registerDomainDependencies(container);
  registerApplicationDependencies(container);
  registerInfrastructureDependencies(container);
  registerPresentationDependencies(container);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function registerDomainDependencies(container: Container) {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function registerApplicationDependencies(container: Container) {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function registerInfrastructureDependencies(container: Container) {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function registerPresentationDependencies(container: Container) {}
