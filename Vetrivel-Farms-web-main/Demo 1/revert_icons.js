const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Restore cursor
html = html.replace('<!-- CUSTOM CURSOR REMOVED -->', '<!-- ── Custom Cursor ── -->\n  <div class="cursor-dot" id="cursorDot"></div>\n  <div class="cursor-ring" id="cursorRing"></div>');

// Emoji map
const emojiMap = {
  'spa': '🌿',
  'face_retouching_natural': '🧴',
  'public': '🌍',
  'recycling': '♻️',
  'verified': '🏆',
  'opacity': '💧',
  'handshake': '🤝',
  'verified_user': '🛡️',
  'eco': '🌱',
  'auto_awesome': '✨',
  'visibility': '👁️',
  'support_agent': '🎧',
  'group': '👥',
  'science': '🔬',
  'water_drop': '💧',
  'volunteer_activism': '🤲',
  'school': '🎓',
  'health_and_safety': '🏥',
  'forest': '🌲',
  'shopping_bag': '🛍️',
  'storefront': '🏪',
  'location_on': '📍',
  'mail': '✉️',
  'phone': '📞'
};

// Replace material icons with emojis
html = html.replace(/<span class="material-symbols-outlined[^>]*>([^<]+)<\/span>/g, (match, iconName) => {
  const cleanName = iconName.trim();
  return emojiMap[cleanName] || '✨';
});

// Clean up Material Icons stylesheet link
html = html.replace(/<link rel=\"stylesheet\" href=\"https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined[^\"]*\" \/>/g, '');

fs.writeFileSync('index.html', html);
console.log('Successfully reverted HTML icons and cursor.');
