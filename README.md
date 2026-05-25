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

### Project configuration

1. `jiyi.us` Pages project
   - Build command: leave empty
   - Build output directory: `/`
   - Root `index.html` must be served as the homepage

2. `cn.jiyi.us` Pages project
   - Build command: leave empty
   - Build output directory: `cn`
   - Ensure `cn/index.html` is served as the homepage

### Setup checklist

- [ ] Create the first Cloudflare Pages project and connect it to this repository.
- [ ] Leave the build command blank.
- [ ] Set the build output directory to `/` for `jiyi.us`.
- [ ] Confirm `index.html` is the homepage for `jiyi.us`.
- [ ] Add `jiyi.us` as the custom domain for the first Pages project.
- [ ] Create the second Cloudflare Pages project for the same repository.
- [ ] Leave the build command blank.
- [ ] Set the build output directory to `cn` for `cn.jiyi.us`.
- [ ] Confirm `cn/index.html` is the homepage for `cn.jiyi.us`.
- [ ] Add `cn.jiyi.us` as the custom domain for the second Pages project.
- [ ] Verify both domains inside Cloudflare Pages.

## Cloudflare DNS guidance

If Cloudflare DNS manages both domains:

- Keep both Pages projects in the same Cloudflare account.
- Add the custom domains to their respective Pages projects.
- Cloudflare will automatically manage the required DNS records for Pages.

## Developer Notes

- Serve HTML with correct charset headers, such as `Content-Type: text/html; charset=UTF-8`.
- Keep source files encoded in UTF-8.
- Avoid writing Chinese or other non-ASCII characters in HTTP header field values.
- Non-ISO-8859-1 characters in header values can cause `TypeError` or server-side rejection in some proxy/CDN setups.
- If you see encoding errors, verify both the HTTP headers and the actual file encoding.

## Summary

- Root `index.html` = English site for `jiyi.us`
- `cn/index.html` = Chinese site for `cn.jiyi.us`
- Cloudflare Pages: two separate projects, output directories `/` and `cn`
