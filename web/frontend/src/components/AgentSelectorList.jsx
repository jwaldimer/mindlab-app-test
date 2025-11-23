import React, { useEffect, useState } from "react";
import {
  Card,
  EmptyState,
  FormLayout,
  InlineError,
  Spinner,
  Text,
  Banner,
} from "@shopify/polaris";
import axios from "axios";
import AgentSelector from "./AgentSelector";
import "./AgentSelector.css";

function AgentSelectorList({ authData }) {
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setError(null);

      if (!authData?.token || !authData?.user?.companyId) return;

      try {
        setLoadingAgents(true);

        const res = await axios.get(
          `/api/v1/mindlab/agents/${authData.user.companyId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          }
        );

        const agentsData = res.data.agents || [];
        setAgents(agentsData);
      } catch (err) {
        console.error(err);
        setError("Could not load agents from MindLab.");
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchAgents();
  }, [authData]);

  const handleAgentSelected = (agentId) => {
    setSelectedAgentId(agentId);
  };

  const isDisabled = !authData?.token;

  return (
    <Card title="Agent selection" sectioned>
      <FormLayout>
        <Text as="h2" variant="headingLg">
          MindLab Available Agents
        </Text>

        <Text as="p" variant="bodySm">
          Choose which MindLab AI agent will be used in this store.
        </Text>

        {!authData?.token && (
          <Banner status="info" title="Connect MindLab first">
            <p>You must sign in with MindLab before selecting an agent.</p>
          </Banner>
        )}

        {loadingAgents ? (
          <div className="agent-list-loading">
            <Spinner size="small" />
          </div>
        ) : (
          <div className="agent-selector-scroll">
            <div className="agent-grid">
              {agents.map((agent) => (
                <AgentSelector
                  key={agent.id}
                  authData={authData}
                  agent={agent}
                  isSelected={selectedAgentId === agent.id}
                  onSelected={handleAgentSelected}
                  disabled={isDisabled}
                />
              ))}
            </div>
            {agents.length === 0 && (
              <EmptyState
                heading="No agents available for this company."
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                fullWidth
              >
                {error && <InlineError message={error} />}
              </EmptyState>
            )}
          </div>
        )}
      </FormLayout>
    </Card>
  );
}

export default AgentSelectorList;
