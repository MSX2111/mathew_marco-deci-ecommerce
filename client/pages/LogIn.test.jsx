import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LogIn from "./LogIn.jsx";

describe("LogIn Component", () => {
  test("renders login form inputs and submit button", () => {
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("submits login form successfully and completes request", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole("button", { name: /log in/i });

    // Fill out form fields
    await user.type(screen.getByPlaceholderText(/email/i), "user@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "Password123!");

    // Submit form
    await user.click(submitButton);

    // Verify loading finishes and button resets
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByText(/one moment\.\.\./i)).not.toBeInTheDocument();
    });
  });
});
