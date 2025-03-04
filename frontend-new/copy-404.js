// This script copies the 404.html to the build folder
// Run this script after the build process completes
const fs = require('fs');
const path = require('path');

// Path to the 404.html file in the public folder
const sourcePath = path.join(__dirname, 'public', '404.html');
// Path where to copy the file in the build folder
const destPath = path.join(__dirname, 'build', '404.html');

// Check if source file exists
if (fs.existsSync(sourcePath)) {
  // Read the file content
  const fileContent = fs.readFileSync(sourcePath);
  
  // Write to the destination
  fs.writeFileSync(destPath, fileContent);
  
  console.log('404.html has been copied to the build folder');
} else {
  console.error('Error: 404.html not found in the public folder');
  
  // Create a basic 404.html file if it doesn't exist
  const basic404Content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Single Page Apps for GitHub Pages
    var pathSegmentsToKeep = 1;
    
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  <h2 style="font-family: Helvetica, Arial, sans-serif; text-align: center; margin-top: 50px;">
    Redirecting...
  </h2>
</body>
</html>`;

  fs.writeFileSync(destPath, basic404Content);
  console.log('Created a new 404.html file in the build folder');
}