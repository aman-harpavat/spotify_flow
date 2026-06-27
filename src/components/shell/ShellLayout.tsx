import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomPlayer } from "./BottomPlayer";
import { Toast } from "../shared/Toast";
import { useFlowStore } from "../../app/store/flowStore";

export function ShellLayout() {
  const toast = useFlowStore((state) => state.toast);
  const dismissToast = useFlowStore((state) => state.dismissToast);

  return (
    <div className="min-h-screen bg-black text-spotify-text">
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 gap-2 p-2 pb-28 md:pb-32">
          <Sidebar />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-spotify-black">
            <TopBar />
            <main className="relative flex-1 overflow-y-auto bg-hero-glow">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <BottomPlayer />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
