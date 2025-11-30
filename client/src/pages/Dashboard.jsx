import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function Dashboard() {

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <TopBar />

                <div className="p-4">
                   <p className="text-black">dashboard</p>
                </div>

            </div>
        </div>
    );
}