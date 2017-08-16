var toolbar, tooltip, tooltipText, theatre, trigger, body
var targets = 'body, div#movie_player, .html5-main-video'
var state = false

var ytbfw_waitUntilAvailable = setInterval(function () {
    toolbar = document.querySelector('.ytp-chrome-controls .ytp-right-controls')

    if (toolbar !== null) {
        theatre = document.querySelector('.ytp-size-button')
        trigger = document.createElement('button')
        body = document.querySelector('body')

        trigger.setAttribute('class', 'ytp-full-windowed-button ytp-button')
        trigger.setAttribute('title', 'Full Windowed')

        ytbfw_open_icon(trigger)

        /**
         * Allow the user to press ESC to exit out of full windowed mode.
         */
        body.addEventListener('keyup', function (e) {
            if (e.keyCode == 27 && ytbfw_is_active()) {
                ytbfw_exit();
            }
        });

        /**
         * Display the tooltip on hover.
         */
        trigger.addEventListener('mouseover', function () {
            ytbfw_is_active() ? ytbfw_close_icon_hover(trigger) : ytbfw_open_icon_hover(trigger)
        })

        /**
         * Hide the tooltip when hover is lost.
         */
        trigger.addEventListener('mouseout', function () {
            ytbfw_is_active() ? ytbfw_close_icon(trigger) : ytbfw_open_icon(trigger)
        })

        /**
         * Toggle full windowed mode.
         */
        trigger.addEventListener('click', function (e) {
            if (ytbfw_is_active()) {
                return ytbfw_exit()
            }

            state = ytbfw_is_theatre()

            return ytbfw_enter()
        })

        toolbar.childNodes[1].insertAdjacentElement('afterend', trigger)

        clearInterval(ytbfw_waitUntilAvailable)
    }
}, 500)

/**
 * Check whether the video player is currently in full windowed mode or not.
 *
 * @return boolean
 */
function ytbfw_is_active () {
    return body.classList.contains('is-full-windowed')
}

/**
 * Check whether the video player is currently in theathre mode or not.
 *
 * @return boolean
 */
function ytbfw_is_theatre () {
    return theatre.getAttribute('title') === 'Default view'
}

/**
 * Enter full windowed mode.
 *
 * @return void
 */
function ytbfw_enter () {
    document.querySelectorAll(targets).forEach(function (target) {
        target.classList.add('is-full-windowed')
    })

    if (! ytbfw_is_theatre()) {
        theatre.click()
    }

    ytbfw_close_icon(trigger)

    window.dispatchEvent(new Event('resize'))
}

/**
 * Exit out of full windowed mode.
 *
 * @return void
 */
function ytbfw_exit () {
    document.querySelectorAll(targets).forEach(function (target) {
        target.classList.remove('is-full-windowed')
    })

    if (! state && ytbfw_is_theatre()) {
        theatre.click()
    }

    ytbfw_open_icon(trigger)

    window.dispatchEvent(new Event('resize'))
}

/**
 * Set the icon of the trigger.
 *
 * @param  \DOMElement  trigger
 * @return void
 */
function ytbfw_open_icon (trigger) {
    trigger.innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">'
                  + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-1"></use>'
                  + '<path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m13.56101,18.08987l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-1"/>'
                  + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-2"></use>'
                  + '<path transform="rotate(-180 21.507320404052734,14.492679595947264) " stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m20.57565,11.07523l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-2"/>'
                  + '</svg>'
}

/**
 * Set the icon of the trigger.
 *
 * @param  \DOMElement  trigger
 * @return void
 */
function ytbfw_open_icon_hover (trigger) {
    trigger.innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">'
                  + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-3"></use>'
                  + '<path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m12.10554,19.54534l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-3"/>'
                  + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-4"></use>'
                  + '<path transform="rotate(-180 22.962797164916992,13.037205696105957) " stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m22.03112,9.61976l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-4"/>'
                  + '</svg>'
}

/**
 * Set the icon of the trigger.
 *
 * @param  \DOMElement  trigger
 * @return void
 */
function ytbfw_close_icon (trigger) {
    trigger.innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">'
                  + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-5"></use>'
                  + '<path transform="rotate(-180 12.460127830505371,23.539867401123047) " id="ytbfw-id-5" d="m11.52846,20.12242l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/>'
                  + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-6"></use>'
                  + '<path id="ytbfw-id-6" d="m22.6082,9.04268l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/>'
                  + '</svg>'
}

/**
 * Set the icon of the trigger.
 *
 * @param  \DOMElement  trigger
 * @return void
 */
function ytbfw_close_icon_hover (trigger) {
    trigger.innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">'
                  + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-7"></use>'
                  + '<path transform="rotate(-180 14.062260627746582,21.9377384185791) " id="ytbfw-id-7" d="m13.13059,18.52029l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/>'
                  + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-8"></use>'
                  + '<path id="ytbfw-id-8" d="m21.00607,10.64481l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/>'
                  + '</svg>'
}
