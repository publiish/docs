import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import styles from './api-tester.module.css';

// Define endpoint categories and their endpoints
const endpointCategories = [
  {
    name: 'DID Management',
    endpoints: [
      { method: 'POST', path: '/api/did', description: 'Create a new DID', requestBody: { title: '', description: '', metadata: {} } },
      { method: 'GET', path: '/api/did/{id}', description: 'Retrieve a DID document', pathParams: ['id'] },
      { method: 'PUT', path: '/api/did/{id}', description: 'Update a DID document', pathParams: ['id'], requestBody: { title: '', description: '', metadata: {} } },
      { method: 'GET', path: '/api/did/resolve/{id}', description: 'Resolve and validate a DID', pathParams: ['id'] },
      { method: 'POST', path: '/api/did/dataverse/link', description: 'Link DID to Dataverse DOI', requestBody: { did: '', dataverse_doi: '' } },
    ],
  },
  {
    name: 'BioAgents',
    endpoints: [
      { method: 'POST', path: '/api/bioagents/process', description: 'Process paper via BioAgents', requestBody: { file_cid: '', title: '', authors: [], doi: '' } },
      { method: 'GET', path: '/api/bioagents/status/{task_id}', description: 'Check processing status', pathParams: ['task_id'] },
      { method: 'GET', path: '/api/bioagents/metadata/{task_id}', description: 'Get extracted metadata', pathParams: ['task_id'] },
      { method: 'GET', path: '/api/bioagents/search', description: 'Search biological entities', queryParams: ['query'] },
      { method: 'POST', path: '/api/bioagents/knowledge-graph/{cid}', description: 'Generate knowledge graph', pathParams: ['cid'] },
    ],
  },
  {
    name: 'Dataverse',
    endpoints: [
      { method: 'POST', path: '/api/dataverse/dataset', description: 'Create dataset in Dataverse', requestBody: { title: '', description: '', authors: [], keywords: [] } },
      { method: 'POST', path: '/api/dataverse/dataset/file', description: 'Upload file to Dataverse', requestBody: { persistent_id: '', file: null, description: '' } },
      { method: 'POST', path: '/api/dataverse/dataset/publish', description: 'Publish dataset in Dataverse', requestBody: { persistent_id: '' } },
    ],
  },
];

// API Tester Component
export default function ApiTester() {
  const { siteConfig } = useDocusaurusContext();
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8081');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [pathParams, setPathParams] = useState({});
  const [queryParams, setQueryParams] = useState({});
  const [requestBody, setRequestBody] = useState({});
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('request');
  const [selectedCategory, setSelectedCategory] = useState(endpointCategories[0].name);

  // Reset form when endpoint changes
  useEffect(() => {
    if (selectedEndpoint) {
      // Initialize path params
      const newPathParams = {};
      if (selectedEndpoint.pathParams) {
        selectedEndpoint.pathParams.forEach(param => {
          newPathParams[param] = '';
        });
      }
      setPathParams(newPathParams);

      // Initialize query params
      const newQueryParams = {};
      if (selectedEndpoint.queryParams) {
        selectedEndpoint.queryParams.forEach(param => {
          newQueryParams[param] = '';
        });
      }
      setQueryParams(newQueryParams);

      // Initialize request body
      if (selectedEndpoint.requestBody) {
        setRequestBody(JSON.parse(JSON.stringify(selectedEndpoint.requestBody)));
      } else {
        setRequestBody({});
      }

      setResponse(null);
      setError(null);
    }
  }, [selectedEndpoint]);

  // Handle endpoint selection
  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
  };

  // Handle path param change
  const handlePathParamChange = (param, value) => {
    setPathParams(prev => ({ ...prev, [param]: value }));
  };

  // Handle query param change
  const handleQueryParamChange = (param, value) => {
    setQueryParams(prev => ({ ...prev, [param]: value }));
  };

  // Handle request body change
  const handleRequestBodyChange = (value) => {
    try {
      const parsedValue = JSON.parse(value);
      setRequestBody(parsedValue);
      setError(null);
    } catch (err) {
      setError('Invalid JSON in request body');
    }
  };

  // Build the full URL with path and query parameters
  const buildUrl = () => {
    if (!selectedEndpoint) return '';

    let url = apiBaseUrl + selectedEndpoint.path;

    // Replace path parameters
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
    });

      // Add query parameters
  const queryString = Object.entries(queryParams)
    .filter(([_, value]) => Boolean(value))
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  };

  // Send API request
  const sendRequest = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = buildUrl();
      const options = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
      };

      // Add request body for POST, PUT methods
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && Object.keys(requestBody).length > 0) {
        (options as any).body = JSON.stringify(requestBody);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: {},
        data,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title="API Tester"
      description="Test Bio-DID-Seq API endpoints">
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.header}>
          <Heading as="h1" className={styles.title}>
            Bio-DID-Seq API Tester
          </Heading>
          <p className={styles.subtitle}>
            Test and explore the Bio-DID-Seq API endpoints
          </p>
          
          <div className={styles.apiArchitecture}>
            <Heading as="h3">API Architecture</Heading>
            <img 
              src="/img/api-architecture.svg" 
              alt="Bio-DID-Seq API Architecture"
              className={styles.architectureDiagram}
            />
          </div>
        </motion.div>

        <div className={styles.content}>
          <div className={styles.sidebar}>
            <div className={styles.configSection}>
              <Heading as="h3" className={styles.sectionTitle}>Configuration</Heading>
              <div className={styles.formGroup}>
                <label htmlFor="apiBaseUrl">API Base URL:</label>
                <input
                  type="text"
                  id="apiBaseUrl"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="apiKey">API Key:</label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={styles.input}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className={styles.endpointsSection}>
              <Heading as="h3" className={styles.sectionTitle}>Endpoints</Heading>
              <div className={styles.categoryTabs}>
                {endpointCategories.map(category => (
                  <button
                    key={category.name}
                    className={clsx(styles.categoryTab, selectedCategory === category.name && styles.activeTab)}
                    onClick={() => setSelectedCategory(category.name)}>
                    {category.name}
                  </button>
                ))}
              </div>
              <div className={styles.endpointList}>
                {endpointCategories
                  .find(category => category.name === selectedCategory)
                  .endpoints.map((endpoint, index) => (
                    <button
                      key={index}
                      className={clsx(
                        styles.endpointButton,
                        selectedEndpoint === endpoint && styles.activeEndpoint
                      )}
                      onClick={() => handleEndpointSelect(endpoint)}>
                      <span className={styles.method}>{endpoint.method}</span>
                      <span className={styles.path}>{endpoint.path}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className={styles.mainContent}>
            {selectedEndpoint ? (
              <>
                <div className={styles.endpointDetails}>
                  <div className={styles.endpointHeader}>
                    <span className={clsx(styles.methodBadge, styles[selectedEndpoint.method.toLowerCase()])}>
                      {selectedEndpoint.method}
                    </span>
                    <span className={styles.endpointPath}>{selectedEndpoint.path}</span>
                  </div>
                  <p className={styles.endpointDescription}>{selectedEndpoint.description}</p>
                </div>

                <div className={styles.requestSection}>
                  <div className={styles.tabs}>
                    <button
                      className={clsx(styles.tab, activeTab === 'request' && styles.activeTab)}
                      onClick={() => setActiveTab('request')}>
                      Request
                    </button>
                    <button
                      className={clsx(styles.tab, activeTab === 'response' && styles.activeTab)}
                      onClick={() => setActiveTab('response')}>
                      Response
                    </button>
                  </div>

                  {activeTab === 'request' ? (
                    <div className={styles.requestForm}>
                      {/* Path Parameters */}
                      {selectedEndpoint.pathParams && selectedEndpoint.pathParams.length > 0 && (
                        <div className={styles.formSection}>
                          <Heading as="h4" className={styles.formSectionTitle}>Path Parameters</Heading>
                          {selectedEndpoint.pathParams.map(param => (
                            <div key={param} className={styles.formGroup}>
                              <label htmlFor={`path-${param}`}>{param}:</label>
                              <input
                                type="text"
                                id={`path-${param}`}
                                value={pathParams[param] || ''}
                                onChange={(e) => handlePathParamChange(param, e.target.value)}
                                className={styles.input}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Query Parameters */}
                      {selectedEndpoint.queryParams && selectedEndpoint.queryParams.length > 0 && (
                        <div className={styles.formSection}>
                          <Heading as="h4" className={styles.formSectionTitle}>Query Parameters</Heading>
                          {selectedEndpoint.queryParams.map(param => (
                            <div key={param} className={styles.formGroup}>
                              <label htmlFor={`query-${param}`}>{param}:</label>
                              <input
                                type="text"
                                id={`query-${param}`}
                                value={queryParams[param] || ''}
                                onChange={(e) => handleQueryParamChange(param, e.target.value)}
                                className={styles.input}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Request Body */}
                      {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
                        <div className={styles.formSection}>
                          <Heading as="h4" className={styles.formSectionTitle}>Request Body</Heading>
                          <textarea
                            value={JSON.stringify(requestBody, null, 2)}
                            onChange={(e) => handleRequestBodyChange(e.target.value)}
                            className={styles.jsonEditor}
                            rows={10}
                          />
                          {error && <div className={styles.error}>{error}</div>}
                        </div>
                      )}

                      <div className={styles.requestUrl}>
                        <strong>Request URL:</strong> {buildUrl()}
                      </div>

                      <button
                        className={styles.sendButton}
                        onClick={sendRequest}
                        disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Request'}
                      </button>
                    </div>
                  ) : (
                    <div className={styles.responseSection}>
                      {isLoading ? (
                        <div className={styles.loading}>Loading...</div>
                      ) : response ? (
                        <>
                          <div className={styles.responseHeader}>
                            <div className={styles.statusBadge} data-status={Math.floor(response.status / 100)}>
                              {response.status} {response.statusText}
                            </div>
                          </div>
                          <div className={styles.responseBody}>
                            <pre className={styles.jsonResponse}>
                              {JSON.stringify(response.data, null, 2)}
                            </pre>
                          </div>
                        </>
                      ) : error ? (
                        <div className={styles.error}>{error}</div>
                      ) : (
                        <div className={styles.noResponse}>No response yet. Send a request first.</div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.noEndpoint}>
                <div className={styles.noEndpointContent}>
                  <h3>Select an endpoint</h3>
                  <p>Choose an endpoint from the sidebar to start testing the Bio-DID-Seq API.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 