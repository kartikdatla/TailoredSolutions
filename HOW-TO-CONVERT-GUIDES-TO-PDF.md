# How to Convert Guide Files to PDF

This guide shows you how to convert the markdown (.md) guide files to PDF format.

---

## Quick Method: Online Converter (No Installation)

### Step 1: Go to an Online Converter
Visit one of these free websites:
- **https://www.markdowntopdf.com** (Recommended - simplest)
- **https://dillinger.io** (Paste content, export as PDF)
- **https://md2pdf.netlify.app**

### Step 2: Upload Your File
1. Click "Choose File" or "Upload"
2. Select the `.md` file from your computer (e.g., `SETUP-GUIDE.md`)
3. Click "Convert" or "Download PDF"

### Step 3: Save the PDF
The PDF will download to your computer automatically.

---

## Alternative: Using GitHub (Print to PDF)

If your files are already on GitHub:

1. Go to your repository: https://github.com/kartikdatla/TailoredSolutions
2. Click on the `.md` file you want to convert
3. GitHub will display it nicely formatted
4. Press `Ctrl + P` (Windows) or `Cmd + P` (Mac) to open Print
5. Change the printer to "Save as PDF"
6. Click Save

---

## Files You Can Convert

| File | Description |
|------|-------------|
| `SETUP-GUIDE.md` | Full setup instructions |
| `QUICK-START-GUIDE.md` | Quick reference guide |
| `apps/installer/DELIVERY-GUIDE.md` | How to share the installer |

---

## Uploading PDFs to GitHub

After converting to PDF, you can add them to your repository:

### Option A: Through GitHub Website (Easiest)
1. Go to https://github.com/kartikdatla/TailoredSolutions
2. Click "Add file" → "Upload files"
3. Drag and drop your PDF files
4. Add a message like "Add PDF versions of guides"
5. Click "Commit changes"

### Option B: Through Terminal
```bash
cd ~/Documents/TailoredSolutions
# Copy your PDFs to this folder, then:
git add *.pdf
git commit -m "Add PDF versions of guides"
git push origin main
```

---

## Tips

- **File names**: Keep the same name but change `.md` to `.pdf`
  - `SETUP-GUIDE.md` → `SETUP-GUIDE.pdf`

- **Updates**: If you update the markdown file, remember to re-convert to PDF

- **Sharing**: You can share the PDF directly with clients, or link to it on GitHub

---

*Last updated: January 2026*
