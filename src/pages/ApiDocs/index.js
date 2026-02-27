// export default ApiDocs;
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Container, Card, CardBody } from 'reactstrap';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import MetaTag from '../../Components/Common/Meta';
import './ApiDocs.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_KEY_GET } from '../../helpers/url_helpers/dig';

import openApiSpec from './openapi.json';

const ApiDocs = () => {
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('https://dynamicpdf.1automations.com/');
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const serverSectionRef = useRef(null);

  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  // Fetch API key on mount
  useEffect(() => {
    const fetchApiKey = async () => {
      const userId = userRNP?.subscription?.id;
      if (!userId) {
        setApiKeyLoading(false);
        return;
      }

      try {
        const response = await axios.get(API_KEY_GET, {
          headers: {
            "X-Authentication": JSON.stringify({ user_id: userId })
          }
        });

        let existingKey = null;
        if (response && typeof response === 'object') {
          let responseData;
          if ('status' in response && 'data' in response) {
            responseData = response.data;
          } else if ('key' in response) {
            responseData = response;
          }
          if (responseData) {
            if (responseData.key) {
              existingKey = responseData.key;
            } else if (responseData.data && responseData.data.key) {
              existingKey = responseData.data.key;
            }
          }
        }

        if (existingKey) {
          setApiKey(existingKey);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error("Error fetching API key:", error);
        }
      } finally {
        setApiKeyLoading(false);
      }
    };

    if (userRNP?.subscription?.id) {
      fetchApiKey();
    }
  }, [userRNP]);

  // Modify the spec to use the user's base URL
  const modifiedSpec = useMemo(() => ({
    ...openApiSpec,
    servers: [{ url: baseUrl }],
  }), [baseUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApiKeyCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  // Plugin to hide default server section
  const HideServersPlugin = () => ({
    wrapComponents: {
      ServersContainer: () => () => null,
    },
  });

  // Move server section after info container once Swagger loads
  useEffect(() => {
    if (!loading && serverSectionRef.current) {
      const infoContainer = document.querySelector('.api-docs-page .swagger-ui .information-container');
      if (infoContainer && serverSectionRef.current.parentNode) {
        infoContainer.parentNode.insertBefore(serverSectionRef.current, infoContainer.nextSibling);
      }
    }
  }, [loading]);

  return (
    <React.Fragment>
      <div className="page-content api-docs-page">
        <MetaTag title_content="API Documentation" />
        <Container fluid>
          <Card className="border-0 shadow-sm">
            <CardBody className="p-0">
              {/* Custom Server URL Section - will be moved via useEffect */}
              <div className="api-server-section" ref={serverSectionRef}>
                {/* Base URL Row */}
                <div className="server-row">
                  <div className="server-label">
                    <i className="ri-server-line"></i>
                    <span>Base URL</span>
                  </div>
                  <div className="server-input-wrapper">
                    <input
                      type="text"
                      className="server-input"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="Enter API base URL"
                    />
                    <button
                      className={`copy-btn ${copied ? 'copied' : ''}`}
                      onClick={handleCopy}
                      title={copied ? 'Copied!' : 'Copy URL'}
                    >
                      <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
                    </button>
                  </div>
                </div>

                {/* API Key Row */}
                <div className="server-row">
                  <div className="server-label">
                    <i className="ri-key-2-line"></i>
                    <span>API Key</span>
                  </div>
                  <div className="server-input-wrapper">
                    {apiKeyLoading ? (
                      <div className="server-input" style={{ color: '#999', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="loading-dots">Loading</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="server-input"
                        value={apiKey || 'No API key generated yet'}
                        readOnly
                        style={{
                          backgroundColor: apiKey ? '#fff' : '#f5f5f5',
                          color: apiKey ? '#333' : '#999'
                        }}
                      />
                    )}
                    <button
                      className={`copy-btn ${apiKeyCopied ? 'copied' : ''}`}
                      onClick={handleApiKeyCopy}
                      title={apiKeyCopied ? 'Copied!' : 'Copy API Key'}
                      disabled={!apiKey || apiKeyLoading}
                      style={{ opacity: apiKey && !apiKeyLoading ? 1 : 0.5 }}
                    >
                      <i className={apiKeyCopied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Swagger UI */}
              <div className={`swagger-wrapper ${loading ? 'loading' : ''}`}>
                <SwaggerUI
                  spec={modifiedSpec}
                  docExpansion="list"
                  defaultModelsExpandDepth={-1}
                  displayRequestDuration={true}
                  filter={false}
                  tryItOutEnabled={true}
                  plugins={[HideServersPlugin]}
                  onComplete={() => setLoading(false)}
                />
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ApiDocs;