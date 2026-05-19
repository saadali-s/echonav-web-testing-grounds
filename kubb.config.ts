import { defineConfig } from '@kubb/core';
import { pluginClient } from '@kubb/plugin-client';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginTs } from '@kubb/plugin-ts';

export default defineConfig({
  root: '.',
  input: {
    // Pointing directly to your live Spring Boot Swagger schema
    path: 'http://localhost:8081/v3/api-docs',
  },
  output: {
    // Where the generated SDK will live
    path: './src/lib/api/gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginClient(),
    pluginReactQuery({
      mutation: {
        methods: ['post', 'put', 'delete'],
      }
    }),
  ],
});