var toolbar, targets, theatre, trigger, body
var state = false

var ytbfw_waitUntilAvailable = setInterval(function () {
    toolbar = document.querySelector('.ytp-chrome-controls .ytp-right-controls')

    if (toolbar !== null) {
        targets = 'body, div#movie_player, .html5-main-video'
        theatre = document.querySelector('.ytp-size-button')
        trigger = document.createElement('button')
        body = document.querySelector('body')

        trigger.setAttribute('class', 'ytp-full-windowed-button ytp-button')
        trigger.setAttribute('title', 'Full windowed')

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
                  + '<path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m13.56101,18.08987l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="svg_3"/>'
                  + '<path transform="rotate(-180 21.507320404052734,14.492679595947264) " stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m20.57565,11.07523l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="svg_5"/>'
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
                  + '<path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m12.37817,19.27271l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="svg_3" transform="rotate(-180 13.309835433959961,22.69016456604004) "/>'
                  + '<path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m21.75849,9.89239l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="svg_5"/>'
                  + '</svg>'
}
