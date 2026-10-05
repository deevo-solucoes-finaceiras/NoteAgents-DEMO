import React, { useEffect } from "react";
import { useAppStore } from "./stores/useAppStore";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./components/marketing/LandingPage";
import { DashboardView } from "./components/pages/DashboardView";
import { ProjectsView } from "./components/pages/ProjectsView";
import { ProjectDetailView } from "./components/pages/ProjectDetailView";
import { ChatView } from "./components/pages/ChatView";
import { KnowledgeView } from "./components/pages/KnowledgeView";
import { AuditsView } from "./components/pages/AuditsView";
import { AgentsView } from "./components/pages/AgentsView";
import { PipelinesView } from "./components/pages/PipelinesView";
import { EnvironmentView } from "./components/pages/EnvironmentView";
import { IntegrationsView } from "./components/pages/IntegrationsView";
import { DatabaseView } from "./components/pages/DatabaseView";
import { SettingsView } from "./components/pages/SettingsView";
import { ProfileView } from "./components/pages/ProfileView";
import { DocsView } from "./components/pages/DocsView";
import { LoginView } from "./components/pages/LoginView";
import { EvidenceView } from "./components/pages/EvidenceView";
import { ReadinessView } from "./components/pages/ReadinessView";
import { ObserverView, WorkspaceView } from "./components/pages/ObserverView";

export default function App() {
  const { currentPath, setCurrentPath } = useAppStore();

  // Listen to browser popstate for history navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || "/dashboard";
      setCurrentPath(path);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setCurrentPath]);

  // Route: Landing page
  if (currentPath === "/") {
    return <LandingPage />;
  }

  // Route: Login / Register
  if (currentPath === "/login" || currentPath === "/cadastro") {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <LoginView />
      </div>
    );
  }

  // Helper for dynamic project detail route: /projects/:id
  const projectMatch = currentPath.match(/^\/projects\/([a-zA-Z0-9_-]+)$/);
  const selectedProjectId = projectMatch ? projectMatch[1] : null;

  const renderActiveView = () => {
    if (selectedProjectId) {
      return <ProjectDetailView projectId={selectedProjectId} />;
    }

    if (currentPath.startsWith("/projects")) return <ProjectsView />;
    if (currentPath.startsWith("/chat")) return <ChatView />;
    if (currentPath.startsWith("/knowledge")) return <KnowledgeView />;
    if (currentPath.startsWith("/audits")) return <AuditsView />;
    if (currentPath.startsWith("/agents")) return <AgentsView />;
    if (currentPath.startsWith("/pipelines") || currentPath.startsWith("/runs")) {
      return <PipelinesView />;
    }
    if (currentPath.startsWith("/environment")) return <EnvironmentView />;
    if (currentPath.startsWith("/integrations")) return <IntegrationsView />;
    if (currentPath.startsWith("/database")) return <DatabaseView />;
    if (currentPath.startsWith("/settings/profile")) return <ProfileView />;
    if (currentPath.startsWith("/settings")) return <SettingsView />;
    if (currentPath.startsWith("/documentacao")) return <DocsView />;
    if (currentPath.startsWith("/evidence")) return <EvidenceView />;
    if (currentPath.startsWith("/readiness")) return <ReadinessView />;
    if (currentPath.startsWith("/observer")) return <ObserverView />;
    if (currentPath.startsWith("/workspace") || currentPath.startsWith("/files")) {
      return <WorkspaceView />;
    }

    return <DashboardView />;
  };

  return <AppShell>{renderActiveView()}</AppShell>;
}
