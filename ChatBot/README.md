# Gemma: Next.js Chat App with LM Studio Integration

Gemma is a [Next.js](https://nextjs.org) application designed to interact with a **local LM Studio server** (OpenAI-compatible API). This project enables seamless communication with language models hosted locally, providing a robust and customizable chat interface.

## Features

- **Next.js Framework**: Leverages the power of Next.js for server-side rendering and optimized performance.
- **LM Studio Integration**: Connects to a local LM Studio server for AI model interactions.
- **Dynamic Routing**: Organized structure for handling semester, subject, and material-specific pages.
- **Customizable API**: Proxy API for secure and efficient communication with the LM Studio server.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org) (v16 or higher recommended)
- [LM Studio](https://lmstudio.ai) with a compatible model loaded

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Start LM Studio Local Server

1. Open LM Studio and load a model.
2. Start the server with the **OpenAI-compatible** option enabled.
3. Note the base URL (default: `http://localhost:1234/v1`).

### 2. Configure Environment Variables

This repository includes a `.env` file for configuration. Use `.env.example` as a reference. Update the following variables:

- `LMSTUDIO_API_BASE_URL`: Base URL of the LM Studio server (e.g., `http://localhost:1234/v1`).
- `LMSTUDIO_MODEL`: Model ID exposed by LM Studio (e.g., `google/gemma-4-e4b`).
- `LMSTUDIO_API_KEY`: API key for LM Studio (leave empty for local servers).

### 3. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 4. Run the Development Server

Start the development server with:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  globals.css       # Global styles
  layout.tsx        # Application layout
  page.tsx          # Home page
  api/
    chat/           # Chat API route
  components/
    ChatPanel.tsx   # Chat panel component
  sem/              # Semester-specific pages
    [semester]/
      page.tsx      # Semester overview
      [subject]/
        page.tsx    # Subject overview
        materials/  # Materials page
        qa/         # Q&A page
lib/
  catalog.ts        # Catalog utilities
  lmstudio.ts       # LM Studio utilities
  server-env.ts     # Server environment configuration
public/
  courses.json      # Course data
  materials.json    # Materials data
```

## API Overview

The application uses the following API endpoint:

- **POST /api/chat**: Proxies requests to the LM Studio server. Ensure the LM Studio server is running and accessible.

## Deployment

To deploy the application, consider using [Vercel](https://vercel.com), the platform built by the creators of Next.js. Follow the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed instructions.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs): Learn about Next.js features and APIs.
- [LM Studio Documentation](https://lmstudio.ai/docs): Explore LM Studio capabilities.
- [Vercel Platform](https://vercel.com): Deploy your Next.js app effortlessly.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the [MIT License](LICENSE).
