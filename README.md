## Intro and usage

Aladdin's lamp is your **a**synchronous and **l**igthweight **a**sset **m**anager **p**al.

You can request a single image, rub the lamp so that your vow is fulfilled (meaning *downloaded*) and then get notified:

    var lamp = new Aladdin.Lamp();
    lamp.request('/img/genius-memories.png');
    lamp.rub();
    lamp.on('fulfilled', function() { console.log('remembering'); });

But you may have several requests:

    var sizes = ['/img/s.png', '/img/m.png', '/img/l.png', '/img/xl.png'];
    lamp.request(sizes);
    lamp.request('/img/xs.png');// this one too
    lamp.rub();
    lamp.on('fulfilled', function() { console.log('all sizes downloaded'); });

You can also pack assets into bundles:

    var splashScreen = ['/img/bg.jpg', '/img/loading.gif'];
    var intro = ['img/logo.png', 'img/trees.png', 'img/houses.png'];
    lamp.request(splashScreen, 'splash-screen');
    lamp.request(intro, 'intro');
    lamp.on('fulfilled:splash-screen', function() {
      // display splash screen here...
      // and launch subsequent downloads
      lamp.rub('intro');
    });
    // start downloads
    lamp.rub('splash-screen');

What matters here is the bundle names you pass to the *request* and *rub* methods.

Finally, when an asset has been downloaded you can access it or remove it using its URI:

    var logo = lamp.get('/img/logo.png');// returns a Javascript Image instance
    lamp.remove('/img/useless.png');// deletes it from the lamp's cache

## Installation

Aladdin relies either on [underscore](http://underscorejs.org/) or [lodash](http://lodash.com/).

Once the sources has been downloaded link to them:

    <script src="/path/to/js/underscore.js"></script>
    <script src="/path/to/js/aladding.js"></script>

## TODO

+ support Audio objects
+ write tests

## Inspiration

Aladdin's asset manager has been inspired by this html5rocks [tutorial](http://www.html5rocks.com/en/tutorials/games/assetmanager/ "Simple Asset Management for HTML5 Games"), especially enhanced with asset bundles and events. Stoyan Stefanov's *JavaScript Patterns* book has also guided this implementation.

## License

MIT