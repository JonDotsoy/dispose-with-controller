# dispose-with-controller

A utility to manage and execute disposal callbacks, supporting both synchronous and asynchronous disposal.

## Installation

You can install this package using npm:

```bash
npm install dispose-with-controller
```

## Usage

Here's an example of how to use the `dispose-with-controller`:

```ts
import { disposeWithController } from "dispose-with-controller";

await using controller = disposeWithController();

// Adding a synchronous dispose callback
controller.add(() => {
  console.log("Synchronous cleanup");
});

// Adding an asynchronous dispose callback
controller.add(async () => {
  console.log("Asynchronous cleanup start");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Asynchronous cleanup end");
});
```

# API Documentation

## `DisposeWithController`

Class to manage and execute disposal callbacks, supporting both synchronous and asynchronous disposal.

### Constructor

#### `new DisposeWithController(init?: (OnDispose | OnAsyncDispose)[])`

Initializes a new instance of the `DisposeWithController` class.

- **Parameters:**
  - `init` (optional): An array of disposal callbacks (either synchronous or asynchronous) to initialize the controller with.

### Properties

#### `disposed`

Returns a boolean indicating whether the controller has been disposed.

- **Type:** `boolean`
- **Description:** True if the controller has been disposed; otherwise, false.

### Methods

#### `add(disposableOrAdopt: DisposableOrOnDispose): void`

Adds a disposal callback or an object implementing dispose/asyncDispose methods to the controller.

- **Parameters:**

  - `disposableOrAdopt`: A disposal callback or an object with `Symbol.dispose` or `Symbol.asyncDispose` methods.

- **Description:** Adds a disposal callback to the controller. If the provided argument is a function, it is added directly to the `disposes` set. If it is an object implementing `Symbol.dispose` or `Symbol.asyncDispose`, the respective method is added to the `disposes` set as a callback function.

#### `dispose(): void`

Synchronously executes all registered disposal callbacks. Alias for `[Symbol.dispose]()`.

- **Description:** Calls the synchronous dispose method, executing all registered disposal callbacks.

#### `asyncDispose(): Promise<void>`

Asynchronously executes all registered disposal callbacks. Alias for `[Symbol.asyncDispose]()`.

- **Description:** Calls the asynchronous dispose method, executing all registered disposal callbacks and awaiting their completion.

#### `[Symbol.dispose](): void`

Synchronously executes all registered disposal callbacks.

- **Description:** Iterates over the `disposes` set and calls each disposal callback. Sets the `#disposed` property to `true` after all callbacks are executed.

#### `[Symbol.asyncDispose](): Promise<void>`

Asynchronously executes all registered disposal callbacks, awaiting the completion of each.

- **Description:** Iterates over the `disposes` set and calls each disposal callback, awaiting their completion. Sets the `#disposed` property to `true` after all callbacks are executed.

## `disposeWithController`

Creates a disposal controller that manages a set of disposal callbacks. These callbacks can be either synchronous or asynchronous. The controller provides methods to add disposal callbacks and to execute them synchronously or asynchronously.

### Function

#### `disposeWithController(init?: (OnDispose | OnAsyncDispose)[]): DisposeWithController`

Creates a new `DisposeWithController` instance.

- **Parameters:**

  - `init` (optional): An array of disposal callbacks (either synchronous or asynchronous) to initialize the controller with.

- **Returns:**
  - `DisposeWithController`: A disposal controller instance.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Jonathan Delgado <hi@jon.soy> (https://jon.soy)
