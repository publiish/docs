import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './api-tester.module.css';

// Define DID Management endpoints
const didEndpoints = [
  {
    id: 'create-did',
    method: 'POST',
    path: '/api/did',
    description: 'Create a new DID document for research data',
    requestBody: {
      title: 'CRISPR-Cas9 Gene Editing Dataset',
      description: 'A comprehensive dataset of CRISPR-Cas9 gene editing experiments',
      metadata: {
        researchers: [
          {
            name: 'Jane Smith',
            orcid: '0000-0001-2345-6789',
            role: 'Principal Investigator'
          }
        ],
        keywords: ['CRISPR', 'gene editing', 'genomics'],
        publicationDate: '2025-06-21'
      }
    },
    responseExample: {
      id: 'did:bio:123456789abcdefghi',
      cid: 'QmXg9Pp2ytZ14xgK35M6iTC2Vz6jR9zYgooNp2UHPTMnPN',
      created_at: '2025-06-15T10:30:45Z',
      controller: 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
    }
  },
  {
    id: 'get-did',
    method: 'GET',
    path: '/api/did/{id}',
    description: 'Retrieve a DID document by its identifier',
    pathParams: ['id'],
    responseExample: {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://w3id.org/biodata/v1'
      ],
      'id': 'did:bio:123456789abcdefghi',
      'controller': ['did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'],
      'verificationMethod': [
        {
          'id': 'did:bio:123456789abcdefghi#keys-1',
          'type': 'Ed25519VerificationKey2020',
          'controller': 'did:bio:123456789abcdefghi',
          'publicKeyMultibase': 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
        }
      ],
      'authentication': ['did:bio:123456789abcdefghi#keys-1'],
      'service': [
        {
          'id': 'did:bio:123456789abcdefghi#storage',
          'type': 'IPFSStorage',
          'serviceEndpoint': 'https://ipfs.bio-did-seq.example/api'
        }
      ],
      'metadata': {
        'title': 'CRISPR-Cas9 Gene Editing Dataset',
        'researchers': [
          {
            'name': 'Jane Smith',
            'orcid': '0000-0001-2345-6789',
            'role': 'Principal Investigator'
          }
        ],
        'keywords': ['CRISPR', 'gene editing', 'genomics'],
        'dataverse_link': 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/EXAMPLE'
      }
    }
  },
  {
    id: 'update-did',
    method: 'PUT',
    path: '/api/did/{id}',
    description: 'Update an existing DID document',
    pathParams: ['id'],
    requestBody: {
      title: 'Updated CRISPR-Cas9 Gene Editing Dataset',
      description: 'An updated comprehensive dataset of CRISPR-Cas9 gene editing experiments',
      metadata: {
        researchers: [
          {
            name: 'Jane Smith',
            orcid: '0000-0001-2345-6789',
            role: 'Principal Investigator'
          },
          {
            name: 'John Doe',
            orcid: '0000-0002-3456-7890',
            role: 'Co-Investigator'
          }
        ],
        keywords: ['CRISPR', 'gene editing', 'genomics', 'cas9'],
        publicationDate: '2025-06-11'
      }
    },
    responseExample: {
      id: 'did:bio:123456789abcdefghi',
      cid: 'QmNewCidAfterUpdate123456789abcdefghijklmnopqrstuvwxyz',
      updated_at: '2025-06-20T14:25:30Z'
    }
  },
  {
    id: 'resolve-did',
    method: 'GET',
    path: '/api/did/resolve/{id}',
    description: 'Resolve and validate a DID',
    pathParams: ['id'],
    responseExample: {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://w3id.org/biodata/v1'
      ],
      'id': 'did:bio:123456789abcdefghi',
      'controller': ['did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'],
      'verificationMethod': [
        {
          'id': 'did:bio:123456789abcdefghi#keys-1',
          'type': 'Ed25519VerificationKey2020',
          'controller': 'did:bio:123456789abcdefghi',
          'publicKeyMultibase': 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
        }
      ],
      'authentication': ['did:bio:123456789abcdefghi#keys-1'],
      'service': [
        {
          'id': 'did:bio:123456789abcdefghi#storage',
          'type': 'IPFSStorage',
          'serviceEndpoint': 'https://ipfs.bio-did-seq.example/api'
        }
      ],
      'metadata': {
        'title': 'Updated CRISPR-Cas9 Gene Editing Dataset',
        'researchers': [
          {
            'name': 'Jane Smith',
            'orcid': '0000-0001-2345-6789',
            'role': 'Principal Investigator'
          },
          {
            'name': 'John Doe',
            'orcid': '0000-0002-3456-7890',
            'role': 'Co-Investigator'
          }
        ],
        'keywords': ['CRISPR', 'gene editing', 'genomics', 'cas9'],
        'dataverse_link': 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/EXAMPLE'
      },
      'validationResult': {
        'isValid': true,
        'validationTime': '2025-06-20T15:10:22Z'
      }
    }
  },
  {
    id: 'link-dataverse',
    method: 'POST',
    path: '/api/did/dataverse/link',
    description: 'Link DID to Dataverse DOI',
    requestBody: {
      did: 'did:bio:123456789abcdefghi',
      dataverse_doi: 'doi:10.7910/DVN/EXAMPLE'
    },
    responseExample: {
      message: 'DID successfully linked to Dataverse dataset',
      did: 'did:bio:123456789abcdefghi',
      dataverse_doi: 'doi:10.7910/DVN/EXAMPLE'
    }
  }
];

// DID Management Component
export default function DIDManagement() {
  const { siteConfig } = useDocusaurusContext();
  const [selectedEndpoint, setSelectedEndpoint] = useState(didEndpoints[0]);
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8081');
  const [pathParams, setPathParams] = useState({});
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
    
    setResponse(null);
    setError(null);
  };

  // Handle path param change
  const handlePathParamChange = (param, value) => {
    setPathParams(prev => ({ ...prev, [param]: value }));
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

  // Build the full URL with path parameters
  const buildUrl = () => {
    if (!selectedEndpoint) return '';

    let url = apiBaseUrl + selectedEndpoint.path;

    // Replace path parameters
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    });

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
          options.body = requestBody;
        } catch (err) {
          throw new Error('Invalid JSON in request body');
        }
      }

      const response = await fetch(url, options);
      const data = await response.json();

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
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
      title="DID Management API"
      description="Manage Decentralized Identifiers (DIDs) for research data">
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.header}>
          <Heading as="h1" className={styles.title}>
            DID Management API
          </Heading>
          <p className={styles.subtitle}>
            Create, retrieve, update, and manage Decentralized Identifiers (DIDs) for research data
          </p>
        </motion.div>

        <div className="api-nav">
          <Link to="/api-tester" className="button button--outline button--sm">
            Back to API Tester
          </Link>
          <Link to="/bioagents" className="button button--outline button--sm">
            BioAgents API
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
                {didEndpoints.map((endpoint, index) => (
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

                {/* Request Body */}
                {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
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