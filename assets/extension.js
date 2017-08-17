(function (chrome) {
    var initialised = []

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        var pattern = /^https:\/\/www.youtube.com\/watch\?v=/i

        if (changeInfo.status === 'complete') {
            if (pattern.test(tab.url)) {
                chrome.browserAction.setIcon({ path: 'icons/enter-fw.png', tabId: tabId })
                chrome.browserAction.setTitle({ title: 'Enter Full Windowed', tabId: tabId })
            } else {
                chrome.browserAction.setIcon({ path: 'icons/browser.png', tabId: tabId })
                chrome.browserAction.setTitle({ title: 'YouTube Full Windowed', tabId: tabId })

                delete initialised[tabId]
            }
        }
    })

    chrome.runtime.onMessage.addListener(function (request, sender, callback) {
        var action = (request.action || '').toLowerCase()

        switch (action) {
            case 'initialise':
                delete initialised[sender.tab.id]
                initialised.push(sender.tab.id)
                callback()
                break;

            case 'toggle':
                var path = request.status === true ? 'icons/exit-fw.png' : 'icons/enter-fw.png'
                var title = request.status === true ? 'Exit Full Windowed' : 'Enter Full Windowed'

                chrome.browserAction.setIcon({ path: path, tabId: sender.tab.id })
                chrome.browserAction.setTitle({ title: title, tabId: sender.tab.id })
                break;
        }
    })

    chrome.browserAction.onClicked.addListener(function (tab) {
        var pattern = /^https:\/\/www.youtube.com\/watch\?v=/i
        if (initialised.indexOf(tab.id) === -1 || ! pattern.test(tab.url)) {
            return false;
        }

        chrome.tabs.executeScript(tab.id, {
            code: 'ytbfw.toggle()',
        }, function (response) {
            chrome.runtime.sendMessage({ action: 'toggle', status: response[0] })
        })
    })
})(chrome)
