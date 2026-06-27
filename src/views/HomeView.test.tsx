import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeView } from "./HomeView";
import { useFlowStore } from "../app/store/flowStore";

describe("HomeView launcher flow", () => {
  beforeEach(() => {
    useFlowStore.setState({
      isLauncherOpen: false,
      launcherStep: "prompt",
      promptDraft: "",
      selectedStarterPrompt: null,
      keepSeparateProfile: true,
      toast: null
    });
  });

  it("opens Flow launcher and blocks empty submit", async () => {
    const user = userEvent.setup();

    render(<HomeView />);

    await user.click(screen.getAllByRole("button", { name: /open flow/i })[0]);

    expect(
      screen.getByRole("heading", { name: /start a room for this moment/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /start room/i }));

    expect(
      screen.getByText(/select one of the three demo prompts to continue/i)
    ).toBeInTheDocument();
  });
});
