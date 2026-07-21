import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignUp from "./SignUp.jsx";

describe("SignUp Component", () => {
  test("renders signup form inputs and submit button", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  test("submits form and completes registration without remaining in loading state", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole("button", { name: /sign up/i });

    // Fill form fields
    await user.type(screen.getByPlaceholderText(/name/i), "Jane Doe");
    await user.type(
      screen.getByPlaceholderText(/email/i),
      "newuser@example.com",
    );
    await user.type(screen.getByPlaceholderText(/password/i), "Password123!");

    // Submit form
    await user.click(submitButton);

    // Verify the loading state finishes and button re-enables
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByText(/one moment\.\.\./i)).not.toBeInTheDocument();
    });
  });
});
