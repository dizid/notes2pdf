# Notes to Deck - Architecture

## Stack

- **Vue 3** (Composition API, script setup)
- **Vite** + **Tailwind CSS 4**
- **Vue Router** for navigation
- **html2pdf.js** for PDF generation
- **Netlify** (hosting + serverless functions)
- **localStorage** for persistence

## Project Structure

```
src/
├── views/
│   ├── HomeView.vue      # Main create/export interface
│   ├── StudioView.vue    # AI design generator
│   ├── HistoryView.vue   # Export history
│   └── AboutView.vue     # Info page
├── components/
│   ├── InputZone.vue     # Title, notes, image upload
│   ├── DesignPicker.vue  # Template selection grid
│   ├── PreviewPane.vue   # Scaled live preview
│   ├── OutputActions.vue # Export button + validation
│   └── TopNav.vue        # Navigation bar
├── composables/
│   ├── useStorage.js     # localStorage wrapper
│   ├── useTemplates.js   # Template registry (built-in + custom)
│   ├── usePdfExport.js   # html2pdf wrapper
│   ├── useDesignGenerator.js # AI design + local fallback
│   ├── useImageAnalysis.js   # Color/mood extraction
│   └── useToast.js       # Notifications
├── templates/
│   ├── BoldEditorial.vue
│   ├── PhotoSpread.vue
│   ├── CleanDeck.vue
│   └── DynamicTemplate.vue # Style-driven generic
└── router/index.js

netlify/functions/
└── generate-design.js    # Claude API for design generation
```

## Key Patterns

**Composables**: All business logic extracted into reusable hooks

**Template System**:
- Fixed templates (Vue components with specific layouts)
- Dynamic templates (DynamicTemplate.vue accepts style objects)

**Data Flow**:
```
InputZone → content ref → PreviewPane → OutputActions → usePdfExport → useStorage
```

**AI Design Flow**:
```
Upload Images → useImageAnalysis → Extract mood/colors → useDesignGenerator → Claude API → DynamicTemplate
```

## Environment

- `ANTHROPIC_API_KEY` - For Claude API (optional, has local fallback)

## Key Files to Resume Work

- [HomeView.vue](src/views/HomeView.vue) - Main interface (largest file)
- [StudioView.vue](src/views/StudioView.vue) - Design studio
- [useDesignGenerator.js](src/composables/useDesignGenerator.js) - AI logic
- [useImageAnalysis.js](src/composables/useImageAnalysis.js) - Color extraction
- [useTemplates.js](src/composables/useTemplates.js) - Template management
- [DynamicTemplate.vue](src/templates/DynamicTemplate.vue) - Generic template
