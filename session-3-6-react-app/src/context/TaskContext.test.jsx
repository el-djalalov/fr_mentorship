import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { TaskProvider, useTasks } from "./TaskContext";

describe("TaskContext (Session 4 & 5 - State Management)", () => {
	const wrapper = ({ children }) => <TaskProvider>{children}</TaskProvider>;

	beforeEach(() => {
		localStorage.clear();
	});

	it("provides initial state", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });

		expect(result.current.tasks).toBeDefined();
		expect(Array.isArray(result.current.tasks)).toBe(true);
	});

	it("adds a new task", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });

		act(() => {
			result.current.addTask({
				title: "Test Task",
				description: "Test Description",
				priority: "high",
				dueDate: "2024-12-31",
			});
		});

		expect(result.current.tasks).toHaveLength(5); // 4 sample + 1 new
		expect(result.current.tasks[4].title).toBe("Test Task");
		expect(result.current.tasks[4].status).toBe("pending");
	});

	it("assigns unique IDs to tasks", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });

		act(() => {
			result.current.addTask({
				title: "Task 1",
				description: "",
				priority: "low",
			});
			result.current.addTask({
				title: "Task 2",
				description: "",
				priority: "low",
			});
		});

		const ids = result.current.tasks.map(t => t.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
	});

	it("toggles task completion", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });
		const firstTaskId = result.current.tasks[0].id;
		const originalStatus = result.current.tasks[0].status;

		act(() => {
			result.current.toggleTask(firstTaskId);
		});

		const updatedTask = result.current.tasks.find(t => t.id === firstTaskId);
		expect(updatedTask.status).not.toBe(originalStatus);
		expect(updatedTask.status).toBe(
			originalStatus === "pending" ? "completed" : "pending"
		);
	});

	it("updates a task", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });
		const taskId = result.current.tasks[0].id;

		act(() => {
			result.current.updateTask(taskId, {
				title: "Updated Title",
				priority: "high",
			});
		});

		const updatedTask = result.current.tasks.find(t => t.id === taskId);
		expect(updatedTask.title).toBe("Updated Title");
		expect(updatedTask.priority).toBe("high");
	});

	it("deletes a task", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });
		const initialCount = result.current.tasks.length;
		const taskIdToDelete = result.current.tasks[0].id;

		act(() => {
			result.current.deleteTask(taskIdToDelete);
		});

		expect(result.current.tasks).toHaveLength(initialCount - 1);
		expect(
			result.current.tasks.find(t => t.id === taskIdToDelete)
		).toBeUndefined();
	});

	it("calculates stats correctly", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });

		// Add tasks with known states
		act(() => {
			result.current.addTask({
				title: "Task 1",
				description: "",
				priority: "high",
			});
			result.current.addTask({
				title: "Task 2",
				description: "",
				priority: "medium",
			});
		});

		const stats = result.current.getStats();

		expect(stats).toHaveProperty("total");
		expect(stats).toHaveProperty("completed");
		expect(stats).toHaveProperty("inProgress");
		expect(stats).toHaveProperty("completionRate");

		expect(stats.total).toBe(result.current.tasks.length);
		expect(typeof stats.completionRate).toBe("number");
	});

	it("filters tasks by status", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });

		// Set filter to completed
		act(() => {
			result.current.setFilter("status", "completed");
		});

		const completedTasks = result.current.getFilteredTasks();
		expect(completedTasks.every(t => t.status === "completed")).toBe(true);

		// Set filter to pending
		act(() => {
			result.current.setFilter("status", "pending");
		});

		const pendingTasks = result.current.getFilteredTasks();
		expect(pendingTasks.every(t => t.status === "pending")).toBe(true);
	});

	it("persists to localStorage", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });

		act(() => {
			result.current.addTask({
				title: "Persistent Task",
				description: "Test",
				priority: "medium",
			});
		});

		const stored = localStorage.getItem("taskmaster-react-tasks");
		expect(stored).not.toBeNull();

		const parsed = JSON.parse(stored);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.some(t => t.title === "Persistent Task")).toBe(true);
	});

	it("maintains immutable state updates", () => {
		const { result } = renderHook(() => useTasks(), { wrapper });
		const originalTasks = result.current.tasks;

		act(() => {
			result.current.addTask({
				title: "New Task",
				description: "",
				priority: "low",
			});
		});

		// State should be a new reference
		expect(result.current.tasks).not.toBe(originalTasks);
		// But original tasks should be unchanged
		expect(originalTasks.some(t => t.title === "New Task")).toBe(false);
	});
});
