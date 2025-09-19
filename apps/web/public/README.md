# 📁 Public Assets

This directory contains static assets for the Donation Hub application.

## 🖼️ Images

### `bg.png`
- **Purpose**: Background image for the main dashboard
- **Dimensions**: Large format image for background positioning
- **Usage**: Applied as background with specific CSS properties:
  - Width: 3717px
  - Height: 2091px
  - Position: -385px -181px
  - Opacity: 0.07
  - No repeat

### `bg2.png`
- **Purpose**: New background image for the main dashboard
- **Usage**: Applied as cover background with center positioning
- **Properties**: 
  - backgroundSize: 'cover'
  - backgroundPosition: 'center'
  - backgroundRepeat: 'no-repeat'

### `logo.png`
- **Purpose**: Campaign logo image
- **Usage**: Displayed in the top-right corner of the dashboard
- **Dimensions**: Optimized for web display (200x200px)

## 🎨 CSS Classes

The following CSS classes are available for background styling:

### `.custom-bg`
```css
.custom-bg {
  background-image: url('/bg.png');
  background-size: 3717px 2091px;
  background-position: -385px -181px;
  background-repeat: no-repeat;
  opacity: 0.07;
}
```

### `.content-layer`
```css
.content-layer {
  position: relative;
  z-index: 10;
}
```

## 📱 Responsive Considerations

- Background image is positioned to work across different screen sizes
- Content layer ensures readability over the background
- Opacity is set low (0.07) to maintain text legibility

## 🔧 Usage Example

```tsx
<div className="min-h-screen p-6 relative overflow-hidden custom-bg">
  <div className="max-w-7xl mx-auto content-layer">
    {/* Your content here */}
  </div>
</div>
```

## 📝 Notes

- Ensure `bg.png` and `logo.jpg` are optimized for web
- Consider using WebP format for better performance
- Test background positioning on different screen sizes
- Maintain accessibility with proper contrast ratios
