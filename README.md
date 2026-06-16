# SmartInvest Portfolio Manager

## Overview

The SmartInvest Portfolio Manager is a full-stack investment tracking application that allows users to manage stock holdings, monitor portfolio performance, and visualize investment allocation.

This application was developed using React for the frontend and FastAPI with SQLAlchemy for the backend. It demonstrates CRUD operations, REST API development, database integration, and modern frontend-backend communication.

## Features

* Add stock holdings
* Update stock information
* Delete stocks
* Portfolio summary dashboard
* Profit and loss calculation
* Portfolio allocation pie chart
* Search stocks by symbol
* REST API documentation using Swagger UI

## Use Cases

### Portfolio Tracking

Investors can maintain a list of stock holdings and monitor their portfolio performance from a single dashboard. The system provides a consolidated view of investment allocations and portfolio value.

### Investment Analysis

The platform helps users evaluate their investments by tracking performance metrics and comparing individual holdings within the portfolio.

### Asset Allocation Monitoring

Users can understand how their investments are distributed across different assets and identify concentration risks in their portfolio.

### Risk Awareness

The dashboard provides visibility into portfolio composition, allowing investors to make informed decisions about diversification and risk management.

### Financial Planning

Investors can use the platform to review their investment positions regularly and support long-term financial planning objectives.

### Learning and Practice

The application serves as a practical example of how financial dashboards are built using modern web technologies, backend APIs, database management, and data visualization techniques.

### Data-Driven Decision Making

By presenting portfolio information through interactive charts and analytics, the platform enables users to make investment decisions based on organized financial data rather than manual tracking.

### Personal Wealth Management

Individual investors can use the application as a lightweight portfolio management tool to monitor holdings and review investment performance over time.

## Technology Stack

### Frontend

* React
* Axios
* Recharts
* CSS

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* SQLite

### Tools

* Git
* GitHub
* VS Code

## API Endpoints

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | /stocks            |
| POST   | /stocks            |
| PUT    | /stocks/{stock_id} |
| DELETE | /stocks/{stock_id} |
| GET    | /portfolio-summary |

## Screenshots

Project screenshots are available inside the screenshots folder.

## Future Enhancements

* User Authentication
* Live Stock Market API Integration
* Portfolio Performance Analytics
* Cloud Deployment
* Export Portfolio Reports

## Author

Chaitanya Naga Eeda

Full Stack Portfolio Management Application built using React, FastAPI, SQLAlchemy, and SQLite.
