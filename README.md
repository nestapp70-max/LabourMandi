LabourMandi

LabourMandi is a full-stack web platform designed to connect individuals and businesses with skilled workers such as plumbers, electricians, carpenters, welders, and more. The project includes a modern frontend built with React and Vite, and a backend powered by Express/Node.js.

The application provides an easy way for users to post jobs, browse available technicians, and manage work requests.

Features
Frontend

Built using React, TypeScript, and Vite

Modern, responsive UI

Tailwind CSS and ShadCN component system

Hero image carousel with category-based slides

Job posting interface

User authentication flow

Dynamic components and clean routing structure

Backend

Express-based API server

REST endpoints for job creation, login, signup and worker listings

TypeScript support

Production build bundling via esbuild

General

Full stack project structure

Works well on both desktop and mobile

Deployable on Render or any Node.js hosting platform

Project Structure
LabourMandi/
│
├── client/                     # Frontend
│   ├── src/
│   ├── public/
│   ├── components/
│   ├── attached_assets/
│   │   └── generated_images/   # Carousel images
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Backend
│   ├── index.ts
│   ├── index-prod.ts
│   ├── routes/
│   ├── db/
│   └── package.json
│
├── shared/
├── README.md
└── tsconfig.json

Running the Project Locally
Prerequisites

Node.js (LTS version recommended)

npm or yarn

1. Install Dependencies
Client:
cd client
npm install

Server:
cd server
npm install

2. Start Development Servers
Client:
npm run dev

Server:
npm run dev


Frontend runs on Vite (default: port 5173)
Backend runs on Node/Express (default: port 3000 or configured value)

Building for Production
Client:
npm run build

Server:
npm run build

Deploying on Render

Render requires a custom build and start command due to the dual project structure.

Build Command
npm install && npm run build

Start Command
node dist/index.js

Important Notes for Deployment

Ensure all image assets are committed to your repository

Update import paths in the frontend to match actual folder structure

Make sure attached_assets/generated_images is included and not ignored by .gitignore

If images are missing during build, update your paths inside the React components accordingly.

Technologies Used
Frontend

React

TypeScript

Vite

Tailwind CSS

ShadCN UI

Lucide Icons

Backend

Node.js

Express

TypeScript

Esbuild

Contribution

Contributions, issues, and suggestions are welcome.
Fork the repository and submit a pull request for any feature or fix.

License

This project is licensed under the MIT License.
