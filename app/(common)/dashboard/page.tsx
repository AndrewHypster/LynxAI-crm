// import { CreatorDashboard } from "./_components/creator-dashboard"
// import { AdminDashboard } from "./_components/admin-dashboard"
import { getServerSession } from "next-auth"
import ManagerDashboard from "./manager"
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions) // Отримуєш сесію
  const user = session?.user

  console.log(session);
  

  return (
    <>
      {/* {role === "CREATOR" && <CreatorDashboard />}
      {role === "ADMIN" && <AdminDashboard />} */}
      {user?.role === "MANAGER" && <ManagerDashboard user={user} />}
    </>
  )
}
