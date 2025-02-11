import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import SearchForm from "./index";

jest.useFakeTimers();

test("debounces input and calls onSearch after 2 seconds", async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const onSearchMock = jest.fn();
  const { getByLabelText } = render(<SearchForm onSearch={onSearchMock} />);
  const input = getByLabelText(/nazwa użytkownika/i);

  await act(async () => {
    await user.type(input, "test");
  });

  act(() => {
    jest.advanceTimersByTime(1500);
  });
  expect(onSearchMock).not.toHaveBeenCalled();

  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(onSearchMock).toHaveBeenCalledWith("test");
});
