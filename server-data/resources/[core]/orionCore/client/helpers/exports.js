const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

exports('Delay', delay)