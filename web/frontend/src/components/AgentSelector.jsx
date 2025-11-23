import React, { useState } from "react";
import {
  Card,
  Text,
  Thumbnail,
  InlineError,
  Button,
  Spinner,
  Badge,
  Modal,
} from "@shopify/polaris";
import axios from "axios";
import "./AgentSelector.css";

function AgentSelector({ authData, agent, isSelected, onSelected, disabled }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  const handleSelectConfirmed = async () => {
    setError(null);
    setSaving(true);
    closeConfirm();

    try {
      await axios.post(
        "/api/v1/mindlab/agents/select",
        { agentId: agent.id },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      if (onSelected) onSelected(agent.id);
    } catch (err) {
      console.error(err);
      setError("Could not select this agent. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const shortDescription =
    agent.config?.systemPrompt?.replace(/\n/g, " ")?.slice(0, 120) ||
    "AI agent available for your store.";

  return (
    <div
      className={`agent-card ${isSelected ? "agent-card--selected" : ""}`}
      role="group"
      aria-label={`Agent ${agent.name}`}
    >
      <Card sectioned subdued={isSelected}>
        <div className="agent-card-header">
          <Thumbnail source={agent.photo} alt={agent.name} size="small" />
          <div className="agent-card-header-text">
            <p className="agent-name">
              <strong>{agent.name}</strong>
              {isSelected && (
                <Badge tone="success">Selected</Badge>
              )}
            </p>
            <p className="agent-metadata">
              Model: {agent.config?.modelProvider} · Language:{" "}
              {agent.config?.language}
            </p>
          </div>
        </div>

        <div className="agent-card-content">
          <Text spacing="tight">
            <p className="agent-description">{shortDescription}</p>
          </Text>

          {error && <InlineError message={error} />}

          <div className="agent-card-actions">
            <Button
              primary
              size="slim"
              onClick={openConfirm}
              disabled={saving || disabled || isSelected}
            >
              {saving ? "Saving..." : isSelected ? "Selected" : "Select agent"}
            </Button>

            {saving && <Spinner size="small" />}
          </div>
        </div>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={closeConfirm}
        title="Confirm agent selection"
        primaryAction={{
          content: "Yes, select this agent",
          onAction: handleSelectConfirmed,
          loading: saving,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: closeConfirm,
          },
        ]}
      >
        <Modal.Section>
          <div className="agent-modal-content">
            <div className="agent-modal-header">
              <Thumbnail source={agent.photo} alt={agent.name} size="medium" />

              <div className="agent-modal-header-text">
                <p className="agent-modal-name">
                  <strong>{agent.name}</strong>
                </p>

                <Badge tone="info">{agent.type} Agent</Badge>
              </div>
            </div>

            <div className="agent-modal-metadata">
              <p><strong>Model:</strong> {agent.config?.modelProvider}</p>
              <p><strong>Language:</strong> {agent.config?.language}</p>
            </div>

            <div className="agent-modal-description">
              <p>{shortDescription}</p>
            </div>

            <p className="agent-modal-question">
              Are you sure you want to set <strong>{agent.name}</strong> as the active AI agent for this store?
            </p>
          </div>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default AgentSelector;
