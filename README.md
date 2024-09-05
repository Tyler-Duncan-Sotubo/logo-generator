# AI Logo Generator Website

This repository contains the source code for an AI-powered logo generator website built using the **T3 Stack** with **Next.js**. The website allows users to create unique logos using the **DALL·E-3 API**, supports Google login for user authentication, and integrates with **Stripe** for handling payments.

## Features

- **DALL·E-3 API Integration**: Users can generate custom logos based on their input, using OpenAI's DALL·E-3 model.
- **Google Login**: Secure and fast authentication via Google OAuth 2.0.
- **Stripe Payments**: Stripe handles premium services, such as higher-quality logo generation or additional usage.
- **Responsive Design**: The UI is built to work seamlessly across devices, including mobile, tablet, and desktop.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Prisma (with PostgreSQL or another relational database)
- **Authentication**: Google OAuth using NextAuth.js
- **Payment**: Stripe API
- **AI**: DALL·E-3 API (provided by OpenAI)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** or **yarn**
- **PostgreSQL** (or another relational database supported by Prisma)
- **Google Developer Console** project with OAuth credentials
- **Stripe** account with API keys
- **OpenAI API key** for DALL·E-3

## Getting Started

Follow these steps to set up the project on your local machine:

### 1. Clone the repository:

```bash
git clone <repository-url>
cd ai-logo-generator
