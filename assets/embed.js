(function (chrome, ytbfw) {

    var attempts = 0
    var available = setInterval(function () {
        attempts++

        var toolbar = document.querySelector('.ytp-chrome-controls .ytp-right-controls')
        if (toolbar !== null) {
            chrome.runtime.sendMessage({ action: 'initialise' }, function () {
                ytbfw.init(toolbar)
            })
        }

        if (attempts >= 15 || toolbar !== null) {
            clearInterval(available)
        }
    }, 500)

})(chrome, ytbfw)
