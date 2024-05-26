export type OnDispose = {
  (): void;
};

export type OnAsyncDispose = {
  (): Promise<void>;
};

export type Disposable = {
  [Symbol.dispose](): void;
};

export type AsyncDisposable = {
  [Symbol.asyncDispose](): Promise<void>;
};

export type DisposableOrOnDispose =
  | Disposable
  | AsyncDisposable
  | OnDispose
  | OnAsyncDispose;

export class DisposeWithController {
  #disposed = false;
  disposes: Set<OnDispose | OnAsyncDispose>;

  /**
   * Initializes a new instance of the DisposeWithController class.
   *
   * @param {Array<OnDispose | OnAsyncDispose>} [init] - Optional initial array of disposal callbacks.
   */
  constructor(init?: (OnDispose | OnAsyncDispose)[]) {
    this.disposes = new Set<OnDispose | OnAsyncDispose>(init);
  }

  /**
   * Gets whether the controller has been disposed.
   *
   * @returns {boolean} True if the controller has been disposed; otherwise, false.
   */
  get disposed() {
    return this.#disposed;
  }

  /**
   * Adds a disposal callback or an object implementing dispose/asyncDispose methods to the controller.
   *
   * @param {DisposableOrOnDispose} disposableOrAdopt - A disposal callback or an object with dispose/asyncDispose methods.
   */
  add = (disposableOrAdopt: DisposableOrOnDispose) => {
    if (typeof disposableOrAdopt === "function")
      this.disposes.add(disposableOrAdopt);

    if (
      Symbol.dispose in disposableOrAdopt &&
      typeof disposableOrAdopt[Symbol.dispose] === "function"
    )
      this.disposes.add(() => disposableOrAdopt[Symbol.dispose]());

    if (
      Symbol.asyncDispose in disposableOrAdopt &&
      typeof disposableOrAdopt[Symbol.asyncDispose] === "function"
    )
      this.disposes.add(() => disposableOrAdopt[Symbol.asyncDispose]());
  };

  /**
   * Synchronously executes all registered disposal callbacks.
   * Alias for [Symbol.dispose]().
   */
  dispose() {
    return this[Symbol.dispose]();
  }

  /**
   * Asynchronously executes all registered disposal callbacks.
   * Alias for [Symbol.asyncDispose]().
   */
  asyncDispose() {
    return this[Symbol.asyncDispose]();
  }

  /**
   * Synchronously executes all registered disposal callbacks.
   */
  [Symbol.dispose]() {
    for (const dispose of this.disposes) {
      dispose();
    }
    this.#disposed = true;
  }

  /**
   * Asynchronously executes all registered disposal callbacks, awaiting the completion of each.
   */
  async [Symbol.asyncDispose]() {
    for (const dispose of this.disposes) {
      await dispose();
    }
    this.#disposed = true;
  }
}

/**
 * Creates a disposal controller that manages a set of disposal callbacks.
 * These callbacks can be either synchronous or asynchronous.
 * The controller provides methods to add disposal callbacks and to
 * execute them synchronously or asynchronously.
 *
 * @param {Array<OnDispose | OnAsyncDispose>} [init] - Optional initial array of disposal callbacks.
 * @returns {DisposeWithController} A disposal controller instance.
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
export const disposeWithController = (
  init?: (OnDispose | OnAsyncDispose)[],
) => {
  return new DisposeWithController(init);
};
