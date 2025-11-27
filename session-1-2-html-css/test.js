/**
 * HTML/CSS Automated Tests
 * Tests semantic HTML structure and CSS layout properties
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let passedTests = 0;
let failedTests = 0;
const errors = [];

function test(description, fn) {
  try {
    fn();
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } catch (error) {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    errors.push({ description, error: error.message });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Read files
const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'styles.css');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');

console.log(`\n${colors.cyan}=== Session 1-2 HTML/CSS Tests ===${colors.reset}\n`);

// ===== HTML STRUCTURE TESTS =====
console.log(`${colors.blue}HTML Structure Tests:${colors.reset}`);

test('HTML file contains DOCTYPE declaration', () => {
  assert(htmlContent.includes('<!DOCTYPE html>'), 'DOCTYPE not found');
});

test('HTML uses semantic <nav> element', () => {
  assert(htmlContent.includes('<nav'), '<nav> element not found');
});

test('HTML uses semantic <header> element', () => {
  assert(htmlContent.includes('<header'), '<header> element not found');
});

test('HTML uses semantic <main> element', () => {
  assert(htmlContent.includes('<main'), '<main> element not found');
});

test('HTML uses semantic <section> elements', () => {
  assert(htmlContent.includes('<section'), '<section> elements not found');
});

test('HTML uses semantic <aside> element for sidebar', () => {
  assert(htmlContent.includes('<aside'), '<aside> element not found');
});

test('HTML uses semantic <footer> element', () => {
  assert(htmlContent.includes('<footer'), '<footer> element not found');
});

test('HTML has proper heading hierarchy (h1, h2, h3)', () => {
  assert(htmlContent.includes('<h1'), 'h1 heading not found');
  assert(htmlContent.includes('<h2'), 'h2 heading not found');
  assert(htmlContent.includes('<h3'), 'h3 heading not found');
});

test('HTML includes meta viewport for responsive design', () => {
  assert(
    htmlContent.includes('viewport') && htmlContent.includes('width=device-width'),
    'Viewport meta tag not found or incorrect'
  );
});

test('HTML links to external CSS file', () => {
  assert(
    htmlContent.includes('link') && htmlContent.includes('styles.css'),
    'CSS link not found'
  );
});

// ===== CSS LAYOUT TESTS =====
console.log(`\n${colors.blue}CSS Layout Tests:${colors.reset}`);

test('CSS uses Flexbox for layout', () => {
  assert(
    cssContent.includes('display: flex') || cssContent.includes('display:flex'),
    'Flexbox not found in CSS'
  );
});

test('CSS uses Grid for layout', () => {
  assert(
    cssContent.includes('display: grid') || cssContent.includes('display:grid'),
    'CSS Grid not found'
  );
});

test('CSS includes justify-content for Flexbox', () => {
  assert(cssContent.includes('justify-content'), 'justify-content not found');
});

test('CSS includes align-items for Flexbox', () => {
  assert(cssContent.includes('align-items'), 'align-items not found');
});

test('CSS includes grid-template-columns', () => {
  assert(cssContent.includes('grid-template-columns'), 'grid-template-columns not found');
});

test('CSS includes gap property for spacing', () => {
  assert(cssContent.includes('gap:') || cssContent.includes('gap '), 'gap property not found');
});

// ===== CSS CUSTOM PROPERTIES TESTS =====
console.log(`\n${colors.blue}CSS Custom Properties Tests:${colors.reset}`);

test('CSS uses custom properties (CSS variables)', () => {
  assert(cssContent.includes('--'), 'CSS variables not found');
});

test('CSS defines :root pseudo-class for variables', () => {
  assert(cssContent.includes(':root'), ':root selector not found');
});

test('CSS uses var() function', () => {
  assert(cssContent.includes('var('), 'var() function not found');
});

// ===== RESPONSIVE DESIGN TESTS =====
console.log(`\n${colors.blue}Responsive Design Tests:${colors.reset}`);

test('CSS includes media queries', () => {
  assert(cssContent.includes('@media'), '@media queries not found');
});

test('CSS includes mobile breakpoint (max-width: 768px)', () => {
  assert(
    cssContent.includes('max-width: 768px') || cssContent.includes('max-width:768px'),
    'Mobile breakpoint not found'
  );
});

test('CSS includes small device breakpoint (max-width: 480px)', () => {
  assert(
    cssContent.includes('max-width: 480px') || cssContent.includes('max-width:480px'),
    'Small device breakpoint not found'
  );
});

test('CSS includes large screen breakpoint (min-width: 1200px)', () => {
  assert(
    cssContent.includes('min-width: 1200px') || cssContent.includes('min-width:1200px'),
    'Large screen breakpoint not found'
  );
});

// ===== CSS BEST PRACTICES TESTS =====
console.log(`\n${colors.blue}CSS Best Practices Tests:${colors.reset}`);

test('CSS includes box-sizing reset', () => {
  assert(cssContent.includes('box-sizing'), 'box-sizing not found');
});

test('CSS resets default margins and padding', () => {
  assert(
    (cssContent.includes('margin: 0') || cssContent.includes('margin:0')) &&
    (cssContent.includes('padding: 0') || cssContent.includes('padding:0')),
    'CSS reset not found'
  );
});

test('CSS includes transition properties for smooth animations', () => {
  assert(cssContent.includes('transition'), 'transition property not found');
});

test('CSS includes hover states', () => {
  assert(cssContent.includes(':hover'), ':hover pseudo-class not found');
});

// ===== LAYOUT SPECIFIC TESTS =====
console.log(`\n${colors.blue}Layout Specific Tests:${colors.reset}`);

test('Navbar class uses Flexbox properties', () => {
  const navbarRegex = /\.navbar[\s\S]*?display:\s*flex/;
  assert(navbarRegex.test(cssContent), 'Navbar does not use Flexbox');
});

test('CSS includes space-between for navbar layout', () => {
  assert(cssContent.includes('space-between'), 'space-between not found for navbar');
});

test('Dashboard/app-container uses Grid layout', () => {
  const gridRegex = /(\.app-container|\.dashboard)[\s\S]*?display:\s*grid/;
  assert(gridRegex.test(cssContent), 'Dashboard does not use Grid');
});

test('Grid uses two-column layout (sidebar + main)', () => {
  assert(
    cssContent.includes('280px') && cssContent.includes('1fr'),
    'Two-column grid layout not found'
  );
});

test('Stats grid uses auto-fit or repeat', () => {
  assert(
    cssContent.includes('auto-fit') || cssContent.includes('repeat('),
    'Dynamic grid columns not found'
  );
});

// ===== FILE STRUCTURE TESTS =====
console.log(`\n${colors.blue}File Structure Tests:${colors.reset}`);

test('index.html file exists', () => {
  assert(fs.existsSync(htmlPath), 'index.html file not found');
});

test('styles.css file exists', () => {
  assert(fs.existsSync(cssPath), 'styles.css file not found');
});

test('HTML file is not empty', () => {
  assert(htmlContent.length > 100, 'HTML file appears to be empty or too small');
});

test('CSS file is not empty', () => {
  assert(cssContent.length > 100, 'CSS file appears to be empty or too small');
});

test('HTML file size is reasonable (< 100KB)', () => {
  const stats = fs.statSync(htmlPath);
  assert(stats.size < 100000, 'HTML file is too large');
});

test('CSS file size is reasonable (< 100KB)', () => {
  const stats = fs.statSync(cssPath);
  assert(stats.size < 100000, 'CSS file is too large');
});

// ===== PRINT RESULTS =====
console.log(`\n${colors.cyan}=== Test Results ===${colors.reset}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
console.log(`Total: ${passedTests + failedTests}`);

if (errors.length > 0) {
  console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
  errors.forEach(({ description, error }) => {
    console.log(`  ${colors.red}✗${colors.reset} ${description}`);
    console.log(`    ${colors.yellow}${error}${colors.reset}`);
  });
}

// Exit with error code if tests failed
process.exit(failedTests > 0 ? 1 : 0);
