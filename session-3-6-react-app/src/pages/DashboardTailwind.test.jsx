import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { TaskProvider } from "../context/TaskContext";
import DashboardTailwind from "./DashboardTailwind";

const renderWithProviders = component => {
	return render(
		<BrowserRouter>
			<TaskProvider>{component}</TaskProvider>
		</BrowserRouter>
	);
};

describe("DashboardTailwind Integration Tests (Sessions 3-6)", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("renders dashboard heading", () => {
		renderWithProviders(<DashboardTailwind />);
		expect(
			screen.getByRole("heading", { name: /dashboard/i })
		).toBeInTheDocument();
	});

	it("displays welcome message", () => {
		renderWithProviders(<DashboardTailwind />);
		expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
	});

	it("shows New Task button", () => {
		renderWithProviders(<DashboardTailwind />);
		expect(
			screen.getByRole("button", { name: /new task/i })
		).toBeInTheDocument();
	});

	it("displays all stat cards", () => {
		renderWithProviders(<DashboardTailwind />);

		expect(screen.getByText(/total tasks/i)).toBeInTheDocument();
		expect(screen.getByText(/in progress/i)).toBeInTheDocument();
		expect(screen.getByText(/completed/i)).toBeInTheDocument();
		expect(screen.getByText(/completion rate/i)).toBeInTheDocument();
	});

	it("shows sample tasks on initial load", () => {
		renderWithProviders(<DashboardTailwind />);

		// Should have "Recent Tasks" heading
		expect(
			screen.getByRole("heading", { name: /recent tasks/i })
		).toBeInTheDocument();

		// Should have task cards (at least 1 from sample data)
		const taskCards = screen.getAllByRole("button", {
			name: /complete|reopen/i,
		});
		expect(taskCards.length).toBeGreaterThan(0);
	});

	it("opens modal when New Task button is clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		const newTaskButton = screen.getByRole("button", { name: /new task/i });
		await user.click(newTaskButton);

		// Modal should appear
		expect(
			screen.getByRole("heading", { name: /create new task/i })
		).toBeInTheDocument();
	});

	it("creates a new task through modal", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		// Open modal
		await user.click(screen.getByRole("button", { name: /new task/i }));

		// Fill form
		await user.type(screen.getByLabelText(/title/i), "Integration Test Task");
		await user.type(screen.getByLabelText(/description/i), "Test description");
		await user.selectOptions(screen.getByLabelText(/priority/i), "high");

		// Submit
		await user.click(screen.getByRole("button", { name: /create task/i }));

		// New task should appear
		expect(
			await screen.findByText("Integration Test Task")
		).toBeInTheDocument();
	});

	it("toggles task completion", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		// Count Reopen buttons before
		const initialReopenButtons = screen.queryAllByRole("button", {
			name: /^reopen$/i,
		});
		const initialReopenCount = initialReopenButtons.length;

		// Find first Complete button and click it
		const completeButtons = screen.getAllByRole("button", {
			name: /^complete$/i,
		});
		await user.click(completeButtons[0]);

		// Should have one more Reopen button now
		const finalReopenButtons = await screen.findAllByRole("button", {
			name: /^reopen$/i,
		});
		expect(finalReopenButtons.length).toBe(initialReopenCount + 1);
	});

	it("shows delete confirmation dialog", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		// Find first delete button (trash icon)
		const deleteButtons = screen.getAllByRole("button");
		const deleteButton = deleteButtons.find(btn =>
			btn.innerHTML.includes("M19 7l")
		);

		if (deleteButton) {
			await user.click(deleteButton);

			// Confirmation dialog should appear
			expect(screen.getByText(/delete task/i)).toBeInTheDocument();
			expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
		}
	});

	it("deletes task after confirmation", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		// Get initial task count
		const initialTasks = screen.getAllByRole("button", {
			name: /complete|reopen/i,
		});
		const initialCount = initialTasks.length;

		// Click delete button
		const deleteButtons = screen.getAllByRole("button");
		const deleteButton = deleteButtons.find(btn =>
			btn.innerHTML.includes("M19 7l")
		);

		if (deleteButton) {
			await user.click(deleteButton);

			// Confirm deletion
			const confirmButton = screen.getByRole("button", { name: /^delete$/i });
			await user.click(confirmButton);

			// Task count should decrease
			const remainingTasks = screen.queryAllByRole("button", {
				name: /complete|reopen/i,
			});
			expect(remainingTasks.length).toBe(initialCount - 1);
		}
	});

	it("cancels deletion", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		// Get initial task count
		const initialTasks = screen.getAllByRole("button", {
			name: /complete|reopen/i,
		});
		const initialCount = initialTasks.length;

		// Click delete button
		const deleteButtons = screen.getAllByRole("button");
		const deleteButton = deleteButtons.find(btn =>
			btn.innerHTML.includes("M19 7l")
		);

		if (deleteButton) {
			await user.click(deleteButton);

			// Cancel deletion
			await user.click(screen.getByRole("button", { name: /cancel/i }));

			// Task count should remain same
			const remainingTasks = screen.getAllByRole("button", {
				name: /complete|reopen/i,
			});
			expect(remainingTasks.length).toBe(initialCount);
		}
	});

	it("displays priority badges correctly", () => {
		renderWithProviders(<DashboardTailwind />);

		// Check for priority badges (High, Medium, Low)
		const priorityBadges = screen.getAllByText(/high|medium|low/i);
		expect(priorityBadges.length).toBeGreaterThan(0);
	});

	it("navigates to All Tasks page", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		const viewAllLink = screen.getByText(/view all/i);
		await user.click(viewAllLink);

		// URL should change to /tasks
		expect(window.location.pathname).toBe("/tasks");
	});

	it("shows empty state when no tasks", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		// Delete all tasks
		const deleteButtons = screen.getAllByRole("button");
		const taskDeleteButtons = deleteButtons.filter(btn =>
			btn.innerHTML.includes("M19 7l")
		);

		for (const btn of taskDeleteButtons) {
			await user.click(btn);
			const confirmButton = screen.getByRole("button", { name: /^delete$/i });
			await user.click(confirmButton);
		}

		// Empty state should appear
		expect(await screen.findByText(/no tasks yet/i)).toBeInTheDocument();
		expect(screen.getByText(/create your first task/i)).toBeInTheDocument();
	});

	it("updates stats when tasks change", async () => {
		const user = userEvent.setup();
		renderWithProviders(<DashboardTailwind />);

		// Get initial stats
		const statsSection = screen
			.getByText(/total tasks/i)
			.closest("div").parentElement;
		const initialTotal =
			within(statsSection).getAllByText(/\d+/)[0].textContent;

		// Create a new task
		await user.click(screen.getByRole("button", { name: /new task/i }));
		await user.type(screen.getByLabelText(/title/i), "Stats Test Task");
		await user.click(screen.getByRole("button", { name: /create task/i }));

		// Wait for the task to appear (modal has 500ms delay)
		await screen.findByText("Stats Test Task");

		// Stats should update
		const updatedTotal =
			within(statsSection).getAllByText(/\d+/)[0].textContent;
		expect(Number(updatedTotal)).toBe(Number(initialTotal) + 1);
	});

	it("displays task due dates", () => {
		renderWithProviders(<DashboardTailwind />);

		// Should have date indicators (calendar emoji or formatted dates)
		const dates = screen.getAllByText(/📅|\d{1,2}\/\d{1,2}\/\d{2,4}/);
		expect(dates.length).toBeGreaterThan(0);
	});

	it("applies Tailwind CSS classes", () => {
		renderWithProviders(<DashboardTailwind />);

		const dashboard = screen
			.getByRole("heading", { name: /dashboard/i })
			.closest("div");

		// Check for Tailwind utility classes
		expect(dashboard).toBeInTheDocument();
		// Tailwind classes should be in the DOM
		expect(document.body.innerHTML).toContain("bg-gray-50");
	});
});
