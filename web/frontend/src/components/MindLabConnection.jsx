import React, { useState } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  InlineError,
  Banner,
  Spinner,
  Text
} from "@shopify/polaris";
import axios from "axios";

function MindLabConnection({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccessBanner(false);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("api/v1/auth/signin", { email, password });
      const { token, user } = response.data;

      if (onAuthenticated) {
        onAuthenticated({ token, user });
      }

      setSuccessBanner(true);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials.");
      } else {
        setError("An error occurred while connecting to MindLab. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Card title="Connection with MindLab" sectioned>
      <Form onSubmit={submitHandler}>
        <FormLayout>
          <Text as="h2" variant="headingLg">
            MindLab Authentication
          </Text>

          <Text as="p" variant="bodySm">
            Enter your MindLab credentials to link your account to this store.
          </Text>

          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
          />

          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />

          {successBanner && (<Banner status="success" title="Connected with MindLab"></Banner>)}

          {error && (
            <InlineError message={error} fieldID="mindlab-auth-error" />
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button primary submit disabled={loading}>
              {loading ? "Connecting..." : "Login"}
            </Button>
            {loading && <Spinner size="small" />}
          </div>
        </FormLayout>
      </Form>
    </Card>
  );
}

export default MindLabConnection;
