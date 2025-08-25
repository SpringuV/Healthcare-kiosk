import { DOMAIN } from "../data/port"

export const get = async (path)=> {
    const response = await fetch(`${DOMAIN}${path}`)
    const data = await response.json()
    return { status: response.status, ok: response.ok, data }
}

export const post = async (path, dataRequest) =>{
    const response = await fetch(`${DOMAIN}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataRequest)
    })
    const data = await response.json()
    return { status: response.status, ok: response.ok, data }
}

export const put = async (path, dataRequest) => {
    const response = await fetch(`${DOMAIN}${path}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataRequest)
    })
    const data = await response.json()
    return { status: response.status, ok: response.ok, data }
}

export const del = async (path) => {
    const response = await fetch(`${DOMAIN}${path}`, {
        method: 'DELETE'
    })
    const data = await response.json()
    return { status: response.status, ok: response.ok, data }
}