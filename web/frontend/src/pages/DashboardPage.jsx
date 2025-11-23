import React, { useState, useEffect } from "react";
import { Page, Layout, Button } from "@shopify/polaris";
import MindLabConnection from "../components/MindLabConnection";
import AgentSelectorList from "../components/AgentSelectorList";

const AUTH_STORAGE_KEY = "mindlabAuthData";

function DashboardPage() {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthData(parsed);
      }
    } catch (error) {
      console.error("Error loading stored auth data:", error);
    }
  }, []);

  const handleAuthenticated = (data) => {
    setAuthData(data);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  };

  const handleLogout = () => {
    setAuthData(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAuthenticated = Boolean(authData?.token);

  return (
    <Page 
      fullWidth
      primaryAction={
        isAuthenticated
          ? {
              content: "Sign out",
              onAction: handleLogout,
            }
          : undefined
      }
    >
      <Layout>
        {!isAuthenticated && (
          <Layout.Section>
            <MindLabConnection onAuthenticated={handleAuthenticated} />
          </Layout.Section>
        )}

        {isAuthenticated && (
          <Layout.Section>
            <AgentSelectorList authData={authData} />
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}

export default DashboardPage;
