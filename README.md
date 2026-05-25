# jiyi-web Deployment Guide

This project now includes two site versions:

- `index.html`: English version intended for `jiyi.us`
- `cn/index.html`: Chinese version intended for `cn.jiyi.us`

## What to deploy

### For `jiyi.us`
Deploy the root `index.html` as the homepage for the international English site.

### For `cn.jiyi.us`
Deploy `cn/index.html` as the homepage for the Chinese site.

## Cloudflare Pages deployment

Use two separate Cloudflare Pages projects, one for each domain.

1. `jiyi.us` Pages project
   - Build command: leave empty
   - Build output directory: `/`
   - Root `index.html` must be served as the homepage

2. `cn.jiyi.us` Pages project
   - Build command: leave empty
   - Build output directory: `cn`
   - Ensure `cn/index.html` is served as the homepage

### Common Cloudflare Pages setup steps

1. In Cloudflare Pages, create the first project and connect it to this repository.
2. Leave the build command blank.
3. Set the output directory as described above.
4. Add `jiyi.us` as the custom domain for the first project.
5. Create the second Pages project for the same repository.
6. Add `cn` as the build output directory for the second project.
7. Add `cn.jiyi.us` as the custom domain for the second project.
8. Verify each domain inside Cloudflare Pages.

## Cloudflare DNS guidance

If Cloudflare DNS manages both domains:

- Keep both Pages projects in the same Cloudflare account.
- Add the custom domains to their respective Pages projects.
- Cloudflare will automatically manage the required DNS records for Pages.

## Developer Notes

- Serve HTML with correct charset headers, such as `Content-Type: text/html; charset=UTF-8`.
- Use UTF-8 for source files, but avoid writing Chinese metadata or non-ASCII headers in places that may be interpreted as ISO-8859-1 by older systems.
- If you see encoding errors, verify the HTTP headers and the actual file encoding.
- Non-ISO-8859-1 characters in header values can cause `TypeError` or server-side rejection in some proxy/CDN setups.

## Summary

- Root `index.html` = English site for `jiyi.us`
- `cn/index.html` = Chinese site for `cn.jiyi.us`
- Cloudflare Pages: two separate projects, output directories `/` and `cn`
