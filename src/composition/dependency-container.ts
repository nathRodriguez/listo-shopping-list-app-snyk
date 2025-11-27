import { Container } from "inversify";
import { registerDependencies } from "./dependency-registration";
import { Dependency } from "./dependencies";

export class DependencyContainer {
  private readonly _container: Container;

  constructor() {
    this._container = new Container({
      defaultScope: "Singleton",
    });

    this.registerAllDependencies();
  }

  private registerAllDependencies() {
    registerDependencies(this._container);
  }

  public get<T>(dependency: Dependency): T {
    return this._container.get<T>(dependency);
  }
}
