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
              <Heading as="h3" className={styles.sectionTitle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Configuration
              </Heading>
              <div className={styles.formGroup}>
                <label htmlFor="apiBaseUrl">API Base URL:</label>
                <input
                  type="text"
                  id="apiBaseUrl"
                  className={styles.input}
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="apiKey">API Key (optional):</label>
                <input
                  type="text"
                  id="apiKey"
                  className={styles.input}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>
            </div>

            <div className={styles.endpointsSection}>
              <Heading as="h3" className={styles.sectionTitle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.5 7.5H14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.5 11.5H14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Endpoints
              </Heading>
              <div className={styles.categoryTabs}>
                {endpointCategories.map(category => (
                  <button
                    key={category.name}
                    className={clsx(styles.categoryTab, {
                      [styles.activeCategoryTab]: selectedCategory === category.name
                    })}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div className={styles.endpointList}>
                {endpointCategories
                  .find(cat => cat.name === selectedCategory)
                  ?.endpoints.map((endpoint, index) => (
                    <div
                      key={index}
                      className={clsx(styles.endpointItem, {
                        [styles.active]: selectedEndpoint && 
                          selectedEndpoint.path === endpoint.path && 
                          selectedEndpoint.method === endpoint.method
                      })}
                      onClick={() => handleEndpointSelect(endpoint)}
                    >
                      <span className={clsx(styles.endpointMethod, styles[endpoint.method.toLowerCase()])}>{endpoint.method}</span>
                      <div className={styles.endpointPath}>{endpoint.path}</div>
                      <div className={styles.endpointDescription}>{endpoint.description}</div>
                    </div>
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
                        disabled={!selectedEndpoint || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className={styles.loadingIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className={styles.sendButtonIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className={styles.responseSection}>
                      {isLoading ? (
                        <div className={styles.loadingSpinner}>
                          <div className={styles.spinner}></div>
                        </div>
                      ) : error ? (
                        <div className={styles.errorMessage}>
                          <h4>Error</h4>
                          <p>{error}</p>
                        </div>
                      ) : response ? (
                        <div className={styles.responseSection}>
                          <div className={styles.responseHeader}>
                            <h3 className={styles.responseTitle}>Response</h3>
                            <div 
                              className={clsx(
                                styles.responseStatus, 
                                response.status >= 200 && response.status < 300 
                                  ? styles.success 
                                  : response.status >= 400 
                                    ? styles.error 
                                    : styles.info
                              )}
                            >
                              {response.status} {response.statusText}
                            </div>
                          </div>
                          <div className={styles.responseContent}>
                            <pre className={styles.responseJson}>
                              {JSON.stringify(response.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ) : null}
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