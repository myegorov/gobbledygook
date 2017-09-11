const conf              = require('./conf/conf'),
      metalsmith        = require('metalsmith'),
      markdown          = require('metalsmith-markdown'),
      drafts            = require('metalsmith-drafts'),
      layouts           = require('metalsmith-layouts'),
      permalinks        = require('metalsmith-permalinks'),
      collections       = require('metalsmith-collections'),
      handlebars        = require('handlebars'),
      metallic          = require('metalsmith-metallic'),
      serve             = require('metalsmith-serve'),
      watch             = require('metalsmith-watch');
      redirect					= require('metalsmith-redirect'),
      when              = require('metalsmith-if');

handlebars.registerHelper('moment', require('helper-moment'));

metalsmith(__dirname)
  .metadata({
    site: {
      name: 'maksim.space',
      baseurl: 'http://maksim.space',
      author: 'Maksim Yegorov',
      keywords: 'Maksim Yegorov, myegorov, software engineer',
			description: 'Cabinet of curiosities of Maksim Yegorov'
    }
  })
  .source('./src')
  .destination('./dist')
  .use(drafts())
  .use(collections({
    posts: {
      pattern: 'blog/**/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(metallic())
  .use(markdown())
  .use(permalinks({
    relative: false
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './layout',
    pattern: ["*/*/*html","*/*html","*html"],
    default: 'article.html',
    partials: {
            header: 'partials/header',
            footer: 'partials/footer'
        }
  }))
  .use(when(!conf.isProd, serve({
    port: 3000,
    verbose: true
  })))
  .use(when(!conf.isProd, watch({
      paths: {
        "${source}/**/*": true,
        "layout/**/*": "**/*",
      }
    })))
		.use(redirect({
		  '/about': '/resume',
		}))
    .build(function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(`successfully built ${conf.name}:${conf.version}`);
      }
    });
