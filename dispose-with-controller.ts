/**
 * Creates a disposal controller that manages a set of disposal callbacks.
 * These callbacks can be either synchronous or asynchronous.
 * The controller provides methods to add disposal callbacks and to
 * execute them synchronously or asynchronously.
 *
 * @returns {Object} A disposal controller with the following properties:
 * - `add(cb: () => void | Promise<void>): void`:
 *   Adds a disposal callback to the controller. The callback can be
 *   either a synchronous function returning `void` or an asynchronous
 *   function returning a `Promise<void>`.
 * - `[Symbol.dispose](): void`:
 *   Synchronously executes all registered disposal callbacks.
 * - `[Symbol.asyncDispose](): Promise<void>`:
 *   Asynchronously executes all registered disposal callbacks, awaiting
 *   the completion of each.
 *
 * @example
 * const controller = disposeWithController();
 *
 * // Adding a synchronous dispose callback
 * controller.add(() => {
 *   console.log('Synchronous cleanup');
 * });
 *
 * // Adding an asynchronous dispose callback
 * controller.add(async () => {
 *   console.log('Asynchronous cleanup start');
 *   await new Promise(resolve => setTimeout(resolve, 1000));
 *   console.log('Asynchronous cleanup end');
 * });
 *
 * // Synchronous disposal
 * controller[Symbol.dispose]();
 *
 * // Asynchronous disposal
 * await controller[Symbol.asyncDispose]();
 */
export const disposeWithController = () => {
  const disposes = new Set<() => void | Promise<void>>();

  return {
    add: (cb: () => void | Promise<void>) => {
      disposes.add(cb);
    },
    [Symbol.dispose]() {
      for (const dispose of disposes) {
        dispose();
      }
    },
    async [Symbol.asyncDispose]() {
      for (const dispose of disposes) {
        await dispose();
      }
    },
  };
};
