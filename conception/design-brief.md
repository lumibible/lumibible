Build LumiBible, a multilingual christian website.
Content of the website:

- Bible in multiple languages. Associated with a concordance. Users can highlight or add personal notes on verses.
- Edification articles, podcasts/audio, videos. Organized by collections, authors, themes, and biblical references.
  - Side note: edification can be only textual, or audio, or video, or a combination of these media (e.g., a video sermon with an accompanying transcript, an article that has been read aloud).
  - Themes are hierarchical.
  - Authors can have biographies and photos. They can also be anonymous (if the author chooses so).
  - In the Bible, the user can search for articles, podcasts, or videos related to a specific verse or chapter.
- Dictionary of theological terms and biblical characters. Each term can have multiple definitions, from different sources.
- Biblical maps. Maps showing biblical locations, journeys, events, etc.
- Schematics and infographics. Visual aids to help understand biblical concepts, timelines, genealogies, etc.
- Calendars. Daily meditations, reading plans, verse of the day, etc.
- Hymns and songs. Organized by collections, authors, and themes. The user can see both the lyrics and the score (sheet music).
- Search functionality. Allow users to search across all content types (Bible verses, articles, podcasts, videos, dictionary terms, maps, schematics, calendars, hymns) with various filters.

A CMS for managing the content:

- Authorized users (admins, editors, contributors) should be able to add, edit, and delete content through a user-friendly interface.
- All content should be editable through the CMS, including Bible, articles, podcasts, videos, dictionary terms, maps, schematics, calendars, hymns, etc.
  - Rich text editor. The CMS should provide a rich text editor for creating and formatting articles, dictionary terms, etc.
  - Important note: we are using a special rich text format (xml-based) that allows embedding media, biblical references, etc. The CMS should support this format.
- Media management. The CMS should allow uploading and managing media files (audio, video, images, etc.) associated with the content.
- Versioning and history. The CMS should keep track of changes made to the content, allowing authorized users to view the history and revert to previous versions if needed.
- Content should also be editable through an API, allowing for programmatic content management.

Important features and considerations:

- Multilingual support. The website should support multiple languages. Obviously, depending on the language, not all content will be available (e.g., some articles may only be in English, while others may be in French or Spanish).
  - Inter-language links. For Bible, and other content that exists in multiple languages, provide inter-language links to allow users to easily switch between languages.
  - We assume a single (or zero) translation per language for the Bible and other content.
  - Rare languages. Support for less common languages (e.g., African dialects, Chinese, Arabic, etc.).
- User accounts and personalization. Allow users to create accounts, save their favorite content (bookmark + cross-platform save position), add personal notes, and customize their experience (e.g., preferred language).
- Cross-platform compatibility.
  - The website should be responsive and work well on desktop, tablet, and mobile devices.
  - The website should be also available as a PWA (Progressive Web App) and Android/iOS apps.
- Offline access. Allow users to download certain content (e.g., Bible books, articles, podcasts, videos, etc.) for offline access.
- Synchronization. User data (bookmarks, notes, preferences, etc.) should be synchronized across devices when the user is online.
  - Position in articles, podcasts, and videos should be synchronized.
