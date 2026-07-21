import { http, HttpResponse } from "msw";

export const handlers = [
  // --- LOGIN HANDLER ---
  http.post(/\/users\/login$/, async ({ request }) => {
    const { email, password } = await request.json();

    if (email === "user@example.com" && password === "Password123!") {
      return HttpResponse.json(
        { id: "user-id-123", isAdmin: false },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }),

  // --- SIGNUP HANDLER ---
  http.post(/\/users\/signup$/, async ({ request }) => {
    const { email } = await request.json();

    if (email === "existing@example.com") {
      return HttpResponse.json(
        { error: "User already exists." },
        { status: 409 },
      );
    }

    return HttpResponse.json(
      { id: "new-user-id-456", isAdmin: false },
      { status: 201 },
    );
  }),
];
