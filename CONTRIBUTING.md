# Contributing to TheraGPT

First off, thank you for considering contributing to TheraGPT! This is an AI-powered Cognitive Behavioral Therapy journal application designed to help users identify, analyze, and reframe troubling thoughts and feelings.

While TheraGPT is primarily a solo project, I welcome contributions from the community in the form of bug fixes, improvements, and suggestions. This document provides guidelines and information to make the contribution process smooth and effective.

## Table of Contents

- [Project Status](#project-status)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Code Contributions](#code-contributions)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Communication](#communication)
- [License](#license)

## Project Status

TheraGPT is a side project maintained by a parent of two young children with a full-time job. While I'm committed to the project and value your contributions, please understand that response times to issues, pull requests, and discussions may take 7-14 days depending on my schedule.

## How Can I Contribute?

### Reporting Bugs

If you encounter a bug while using TheraGPT, please open an issue using the bug report template. Include as much detail as possible:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment (browser, OS, device)
- Any additional context that might be helpful

### Suggesting Enhancements

Have an idea to make TheraGPT better? I'd love to hear it! Open an issue using the feature request template and include:

- A clear and descriptive title
- A detailed description of the proposed feature
- Any potential implementation details you have in mind
- Why this feature would be beneficial to TheraGPT users
- Any relevant examples, mockups, or references

### Code Contributions

If you'd like to contribute code to TheraGPT, please follow these steps:

1. Check the issues list for tasks labeled "good first issue" or "help wanted"
2. Comment on the issue you'd like to work on to avoid duplicate efforts
3. Fork the repository and create a branch for your feature
4. Implement your changes following the [Development Workflow](#development-workflow)
5. Submit a pull request with a clear description of the changes

## Development Workflow

1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/theragpt-app.git
   cd theragpt-app
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Make your changes
6. Test your changes:
   ```bash
   pnpm test
   ```
7. Commit your changes with a descriptive message:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
8. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
9. Create a pull request from your fork to the main repository

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation as needed
3. Include tests for new features
4. Ensure all tests pass
5. Link the PR to any related issues
6. Wait for review and address any feedback

## Coding Standards

- Follow the existing code style and conventions
- Use meaningful variable and function names
- Write clear comments for complex logic
- Keep functions small and focused
- Write tests for new functionality
- Use TypeScript types appropriately
- Follow React best practices for components

## Communication

- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Use GitHub discussions for questions, ideas, and general conversation about TheraGPT
- **Pull Requests**: Use pull requests for code contributions

Please keep all communication respectful and constructive. Remember that this is a project aimed at mental well-being, and that extends to our community interactions as well.

## License

By contributing to TheraGPT, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

---

Thank you for contributing to TheraGPT and helping make mental health tools more accessible to everyone!