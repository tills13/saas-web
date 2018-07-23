import Relay from "react-relay/classic"

declare module "recompose" {
  interface RelayContainerComponentEnhancer<TInner, TOutter> {
    (component: React.ComponentType<TInner>): Relay.RelayContainerClass<TOutter>
  }

  interface SetStateCallback<T = any> {
    (newState: T, callback?: () => void): void;
  }

  // export function compose<TInner = any, TOutter = any>(...functions: Function[]): ComponentEnhancer<TInner, TOutter>
  export function compose<TInner = any, TOutter = any>(
    enhancer: RelayContainerComponentEnhancer<any, any>,
    ...functions: Function[]
  ): RelayContainerComponentEnhancer<TInner, TOutter>
}
