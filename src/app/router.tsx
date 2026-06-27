import { createBrowserRouter } from "react-router-dom";
import { ShellLayout } from "../components/shell/ShellLayout";
import { HomeView } from "../views/HomeView";
import { SavedRoomsView } from "../views/SavedRoomsView";
import { RoomView } from "../views/RoomView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellLayout />,
    children: [
      {
        index: true,
        element: <HomeView />
      },
      {
        path: "rooms",
        element: <SavedRoomsView />
      },
      {
        path: "room/:roomId",
        element: <RoomView />
      }
    ]
  }
]);
