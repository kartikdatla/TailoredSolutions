# How to Deliver the Website Installer to Your Client

This guide explains how to give the web-based installer to your business client so they can set up and deploy their own website independently.

---

## Option 1: Host the Installer Online (Recommended)

The easiest way is to host the installer HTML file on a simple web server so the client can access it via a URL.

### Using GitHub Pages (Free)

1. **Create a new GitHub repository** for the installer:
   - Go to [github.com/new](https://github.com/new)
   - Name it `tailored-solutions-installer` (or similar)
   - Make it **Public**
   - Click "Create repository"

2. **Upload the installer file**:
   ```bash
   cd /path/to/home-improvements-business/apps/installer
   git init
   git add web-installer.html
   git commit -m "Add web installer"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/tailored-solutions-installer.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Wait 1-2 minutes

4. **Rename for cleaner URL** (optional):
   - Rename `web-installer.html` to `index.html`
   - Commit and push the change

5. **Share the URL with your client**:
   ```
   https://YOUR-USERNAME.github.io/tailored-solutions-installer/
   ```
   Or if you didn't rename:
   ```
   https://YOUR-USERNAME.github.io/tailored-solutions-installer/web-installer.html
   ```

### Using Netlify Drop (Quick & Easy)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the `installer` folder (containing `web-installer.html`)
3. Netlify instantly gives you a URL like `random-name-123.netlify.app`
4. Share this URL with your client

### Using Your Own Web Server

Simply upload `web-installer.html` to any web server and share the URL.

---

## Option 2: Send the File Directly

If you prefer not to host it online:

### Via Email
1. Rename `web-installer.html` to `Website-Installation-Guide.html`
2. Attach it to an email to your client
3. Tell them to download and open it in their web browser

### Via Cloud Storage
1. Upload to Google Drive, Dropbox, or OneDrive
2. Share the link with your client
3. They can download and open in any browser

### Via USB/Physical Media
1. Copy `web-installer.html` to a USB drive
2. Give it to your client in person
3. They open it by double-clicking (opens in default browser)

---

## Option 3: Create a Custom Landing Page

For a more professional touch, create a simple landing page that links to the installer:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Tailored Solutions - Website Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .btn { display: inline-block; padding: 15px 30px; background: #d4af37; color: #000;
               text-decoration: none; border-radius: 8px; font-weight: bold; }
        .btn:hover { background: #c9a227; }
    </style>
</head>
<body>
    <h1>Welcome to Your Website Setup</h1>
    <p>Thank you for choosing Tailored Solutions! Click the button below to start setting up your new business website.</p>
    <p>The setup guide will walk you through everything step-by-step, even if you have no coding experience.</p>
    <br>
    <a href="web-installer.html" class="btn">Start Installation Guide</a>
    <br><br>
    <p><small>Need help? Contact support@youremail.com</small></p>
</body>
</html>
```

Save this as `index.html` in the same folder as `web-installer.html`, then host both files together.

---

## What to Tell Your Client

Here's a template message you can send:

---

**Subject: Your New Business Website - Installation Guide**

Hi [Client Name],

Your new website is ready to be set up! I've created an easy-to-follow installation guide that will walk you through everything step by step.

**To get started:**
1. Click this link: [YOUR INSTALLER URL]
2. Select your computer type (Mac or Windows)
3. Follow each step - everything is explained in detail

**What you'll need:**
- About 30-60 minutes of time
- Your computer (Mac or Windows)
- Internet connection
- A domain name (like www.yourbusiness.com) - you can buy one during setup if you don't have one yet

**What you'll get:**
- A fully functional business website
- Admin panel to update content yourself
- Professional hosting on your own domain
- Automatic SSL security (https://)

The guide includes troubleshooting tips for common issues. If you get stuck on any step, feel free to reach out and I'll help you through it.

Good luck with your new website!

Best regards,
[Your Name]

---

## Files Included

```
apps/installer/
├── web-installer.html    # The main installation guide (single HTML file)
├── DELIVERY-GUIDE.md     # This document
└── package.json          # (Optional) Electron app config - can be ignored
```

The only file your client needs is `web-installer.html`. Everything else is for development purposes.

---

## Customization

Before delivering to your client, you may want to customize:

1. **Business name references**: Search for "Tailored Solutions" in the HTML and replace with client's business name

2. **GitHub repository URL**: Update the repository clone URL in Step 4 to point to the correct repo

3. **Contact information**: Add your support email or phone number

4. **Branding colors**: The installer uses gold/dark theme - modify CSS variables if needed

5. **Default admin credentials**: Update the default login shown in Step 7 if you've changed them

---

## Support Tips

Common issues clients may encounter:

| Issue | Solution |
|-------|----------|
| "Permission denied" errors | Use `sudo` before commands (Mac) or run as Administrator (Windows) |
| Commands not found | Close and reopen the terminal after installing software |
| Git authentication fails | They need to set up a GitHub Personal Access Token |
| Build fails on Netlify | Check environment variables are set in Netlify dashboard |
| Domain not working | DNS takes up to 48 hours to propagate |

---

## Quick Reference Commands

Save these for quick client support:

```bash
# Navigate to website folder
cd ~/Documents/tailored-solutions-website

# Start the website locally
npm run dev

# Stop the website
# Press Ctrl + C

# Push updates to live site
git add .
git commit -m "Update content"
git push
```

---

*Last updated: January 2026*
