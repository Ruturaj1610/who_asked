# Contributing to Kon Re?

Thank you for your interest in contributing to Kon Re? - the anonymous question party game! 🎉

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/who_asked.git
   cd who_asked
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```
   This will start both the backend (port 3001) and frontend (port 3000) servers.

## Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Backend code is in `backend/server.js`
   - Frontend components are in `frontend/src/components/`
   - Styles are in `frontend/src/App.css`

3. **Test your changes**
   - Ensure both servers run without errors
   - Test the game flow from start to finish
   - Check that multiplayer functionality works

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Guidelines

Follow conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Pull Request Process

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with:
     - Description of changes
     - Screenshots (if UI changes)
     - Testing steps

3. **Wait for review**
   - Address any feedback from reviewers
   - Make requested changes if needed

## Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and reusable

### CSS
- Use CSS variables for colors and common values
- Follow BEM naming convention for classes
- Keep styles organized and maintainable

### File Organization
- Place new components in `frontend/src/components/`
- Keep related files together
- Use descriptive file names

## Testing

Before submitting a PR, ensure:
- [ ] The game can be created and joined
- [ ] All game phases work correctly
- [ ] No console errors appear
- [ ] The UI is responsive on different screen sizes
- [ ] Socket.io connections work properly

## Reporting Bugs

If you find a bug:
1. Check if it's already reported in Issues
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and OS information

## Feature Requests

Have an idea for a new feature?
1. Check if it's already suggested in Issues
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

## Questions?

Feel free to:
- Open an issue for questions
- Reach out to the maintainers
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Kon Re?! 🎮✨
