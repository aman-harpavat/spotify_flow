import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HomeView } from "./HomeView";
import { useFlowStore } from "../app/store/flowStore";
import { createRoomFromFlow, createSavedRoomDefinition, defaultSavedRoom } from "../data/demoRooms";

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
      savedRooms: [],
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
      screen.getByText(/select one of the available demo prompts to continue/i)
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
    await user.click(screen.getByRole("button", { name: /rainy evening hindi/i }));
    await user.click(screen.getByRole("button", { name: /start room/i }));

    expect(screen.getByText(/building your room/i)).toBeInTheDocument();
    expect(screen.getByText(/best fit: stay in the mood/i)).toBeInTheDocument();
  });

  it("does not render leftover open-flow cards below saved rooms", () => {
    render(
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("button", { name: /open flow/i })).toHaveLength(1);
    expect(
      screen.queryByText(/soft hindi songs for a rainy evening/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/high-energy picks that feel less familiar/i)
    ).not.toBeInTheDocument();
  });

  it("shows the locked all-saved launcher state when every demo is already saved", async () => {
    const user = userEvent.setup();

    useFlowStore.setState({
      savedRooms: [
        defaultSavedRoom,
        createSavedRoomDefinition({ ...createRoomFromFlow("rainy_evening"), status: "saved" }),
        createSavedRoomDefinition({ ...createRoomFromFlow("fresh_workout"), status: "saved" })
      ],
      promptDraft: "Surprise me",
      selectedStarterPrompt: "Surprise me"
    });

    render(
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /open flow/i }));

    const startButton = screen.getByRole("button", { name: /start room/i });
    const launcherForm = startButton.closest("form");

    expect(
      screen.getByText(/you have already saved every guided demo/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all guided demos are saved right now/i)
    ).toBeInTheDocument();
    expect(startButton).toBeDisabled();
    expect(
      screen.queryByText(/keep this room separate from my main taste profile/i)
    ).not.toBeInTheDocument();
    expect(launcherForm).not.toBeNull();
    expect(
      within(launcherForm as HTMLFormElement).queryByRole("button", {
        name: /rainy evening hindi/i
      })
    ).not.toBeInTheDocument();
    expect(
      within(launcherForm as HTMLFormElement).queryByRole("button", {
        name: /fresh workout music/i
      })
    ).not.toBeInTheDocument();
  });
});
