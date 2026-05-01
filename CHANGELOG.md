# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Docker ignore files for both backend and frontend to optimize build context
- Environment example file for backend configuration (.env.example)

### Changed
- **Backend**
  - Enhanced authentication module with improved JWT strategy and service
  - Updated Bible service with refined controller and service logic
  - Improved readings controller and service implementation
  - Enhanced summary controller and service with better error handling
  - Updated Dockerfile for optimized containerization
  - Updated package dependencies

- **Frontend**
  - Enhanced profile page layout and styling
  - Improved summary page with better data handling
  - Updated AuthContext with refined authentication flow
  - Enhanced useAuth hook with improved state management
  - Improved useSummary hook for better data fetching
  - Updated API utility with refined endpoint handling
  - Updated Dockerfile for optimized build
  - Updated package dependencies

- **Infrastructure**
  - Improved docker-compose configuration

### Fixed
- API integration consistency
- Authentication flow improvements

---

Generated on: May 1, 2026
