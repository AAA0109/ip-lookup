# IP Security Lookup Graph

This application allows you to look up security information about an IP address using the AbuseIPDB API and visualize the results in a graph using React Flow with Dagre layout.

## Features

- Input an IP address (default: 38.114.121.200)
- Fetch security information from AbuseIPDB
- Visualize the data as a graph with the IP as the parent node and data points as child nodes
- Auto-layout using Dagre algorithm
- View the full JSON response

## Setup Instructions

### Prerequisites

- Node.js 20+ installed
- An AbuseIPDB API key (get one at [AbuseIPDB](https://www.abuseipdb.com/))

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your AbuseIPDB API key:
   ```
   ABUSEIPDB_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- React Flow
- Dagre (for graph layout)
