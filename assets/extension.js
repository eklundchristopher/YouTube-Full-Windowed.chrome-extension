(function (chrome) {
    let namespace = 'YouTube Full Windowed Extension'
    let instance = new Extension()
    
    /**
     * Listen for and execute certain extension actions.
     *
     * @param  object  request
     * @param  object  sender
     * @param  closure  callback
     * @return void
     */
    chrome.runtime.onMessage.addListener(function (request, sender, callback) {
        var action = request.action || ''

        instance.log(`${action}()`, false)

        if (instance[action] === undefined) {
            throw new Error(`Unknown Action -> ${action}`)
        }

        instance[action](request, sender, callback)
    })

    /**
     * Listen for when the current tab has finished loading.
     *
     * @param  integer  tabId
     * @param  object  changeInfo
     * @param  object  tab
     * @return void
     */
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status !== 'complete' || instance.initialised) {
            return
        }

        chrome.browserAction.setIcon({ path: 'icons/state-0.png', tabId })
        chrome.browserAction.setTitle({ title: 'YouTube Full Windowed', tabId })
    })

    /**
     * Trigger a toggle event when the extension browser button is pressed.
     *
     * @param  object  tab
     * @return void
     */
    chrome.browserAction.onClicked.addListener(function (tab) {
        if (instance.state[tab.id] === undefined) {
            return
        }

        instance.log(`toggle()`, false)
        instance.toggle({}, { tab })
    })



    function Extension () {
        this.initialised = false
        this.state = {}

        /**
         * Log information to the extension's background page.
         *
         * @param  string  message
         * @param  boolean  response  true
         * @return void
         */
        this.log = function (message, response = true) {
            var indentation = response === true ? '   ->   ' : ''

            chrome.extension.getBackgroundPage().console.log(
                `[${namespace}]: ${indentation}${message}`
            )
        }

        /**
         * Initialise the extension.
         *
         * @param  object  request
         * @param  object  sender
         * @param  closure  callback
         * @return void
         */
        this.initialise = function (request, sender, callback) {
            this.state[sender.tab.id] = request.state

            this.log(`Extension was initialised with state ${this.state[sender.tab.id]}`)

            chrome.browserAction.setIcon({ path: 'icons/state-1.png', tabId: sender.tab.id })
            chrome.browserAction.setTitle({ title: 'Enter Full Windowed', tabId: sender.tab.id })

            this.initialised = true
        }

        /**
         * Toggle the state of the extension.
         *
         * @param  object  request
         * @param  object  sender
         * @param  closure  callback
         * @return void
         */
        this.toggle = function (request, sender, callback) {
            let state = this.state[sender.tab.id] = ! this.state[sender.tab.id]

            let path = state === false ? 'icons/state-1.png' : 'icons/state-2.png'
            let title = state === false ? 'Enter Full Windowed' : 'Exit Full Windowed'

            chrome.browserAction.setIcon({ path, tabId: sender.tab.id })
            chrome.browserAction.setTitle({ title, tabId: sender.tab.id })

            this.log(`State was updated to ${state}`)

            chrome.tabs.sendMessage(sender.tab.id, { action: 'toggle', state })

            if (callback) {
                callback(state)
            }
        }
    }
})(chrome)
