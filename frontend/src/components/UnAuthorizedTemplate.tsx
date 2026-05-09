import { Link } from "react-router-dom";

const UnAuthorizedTemplate = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-border/80 bg-card p-8 text-center shadow-md">
        <h2 className="mb-2 text-2xl font-bold text-foreground">You are not logged in</h2>
        <p className="mb-4 text-muted-foreground">
          Please log in to access your dashboard.
        </p>
        <Link
          to="/signin"
          className="inline-block rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Sign In
        </Link>
        <span className="mt-3 text-sm text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default UnAuthorizedTemplate;
