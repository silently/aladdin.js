## Intro and usage

Aladdin's lamp is your **a**synchronous and **l**igthweight **a**sset **m**anager **p**al.

You request images (requests are queued) and then rub the lamp (downloads start). When all downloads in the queue are completed, your vows are fulfilled and you get notified:

    var lamp = new Aladdin.Lamp();
    lamp.request('/img/genius-memories.png');
    lamp.rub();
    lamp.on('fulfilled', function() { console.log('remembering'); });

With several assets:

    var sizes = ['/img/s.png', '/img/m.png', '/img/l.png', '/img/xl.png'];
    lamp.request(sizes);
    lamp.request('/img/xs.png');// this one too
    lamp.rub();
    lamp.on('fulfilled', function() { console.log('all sizes downloaded'); });

You may also organize assets into bundles and chain lamp calls:

    var splashScreenAssets = ['/img/bg.jpg', '/img/loading.gif'],
      introAssets = ['img/logo.png', 'img/trees.png', 'img/houses.png'];
    lamp
      .request(splashScreenAssets, 'splash-screen')
      .request(introAssets, 'intro');
      .on('fulfilled:splash-screen', function() {
        // display splash screen here...
        // and launch subsequent downloads
        this.rub('intro');
      })
      .on('fulfilled:intro', function() {
        // display intro here...
      })
      .rub('splash-screen');// downloads start

What matters here is the bundle names you pass to the *request* and *rub* methods.

Finally, when an asset has been downloaded you can access it or remove it using its URI:

    var logo = lamp.get('/img/logo.png');// returns a Javascript Image instance
    lamp.remove('/img/useless.png');// deletes it from the lamp's cache

## Installation

Aladdin relies either on [underscore](http://underscorejs.org/) or [lodash](http://lodash.com/).

Once the sources has been downloaded link to them:

    <script src="/path/to/js/underscore.js"></script>
    <script src="/path/to/js/aladdin.js"></script>

## TODO

+ support Audio objects
+ write tests

## Inspiration

Aladdin's lamp is inspired by this html5rocks [tutorial](http://www.html5rocks.com/en/tutorials/games/assetmanager/ "Simple Asset Management for HTML5 Games"), enhanced in particular with asset bundles and events, plus semantic choices! Stoyan Stefanov's *JavaScript Patterns* book has also guided this implementation.

## License

MIT