# GitHub Actions Setup for LaTeX Resume

This guide will help you set up automatic PDF compilation and releases for your LaTeX resume.

## Step 1: Enable Workflow Permissions

1. Go to your `LaTeX-Resume` repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Scroll to **Workflow permissions**
4. Select **Read and write permissions**
5. Check **Allow GitHub Actions to create and approve pull requests**
6. Click **Save**

## Step 2: Create the Workflow File

In your `LaTeX-Resume` repository, create the following file:

**File:** `.github/workflows/build.yml`

```yaml
name: Build and Release LaTeX Resume

on:
  push:
    branches:
      - main
  workflow_dispatch:  # Allows manual triggering

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Compile LaTeX Document
        uses: xu-cheng/latex-action@v3
        with:
          root_file: resume_2025.tex
          # If your main file has a different name, change it above
          # Common options:
          # latexmk_use_xelatex: true  # Use XeLaTeX instead of pdfLaTeX
          # latexmk_use_lualatex: true # Use LuaLaTeX instead of pdfLaTeX

      - name: Rename PDF to standard name
        run: mv resume_2025.pdf resume.pdf

      - name: Upload PDF as Artifact
        uses: actions/upload-artifact@v4
        with:
          name: resume-pdf
          path: resume.pdf
          retention-days: 30

      - name: Get Current Date
        id: date
        run: echo "date=$(date +'%Y-%m-%d')" >> $GITHUB_OUTPUT

      - name: Create/Update Latest Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: latest
          name: Latest Resume
          body: |
            📄 **Automatically compiled resume**
            
            Last updated: ${{ steps.date.outputs.date }}
            
            Download `resume.pdf` below.
          files: resume.pdf
          make_latest: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create Dated Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ steps.date.outputs.date }}
          name: Resume - ${{ steps.date.outputs.date }}
          body: |
            📄 **Resume compiled on ${{ steps.date.outputs.date }}**
            
            Download `resume.pdf` below.
          files: resume.pdf
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Step 3: Commit and Push

```bash
# In your LaTeX-Resume repository
mkdir -p .github/workflows
# Create the build.yml file with the content above
git add .github/workflows/build.yml
git commit -m "Add GitHub Actions workflow for automatic PDF compilation"
git push origin main
```

## Step 4: Verify It Works

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see the workflow running
4. Once complete, go to **Releases** to see your compiled PDF

## How It Works

1. **On every push to `main`**: The workflow triggers automatically
2. **Compiles LaTeX**: Uses `xu-cheng/latex-action` to compile your `.tex` file
3. **Creates releases**: 
   - A `latest` release that always has the most recent PDF
   - A dated release (e.g., `v2024-12-18`) for version history
4. **Uploads artifact**: Also saves the PDF as a GitHub Actions artifact

## URLs for Your Portfolio

After the workflow runs successfully, your resume will be available at:

**Latest version (recommended for portfolio):**
```
https://github.com/ac-pate/LaTeX-Resume/releases/latest/download/resume.pdf
```

**Direct link to releases page:**
```
https://github.com/ac-pate/LaTeX-Resume/releases
```

## Troubleshooting

### "Permission denied" error
- Make sure you enabled "Read and write permissions" in Step 1

### LaTeX compilation fails
- Check the workflow logs for specific errors
- Make sure all required packages are available (most common ones are included)
- If using custom fonts, you may need to use XeLaTeX:
  ```yaml
  - name: Compile LaTeX Document
    uses: xu-cheng/latex-action@v3
    with:
      root_file: resume_2025.tex
      latexmk_use_xelatex: true
  ```

### Release not updating
- Make sure the tag `latest` doesn't already exist with protection rules
- Try deleting the `latest` release/tag manually and re-running

## Advanced: Multiple Documents

If you have multiple LaTeX files (e.g., resume and CV):

```yaml
- name: Compile Resume
  uses: xu-cheng/latex-action@v3
  with:
    root_file: resume_2025.tex

- name: Compile CV
  uses: xu-cheng/latex-action@v3
  with:
    root_file: cv_2025.tex

- name: Upload PDFs
  uses: softprops/action-gh-release@v2
  with:
    tag_name: latest
    files: |
      resume_2025.pdf
      cv_2025.pdf
```

