# High-level Features and Implementation Order

This document lists the main features (epics) for LumiBible and the recommended implementation order.

## Ordered List of High-level Features

1. **CMS Core & Media Management (Foundations)**
2. **Core Bible Reader & Basic Concordance**
3. **Edification Content (Articles) & XML-based Rich Text**
4. **User Accounts & Basic Personalization (Bookmarks)**
5. **Enhanced Bible Study (Highlights, Notes, Better Concordance)**
6. **Multilingual Support & Inter-language Links (Bible + Articles)**
7. **Edification Content Expansion (Podcasts & Videos, Themes, Related Content)**
8. **Dictionary of Terms & Biblical Characters**
9. **Maps, Schematics, and Infographics**
10. **Calendars, Daily Meditations, and Reading Plans**
11. **Hymns & Songs (Lyrics, Scores, Audio)**
12. **Global Search Across All Content Types**
13. **Offline Access & Synchronization**
14. **Cross-platform Delivery (Responsive Web, PWA, Mobile Shells)**

## Brief Description of Each Feature

1. **CMS Core & Media Management (Foundations)**  
   Role and permissions model (admin/editor/contributor), basic content models (Bible text, articles, media references), CRUD interfaces, simple versioning, and a media library for uploading and managing assets.

2. **Core Bible Reader & Basic Concordance**  
   Bible browsing by book/chapter/verse, simple Bible search, and a first concordance/lexicon view (even minimal) to support basic study.

3. **Edification Content (Articles) & XML-based Rich Text**  
   Public listing and detail views for articles, filtered by collection and author, with author profiles and support for the XML-based rich text format (at least core elements), plus manual links to Bible passages.

4. **User Accounts & Basic Personalization (Bookmarks)**  
   User registration and login, profile basics, and the ability to bookmark Bible passages and articles, with a "My favorites" view.

5. **Enhanced Bible Study (Highlights, Notes, Better Concordance)**  
   Verse highlights and personal notes for logged-in users, stored and visible across sessions/devices, and a richer concordance experience where data is available.

6. **Multilingual Support & Inter-language Links (Bible + Articles)**  
   UI language selection, Bible available in multiple languages with language switching, content language metadata, and inter-language links between language variants of the same Bible passage or article.

7. **Edification Content Expansion (Podcasts & Videos, Themes, Related Content)**  
   Support for audio and video content types, theme hierarchy and filtering, and improved "related content" panels from Bible passages using themes, references, and languages.

8. **Dictionary of Terms & Biblical Characters**  
   Dictionary entries with multiple definitions and sources, search and browse interfaces, and links between dictionary entries and Bible passages, articles, and other entries.

9. **Maps, Schematics, and Infographics**  
   Models and CMS management for maps and visual resources, public viewers with zoom/pan, and associations with Bible passages, dictionary entries, and articles.

10. **Calendars, Daily Meditations, and Reading Plans**  
    Management and display of verses of the day, daily meditations/devotionals, and reading plans; ability for logged-in users to start and track plan progress.

11. **Hymns & Songs (Lyrics, Scores, Audio)**  
    Hymn catalog with browsing by collection/author/theme, display of lyrics and scores (sheet music), and audio playback when recordings are available.

12. **Global Search Across All Content Types**  
    Unified search index covering Bible, articles, audio, video, dictionary entries, maps, schematics, calendars, and hymns, with filters by content type, language, theme, author, and collection.

13. **Offline Access & Synchronization**  
    Downloadable Bible books and selected content for offline use, local storage of highlights/notes/bookmarks and reading positions, and background synchronization when connectivity is restored.

14. **Cross-platform Delivery (Responsive Web, PWA, Mobile Shells)**  
    Fully responsive UI, PWA support (manifest and service worker) leveraging offline capabilities, and mobile app wrappers (Android/iOS) that reuse the same web core and sync model.
