import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
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
      suggestedArc: null,
      selectedArc: null,
      activeRoom: null,
      isPlaying: false,
      toast: null
    });
  });

  it("opens Flow launcher and blocks empty submit", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    );

    await user.click(screen.getAllByRole("button", { name: /open flow/i })[0]);

    expect(
      screen.getByRole("heading", { name: /start a room for this moment/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /start room/i }));

    expect(
      screen.getByText(/select one of the three demo prompts to continue/i)
    ).toBeInTheDocument();
  });

  it("advances to arc suggestion after selecting a demo prompt", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    );

    await user.click(screen.getAllByRole("button", { name: /open flow/i })[0]);
    await user.click(screen.getAllByRole("button", { name: /rainy evening hindi/i })[1]);
    await user.click(screen.getByRole("button", { name: /start room/i }));

    expect(screen.getByText(/building your room/i)).toBeInTheDocument();
    expect(screen.getByText(/best fit: deep dive/i)).toBeInTheDocument();
  });
});
