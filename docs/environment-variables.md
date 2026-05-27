# Environment Variables

This document outlines the environment variables used in the ZIKR project, their purpose, and whether they are public or server-side.

## Required Environment Variables

The following environment variables are required for the application to function correctly.

| Variable Name             | Description                                                                 | Type     |
| :------------------------ | :-------------------------------------------------------------------------- | :------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | The public URL for your Supabase project.                                   | Public   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public anonymous key for your Supabase project.                         | Public   |
| `NEXT_PUBLIC_SITE_URL`          | The public URL of the deployed site.                                        | Public   |
| `SUPABASE_SERVICE_ROLE_KEY`     | The Supabase service role key, used for server-side operations.             | Server   |
| `DATABASE_URL`                  | The connection string for the PostgreSQL database.                          | Server   |
| `AUTH_CALLBACK_URL`             | The callback URL for authentication providers.                              | Server   |

## Optional Integration Environment Variables

The following environment variables are optional and are used for integrating with external services.

| Variable Name             | Description                                                                 | Type     |
| :------------------------ | :-------------------------------------------------------------------------- | :------- |
| `GEMINI_API_KEY`                | API key for Google Gemini services.                                         | Server   |
| `GEMINI_MODEL`                  | Optional Gemini model override (default: `gemini-1.5-flash`).               | Server   |
| `AWS_S3_ACCESS_KEY_ID`          | AWS S3 access key ID for storage.                                           | Server   |
| `AWS_S3_SECRET_ACCESS_KEY`      | AWS S3 secret access key for storage.                                       | Server   |
| `AWS_S3_BUCKET_NAME`            | AWS S3 bucket name for storage.                                             | Server   |
| `AWS_S3_REGION`                 | AWS S3 region for storage.                                                  | Server   |
| `QURAN_API_BASE_URL`            | Base URL for the Quran API.                                                 | Server   |
| `QURAN_AUDIO_CDN_URL`           | CDN URL for Quran audio files.                                              | Server   |
| `HADITH_API_BASE_URL`           | Base URL for the Hadith API.                                                | Server   |
| `YOUTUBE_API_KEY`               | API key for YouTube services.                                               | Server   |
| `YOUTUBE_CHANNEL_ID`            | YouTube channel ID.                                                         | Server   |
| `YOUTUBE_PLAYLIST_ID`           | YouTube playlist ID.                                                        | Server   |

## Runtime Validation

Environment variables are validated at runtime using `zod` to ensure their presence and correct format. Missing or invalid required variables will cause the application to throw an error during startup, preventing potential issues.

## .env.example

The `.env.example` file in the project root provides a template for all environment variables. It should be copied to `.env` and populated with actual values for local development and deployment.
