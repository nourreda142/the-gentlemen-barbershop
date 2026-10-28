# Deploy THE GENTLEMEN to Vercel

This is a static HTML/CSS/JavaScript website. No build tools, npm packages, or environment variables are needed.

## GitHub import (recommended)
1. Create a new GitHub repository and upload the CONTENTS of this folder to the repository root. `index.html` must be at the root.
2. Visit https://vercel.com/new and import the repository.
3. Select **Other** as Framework Preset if prompted.
4. Leave Build Command blank (or override it to empty if auto-detected). Leave Output Directory at the project root/default.
5. Click Deploy.

## Vercel CLI alternative
From this folder, run `npx vercel` for a preview or `npx vercel --prod` for a production deploy, and follow the interactive account/project prompts.

## Notes
- Booking information uses browser localStorage only; separate users/browsers do not share records.
- The contact form is a frontend demonstration and does not send emails.
- Bootstrap, Bootstrap Icons, and Google Fonts load from third-party CDNs and require internet access.
- All internal HTML pages and project assets use local paths and can be served statically.
