import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './api-tester.module.css';

// Define BioAgents endpoints
const bioagentsEndpoints = [
  {
    id: 'process-paper',
    method: 'POST',
    path: '/api/bioagents/process',
    description: 'Process a research paper through BioAgents for metadata extraction and knowledge graph generation',
    requestBody: {
      file_cid: 'QmXg9Pp2ytZ14xgK35M6iTC2Vz6jR9zYgooNp2UHPTMnPN',
      title: 'CRISPR-Cas9 Gene Editing for Neurodegenerative Diseases',
      authors: ['Jane Smith', 'John Doe'],
      doi: '10.1038/s41586-021-03819-2'
    },
    responseExample: {
      task_id: 'b8e5c9a4-2c7a-4d64-b4b3-7c01e2f8b54e',
      status: 'processing'
    }
  },
  {
    id: 'check-status',
    method: 'GET',
    path: '/api/bioagents/status/{task_id}',
    description: 'Check the status of a paper processing task',
    pathParams: ['task_id'],
    responseExample: {
      task_id: 'b8e5c9a4-2c7a-4d64-b4b3-7c01e2f8b54e',
      status: 'completed',
      progress: 1.0,
      started_at: '2025-06-15T10:30:45Z',
      completed_at: '2025-06-15T10:35:12Z',
      result_cid: 'QmResultCid123456789abcdefghijklmnopqrstuvwxyz'
    }
  },
  {
    id: 'get-metadata',
    method: 'GET',
    path: '/api/bioagents/metadata/{task_id}',
    description: 'Get extracted metadata from a completed processing task',
    pathParams: ['task_id'],
    responseExample: {
      title: 'CRISPR-Cas9 Gene Editing for Neurodegenerative Diseases',
      authors: ['Jane Smith', 'John Doe'],
      abstract_text: 'This paper explores the application of CRISPR-Cas9 gene editing technology for treating neurodegenerative diseases...',
      keywords: ['CRISPR', 'Cas9', 'gene editing', 'neurodegenerative diseases', 'Alzheimer', 'Parkinson'],
      publication_date: '2025-06-25',
      journal: 'Nature',
      doi: '10.1038/s41586-021-03819-2',
      biological_entities: [
        {
          entity_type: 'gene',
          name: 'APP',
          identifier: 'ENSG00000142192',
          source: 'Ensembl',
          mentions: [
            {
              text: 'amyloid precursor protein (APP)',
              section: 'introduction',
              start_pos: 1250,
              end_pos: 1280
            }
          ]
        },
        {
          entity_type: 'disease',
          name: 'Alzheimer\'s disease',
          identifier: 'MONDO:0004975',
          source: 'MONDO',
          mentions: [
            {
              text: 'Alzheimer\'s disease',
              section: 'abstract',
              start_pos: 120,
              end_pos: 139
            }
          ]
        }
      ]
    }
  },
  {
    id: 'search',
    method: 'GET',
    path: '/api/bioagents/search',
    description: 'Search for biological entities across processed papers',
    queryParams: ['query'],
    responseExample: {
      results: [
        {
          entity_type: 'gene',
          name: 'APP',
          identifier: 'ENSG00000142192',
          source: 'Ensembl',
          papers: [
            {
              title: 'CRISPR-Cas9 Gene Editing for Neurodegenerative Diseases',
              doi: '10.1038/s41586-021-03819-2',
              cid: 'QmXg9Pp2ytZ14xgK35M6iTC2Vz6jR9zYgooNp2UHPTMnPN'
            }
          ]
        },
        {
          entity_type: 'gene',
          name: 'APOE',
          identifier: 'ENSG00000130203',
          source: 'Ensembl',
          papers: [
            {
              title: 'CRISPR-Cas9 Gene Editing for Neurodegenerative Diseases',
              doi: '10.1038/s41586-021-03819-2',
              cid: 'QmXg9Pp2ytZ14xgK35M6iTC2Vz6jR9zYgooNp2UHPTMnPN'
            }
          ]
        }
      ],
      total_count: 2
    }
  },
  {
    id: 'knowledge-graph',
    method: 'POST',
    path: '/api/bioagents/knowledge-graph/{cid}',
    description: 'Generate a knowledge graph from a processed paper',
    pathParams: ['cid'],
    responseExample: {
      knowledge_graph_cid: 'QmKnowledgeGraphCid123456789abcdefghijklmnopqrstuvwxyz',
      entity_count: 45,
      relationship_count: 78,
      generated_at: '2025-06-15T11:20:33Z'
    }
  }
];

// BioAgents API Component
export default function BioAgentsAPI() {
  const { siteConfig } = useDocusaurusContext();
  const [selectedEndpoint, setSelectedEndpoint] = useState(bioagentsEndpoints[0]);
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8081');
  const [pathParams, setPathParams] = useState({});
  const [queryParams, setQueryParams] = useState({});
  const [requestBody, setRequestBody] = useState(JSON.stringify(selectedEndpoint.requestBody || {}, null, 2));
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle endpoint selection
  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpoint.requestBody || {}, null, 2));
    
    // Initialize path params
    const newPathParams = {};
    if (endpoint.pathParams) {
      endpoint.pathParams.forEach(param => {
        newPathParams[param] = '';
      });
    }
    setPathParams(newPathParams);
    
    // Initialize query params
    const newQueryParams = {};
    if (endpoint.queryParams) {
      endpoint.queryParams.forEach(param => {
        newQueryParams[param] = '';
      });
    }
    setQueryParams(newQueryParams);
    
    setResponse(null);
    setError(null);
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
    setRequestBody(value);
    try {
      JSON.parse(value);
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
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
        try {
          options['body'] = requestBody;
        } catch (err) {
          throw new Error('Invalid JSON in request body');
        }
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
      title="BioAgents API"
      description="Process research papers with AI-powered BioAgents">
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.header}>
          <Heading as="h1" className={styles.title}>
            BioAgents API
          </Heading>
          <p className={styles.subtitle}>
            Process research papers with AI-powered BioAgents for metadata extraction, entity recognition, and knowledge graph generation
          </p>
        </motion.div>

        <div className="api-nav">
          <Link to="/api-tester" className="button button--outline button--sm">
            Back to API Tester
          </Link>
          <Link to="/did-management" className="button button--outline button--sm">
            DID Management API
          </Link>
          <Link to="/dataverse" className="button button--outline button--sm">
            Dataverse API
          </Link>
        </div>

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
              <div className={styles.endpointList}>
                {bioagentsEndpoints.map((endpoint, index) => (
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
                <button className={clsx(styles.tab, styles.activeTab)}>
                  Request
                </button>
              </div>

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
                {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && selectedEndpoint.requestBody && (
                  <div className={styles.formSection}>
                    <Heading as="h4" className={styles.formSectionTitle}>Request Body</Heading>
                    <textarea
                      value={requestBody}
                      onChange={(e) => handleRequestBodyChange(e.target.value)}
                      className={styles.jsonEditor}
                      rows={15}
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
                  disabled={isLoading || error}>
                  {isLoading ? 'Sending...' : 'Send Request'}
                </button>

                {/* Response Section */}
                {isLoading ? (
                  <div className={styles.loading}>Loading...</div>
                ) : response ? (
                  <div className={styles.responseSection}>
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
                  </div>
                ) : (
                  <div className={styles.responseSection}>
                    <Heading as="h4" className={styles.formSectionTitle}>Example Response</Heading>
                    <pre className={styles.jsonResponse}>
                      {JSON.stringify(selectedEndpoint.responseExample, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 