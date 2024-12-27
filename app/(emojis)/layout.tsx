import Header from "@/components/header";

export default function EmojiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      {/* <SidebarProvider className="justify-center"> */}
      <div className="flex min-h-screen bg-background justify-center">
        {/* <AppSidebar /> */}
        <div className="flex-1">
          <Header />
          <main className="container  px-4 py-6">{children}</main>
        </div>
      </div>
      {/* </SidebarProvider> */}
    </div>
  );
}
