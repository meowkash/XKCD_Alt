(function (d) {
    var
        ce = function (e, n) {
            var a = document.createEvent("CustomEvent");
            a.initCustomEvent(n, true, true, e.target);
            e.target.dispatchEvent(a);
            a = null;
            return false
        },
        nm = true,
        minDelta = 90,
        sp = {
            x: 0,
            y: 0
        },
        ep = {
            x: 0,
            y: 0
        },
        touch = {
            touchstart: function (e) {
                sp = {
                    x: e.touches[0].pageX,
                    y: e.touches[0].pageY
                }
            },
            touchmove: function (e) {
                nm = false;
                ep = {
                    x: e.touches[0].pageX,
                    y: e.touches[0].pageY
                }
            },
            touchend: function (e) {
                if (nm) {
                    ce(e, 'fc')
                } else {
                    var x = ep.x - sp.x,
                        xr = Math.abs(x),
                        y = ep.y - sp.y,
                        yr = Math.abs(y);
                    if ((xr ** 2 + yr ** 2) > minDelta ** 2) {
                        ce(e, (xr > yr ? (x < 0 ? 'swl' : 'swr') : (y < 0 ? 'swu' : 'swd')))
                    }
                };
                nm = true
            },
            touchcancel: function (e) {
                nm = false
            }
        };
    for (var a in touch) {
        d.addEventListener(a, touch[a], false);
    }
})(document);

// (function detectSwipe(id, func, deltaMin = 90) {
//     const swipe_det = {
//         sX: 0,
//         sY: 0,
//         eX: 0,
//         eY: 0
//     }
//     // Directions enumeration
//     const directions = Object.freeze({
//         UP: 'up',
//         DOWN: 'down',
//         RIGHT: 'right',
//         LEFT: 'left'
//     })
//     let direction = null
//     const el = document.getElementById(id)
//     el.addEventListener('touchstart', function (e) {
//         const t = e.touches[0]
//         swipe_det.sX = t.screenX
//         swipe_det.sY = t.screenY
//     }, false)
//     el.addEventListener('touchmove', function (e) {
//         // Prevent default will stop user from scrolling, use with care
//         // e.preventDefault();
//         const t = e.touches[0]
//         swipe_det.eX = t.screenX
//         swipe_det.eY = t.screenY
//     }, false)
//     el.addEventListener('touchend', function (e) {
//         const deltaX = swipe_det.eX - swipe_det.sX
//         const deltaY = swipe_det.eY - swipe_det.sY
//         // Min swipe distance, you could use absolute value rather
//         // than square. It just felt better for personnal use
//         if (deltaX ** 2 + deltaY ** 2 < deltaMin ** 2) return
//         // horizontal
        // if (deltaY === 0 || Math.abs(deltaX / deltaY) > 1)
        //     direction = deltaX > 0 ? directions.RIGHT : directions.LEFT
        // else // vertical
        //     direction = deltaY > 0 ? directions.UP : directions.DOWN

//         if (direction && typeof func === 'function') func(el, direction)

//         direction = null
//     }, false)
// })(document);