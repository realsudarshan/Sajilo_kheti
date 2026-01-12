export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">List Users</h1>
        <p className="text-muted-foreground">
          Manage all registered users in the system.
        </p>
      </div>
      {/* Add your users table/content here */}
    </div>
  )
}
