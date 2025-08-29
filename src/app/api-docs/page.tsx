'use client';

import React, {useEffect, useRef} from 'react';
import 'swagger-ui-dist/swagger-ui.css';

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Todo API',
    version: '1.0.0',
    description: 'API documentation for the Todo app',
  },
  servers: [{url: '/api'}],
  paths: {
    '/todo': {
      get: {
        summary: 'Get all todos',
        responses: {
          '200': {
            description: 'List of todos',
          },
        },
      },
      post: {
        summary: 'Create a new todo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {type: 'string'},
                  completed: {type: 'boolean'},
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Todo created',
          },
        },
      },
    },
    '/todo/{id}': {
      get: {
        summary: 'Get a todo by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {type: 'string'},
          },
        ],
        responses: {
          '200': {description: 'A single todo'},
          '404': {description: 'Todo not found'},
        },
      },
      put: {
        summary: 'Update a todo by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {type: 'string'},
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {type: 'string'},
                  completed: {type: 'boolean'},
                },
              },
            },
          },
        },
        responses: {
          '200': {description: 'Todo updated'},
          '404': {description: 'Todo not found'},
        },
      },
      delete: {
        summary: 'Delete a todo by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {type: 'string'},
          },
        ],
        responses: {
          '204': {description: 'Todo deleted'},
          '404': {description: 'Todo not found'},
        },
      },
    },
  },
};

export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ui: any;
    let isCancelled = false;

    const mountSwagger = async () => {
      try {
        const mod = await import('swagger-ui-dist/swagger-ui-es-bundle.js');
        const SwaggerUI = mod.default || mod.SwaggerUI || mod;
        if (!isCancelled && containerRef.current) {
          ui = SwaggerUI({
            domNode: containerRef.current,
            spec: openApiSpec,
            deepLinking: true,
          });
        }
      } catch (error) {
        console.error('Failed to load Swagger UI:', error);
      }
    };

    mountSwagger();
    return () => {
      isCancelled = true;
      if (ui && typeof ui.destroy === 'function') ui.destroy();
    };
  }, []);

  return (
    <main>
      <h1>API Documentation</h1>
      <div ref={containerRef} />
    </main>
  );
}
