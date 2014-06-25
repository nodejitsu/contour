## Scaffolding

The branded CSS framework and required templates are using [ejs][ejs]. Scaffold
will reduce time spent on default elements, like headers, footers, boxes, forms,
login, etc. You can combine any sets of elements. Scaffold can be used as
submodule in any Nodejitsu project. Construct scaffold and provide the required
origin. **All options are optional!**

```
var origin = '/path/to/project/templates', // allows include to use relative paths
    options = {
      id: 'nodejitsu', // brand or framework to use, defaults to 'nodejitsu'
      store: '/path/to/store/square.json', // location to store compiled Square configuration
      output: '/path/to/compiled/CSS/JS', // location to store jitsu.{type}.{ext}
      import: [ '/path/to/another/square.json' ] // additional Square configurations
    };

var Scaffold = require('nodejitsu-app').scaffold,
    scaffold = new Scaffold(origin, options);
```

Currently the following major templates are available:
- [html/head](#html--head) with default title, meta, link, styles and scripts
- [header](#header) top navigation with optional login button, active page highlighting
- [footer](#footer) bottom links and newsletter signup form
- [twocolumn](#twocolumn) layout in 2/10 size, sidebar in first column
- [sidebar](#sidebar) generation of full sidebar, active page highlighting
- [loader](#loader) asynchronous loading of front-end javascript

Additional minor templates are also available:
- [breadcrumb](#breadcrumb) breadcrumb styling and SEO microformats
- [pills](#pills) large pills that can be used for navigation or breadcrumb purposes
- [submit](#submit) set of buttons: plain, icon, login, password
- [button](#button) set of general purpose buttons: plain, icon (anchor support)
- [alert](#alert) set of colored alert messages: notice, error, success, info
- [social](#social) add social integration buttons: facebook, hackernews, twitter
- [label](#label) labels for one word highlights: warning, success, default, info
- [foss](#foss) github like 'free for open source' banner (top right)
- [leader](#leader) horizontal leader, highlight call to actions in a box
- [analytics](#analytics) Google Analytics implementation simplified
- [tooltip](#tooltip) add attributes to show tooltip near triggering element

Free for all scripts:
- [anchor](#anchor) nice scrollable anchor hyperlinks

### Scaffold combined with other template engines

Scaffold itself uses [ejs][ejs], but can easily be used in cooperation with
plates or other template engines. For example see the integration with
[plates][plates] below, which would add default navigation to the `menu`.

```
var base = '<div><h1 class="foo"></h1><div class="menu"></div></div>';

var baseData = { foo: 'bar' };
var mapping = Plates.Map();

mapping.class('menu').append(scaffold.app.navigation());
console.log(Plates.bind(base, baseData, mapping));
```

### Including

Scaffold provides the `include` method to include an arbitrary file or custom
template. For example, to include a file containing some documentation. Required
data can be passed as second argument. In the example `locals` is passed as
content to `docs.html`. In [ejs][ejs], locals is an object which contains all
data, providing a custom data object is also possible.

```js
app.include('content/docs.html', locals);
```

**Markdown**
To include markdown content, Scaffold provides the shorthand `app.markdown`.
Its used like include, but also runs content through
[Chjj's markdown parser][markdown]. Like [app.include][include], data objects
can also be passed to markdown.

```js
app.markdown('content/docs.html', locals)
```

---

### Building CSS/JS

While your working on a new project [Square][square] is able to build CSS and JS
automatically. This functionality is enabled when passing the `store` option to the
constructor of Scaffold. Scaffold will monitor for template calls and add
required CSS/JS assets to the square configuration.

**Global styling**

Styling of HTML elements like tables, forms and also typography are wrapped default
styles. There are no specific templates for these elements, except a log in
form. Some global more advanced styles have been defined. For instance to show a
grid like table just supply it with a `class="rounded"`. All special classes
listed below can be mixed and used side-by-side.

*List of table options*
```
<table class="rounded"> ... </table>                   // grid like full borders
<table class="striped"> ... </table>                   // odd rows colored lightblue
<table class="hover"> ... </table>                     // highlights the hovered row
<table class="condensed"> ... </table>                 // less vertical padding in rows
<table class="rounded striped hover"> ... </table>     // mix it all up!
```

*List of from options*
```
TODO: horizontal label, input size adjusments etc.
```

---

### Template usage

Calling a scaffold without any parameters will supply defaults. These defaults
can be found in [scaffold/defaults.json][defaults]. Also keys are mixed with defaults, so
providing all keys is not required.

*data-attributes*
All templates can be supplied with additional data-attributes. For instance the
[knockout.js][knockout] javascript library makes heavy use of HTML5
data-attributes. Simply supply an `attributes` key with object to the template.
Each object member has to be in the form of `selector: { key: 'value' }`. In the
example below [cheerio][cheerio] would add `data-test="news"` to any element
having class newsletter.

```
<%-
  app.footer({
    navigation: [ ... ],
    attributes: {
      '.newsletter': { test: 'news' }
    }
  })
%>
```

#### HTML / HEAD

HTML5 does not require closing tags so there is no antogonist of `app.head()`.

*Object keys:*
- title {String} title of the document
- description {String} description of the document
- keywords {Array} collection of keywords
- stylesheet {Array} stylesheet locations, use of CDN (versions) is required!
- canonical {String} url of the current page, for canonical generation
- robots {String} robot directives
- foss {Boolean|Object} include the foss banner with optional options
- experiment {String} Google Analytics Experiments key
- extension {String} Custom HTML/meta to insert into the head.

```js
<%-
  app.head({
    title: 'Node.js hosting, cloud products and services | Nodejitsu Inc.',
    description: 'Nodejitsu provides a simple, reliable and smart Node.js hosting platform.',
    keywords: ['Node.js','Nodejitsu','cloud','jitsu','Hosting','paas','platform','services','provider','web'],
    stylesheets: ['https://versions.nodejitsu.com/css/jitsu.min.css'],
    canonical: '/',
    robots: 'index,follow', // equal to empty||undefined
    foss: false, // boolean or optional options { color: 'grey' }
    experiment: '49357282-3',
    extension: '<meta charset="utf-8">'
  })
%>
```

*Important*
- Always supply a unqiue title, keywords, description and proper robots
  directive. Not doing so will murder SEO in the long run.
- Use versions to supply to proper path to some CSS, otherwise clients will run
  into caching issues, updates of CSS will not propagate.
- The canonical will ensure top level domains, e.g. jit.su or jitsu.com
  are pointed to nodejitsu.com.
- By setting `foss: true` the [free for open source][#foss] template will be called
- Make sure you use a custom unique key provided by Google Analytics Experiments
  if you want to do conversion optimalization testing. The tracking code will be
  inserted as first element in `head`.

#### HEADER

The top navigation and our logo is inserted with `app.header()`. The navigation
is a set of links which can be highlighted (e.g. current page) by their root
property.

*Object keys*
- navigation {Array} collection of links
- root {String} reference to active link in `navigation`
- signup {Boolean} visibility of signup button, false by default
- login {Boolean} visibility of login button, true by default
- logout {Boolean} visibility of logout button, false by default

```js
<%-
  app.header({
    navigation: [
      { name: 'Cloud', href: '/paas/' },
      { name: 'Enterprise', href: '/enterprise/private-cloud/' },
      { name: 'Docs', href: '/documentation/' },
      { name: 'Support', href: '/support/' },
      { name: 'Company', root: 'nodejitsu', href: '/company/' }
    ],
    root: '',
    login: true
  })
%>
```

*Important*
- Omitting root will not highlight any element
- There is no need to add a 'home' or 'start' link to the collection, the logo
  will provide this by default.
- The last index of navigation is supplied with a custom root. This will allow
  you to override the default root (e.g. 'company') to do element highlighting.

#### LOADER

The loader is a special template as it does not include any visable elements but
only scripts. It will bootstrap front-end applications in
[Cortex][cortex], providing easy means for fast asynchronous loading.

*Object keys*
- production {Boolean} environment development or production
- apps {Array} collection of application names Cortex must load after bootstrap
- load {Array} collection of JS files that can be mapped with versions (CDN).
- plain {Array} collection of JS files that must be loaded (no mutations)

```js
<%-
  app.loader({
    production: process.env.NODE_ENV === 'production',
    apps: [
      'login',
      'analytics'
    ],
    load: [
      '/js/jitsu.[type].js', // remapped to -- //versions.nodejitsu.com/versions:1.0.3/js/jitsu.[type].js
      '/js/datacenters.[type].js' // remapped to -- //versions.nodejitsu.com/versions:1.0.3/js/datacenters.[type].js
    ],
    plain: [
      '/js/twitter.js',
      '//www.google-analytics.com/ga.js'
    ]
  })
%>
```

*Important*
- For automatic browser reloading to work while developing include this snippet,
  also note that production must be false. Square will start listening on port
  8888 for reload triggers.
- The production setting will determine if `type` will be replaced with either
  `min` or `dev`. If production is false `type` will be `dev`.
- Paths provided to load will be mapped using [versions][versions], resulting in
  a localized path (if production is false) or versioned path.

#### FOOTER

Footer with some general, legal links and newsletter signup per default.
Call `app.footer()` to include the default footer. The newsletter is posting to
mailchimp's external API, so it should work out of the box. The example below
will add two columns with several links, respectively  'Cloud' and 'Enterprise'.

*Object keys*
- navigation {Array} collection of objects representing columns. Each
  column/object must have the keys `name` and `links`.

```js
<%-
  app.footer({
    navigation: [
      {
        name: "Cloud",
        links: {
          "Getting Started": "/getting-started/",
          "Features": "/paas/",
          "Pricing": "/paas/pricing/",
          "Data Centers": "/paas/datacenters/",
          "Addons": "/paas/addons/",
          "FAQ": "/paas/faq/"
        }
      },
      {
        name: "Enterprise",
        links: {
          "Private PaaS": "/enterprise/private-paas/",
          "OpsMezzo": "/enterprise/opsmezzo/",
          "Professional Services": "/enterprise/professional-services/"
        }
      }
    ]
  })
%>
```

*Important*
- The footer supports up to five columns of links besides the newsletter form.
  Any additional columns will not be displayed.
- The keys of links are used as hyperlink text, while the value is the hyperlink
  itself.

#### SIDEBAR

The sidebar in the two-column layout can be provided with any content. However,
usually a submenu with several hyperlinks is common. `app.sidebar()` provides
abstraction for this.

*Object keys*
- menu {Array} collection of links
- page {String} reference to active link in `menu`

```js
<%-
  app.sidebar({
    menu: [
      { name: 'Private Cloud', page: 'products', href: '/enterprise/private-cloud/' },
      { name: 'Conservatory', href: '/enterprise/conservatory/' },
      { name: 'Orchestrion', href: '/enterprise/orchestrion/' },
      { name: 'Professional Services', href: '/enterprise/professional-services/' }
    ],
    page: ''
  })
%>
```

*Important*
- Omitting page will not highlight any element
- The first index of menu is supplied with a custom page. This will allow you to
  override the default page (e.g. private-cloud) to do item highlighting.

#### TWO COLUMN

The two column layout is used to display a sidebar next to content
`app.twocolumn()`. As can be seen in the example below, the [sidebar](#sidebar)
template is added to the first column. The second column gets it content from an
included document.

*Object keys*
- class {String} additional class to add to the surrounding `section`
- one {String} first column content, width of column equals 2/12 of page
- two {String} second column content, width of column equals 10/12 of page

```js
<%-
  app.twocolumn({
    class: 'documentation',
    one: app.sidebar(locals),
    two: app.include('content/docs.html', locals)
  })
%>
```

*Important*
- Defaults are empty since both columns are able to contain variable content.
- Object keys can be used flexible, e.g. either pass content directly, use other
  templates, or the special [app.include](#including).

#### BREADCRUMB

Breadcrumbs are vital for transparent navigation of any application,
specifically content rich applications. The last item is expected to be the
current page and will always be highlighted.

*Object keys*
- breadcrumb {Array} Collection of objects with properties `href` and `text`

```js
<%-
  app.breadcrumb([
    {
      href: '#',
      text: 'Section'
    }
  ])
%>
```

*Important*
- Home is added by default and linked to the relative root, e.g. `/`
- SEO-wise it is preferred breadcrumbs should be as close as possible to actual
  content, preferably right above it.

#### PILLS

Pills are larger navigational elements with markup to make them stand out. Ideal
for switching between pages with similar content. It is not recommended to use
pills and breadcrumbs at the same time. The ideal location is just below the
main navigation and right above content.

*Object keys*
- navigation {Array} collection of objects representing pills. Each pill must
  have the keys `name` and `page`.
- class {String} additional class to add to the surrounding `nav` element.
- effect {String} custom switching effects, comma separated string.
- page {String} current active page, reference to key each pill
- swap {Object} swap the active pill content for elements with class `swap`

To create hyperlinked pills, which just load another page do:
```js
<%-
  app.pills({
    navigation: [
      {
        name: 'Individual plans',
        swap: { show: '.business', hide: '.individual' },
        effect: 'bounceOutDown,bounceInUp',
        page: 'individual-plans',
        href: '#'
      },
      {
        name: 'Business plans',
        swap: { show: '.individual', hide: '.business' },
        effect: 'fadeOut,fadeIn',
        page: 'business-plans',
        href: '#'
      }
    ],
    page: 'individual-plans'
  })
%>
```

To create dynamic pills which swap content by CSS classes and JS do:
```js
<%-
  app.pills({
    navigation: [
      { name: 'Product', page: 'product', swap: { show: '.pricing', hide: '.product' }},
      { name: 'Pricing', page: 'pricing', swap: { show: '.product', hide: '.pricing' }}
    ],
    page: 'product'
  })
%>
```

*Important*
- The `page` key is used for comparison against the `page` key of each pill.
  Supply it with a variable value for switching active states.
- A `href` is optional, by default the attribute will have a hashtag as value.
- Using `swap` will automatically load and initialize the required javascript.
  Also swap keys should contain CSS selectors.

#### SUBMIT

Shorthand for a set of submit buttons used throughout Nodejitsu applications.
Uses button element as opposed to the `input type=submit`. Action and login are
similar/aliased.

*Object keys*
- type {String} reference to type in collection: plain, login, password, icon, action
- class {String} optional class to add to the button, like 'flexible' or 'right'
- text {String} optional custom text for the button

```js
<%-
  app.submit({
    type: 'icon',
    class: 'right',
    text: 'subscribe'
  })
%>
```

*Important*
- Button text for both login and password should be left unchanged
  for consistency across applications.

#### BUTTON

Set of buttons, which both support the button as well as the anchor element. To
create a anchor element simply provide a `href` key.

*Object keys*
- type {String} reference to type in collection: plain, login, action
- href {String} optional adds href attribute and uses an anchor element
- class {String} optional class to add to the button, like 'flexible' or 'right'
- text {String} optional custom text for the button

```js
<%-
  app.button({
    type: 'icon',
    href: '#test',
    class: 'right',
    text: 'edit'
  })
%>
```

#### ALERT

Colored alert messages for salient display of errors or notices. Several types
are supported.

*Object keys*
- type {String} reference to type in collection: notice, error, success, info
- text {String} message text
- class {String} optional class to add to the button, like 'gone'

```js
<%-
  app.alert({
    type: 'notice',
    text: 'username and password are required',
    class: 'gone'
  })
%>
```

#### SOCIAL

Add social integration buttons, currently twitter, facebook and hackernews are
supported. The buttons enable easy sharing of pages.

*Object keys*
- load {Array} which buttons should loaded: twitter, facebook and/or hackernews
- layout {String} optional class for button layout: horizontal or vertical

```js
<%-
  app.social({
    load: [ 'twitter', 'hackernews' ],
    domain: 'https://www.nodejitsu.com', // required for some integrations
    layout: 'vertical' // horizontal is default
  })
%>
```

*Important*
- Template [loader](#loader) has to be included for this to work. The defaults
  are supplied with a hook that will add additional scripts to the loader. These
  third-party scripts are loaded asynchrously.

#### LABEL

Highlight single words or short tags by providing a label. Labels can be used
inline with text, have no border and the font is uppercased/bold.

*Object keys*
- type {String} reference to type in collection: default, warning, important, success, info, inverse
- text {String} message text
- class {String} optional class to add to the button, like 'karma'

```js
<%-
  app.label({
    type: 'info',
    text: 'new'
  })
%>
```

*Important*
- Labels are most suited for one word highlights. [Alerts](#alert) has similar
  functionality but is focussed towards longer messages and block level comments.

#### FOSS

Our awesome free for open source banner can be included to show we are dedicated
to OS. The template has no available options and a fixed static message, so
using it is as simple as:

*Object keys*
- color {String} available in three sets, orange (default), blue, grey

```js
<%-
  app.foss({
    color: blue
  })
%>
```

*Important*

- Although the template can be included in any relative positioned parent
  element it is best placed as child of `body`. By default the body has
  `position: relative`, thus the absolute positioned banner will be displayed
  correctly.

#### LEADER

A leader is a horizontal box which is perfect for displaying short messages and
some call to action, e.g. the button. See the nodejitsu website pricing page
for example.

*Object keys*
- title {String} title of the leader
- text {String} message text
- class {String} optional class to add to the box/leader
- button {Object} see [app.button](#button) for object keys

```js
<%-
  app.leader({
    title: 'Getting Started',
    text: 'Learn how to set up Nodejitsu\'s tool for app deployment and be ready for action.',
    button: {
      type: 'icon',
      href: '/getting-started/',
      class: 'wiggle',
      text: 'See the guide'
    }
  })
%>
```

#### ANALYTICS

Easy implementation of the Google Analytics script. Just pass the tracking ID
and everything will be setup automatically. Especially when multiple GA accounts
should receive data this snippet will make life easier.

*Object keys*
- production {Boolean} is this a production environment
- domain {String} top level domain to allow tracking against
- ids {Object} collection of tracking ids and integrations

```js
<%-
  app.analytics({
    domain: 'jitsu.com',
    ids: {
      ga: [ 'UA-24971485-11' ],
      segment: {
        key: 'aj193ka'
        ga: 'UA-24971485-11'
      }
    }
  })
%>
```
*Important*

- Domain defaults to nodejitsu.com
- Will use GA by default an setup pageview events for each tracker provided.
- Trackers are initialized with the name `jitsu-x`, where x equals the last
  digits of the tracking ID, for example `11` in `UA-24971485-11`. This allows
  multiple trackers to be setup fluently.
- In development the cookieDomain will be set to `none` so cookies will be set
  properly.
- `ids` defaults to an empty object, preventing any possible contamination of an
  account due to copy-pasting. Possible ids keys: 'ga' and 'segment'.
- If a segment.io is provided with a proper key and GA tracker account, all
  evenets will be deferred to the segment.io analytics script.

#### TOOLTIP

Special template since it only outputs relevant attributes. Together with a nice
JS app this will create a tooltip with content near the initiating element.
The tooltip can be placed right, left, bottom or top of the initiator.

*Object keys*
- placement {String} reference to location: left, right, top, bottom
- trigger {String} which event should trigger the tooltip: click, mouseover (default)
- content {String} Content of the tooltip
- color {String} background color, blue or grey

```js
<%-
  app.tooltip({
    placement: 'left',
    trigger: 'mouseover'
    content: 'Little description about the tooltip element',
    color: 'grey'
  })
%>
```

### Free for all scripts

Not every usable script is accompanied by a template. This allows greater
flexibility. Scripts should be included in the projects' build file manually.

#### ANCHOR

To make the normal anchor hyperlink behaviour scrollable include the
`/pagelets/js/anchor.js` script in the JS and add the attribute `data-scroll` to
the anchor.

```
<a href="#scrollable" data-scroll>I'll scroll gently down to the H5</a>
...
...
...
<h5 id="scrollable">Content way down the page</h5>
```


[ejs]: https://github.com/visionmedia/ejs
[plates]: https://github.com/flatiron/plates
[defaults]: https://github.com/nodejitsu/nodejitsu-app/blob/master/scaffold/defaults.js
[cheerio]: https://github.com/MatthewMueller/cheerio
[knockout]: http://knockoutjs.com/
[versions]: https://github.com/nodejitsu/nodejitsu-app/tree/master/cdn
[cortex]: https://github.com/flatiron/cortex
[square]: https://github.com/observing/square
[markdown]: https://github.com/chjj/marked
