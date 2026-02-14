const http = require('http')
const os = require('os')
const process = require('process')
const url = require('url')

//! Format bytes to human-readable format

function formatBytes(bytes, decimal = 2) {
    if (bytes === 0) return '0 Bytes'
    //set base unit
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + sizes[i]
}

// Format seconds to human readable time
function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24))
    const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`
}
//console.log(os.cpus());


//Get CPU info
const getCpuInfo = () => {
    const  model= os.cpus()[0].model
    const cores= os.cpus().length
    const architecture= os.arch();
    const  loadAvg= os.loadavg()

    return{
        model,
        cores,
        architecture,
        loadAvg
    }
}
//console.log(getCpuInfo());


// Memory info
const getMemoryInfo = () => {
    
       const total= formatBytes(os.totalmem())
       const free= formatBytes(os.freemem())
        const usage= ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2) + '%'
        return{
            total,
            free,
            usage
        }

}
//console.log(getMemoryInfo());


// OS info
const getOsInfo = () => {
    
      const  platform= os.platform()
       const type= os.type()
        const release=os.release()
       const hostName= os.hostname()
        const uptime= formatTime(os.uptime())

        return{
            platform,
            type,
            release,
            hostName,
            uptime
        }
}
//console.log(getOsInfo());


// User info
const getUserInfo = () => {
    const user=os.userInfo();
    
    return os.userInfo()
}

// Network info
const getNetworkInfo = () => {
    return os.networkInterfaces()
}

// Process info
const getProcessInfo = () => {
    return {
        pid: process.pid,
        title: process.title,
        nodeVersion: process.version,
        uptime: formatTime(process.uptime()),
        cwd: process.cwd(),
        memoryUsage: {
            rss: formatBytes(process.memoryUsage().rss),
            heapTotal: formatBytes(process.memoryUsage().heapTotal),
            heapUsed: formatBytes(process.memoryUsage().heapUsed),
            external: formatBytes(process.memoryUsage().external)
        },
        env: {
            NODE_ENV: process.env.NODE_ENV || 'Not set'
        }
    }
}

// HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
    res.setHeader('Content-Type', 'application/json')

    if (parsedUrl.pathname === '/') {
        res.end(JSON.stringify({
            name: 'SysView – System Info API',
            routes: ['/cpu', '/memory', '/user', '/process', '/network', '/os']
        }))
    }
    else if (parsedUrl.pathname === '/cpu') {
        res.end(JSON.stringify(getCpuInfo(), null, 2))
    }
    else if (parsedUrl.pathname === '/memory') {
        res.end(JSON.stringify(getMemoryInfo(), null, 2))
    }
    else if (parsedUrl.pathname === '/user') {
        res.end(JSON.stringify(getUserInfo(), null, 2))
    }
    else if (parsedUrl.pathname === '/process') {
        res.end(JSON.stringify(getProcessInfo(), null, 2))
    }
    else if (parsedUrl.pathname === '/network') {
        res.end(JSON.stringify(getNetworkInfo(), null, 2))
    }
    else if (parsedUrl.pathname === '/os') {
        res.end(JSON.stringify(getOsInfo(), null, 2))
    }
    else {
        res.statusCode = 404
        res.end(JSON.stringify({ error: 'Route not found' }))
    }
})

// Start server
const PORT = 8080
server.listen(PORT, () => {
    console.log(`SysView running at http://localhost:${PORT}`)
})