import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  return (
    <div>
      <main className="pb-16">
        {" "}
        {/* 确保主内容不被遮挡 */}
        <h1>Welcome to the App</h1>
      </main>
      <BottomNav />
    </div>
  );
}
