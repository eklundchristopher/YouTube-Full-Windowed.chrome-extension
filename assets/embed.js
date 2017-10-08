(function (chrome) {
    let button, theatre
    let state = false, theatreState = false, initialised = false

    const options = {
        namespace: 'YouTube Full Windowed Extension',
        icons: {
            open: `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-1"></use><path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m13.56101,18.08987l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-1"/><use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-2"></use><path transform="rotate(-180 21.507320404052734,14.492679595947264) " stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m20.57565,11.07523l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-2"/></svg>`,
            close: `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-5"></use><path transform="rotate(-180 12.460127830505371,23.539867401123047) " id="ytbfw-id-5" d="m11.52846,20.12242l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/><use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-6"></use><path id="ytbfw-id-6" d="m22.6082,9.04268l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/></svg>`,
            hover: {
                open: `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-3"></use><path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m12.10554,19.54534l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-3"/><use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-4"></use><path transform="rotate(-180 22.962797164916992,13.037205696105957) " stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m22.03112,9.61976l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-4"/></svg>`,
                close: `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-7"></use><path transform="rotate(-180 14.062260627746582,21.9377384185791) " id="ytbfw-id-7" d="m13.13059,18.52029l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/><use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-8"></use><path id="ytbfw-id-8" d="m21.00607,10.64481l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/></svg>`,
            }
        },
        events: {
            open: function () {
                document.body.classList.add('extension-full-windowed-enabled')

                if (! theatreState) {
                    theatre.click()
                    theatreState = ! theatreState
                }

                window.dispatchEvent(new Event('resize'))
            },
            close: function () {
                document.body.classList.remove('extension-full-windowed-enabled')

                if (theatreState) {
                    theatre.click()
                    theatreState = ! theatreState
                }

                window.dispatchEvent(new Event('resize'))
            }
        }
    }

    document.querySelector('video.html5-main-video').addEventListener('playing', function (event) {
        if (initialised === true) {
            return
        }

        document.body.classList.add('extension-full-windowed')

        theatre = document.querySelector('.ytp-size-button')
        theatreState = theatre.getAttribute('title') === 'Default view'

        chrome.runtime.onMessage.addListener(function (request, sender, callback) {
            switch (request.action) {
                case 'toggle':
                    state = request.state

                    if (button !== undefined) {
                        button.innerHTML = options.icons[state ? 'close' : 'open']
                    }

                    options.events[state ? 'open' : 'close']()

                    console.log(`[${options.namespace}]: ${state ? 'Opened' : 'Closed'}`)
                    break
            }
        })

        chrome.runtime.sendMessage({ action: 'initialise', state }, function () {
            button = document.createElement('button')

            button.setAttribute('class', 'ytp-full-windowed-button ytp-button')
            button.setAttribute('title', 'Full Windowed')

            button.innerHTML = options.icons.open

            button.addEventListener('mouseover', function () {
                this.innerHTML = options.icons.hover[state ? 'close' : 'open']
            })

            button.addEventListener('mouseout', function () {
                this.innerHTML = options.icons[state ? 'close' : 'open']
            })

            button.addEventListener('click', function (event) {
                chrome.runtime.sendMessage({ action: 'toggle' }, function (state) {
                    options.events[state ? 'open' : 'close']()
                })
            })

            document.body.addEventListener('keyup', function (e) {
                if (state === true && e.keyCode == 27) {
                    chrome.runtime.sendMessage({ action: 'toggle' }, function (state) {
                        options.events.close()
                    })
                }
            })

            let toolbar = document.querySelector('.ytp-chrome-controls .ytp-right-controls')
            toolbar.childNodes[1].insertAdjacentElement('afterend', button)

            console.log(`[${options.namespace}]: Initialised`)
        })

        initialised = true
    }, false)
})(chrome)
