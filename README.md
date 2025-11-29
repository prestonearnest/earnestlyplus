# Real Estate Investment Analysis Tool

A comprehensive web application for managing and analyzing your real estate investment portfolio.

## Features

### Portfolio Management
- **Property Tracking**: Add and manage multiple properties with detailed information
- **Mortgage Management**: Track loan details, balances, and payments
- **Property Types**: Support for single-family, multi-family, condos, townhouses, commercial properties, and land

### Financial Analysis
- **Performance Metrics**:
  - ROI (Return on Investment)
  - Cap Rate (Capitalization Rate)
  - Cash-on-Cash Return
  - Net Cash Flow
  - Debt-to-Equity Ratio

### Income & Expense Tracking
- **Rental Income**: Track rent payments, deposits, and other income
- **Expense Categories**: Maintenance, repairs, utilities, management fees, insurance, taxes, HOA fees
- **Transaction History**: View all income and expenses with filtering options

### Visualizations & Analytics
- **Portfolio Charts**:
  - Property value distribution
  - Property type distribution
  - ROI comparison across properties
  - Income vs Expenses over time
  - Expense breakdown by category

### Data Management
- **Local Storage**: All data stored locally in your browser using IndexedDB
- **Export/Import**: Backup and restore your portfolio data as JSON files

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Database**: IndexedDB (via Dexie.js)
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Add Your First Property**: Click "Add Property" to enter details about your investment property
2. **Track Transactions**: Use "Add Income" and "Add Expense" to record financial activities
3. **View Analytics**: Navigate to the "Analytics" tab to see detailed charts and visualizations
4. **Export Data**: Regularly export your portfolio data for backup purposes

## Data Privacy

All data is stored locally in your browser. No information is sent to external servers. Your investment data stays private and secure on your device.

## Packaging as Mac Desktop App

To convert this web app into a Mac desktop application, you can use Electron:

```bash
# Install Electron
npm install -D electron electron-builder

# Build the web app first
npm run build

# Configure Electron and build for Mac
# (Additional configuration required)
```

## License

MIT
