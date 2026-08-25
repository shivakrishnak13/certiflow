# CertiFlow

CertiFlow is a full-stack provisional certificate application system.

It allows authenticated users to:

- Create provisional certificate applications
- Enter applicant and academic details
- Upload required documents
- Save applications as drafts
- Resume incomplete applications
- Review applications before submission
- Submit applications
- Generate provisional certificates
- Download generated certificates
- Manage draft and submitted applications from the dashboard

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- HTTP-only authentication cookie
- Authenticated user session
- Logout

### Application Management

- Create a provisional certificate application
- Save applicant details
- Save applications as drafts
- Resume draft applications
- Track application progress
- Review application before submission
- Submit application

### Document Management

- Upload PDF documents
- Maximum file size of 5 MB
- ID Proof
- Degree Certificate
- Replace previously uploaded documents
- Preview uploaded documents through backend-generated signed URLs

### Certificate

- Generate a provisional certificate after successful submission
- Store generated certificates securely in Amazon S3
- Generate signed download URLs
- Download generated certificates

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Axios
- Lucide React

## Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- HTTP-only Cookies
- Zod
- Multer
- PDFKit
- Helmet
- CORS

## Storage

- Amazon S3

---

# Project Structure

The project uses a simple frontend/backend structure:

```text
certiflow/
├── frontend/
└── backend/
```

---

# Architecture Overview

```text
                         +---------------------+
                         |      CertiFlow      |
                         |      Frontend       |
                         |      Next.js        |
                         +----------+----------+
                                    |
                                    | HTTP / JSON
                                    | Credentials
                                    v
                         +---------------------+
                         |       Backend       |
                         | Express + TypeScript|
                         +----------+----------+
                                    |
                       +------------+------------+
                       |                         |
                       v                         v
                +--------------+          +--------------+
                |   MongoDB    |          |   Amazon S3  |
                |              |          |              |
                | Users        |          | Documents    |
                | Applications |          | Certificates |
                | Documents    |          |              |
                +--------------+          +--------------+
```

The frontend communicates with the Express API.

The backend is responsible for:

- Authentication
- Application management
- Document management
- Application validation
- Certificate generation
- S3 storage
- Signed URLs

MongoDB stores user, application, and document metadata.

Amazon S3 stores private documents and generated certificates.

---

# Frontend Architecture

The frontend uses the Next.js App Router.

```text
frontend/
└── src/
    ├── app/
    ├── components/
    ├── config/
    ├── lib/
    ├── module/
    └── types/
```

### `app/`

Contains Next.js routes.

```text
app/
├── (auth)/
│   ├── signin/
│   └── signup/
│
└── applications/
    └── [id]/
        ├── details/
        ├── documents/
        ├── review/
        └── success/
```

### `components/`

Shared UI and application components.

```text
components/
├── brand/
├── common/
├── providers/
└── ui/
```

### `module/`

Feature-oriented frontend modules.

```text
module/
├── applicant-details/
├── auth/
├── dashboard/
├── documents/
├── review/
└── submission/
```

Each feature contains the components, hooks, types, and utilities required by that feature.

### `lib/`

Shared application utilities such as:

- Axios API client
- Utility functions

### `config/`

Application configuration such as route definitions.

---

# Backend Architecture

The backend follows a controller/service architecture.

```text
backend/
└── src/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── types/
    └── utils/
```

### Controllers

Handle HTTP requests and responses.

```text
controllers/
├── application.controller.ts
└── auth.controller.ts
```

### Services

Contain application and business logic.

```text
services/
├── application.service.ts
├── auth.service.ts
├── document.service.ts
└── s3.service.ts
```

### Models

Mongoose models for:

- Users
- Applications
- Documents

### Routes

API route definitions.

```text
routes/
├── application.routes.ts
├── auth.routes.ts
└── index.ts
```

### Middleware

Includes:

- Authentication
- Request validation
- Error handling

### Configuration

Contains:

- MongoDB configuration
- AWS S3 configuration
- Multer configuration

---

# Application Flow

The main application workflow is:

```text
Sign In
   |
   v
Dashboard
   |
   | Get Provisional Certificate
   v
Create Application
   |
   v
Applicant Details
   |
   | PATCH application
   v
Documents
   |
   | Upload documents
   v
Review
   |
   | Submit
   v
Application Submitted
   |
   v
Generate Certificate
   |
   v
Download Certificate
```

---

# Draft Application Flow

Applications can remain in `DRAFT` status.

For example:

```text
Create Application
       |
       v
Applicant Details
       |
       v
Documents
       |
       v
User leaves application
       |
       v
Application remains DRAFT
```

When the user returns:

```text
Dashboard
    |
    v
Continue Application
    |
    v
Load Application
    |
    v
Restore existing data
    |
    v
Continue from current step
```

Previously uploaded documents are also displayed when the draft is resumed.

---

# Authentication

CertiFlow uses JWT authentication through an HTTP-only cookie.

The frontend does not store the JWT in:

```text
localStorage
sessionStorage
```

Authenticated API requests send credentials so the browser can send the HTTP-only authentication cookie.

Authentication endpoints include:

```text
POST /auth/register
POST /auth/login
GET  /auth/me
POST /auth/logout
```

The backend is responsible for setting and clearing the authentication cookie.

---

# Application API

## Create Application

```http
POST /applications
```

Creates a new draft application.

---

## Get Applications

```http
GET /applications
```

Returns applications belonging to the authenticated user.

---

## Get Application

```http
GET /applications/:id
```

Returns application details and uploaded document information.

---

## Update Application

```http
PATCH /applications/:id
```

Updates applicant information.

---

## Upload / Replace Document

```http
POST /applications/:id/documents
```

Uses:

```text
multipart/form-data
```

Fields:

```text
documentType
file
```

Supported document types:

```text
ID_PROOF
DEGREE_CERTIFICATE
```

Documents must be PDF files and must not exceed 5 MB.

Uploading another document with the same document type replaces the existing document.

---

## Preview Document

```http
GET /applications/:id/documents/:documentId/view
```

The backend generates a signed URL for the private S3 object.

The frontend does not construct S3 URLs or expose S3 keys.

---

## Submit Application

```http
POST /applications/:id/submit
```

Submitting an application causes the backend to:

1. Validate applicant information
2. Validate required documents
3. Generate a reference number
4. Generate the provisional certificate PDF
5. Upload the certificate to S3
6. Mark the application as submitted
7. Save submission information

---

## Download Certificate

```http
GET /applications/:id/certificate/download
```

The backend generates a signed S3 download URL.

The frontend uses the returned URL to download the certificate.

---

# Application Status

The backend supports:

```text
DRAFT
SUBMITTED
COMPLETED
```

The current frontend workflow primarily uses:

```text
DRAFT
SUBMITTED
```

Application progress is represented by:

```text
currentStep
```

The application flow consists of:

```text
1. Applicant Details
2. Documents
3. Review
```

---

# Document Storage

Documents and generated certificates are stored in a private Amazon S3 bucket.

The frontend never directly constructs S3 URLs.

For private document access, the backend generates signed URLs.

This keeps S3 objects private while allowing authorized users to access their documents.

---

# Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB
- AWS account with an S3 bucket

---

# Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd certiflow
```

The project contains two applications:

```text
frontend/
backend/
```

Install dependencies separately.

---

# Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

using the environment variables described below.

Run the backend in development mode:

```bash
npm run dev
```

The development script uses `tsx watch` and loads the `.env` file automatically.

---

# Backend Environment Variables

Create:

```text
backend/.env
```

with:

```env
PORT=
DB_PATH=

JWT_SECRET=

ALLOWED_ORIGINS=
COOKIE_DOMAIN_NAME=
NODE_ENV=

AWS_REGION=
S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express server |
| `DB_PATH` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `ALLOWED_ORIGINS` | Allowed frontend origin(s) for CORS |
| `COOKIE_DOMAIN_NAME` | Cookie domain configuration |
| `NODE_ENV` | Runtime environment such as development or production |
| `AWS_REGION` | AWS region containing the S3 bucket |
| `S3_BUCKET_NAME` | Private S3 bucket used for documents and certificates |
| `AWS_ACCESS_KEY_ID` | AWS access key used by the backend |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key used by the backend |

Never commit `.env` files or secret values to Git.

---

# Backend Production Build

Build the backend:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```

The build process compiles TypeScript and applies TypeScript path aliases.

---

# Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=
```

Set this to the backend API URL.

For local development, for example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use the actual port configured by the backend.

---

# Run Frontend

Start the Next.js development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# Frontend Production Build

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Lint:

```bash
npm run lint
```

---

# Environment Files

The project uses separate environment configuration for frontend and backend.

```text
certiflow/
├── frontend/
│   └── .env.local
│
└── backend/
    └── .env
```

Do not commit environment files containing secrets.

The frontend only exposes variables prefixed with:

```text
NEXT_PUBLIC_
```

Never put private AWS credentials, JWT secrets, database credentials, or other backend secrets in the frontend environment.

---

# AWS S3

CertiFlow uses Amazon S3 for private document and certificate storage.

The backend requires:

```env
AWS_REGION=
S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

The S3 bucket should remain private.

The application uses backend-generated signed URLs for document viewing and certificate downloads.

---

# S3 CORS

If the frontend downloads or previews a private S3 object directly through a signed URL, the S3 bucket must allow requests from the deployed frontend origin.

For local development, the frontend origin is typically:

```text
http://localhost:3000
```

For production, configure the actual deployed frontend origin.

Do not expose the S3 bucket publicly just to solve CORS issues.

---

# Security Considerations

CertiFlow uses several security measures:

- JWT authentication
- HTTP-only authentication cookies
- Password hashing with bcrypt
- Helmet security middleware
- CORS restrictions
- Request validation
- Private S3 storage
- Signed S3 URLs
- User ownership checks for applications and certificates

The frontend does not expose:

```text
JWT tokens
S3 keys
AWS credentials
MongoDB credentials
```

---

# Development Notes

The frontend uses TanStack Query for server state and API interactions.

Feature-specific functionality is organized under:

```text
src/module/
```

This keeps authentication, dashboard, applicant details, documents, review, and submission functionality separated without introducing unnecessary architectural complexity.

---

# Scripts

## Frontend

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Backend

```bash
npm run dev
npm run build
npm start
```

---

# Project Goal

CertiFlow provides a simple end-to-end workflow for provisional certificate applications:

```text
Authentication
     |
     v
Application
     |
     v
Applicant Details
     |
     v
Document Upload
     |
     v
Review
     |
     v
Submission
     |
     v
Certificate Generation
     |
     v
Certificate Download
```

The project focuses on a clean user experience, secure document handling, and a straightforward full-stack architecture.
