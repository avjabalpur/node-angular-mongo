var fs = require('fs');
var webPage = require('webpage');
var page = webPage.create();

// since this tool will run before your production deploy, your target URL will be your dev/staging environment (localhost, in this example)
var pageName = 'angularjs-how-to-create-a-spa-crawlable-and-seo-friendly';
var path = 'posts/' + pageName;
var url = 'http://localhost/' + path;

page.open(url, function (status) {

  if (status != 'success')
    throw 'Error trying to prerender ' + url;

  var content = page.content;
  fs.write(path, content, 'w');

  console.log("The file was saved.");
  phantom.exit();
});