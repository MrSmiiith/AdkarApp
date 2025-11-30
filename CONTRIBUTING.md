# Contributing to Adkar

First off, thank you for considering contributing to Adkar! It's people like you that make this app better for the Muslim community worldwide.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include as many details as possible:

**Bug Report Template:**
```
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Device Info:**
 - Device: [e.g., iPhone 12, Samsung Galaxy S21]
 - OS: [e.g., iOS 15.0, Android 12]
 - App Version: [e.g., 1.0.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Features

Feature requests are welcome! Please provide:
- Clear description of the feature
- Why it would be useful
- How it aligns with Islamic values
- Whether you'd be willing to implement it

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the code style** - we use TypeScript and ESLint
3. **Test your changes** - make sure the app runs on both iOS and Android
4. **Update documentation** if needed
5. **Write clear commit messages**

#### Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference issues when applicable

Examples:
```
✅ Add audio recitation feature
✅ Fix prayer time notification on iOS
✅ Update Quran translation API
```

## 📋 Development Process

### Setting Up Development Environment

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Adkar.git
   cd Adkar/AdkarApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Run on device/emulator:
   ```bash
   npm run ios     # iOS
   npm run android # Android
   ```

### Code Style

- **TypeScript**: All new code should be in TypeScript
- **ESLint**: Run `npm run lint` before committing
- **Prettier**: Code is auto-formatted
- **Naming**: Use camelCase for variables, PascalCase for components
- **Comments**: Add comments for complex logic

### Project Structure

- `src/screens/` - Screen components
- `src/components/` - Reusable components
- `src/services/` - API and business logic
- `src/store/` - State management (Zustand)
- `src/utils/` - Helper functions
- `src/constants/` - App constants

### Testing

Currently using manual testing. Automated tests coming soon!

Before submitting PR, manually test:
- [ ] Feature works on iOS
- [ ] Feature works on Android
- [ ] No console errors
- [ ] Offline functionality (if applicable)
- [ ] Dark mode appearance
- [ ] Arabic RTL layout (if applicable)

## 🕌 Islamic Content Guidelines

When adding Islamic content (Quran, Hadith, Adkar):

1. **Authenticity First**
   - Only use verified Islamic sources
   - Cite references (Bukhari, Muslim, Quran verse, etc.)
   - Double-check Arabic text accuracy

2. **Respect**
   - Handle Quranic text with utmost respect
   - Avoid decorative-only use of Quran verses
   - Ensure proper Arabic typography

3. **Accuracy**
   - Translations should be from reputable scholars
   - Verify hadith authenticity levels
   - Consult Islamic scholars when in doubt

4. **Inclusivity**
   - Support different madhabs (schools of thought)
   - Provide multiple calculation methods for prayer times
   - Avoid sectarian bias

## 🐛 Issue Labels

- `bug` - Something isn't working
- `feature` - New feature request
- `enhancement` - Improvement to existing feature
- `documentation` - Documentation updates
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `islamic-content` - Related to Quran/Hadith/Adkar
- `ui/ux` - User interface/experience

## 📱 Platform-Specific Considerations

### iOS
- Test on multiple iOS versions
- Check dark mode appearance
- Verify haptic feedback
- Test on different screen sizes

### Android
- Test on different Android versions
- Check Material Design compliance
- Verify notifications work properly
- Test on various manufacturers (Samsung, Google, etc.)

## ✅ Code Review Process

1. **Automated checks** must pass (linting, build)
2. **Manual review** by maintainers
3. **Testing** on physical devices
4. **Islamic content** verified if applicable
5. **Merge** when approved

## 🤲 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability
- Ethnicity, gender identity
- Level of experience
- Nationality, personal appearance
- Race, religion

### Our Standards

**Positive behavior:**
- Be respectful and kind
- Welcome newcomers
- Give constructive feedback
- Focus on what's best for the community
- Show empathy

**Unacceptable behavior:**
- Harassment or discrimination
- Trolling or insulting comments
- Political or sectarian arguments
- Publishing others' private information
- Any conduct violating Islamic ethics

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

## 📞 Contact

Questions? Reach out:
- Open an issue
- Email: [contact info]
- Discussions tab on GitHub

## 🙏 Recognition

Contributors will be:
- Listed in README
- Credited in releases
- Mentioned in change logs
- Part of a global effort to serve the Muslim community

---

**JazakAllahu Khairan** (May Allah reward you with goodness) for contributing!

*Working together to serve the Muslim Ummah* 🤲
