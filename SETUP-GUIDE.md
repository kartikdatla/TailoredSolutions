# Tailored Solutions - Website Setup Guide

## Complete Installation & Configuration Manual

**Version 1.0 | January 2026**

---

## Table of Contents

1. [Overview](#1-overview)
2. [System Requirements](#2-system-requirements)
3. [Initial Setup](#3-initial-setup)
4. [Starting the Website](#4-starting-the-website)
5. [Admin Panel Guide](#5-admin-panel-guide)
6. [Microsoft Teams Integration](#6-microsoft-teams-integration)
7. [WhisperAI Configuration](#7-whisperai-configuration)
8. [How the Consultation Flow Works](#8-how-the-consultation-flow-works)
9. [Daily Operations](#9-daily-operations)
10. [Troubleshooting](#10-troubleshooting)
11. [Costs & Billing](#11-costs--billing)

---

## 1. Overview

Your Tailored Solutions website is a complete business management system that includes:

- **Public Website** - Showcases your services, portfolio, and testimonials
- **Admin CMS** - Edit all website content without coding
- **Booking Calendar** - Manage consultation availability
- **WhisperAI Integration** - Automatically transcribe consultations and generate professional quotations

### Key URLs (when running locally)

| Page | URL |
|------|-----|
| Main Website | http://localhost:3001 |
| Admin CMS | http://localhost:3001/admin/cms |
| Calendar Management | http://localhost:3001/admin/calendar |
| WhisperAI Demo | http://localhost:3001/admin/test-transcription |

---

## 2. System Requirements

### Minimum Computer Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 2GB free space
- **Internet**: Broadband connection required

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org
   - Choose the "LTS" (Long Term Support) version

2. **Git** (for updates)
   - Download from: https://git-scm.com

3. **A Code Editor** (optional, for advanced changes)
   - Recommended: Visual Studio Code (free)
   - Download from: https://code.visualstudio.com

### Required Accounts

1. **OpenAI Account** (for WhisperAI transcription)
   - Sign up at: https://platform.openai.com
   - You'll need an API key and payment method

2. **Microsoft 365 Business Account** (for Teams integration)
   - Required for video consultations
   - Azure Active Directory access needed for webhook setup

---

## 3. Initial Setup

### Step 1: Install Node.js

1. Go to https://nodejs.org
2. Download the **LTS version** (e.g., "20.x LTS")
3. Run the installer and follow the prompts
4. Accept all default options
5. Restart your computer after installation

**To verify installation:**
- Open Terminal (Mac) or Command Prompt (Windows)
- Type: `node --version`
- You should see a version number like `v20.x.x`

### Step 2: Open the Project Folder

1. Navigate to the project folder:
   ```
   /Users/kartikdatla/Documents/home-improvements-business
   ```

2. Or wherever you've saved the project files

### Step 3: Install Dependencies

1. Open Terminal/Command Prompt
2. Navigate to the project folder:
   ```bash
   cd /path/to/home-improvements-business
   ```
3. Install all required packages:
   ```bash
   npm install
   ```
4. Wait for installation to complete (may take 2-5 minutes)

### Step 4: Configure Environment Variables

1. Find the file named `.env.example` in the project root
2. Copy it and rename to `.env.local`
3. Open `.env.local` in a text editor
4. Fill in your API keys:

```env
# OpenAI API Key (for WhisperAI)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Microsoft Teams Integration (see Section 6)
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id

# Website URL (change for production)
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001

# Twilio (optional - for WhatsApp notifications)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

---

## 4. Starting the Website

### Starting the Development Server

1. Open Terminal/Command Prompt
2. Navigate to the project folder
3. Run the following command:
   ```bash
   npm run dev
   ```
4. Wait for the message: "Ready in X.Xs"
5. Open your web browser and go to: **http://localhost:3001**

### Stopping the Server

- Press `Ctrl + C` in the Terminal window
- Or simply close the Terminal window

### Quick Start Script (Optional)

You can create a shortcut to start the website:

**For Mac:**
1. Open TextEdit
2. Paste:
   ```bash
   #!/bin/bash
   cd /path/to/home-improvements-business
   npm run dev
   ```
3. Save as `start-website.command`
4. Make it executable: `chmod +x start-website.command`
5. Double-click to run

**For Windows:**
1. Open Notepad
2. Paste:
   ```batch
   cd C:\path\to\home-improvements-business
   npm run dev
   pause
   ```
3. Save as `start-website.bat`
4. Double-click to run

---

## 5. Admin Panel Guide

### Accessing the Admin Panel

1. Start the website (see Section 4)
2. Go to: **http://localhost:3001/admin/cms**

### Editing Business Information

1. Click on **"Business Info"** tab
2. Edit your:
   - Business Name
   - Tagline
   - Phone Number
   - Email Address
   - WhatsApp Number
   - Service Area
   - Business Hours
3. Click **"Save Changes"** (green button, top right)

### Editing Statistics

1. Click on **"Statistics"** tab
2. Update your numbers:
   - Years of Experience
   - Projects Completed
   - Client Satisfaction (%)
   - Star Rating (out of 5)
   - Referral Rate (%)
3. Click **"Save Changes"**

### Managing Testimonials

1. Click on **"Testimonials"** tab
2. **To add a new testimonial:**
   - Click **"+ Add Testimonial"** (green button)
   - Fill in: Client Name, Location, Service Type
   - Write the testimonial text
   - Set the star rating (click stars)
   - Check "Featured" if you want it highlighted
3. **To delete a testimonial:**
   - Click the trash icon next to the testimonial
4. Click **"Save Changes"**

### Managing Portfolio

1. Click on **"Portfolio"** tab
2. **To add a new project:**
   - Click **"+ Add Project"** (green button)
   - Fill in: Project Title, Category, Year, Location
   - Write a description
   - Click "Add Images" to upload photos
   - Check "Featured Project" for homepage display
3. Click **"Save Changes"**

---

## 6. Microsoft Teams Integration

### Overview

The Microsoft Teams integration allows you to:
- Conduct video consultations with clients
- Automatically record meetings (with consent)
- Send recordings to WhisperAI for transcription
- Generate professional quotation documents

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONSULTATION FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CLIENT BOOKS         2. TEAMS MEETING        3. RECORDING   │
│     CONSULTATION            CREATED                 SAVED       │
│         │                      │                      │         │
│         ▼                      ▼                      ▼         │
│   ┌──────────┐          ┌──────────┐          ┌──────────┐     │
│   │ Calendar │ ──────▶  │ MS Teams │ ──────▶  │  Azure   │     │
│   │ Booking  │          │  Meeting │          │  Storage │     │
│   └──────────┘          └──────────┘          └──────────┘     │
│                                                      │          │
│                                                      ▼          │
│  6. QUOTATION           5. AI SUMMARY          4. WHISPER      │
│     SENT TO CLIENT         GENERATED             TRANSCRIBES   │
│         │                      │                      │         │
│         ▼                      ▼                      ▼         │
│   ┌──────────┐          ┌──────────┐          ┌──────────┐     │
│   │  Email   │ ◀──────  │  GPT-4   │ ◀──────  │ WhisperAI│     │
│   │   PDF    │          │ Analysis │          │   API    │     │
│   └──────────┘          └──────────┘          └──────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Teams Setup

#### Part A: Create Azure App Registration

1. Go to: https://portal.azure.com
2. Sign in with your Microsoft 365 admin account
3. Search for **"App registrations"** in the search bar
4. Click **"+ New registration"**
5. Fill in:
   - **Name**: "Tailored Solutions Consultation App"
   - **Supported account types**: "Accounts in this organizational directory only"
   - **Redirect URI**: Select "Web" and enter: `http://localhost:3001/api/auth/callback/azure`
6. Click **"Register"**

#### Part B: Note Your App Credentials

After registration, you'll see an overview page. Copy these values:

1. **Application (client) ID** → This is your `AZURE_CLIENT_ID`
2. **Directory (tenant) ID** → This is your `AZURE_TENANT_ID`

#### Part C: Create Client Secret

1. In your app registration, click **"Certificates & secrets"** in the left menu
2. Click **"+ New client secret"**
3. Enter a description: "Consultation App Secret"
4. Choose expiry: "24 months"
5. Click **"Add"**
6. **IMMEDIATELY copy the secret value** → This is your `AZURE_CLIENT_SECRET`

   ⚠️ **Important**: You can only see this value once! Copy it now.

#### Part D: Set API Permissions

1. Click **"API permissions"** in the left menu
2. Click **"+ Add a permission"**
3. Select **"Microsoft Graph"**
4. Select **"Delegated permissions"**
5. Search and add these permissions:
   - `OnlineMeetings.ReadWrite`
   - `Calendars.ReadWrite`
   - `User.Read`
6. Click **"Add permissions"**
7. Click **"Grant admin consent for [Your Organization]"**
8. Click **"Yes"** to confirm

#### Part E: Enable Meeting Recording

1. Go to: https://admin.teams.microsoft.com
2. Sign in with your admin account
3. Navigate to: **Meetings** → **Meeting policies**
4. Click on **"Global (Org-wide default)"**
5. Under "Recording & transcription":
   - Set **"Cloud recording"** to **On**
   - Set **"Transcription"** to **On**
6. Click **"Save"**

#### Part F: Configure Webhook for Recording Notifications

1. In Azure Portal, go to your app registration
2. Click **"Expose an API"** in the left menu
3. Click **"+ Add a scope"**
4. Set the Application ID URI (accept default or customize)
5. Add scope:
   - **Scope name**: `access_as_user`
   - **Admin consent display name**: "Access Tailored Solutions"
   - **Admin consent description**: "Allow the app to access consultation recordings"
6. Click **"Add scope"**

Now configure the webhook subscription:

1. Your API endpoint for Teams webhooks is:
   ```
   https://your-domain.com/api/webhooks/teams
   ```
2. For local testing with ngrok:
   ```bash
   # Install ngrok: https://ngrok.com
   ngrok http 3001
   # Use the https URL provided, e.g.:
   # https://abc123.ngrok.io/api/webhooks/teams
   ```

#### Part G: Update Environment Variables

Add these to your `.env.local` file:

```env
AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_CLIENT_SECRET=your-secret-value-here
AZURE_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 7. WhisperAI Configuration

### What is WhisperAI?

WhisperAI is OpenAI's speech-to-text service. It:
- Converts your consultation recordings to text
- Supports multiple languages and accents
- Is highly accurate for technical conversations
- Runs in the cloud (no local installation needed)

### Getting Your OpenAI API Key

1. Go to: https://platform.openai.com
2. Sign up or log in
3. Click on your profile icon (top right)
4. Select **"View API keys"**
5. Click **"+ Create new secret key"**
6. Give it a name: "Tailored Solutions"
7. Copy the key immediately (starts with `sk-`)
8. Add to your `.env.local`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

### Setting Up Billing

1. In OpenAI dashboard, click **"Settings"** → **"Billing"**
2. Click **"Add payment method"**
3. Enter your card details
4. Set a **monthly spending limit** (recommended: £20-50 to start)

### How Transcription Works

```
┌─────────────────────────────────────────────────────────────┐
│                 WHISPERAI TRANSCRIPTION FLOW                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   AUDIO FILE              WHISPER API           TEXT OUTPUT │
│   (from Teams)            (OpenAI)              (Transcript)│
│        │                      │                      │      │
│        ▼                      ▼                      ▼      │
│   ┌─────────┐            ┌─────────┐            ┌─────────┐│
│   │  .mp4   │  ──────▶   │ Whisper │  ──────▶   │  JSON   ││
│   │  .m4a   │   Upload   │  Model  │   Return   │  Text   ││
│   │  .webm  │            │         │            │ + Times ││
│   └─────────┘            └─────────┘            └─────────┘│
│                                                      │      │
│                                                      ▼      │
│                                               ┌─────────┐  │
│                                               │  GPT-4  │  │
│                                               │ Summary │  │
│                                               │ & Quote │  │
│                                               └─────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Supported Audio Formats

- MP3, MP4, MPEG, MPGA
- M4A, WAV, WEBM
- Maximum file size: 25MB
- For longer recordings, files are automatically split

### Cost Breakdown

| Service | Cost | Example |
|---------|------|---------|
| Whisper Transcription | £0.006 per minute | 15-min call = £0.09 |
| GPT-4 Summary | ~£0.03 per summary | Per consultation |
| **Total per consultation** | **~£0.12 - £0.15** | Varies by length |

**Monthly estimate**: 20 consultations × £0.15 = **£3/month**

---

## 8. How the Consultation Flow Works

### Complete End-to-End Process

#### Step 1: Client Books Consultation

1. Client visits your website
2. Clicks "Book Consultation" or "Get Quote"
3. Fills in contact form with details about their project
4. Selects available time slot from your calendar

#### Step 2: Confirmation & Meeting Setup

1. System automatically creates Microsoft Teams meeting
2. Client receives email with:
   - Meeting link
   - Date and time
   - Recording consent notice
3. You receive notification of new booking

#### Step 3: Conduct the Consultation

1. Join the Teams meeting at scheduled time
2. At the start, confirm recording consent:
   > "Before we begin, I'd like to let you know this consultation will be recorded so I can provide you with an accurate quotation. Is that okay with you?"
3. Discuss the client's requirements
4. Take notes if needed (backup)
5. End the meeting when finished

#### Step 4: Automatic Processing

After the meeting ends, the system automatically:

1. **Retrieves the recording** from Microsoft Teams
2. **Sends to WhisperAI** for transcription
3. **Analyzes with GPT-4** to extract:
   - Key discussion points
   - Work items identified
   - Technical requirements
   - Client preferences
   - Estimated costs

#### Step 5: Review & Edit Quotation

1. Go to: http://localhost:3001/admin/consultations
2. Find the consultation in the list
3. Click to view the generated document
4. Click **"Edit & Customize Quotation"**
5. Review and adjust:
   - Work items and descriptions
   - Pricing (min/max ranges)
   - Priority levels (Essential/Recommended/Optional)
   - Timeline
   - Additional notes
6. Click **"Save Draft"** or **"Send to Client"**

#### Step 6: Client Receives Quotation

The client receives a professional PDF quotation via email containing:
- Executive summary of discussion
- Itemized work breakdown
- Clear pricing with options
- Timeline estimate
- Your contact details
- Terms and conditions

---

## 9. Daily Operations

### Morning Routine

1. **Start the website** (if not already running)
   ```bash
   cd /path/to/home-improvements-business
   npm run dev
   ```

2. **Check calendar** for today's consultations
   - Go to: http://localhost:3001/admin/calendar

3. **Review pending quotations**
   - Go to: http://localhost:3001/admin/consultations
   - Process any completed transcriptions

### After Each Consultation

1. Wait 5-10 minutes for processing to complete
2. Go to the Consultations page
3. Review the AI-generated summary
4. Edit pricing and details as needed
5. Send quotation to client

### Weekly Tasks

1. **Update portfolio** with completed projects
2. **Add new testimonials** from satisfied clients
3. **Adjust calendar availability** for upcoming weeks
4. **Review website statistics** in admin panel

### Backing Up Your Data

Your content is stored in:
```
/apps/web/data/site-content.json
```

**To backup:**
1. Copy this file to a safe location
2. Also backup any uploaded images from `/apps/web/public/uploads/`

---

## 10. Troubleshooting

### Common Issues & Solutions

#### Website Won't Start

**Error**: "npm: command not found"
- **Solution**: Node.js is not installed. Follow Section 3, Step 1.

**Error**: "Port 3001 is already in use"
- **Solution**: Another program is using port 3001. Either:
  - Close the other program, or
  - Change the port in `package.json`

**Error**: "Module not found"
- **Solution**: Run `npm install` again in the project folder

#### Teams Integration Issues

**Meetings not being created**
- Check your Azure credentials in `.env.local`
- Verify API permissions are granted
- Ensure you're signed into the correct Microsoft account

**Recordings not processing**
- Check that cloud recording is enabled in Teams Admin
- Verify webhook URL is accessible
- Check the server logs for errors

#### WhisperAI Issues

**Error**: "Invalid API key"
- Verify your OpenAI API key in `.env.local`
- Check that billing is set up in OpenAI dashboard
- Ensure you haven't exceeded your spending limit

**Transcription quality issues**
- Ensure good audio quality during calls
- Use a headset/microphone
- Minimize background noise

### Getting Help

If you encounter issues:

1. **Check the logs**: Look at the Terminal window for error messages
2. **Restart the server**: Press Ctrl+C, then run `npm run dev` again
3. **Clear browser cache**: Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)

---

## 11. Costs & Billing

### Monthly Cost Estimate

| Service | Estimated Cost | Notes |
|---------|---------------|-------|
| OpenAI (WhisperAI + GPT-4) | £3 - £15 | Based on 20-100 consultations |
| Microsoft 365 Business | £10 - £20 | Required for Teams |
| Domain + Hosting (production) | £10 - £20 | If deploying online |
| **Total Monthly** | **£23 - £55** | |

### Monitoring OpenAI Usage

1. Go to: https://platform.openai.com/usage
2. View your daily/monthly usage
3. Set up usage alerts:
   - Click "Settings" → "Limits"
   - Set a hard cap to prevent unexpected charges

### Setting Budget Limits

In OpenAI:
1. Go to Settings → Billing → Limits
2. Set "Hard limit" (will stop API calls when reached)
3. Set "Soft limit" (will send email warning)

**Recommended starting limits:**
- Soft limit: £30/month
- Hard limit: £50/month

---

## Quick Reference Card

### Essential Commands

| Action | Command |
|--------|---------|
| Start website | `npm run dev` |
| Stop website | Press `Ctrl + C` |
| Install updates | `npm install` |

### Key URLs

| Page | URL |
|------|-----|
| Main Website | http://localhost:3001 |
| Admin CMS | http://localhost:3001/admin/cms |
| Calendar | http://localhost:3001/admin/calendar |
| Consultations | http://localhost:3001/admin/consultations |
| WhisperAI Demo | http://localhost:3001/admin/test-transcription |

### Support Contacts

- **Technical Support**: [Your contact details]
- **OpenAI Support**: https://help.openai.com
- **Microsoft Support**: https://support.microsoft.com

---

## Document Information

**Created**: January 2026
**Version**: 1.0
**Author**: Development Team

For the latest updates to this guide, check the project repository.

---

*This guide is designed to help you set up and manage your Tailored Solutions website independently. Keep this document in a safe place for future reference.*
