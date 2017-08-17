window.ytbfw = {
    extensionClass: 'is-full-windowed',

    state: false,

    selectors: {
        theatre: '.ytp-size-button',
        targets: 'body, div#movie_player, .html5-main-video',
        toolbar: '.ytp-chrome-controls .ytp-right-controls',
    },

    accessors: {
        body: null,
        theatre: null,
        toolbar: null,
        trigger: null,
        targets: [],
    },

    init: function (toolbar) {
        console.log('YouTube Full Windowed Extension: Initialised.')

        this.accessors.toolbar = toolbar
        this.accessors.body = document.querySelector('body')
        this.accessors.theatre = document.querySelector(this.selectors.theatre)
        this.accessors.trigger = document.createElement('button')
        this.accessors.targets = document.querySelectorAll(this.selectors.targets)

        this.accessors.trigger.setAttribute('class', 'ytp-full-windowed-button ytp-button')
        this.accessors.trigger.setAttribute('title', 'Full Windowed')

        this.open_icon()
        this.state = this.is_theatre()

        var vm = this

        /**
         * Allow the user to press ESC to exit out of full windowed mode.
         */
        this.accessors.body.addEventListener('keyup', function (e) {
            if (vm.is_active() && e.keyCode == 27) {
                vm.exit()
            }
        })

        /**
         * Display the tooltip on hover.
         */
        this.accessors.trigger.addEventListener('mouseover', function () {
            vm.is_active() ? vm.close_icon_hover() : vm.open_icon_hover()
        })

        /**
         * Hide the tooltip when hover is lost.
         */
        this.accessors.trigger.addEventListener('mouseout', function () {
            vm.is_active() ? vm.close_icon() : vm.open_icon()
        })

        /**
         * Toggle full windowed mode.
         */
        this.accessors.trigger.addEventListener('click', function (e) {
            if (vm.is_active()) {
                return vm.exit()
            }

            vm.state = vm.is_theatre()

            return vm.enter()
        })

        this.accessors.toolbar.childNodes[1].insertAdjacentElement('afterend', this.accessors.trigger)
    },

    /**
     * Check whether the video player is currently in full windowed mode or not.
     *
     * @return boolean
     */
    is_active: function () {
        return this.accessors.body.classList.contains(this.extensionClass)
    },

    /**
     * Check whether the video player is currently in theathre mode or not.
     *
     * @return boolean
     */
    is_theatre: function () {
        return this.accessors.theatre.getAttribute('title') === 'Default view'
    },

    /**
     * Toggle full windowed mode.
     *
     * @return boolean
     */
    toggle: function () {
        if (this.is_active()) {
            this.exit()
            return false
        }

        this.enter()
        return true
    },

    /**
     * Enter full windowed mode.
     *
     * @return void
     */
    enter: function () {
        var vm = this
        this.accessors.targets.forEach(function (target) {
            target.classList.add(vm.extensionClass)
        })

        if (! this.is_theatre()) {
            this.accessors.theatre.click()
        }

        this.close_icon()
        chrome.runtime.sendMessage({ action: 'toggle', status: true })

        window.dispatchEvent(new Event('resize'))
    },

    /**
     * Exit out of full windowed mode.
     *
     * @return void
     */
    exit: function () {
        var vm = this
        this.accessors.targets.forEach(function (target) {
            target.classList.remove(vm.extensionClass)
        })

        if (! this.state && this.is_theatre()) {
            this.accessors.theatre.click()
        }

        this.open_icon()
        chrome.runtime.sendMessage({ action: 'toggle', status: false })

        window.dispatchEvent(new Event('resize'))
    },

    /**
     * Set the icon of the trigger.
     *
     * @return void
     */
    open_icon: function () {
        this.accessors.trigger.innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">'
          + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-1"></use>'
          + '<path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m13.56101,18.08987l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-1"/>'
          + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-2"></use>'
          + '<path transform="rotate(-180 21.507320404052734,14.492679595947264) " stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m20.57565,11.07523l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-2"/>'
          + '</svg>'
    },

    /**
     * Set the icon of the trigger.
     *
     * @return void
     */
    open_icon_hover: function () {
        this.accessors.trigger.innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">'
          + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-3"></use>'
          + '<path stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m12.10554,19.54534l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-3"/>'
          + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-4"></use>'
          + '<path transform="rotate(-180 22.962797164916992,13.037205696105957) " stroke="#000" fill="#fff" stroke-width="0" stroke-opacity="null" d="m22.03112,9.61976l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" id="ytbfw-id-4"/>'
          + '</svg>'
    },

    /**
     * Set the icon of the trigger.
     *
     * @return void
     */
    close_icon: function () {
        this.accessors.trigger.innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">'
          + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-5"></use>'
          + '<path transform="rotate(-180 12.460127830505371,23.539867401123047) " id="ytbfw-id-5" d="m11.52846,20.12242l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/>'
          + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-6"></use>'
          + '<path id="ytbfw-id-6" d="m22.6082,9.04268l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/>'
          + '</svg>'
    },

    /**
     * Set the icon of the trigger.
     *
     * @param  \DOMElement  trigger
     * @return void
     */
    close_icon_hover: function () {
        this.accessors.trigger.innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">'
          + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-7"></use>'
          + '<path transform="rotate(-180 14.062260627746582,21.9377384185791) " id="ytbfw-id-7" d="m13.13059,18.52029l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/>'
          + '<use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytbfw-id-8"></use>'
          + '<path id="ytbfw-id-8" d="m21.00607,10.64481l-0.00013,4.34952l4.34952,-0.00013l0.00066,2.48645l-6.83597,-0.00054l-0.00079,-6.83624" stroke-opacity="null" stroke-width="0" fill="#fff" stroke="#000"/>'
          + '</svg>'
    }
}
