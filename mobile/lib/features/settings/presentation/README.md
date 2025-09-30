# Settings Domain - Presentation Layer

This directory contains the presentation layer for the settings domain, providing comprehensive configuration management for portfolio settings, user preferences, and site customization.

## Structure

```
presentation/
├── bloc/
│   └── settings_bloc.dart               # Settings domain BLoC with events and states
├── pages/
│   ├── settings_overview_page.dart      # Main settings dashboard with categories
│   ├── core_profile_settings_page.dart  # Core profile and basic information
│   ├── social_media_settings_page.dart  # Social media links and accounts
│   ├── contact_settings_page.dart       # Contact information and messaging
│   ├── site_settings_page.dart          # Site configuration and customization
│   └── pages.dart                       # Export file for all pages
├── queries/
│   └── settings_queries.dart            # Utility functions for direct use case calls
└── README.md                            # This file
```

## Features

### 🎛️ **Settings Management**

1. **Settings Overview Page** (`settings_overview_page.dart`)
   - Centralized settings dashboard with categorized sections
   - Quick access to all settings categories
   - App settings (theme, language, notifications)
   - Account actions (change password, export data, delete account)
   - Visual cards with icons and descriptions
   - Clean navigation to specific setting pages

2. **Core Profile Settings Page** (`core_profile_settings_page.dart`)
   - Profile picture management with image preview
   - Basic information (name, title, location, website)
   - Bio section with rich text support
   - Live preview of profile information
   - Form validation with error handling
   - Auto-save functionality

3. **Social Media Settings Page** (`social_media_settings_page.dart`)
   - Professional platforms (GitHub, LinkedIn, Twitter)
   - Creative platforms (Instagram, YouTube, TikTok)
   - Gaming & community (Discord, Twitch, Facebook)
   - Visual platform chips with color coding
   - URL validation for all social links
   - Preview of connected platforms

4. **Contact Settings Page** (`contact_settings_page.dart`)
   - Email configuration with validation
   - Phone number with privacy toggle
   - Address information with structured fields
   - Messaging apps (Skype, Telegram, WhatsApp)
   - Privacy controls for each contact method
   - Live preview of contact information

5. **Site Settings Page** (`site_settings_page.dart`)
   - Basic site information (name, description, URL)
   - Branding (logo, favicon, colors)
   - Appearance settings (theme, language)
   - Feature toggles (blog, projects, testimonials, etc.)
   - Analytics integration (Google Analytics, GTM)
   - Advanced settings (maintenance mode, custom CSS/JS)

### 🎯 **BLoC Integration**

The settings BLoC (`settings_bloc.dart`) handles all settings states:

**Events:**
- `GetSettingsRequested` - Load settings with filters
- `GetSettingByKeyRequested` - Load specific setting
- `CreateSettingRequested` - Create new setting
- `UpdateSettingRequested` - Update existing setting
- `UpdateSettingByKeyRequested` - Update setting by key
- `DeleteSettingRequested` - Delete setting
- `UpdateSettingsBulkRequested` - Bulk update settings

**Category-specific Events:**
- `GetCoreProfileSettingsRequested` - Load core profile settings
- `GetSocialMediaSettingsRequested` - Load social media settings
- `GetContactSettingsRequested` - Load contact settings
- `GetSiteSettingsRequested` - Load site settings
- `UpdateCoreProfileSettingsRequested` - Update core profile settings
- `UpdateSocialMediaSettingsRequested` - Update social media settings
- `UpdateContactSettingsRequested` - Update contact settings
- `UpdateSiteSettingsRequested` - Update site settings

**States:**
- `SettingsInitial` - Initial state
- `SettingsLoading` - Loading state for async operations
- `SettingsError` - Error state with error message
- `SettingsLoaded` - Settings list loaded
- `SettingLoaded` - Single setting loaded
- `SettingCreated` - Setting created successfully
- `SettingUpdated` - Setting updated successfully
- `SettingDeleted` - Setting deleted successfully
- `SettingsBulkUpdated` - Settings bulk updated successfully

**Category-specific States:**
- `CoreProfileSettingsLoaded/Updated` - Core profile settings states
- `SocialMediaSettingsLoaded/Updated` - Social media settings states
- `ContactSettingsLoaded/Updated` - Contact settings states
- `SiteSettingsLoaded/Updated` - Site settings states

## UI/UX Features

### 🎨 **Design System**
- **Color Coding**: Each category has its own theme color
  - Core Profile: Blue (`Colors.blue.shade600`)
  - Social Media: Purple (`Colors.purple.shade600`)
  - Contact: Green (`Colors.green.shade600`)
  - Site Settings: Orange (`Colors.orange.shade600`)
- **Material Design 3**: Modern, consistent UI components
- **Responsive Layout**: Works on different screen sizes
- **Loading States**: Progress indicators and skeleton screens

### 🔧 **Form Features**
- **Real-time Validation**: Instant feedback on form inputs
- **Live Preview**: See changes as you type
- **Privacy Controls**: Toggle visibility for sensitive information
- **URL Validation**: Proper validation for all URL fields
- **Email Validation**: Regex-based email validation
- **Auto-save**: Automatic saving of form changes

### 📱 **User Experience**
- **Categorized Settings**: Logical grouping of related settings
- **Quick Access**: Easy navigation between setting categories
- **Visual Feedback**: Icons, colors, and chips for better UX
- **Error Handling**: User-friendly error messages with retry options
- **Confirmation Dialogs**: Safety prompts for destructive actions

## Settings Categories

### 👤 **Core Profile Settings**
- **Profile Picture**: Image URL with preview
- **Basic Information**: Full name, professional title, location
- **Website**: Personal or professional website
- **Bio**: Detailed description of professional background

### 📱 **Social Media Settings**
- **Professional**: GitHub, LinkedIn, Twitter
- **Creative**: Instagram, YouTube, TikTok
- **Community**: Discord, Twitch, Facebook
- **Visual Indicators**: Platform-specific colors and icons

### 📞 **Contact Settings**
- **Primary Contact**: Email (required)
- **Phone**: Optional with privacy toggle
- **Address**: Structured address fields with privacy control
- **Messaging**: Skype, Telegram, WhatsApp integration

### 🌐 **Site Settings**
- **Basic Info**: Site name, description, URL
- **Branding**: Logo, favicon, color scheme
- **Appearance**: Theme selection, language preferences
- **Features**: Toggle portfolio sections (blog, projects, etc.)
- **Analytics**: Google Analytics and Tag Manager integration
- **Advanced**: Maintenance mode, custom CSS/JavaScript

## Form Validation

All forms include comprehensive validation:

### 📝 **Input Validation**
- **Required Fields**: Clear indication of required inputs
- **Email Format**: Regex validation for email addresses
- **URL Format**: Proper URL validation for web links
- **Text Length**: Minimum and maximum length constraints
- **Character Restrictions**: Allowed characters for specific fields

### 🔒 **Privacy Controls**
- **Toggle Visibility**: Show/hide sensitive information
- **Privacy Indicators**: Visual cues for public/private settings
- **Selective Display**: Choose what to show publicly

## Usage Examples

### 1. **Configure Core Profile**

```dart
// Navigate to core profile settings
context.go('/settings/core-profile');

// Features include:
// - Profile picture with image preview
// - Basic information form
// - Bio section
// - Live preview of profile
```

### 2. **Manage Social Media Links**

```dart
// Navigate to social media settings
context.go('/settings/social-media');

// Supports:
// - Professional platforms (GitHub, LinkedIn, Twitter)
// - Creative platforms (Instagram, YouTube, TikTok)
// - Community platforms (Discord, Twitch, Facebook)
// - Visual preview with platform-specific colors
```

### 3. **Set Up Contact Information**

```dart
// Navigate to contact settings
context.go('/settings/contact');

// Features:
// - Email configuration (required)
// - Phone with privacy toggle
// - Address with structured fields
// - Messaging apps integration
```

### 4. **Customize Site Settings**

```dart
// Navigate to site settings
context.go('/settings/site');

// Configuration options:
// - Basic site information
// - Branding and appearance
// - Feature toggles
// - Analytics integration
// - Advanced customization
```

## Error Handling

- **Network Errors**: User-friendly messages with retry options
- **Validation Errors**: Inline form validation with specific messages
- **Loading States**: Prevents multiple submissions during async operations
- **Empty States**: Helpful guidance when no data exists
- **Image Errors**: Fallback display for invalid image URLs

## Privacy & Security

- **Privacy Toggles**: Control visibility of sensitive information
- **Data Validation**: Server-side validation for all inputs
- **Secure Storage**: Encrypted storage of sensitive settings
- **Access Control**: Role-based access to different setting categories

## Future Enhancements

- [ ] Image upload functionality for profile pictures and logos
- [ ] Rich text editor for bio and description fields
- [ ] Theme customization with color picker
- [ ] Import/export settings functionality
- [ ] Settings templates and presets
- [ ] Advanced analytics dashboard
- [ ] Multi-language support for site content
- [ ] Custom domain configuration
- [ ] SEO settings and meta tags
- [ ] Integration with third-party services

## Integration Points

The settings domain integrates with:

1. **Auth Domain**: User authentication and permissions
2. **Core Layer**: Dependency injection and error handling
3. **Data Layer**: Repository pattern for settings storage
4. **Domain Layer**: Use cases and entities
5. **External Services**: Analytics, social media APIs, etc.

This creates a comprehensive settings management system that allows users to fully customize their portfolio experience with modern UI/UX and robust functionality.
