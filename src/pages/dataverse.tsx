import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './api-tester.module.css';

// Define Dataverse endpoints
const dataverseEndpoints = [
  {
    id: 'create-dataset',
    method: 'POST',
    path: '/api/dataverse/dataset',
    description: 'Create a new dataset in Dataverse',
    requestBody: {
      title: 'CRISPR-Cas9 Gene Editing Dataset',
      description: 'A comprehensive dataset of CRISPR-Cas9 gene editing experiments',
      authors: ['Jane Smith', 'John Doe'],
      keywords: ['CRISPR', 'gene editing', 'genomics']
    },
    responseExample: {
      id: 'dataset-123456',
      persistent_id: 'doi:10.7910/DVN/EXAMPLE'
    }
  },
  {
    id: 'upload-file',
    method: 'POST',
    path: '/api/dataverse/dataset/file',
    description: 'Upload a file to a Dataverse dataset',
    requestBody: {
      persistent_id: 'doi:10.7910/DVN/EXAMPLE',
      file: '(binary file data)',
      description: 'Experimental data in CSV format'
    },
    responseExample: {
      file_id: 'file-123456',
      message: 'File uploaded successfully'
    }
  },
  {
    id: 'publish-dataset',
    method: 'POST',
    path: '/api/dataverse/dataset/publish',
    description: 'Publish a dataset in Dataverse',
    requestBody: {
      persistent_id: 'doi:10.7910/DVN/EXAMPLE'
    },
    responseExample: {
      persistent_id: 'doi:10.7910/DVN/EXAMPLE',
      message: 'Dataset published successfully'
    }
  }
];

// Dataverse API Component
export default function DataverseAPI() {
  const { siteConfig } = useDocusaurusContext();
  const [selectedEndpoint, setSelectedEndpoint] = useState(dataverseEndpoints[0]);
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8081');
  const [requestBody, setRequestBody] = useState(JSON.stringify(selectedEndpoint.requestBody || {}, null, 2));
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  // Handle endpoint selection
  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpoint.requestBody || {}, null, 2));
    setResponse(null);
    setError(null);
    setFile(null);
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

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Build the full URL
  const buildUrl = () => {
    if (!selectedEndpoint) return '';
    return apiBaseUrl + selectedEndpoint.path;
  };

  // Send API request
  const sendRequest = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = buildUrl();
      
      // For file upload, use FormData
      if (selectedEndpoint.id === 'upload-file' && file) {
        const formData = new FormData();
        const bodyObj = JSON.parse(requestBody);
        formData.append('file', file);
        formData.append('persistent_id', bodyObj.persistent_id);
        formData.append('description', bodyObj.description || '');
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
          },
          body: formData
        });
        
        const data = await response.json();
        
        setResponse({
          status: response.status,
          statusText: response.statusText,
          headers: {},
          data,
        });
      } else {
        // Regular JSON request
        const options = {
          method: selectedEndpoint.method,
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
          },
          body: requestBody
        };

        const response = await fetch(url, options);
        const data = await response.json();

        setResponse({
          status: response.status,
          statusText: response.statusText,
          headers: {},
          data,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title="Dataverse API"
      description="Manage datasets in Harvard Dataverse">
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.header}>
          <Heading as="h1" className={styles.title}>
            Dataverse API
          </Heading>
          <p className={styles.subtitle}>
            Create, publish, and manage datasets in Harvard Dataverse
          </p>
        </motion.div>

        <div className="api-nav">
          <Link to="/api-tester" className="button button--outline button--sm">
            Back to API Tester
          </Link>
          <Link to="/did-management" className="button button--outline button--sm">
            DID Management API
          </Link>
          <Link to="/bioagents" className="button button--outline button--sm">
            BioAgents API
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
                {dataverseEndpoints.map((endpoint, index) => (
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
                {/* File upload for dataset/file endpoint */}
                {selectedEndpoint.id === 'upload-file' && (
                  <div className={styles.formSection}>
                    <Heading as="h4" className={styles.formSectionTitle}>File Upload</Heading>
                    <div className={styles.formGroup}>
                      <label htmlFor="file">Select File:</label>
                      <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                )}

                {/* Request Body */}
                <div className={styles.formSection}>
                  <Heading as="h4" className={styles.formSectionTitle}>Request Body</Heading>
                  <textarea
                    value={requestBody}
                    onChange={(e) => handleRequestBodyChange(e.target.value)}
                    className={styles.jsonEditor}
                    rows={10}
                  />
                  {error && <div className={styles.error}>{error}</div>}
                </div>

                <div className={styles.requestUrl}>
                  <strong>Request URL:</strong> {buildUrl()}
                </div>

                <button
                  className={styles.sendButton}
                  onClick={sendRequest}
                  disabled={isLoading || error || (selectedEndpoint.id === 'upload-file' && !file)}>
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