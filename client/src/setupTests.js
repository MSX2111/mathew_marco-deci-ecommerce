import "@testing-library/jest-dom";
import { server } from "./mocks/server.js";

// 1. Start the mock server before running tests
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// 2. Reset any runtime request handlers added during individual tests
afterEach(() => server.resetHandlers());

// 3. Clean up and close the server after all tests are complete
afterAll(() => server.close());
