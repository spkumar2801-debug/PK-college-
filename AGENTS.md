<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public college content in typed `src/data/site.ts` records so a later Firebase data source can replace demo records without rewriting page UI.
- Keep Firebase configuration client-only and optional until actual credentials and authorization rules are provided; never expose an unprotected admin dashboard.
- Use TanStack route files for each public page and a shared `SiteLayout` for navigation and footer so metadata and site chrome remain consistent.
