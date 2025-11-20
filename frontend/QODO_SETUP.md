# Qodo Setup Guide for Zali Frontend

This document provides information about the Qodo configuration for this Next.js + Web3 project.

## 📋 Overview

Qodo has been initialized for this project with configurations optimized for:
- **Next.js 16** with App Router
- **TypeScript** development
- **Web3/Blockchain** integration (Celo, Wagmi, RainbowKit)
- **React 19** best practices
- **Tailwind CSS** styling

## 📁 Configuration Files

### `.qodo.yaml`
The main Qodo configuration file containing:
- Project metadata and type
- Code review settings
- Testing configuration
- Documentation preferences
- Code quality thresholds
- Web3-specific security checks
- Build and deployment settings
- AI assistant context and standards

### `.qodoignore`
Specifies files and directories to exclude from Qodo analysis:
- Dependencies (`node_modules/`)
- Build outputs (`.next/`, `dist/`)
- Environment files (`.env*`)
- Generated files and source maps
- IDE and OS-specific files

## 🚀 Key Features Enabled

### 1. **Automatic Code Review**
- Reviews code for security vulnerabilities
- Checks Web3 interaction patterns
- Validates React best practices
- Ensures TypeScript type safety

### 2. **Web3 Security Checks**
- Private key exposure detection
- Contract address validation
- Transaction signing verification
- RPC endpoint validation

### 3. **Code Quality Standards**
- Maximum function length: 50 lines
- Maximum file length: 500 lines
- Maximum cyclomatic complexity: 10
- ESLint integration
- TypeScript strict mode

### 4. **Performance Monitoring**
- Bundle size limits
- Performance budgets for FCP and TTI
- Build optimization suggestions

### 5. **Custom Rules**
- No `console.log` in production code
- Environment variables for RPC URLs
- Proper error handling in async functions

## 🛠️ Usage

### Basic Commands

```bash
# Run code review
qodo review

# Check code quality
qodo quality

# Generate documentation
qodo docs

# Run security scan
qodo security

# Analyze performance
qodo performance
```

### Integration with Development Workflow

1. **Before Committing:**
   ```bash
   qodo review --staged
   ```

2. **Before Pull Request:**
   ```bash
   qodo review --full
   qodo quality --check
   ```

3. **Continuous Integration:**
   Add Qodo checks to your CI/CD pipeline

## 🎯 Focus Areas

Qodo is configured to pay special attention to:

1. **Security**
   - Private key handling
   - Smart contract interactions
   - User input validation
   - Transaction security

2. **Performance**
   - Bundle size optimization
   - Code splitting
   - Lazy loading
   - React rendering optimization

3. **Best Practices**
   - React Hooks rules
   - TypeScript strict typing
   - Error boundary implementation
   - Proper state management

4. **Web3 Patterns**
   - Wallet connection handling
   - Transaction error handling
   - Network switching
   - Gas estimation

## 📝 Coding Standards

The AI assistant is configured with these standards:

- ✅ Follow React best practices and hooks rules
- ✅ Use TypeScript strict mode
- ✅ Implement proper error handling for Web3 interactions
- ✅ Use async/await for asynchronous operations
- ✅ Follow Next.js App Router conventions
- ✅ Ensure responsive design with Tailwind
- ✅ Handle wallet connection states properly
- ✅ Validate user inputs and transaction parameters

## 🔒 Security Features

### Secret Detection
Qodo will alert you if it detects:
- Private keys
- API keys
- Passwords
- Mnemonics
- Other sensitive data

### Dependency Scanning
- Automatic vulnerability scanning
- Severity threshold: medium and above
- Regular dependency updates recommended

## 📊 Performance Budgets

- **Max Initial Bundle:** 500 KB
- **Max Total Bundle:** 2000 KB
- **First Contentful Paint:** < 2000ms
- **Time to Interactive:** < 5000ms

## 🔧 Customization

To customize Qodo settings:

1. Edit `.qodo.yaml` for general configuration
2. Edit `.qodoignore` to change ignored files
3. Adjust thresholds and rules as needed
4. Add project-specific custom rules

## 📚 Additional Resources

- [Qodo Documentation](https://qodo.ai/docs)
- [Next.js Best Practices](https://nextjs.org/docs)
- [Web3 Security Guide](https://consensys.github.io/smart-contract-best-practices/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

When contributing to this project:

1. Ensure Qodo checks pass before submitting PR
2. Follow the commit message format: `type(scope): description`
3. Add tests for new features
4. Update documentation as needed

## 📞 Support

For Qodo-related issues:
- Check the [Qodo documentation](https://qodo.ai/docs)
- Review configuration in `.qodo.yaml`
- Consult the team for project-specific guidelines

---

**Note:** This configuration is optimized for the Zali Frontend project. Adjust settings based on your team's specific needs and preferences.
