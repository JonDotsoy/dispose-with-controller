import { test, expect } from "bun:test";
import { disposeWithController } from "./dispose-with-controller";

test("should execute synchronous disposal callback when disposed", () => {
  let closed = false;
  {
    using controller = disposeWithController();
    controller.add(() => {
      closed = true;
    });
  }

  expect(closed).toBeTrue();
});

test("should call [Symbol.dispose] method of an object when disposed", () => {
  const obj = new (class {
    closed = false;

    [Symbol.dispose]() {
      this.closed = true;
    }
  })();

  {
    using controller = disposeWithController();
    controller.add(obj);
  }

  expect(obj.closed).toBeTrue();
});

test("should execute asynchronous disposal callback when async disposed", async () => {
  let closed = false;
  {
    await using controller = disposeWithController();
    controller.add(async () => {
      await new Promise((r) => setTimeout(r, 10));
      closed = true;
    });
  }

  expect(closed).toBeTrue();
});

test("should call [Symbol.asyncDispose] method of an object when async disposed", async () => {
  const obj = new (class {
    closed = false;

    async [Symbol.asyncDispose]() {
      await new Promise((r) => setTimeout(r, 10));
      this.closed = true;
    }
  })();

  {
    await using controller = disposeWithController();
    controller.add(obj);
    expect(obj.closed).toBeFalse();
  }

  expect(obj.closed).toBeTrue();
});

test("should immediately call [Symbol.asyncDispose] method when asyncDispose is called directly", async () => {
  const obj = new (class {
    closed = false;

    async [Symbol.asyncDispose]() {
      await new Promise((r) => setTimeout(r, 10));
      this.closed = true;
    }
  })();

  {
    await using controller = disposeWithController();
    controller.add(obj);
    await controller.asyncDispose();
    expect(obj.closed).toBeTrue();
  }

  expect(obj.closed).toBeTrue();
});

test("should not call [Symbol.asyncDispose] method if disposed manually", async () => {
  const obj = new (class {
    closed = false;

    async [Symbol.asyncDispose]() {
      await new Promise((r) => setTimeout(r, 10));
      this.closed = true;
    }
  })();

  {
    await using controller = disposeWithController();
    controller.add(obj);
    controller.delete(obj);
  }

  expect(obj.closed).toBeFalse();
});
