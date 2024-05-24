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

## API

### `disposeWithController()`

Creates a disposal controller that manages a set of disposal callbacks. These callbacks can be either synchronous or asynchronous.

#### Returns

- **Object**: A disposal controller with the following properties:
  - `add(cb: () => void | Promise<void>): void`: Adds a disposal callback to the controller. The callback can be either a synchronous function returning `void` or an asynchronous function returning a `Promise<void>`.
  - `[Symbol.dispose](): void`: Synchronously executes all registered disposal callbacks.
  - `[Symbol.asyncDispose](): Promise<void>`: Asynchronously executes all registered disposal callbacks, awaiting the completion of each.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Jonathan Delgado <hi@jon.soy> (https://jon.soy)
