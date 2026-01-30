# Tailored Solutions Website Installer

A user-friendly desktop application to help anyone set up the Tailored Solutions home improvements business website, even with zero coding experience.

## Features

- **Step-by-step wizard** - Guides users through the entire setup process
- **System requirements check** - Automatically verifies Node.js, npm, and Git are installed
- **One-click installation** - Downloads and sets up all website files automatically
- **Business configuration** - Easy form to enter business details
- **API setup guide** - Clear instructions for setting up external services (OpenAI, email, etc.)
- **Cross-platform** - Works on both macOS and Windows

## Building the Installer

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

```bash
# Navigate to installer directory
cd apps/installer

# Install dependencies
npm install
```

### Development

```bash
# Run in development mode
npm start
```

### Building for Distribution

```bash
# Build for current platform
npm run build

# Build for macOS only
npm run build:mac

# Build for Windows only
npm run build:win

# Build for all platforms
npm run build:all
```

The built installers will be in the `dist` folder:
- macOS: `.dmg` and `.zip` files
- Windows: `.exe` installer and portable `.exe`

## Icons

Before building, add your app icons to the `assets` folder:
- `icon.png` - PNG icon (512x512 or larger)
- `icon.icns` - macOS icon
- `icon.ico` - Windows icon

You can generate `.icns` and `.ico` files from a PNG using online tools or:
- macOS: Use `iconutil` or apps like Image2Icon
- Windows: Use online converters or GIMP

## Customization

### Changing the Repository URL

Edit `main.js` and update the clone command in the `clone-repo` handler to point to your GitHub repository.

### Modifying Steps

The installer UI is defined in `index.html`. Each step is a `<div class="step-content">` element with a corresponding sidebar item.

### Styling

All styles are in the `<style>` tag in `index.html`. The design uses CSS custom properties for easy theme customization.

## Workflow for End Users

1. **Download** - User downloads the installer for their platform
2. **Run** - User opens the installer application
3. **Requirements** - Installer checks if Node.js, npm, and Git are installed
4. **Install** - User selects a folder and the installer downloads the website
5. **Configure** - User enters their business details
6. **API Setup** - User adds API keys (optional)
7. **Launch** - User can launch the website locally

## What Gets Installed

- Complete Next.js website with all components
- Content Management System (CMS)
- Booking system
- WhisperAI transcription feature
- All necessary dependencies

## Support

For issues or questions, please open an issue on the GitHub repository.
