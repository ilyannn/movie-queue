# MovieQueue - Collaborative Movie Planning App

A collaborative platform for managing and sharing movie watch lists with friends.

**Under construction!**

## Overview

MovieQueue allows users to create and manage movie queues collaboratively. Users can search for movies, add them to queues, share with groups, and get AI-powered reviews.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) with server components
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Data Storage**:
  - [Elasticsearch](https://www.elastic.co/) for movie queues and search
  - [Redis](https://redis.io/) for caching and task queues
  - [Supabase Storage](https://supabase.com/storage) for group assets
- **External APIs**:
  - [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
  - [Kagi](https://kagi.com/) for movie review information
  - [Claude API](https://www.anthropic.com/claude) for review generation
- **Localization**: [i18next](https://www.i18next.com/)
- **Observability**: [Elastic Observability](https://www.elastic.co/observability)
- **Deployment**: custom [Hetzner](https://www.hetzner.com/cloud) server

## Architecture

The app follows a 3-tier architecture with unidirectional data flow for predictable state management:

- **Presentation Layer**: Next.js components with real-time updates
- **Application Layer**: API routes and service handlers
- **Persistence Layer**: Distributed data storage

## Features Overview

- **Search:** Use TMDB API for detailed movie searches
- **Queue:**: Personal and shared watch queues.
- **Real-Time Collaboration:** Group creation, live queue updates.
- **AI Movie Reviews:** Integration with Kagi and Claude API for dynamic insights.
- **Localization:** Multi-language support in search and UI.

### Key Features by Stage

#### Stage 1: MVP

- Basic authentication
- Movie search and details
- Personal queue

#### Stage 2: Enhanced Experience

- Improved search
- Queue order management
- Multi-language support

#### Stage 3: Collaboration

- Redis caching implementation
- Group creation and management
- Watch status tracking

#### Stage 4: Rich Features

- AI-powered movie reviews
- Enhanced movie details
- Observability

### Stage 5: Advanced Features

- Real-time collaboration
