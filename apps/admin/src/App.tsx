import { AppProviders } from "@/app/providers/AppProviders";
import { ErrorBoundary } from "@/shared/components";

function App() {
  return (
    <ErrorBoundary>
      <AppProviders />
    </ErrorBoundary>
  );
}

export default App;
