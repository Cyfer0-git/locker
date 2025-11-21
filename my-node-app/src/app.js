import { google } from 'googleapis'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
        const spreadsheetId = process.env.GOOGLE_SHEET_ID

        if (!keyJson || !spreadsheetId) {
            return new Response(JSON.stringify({ error: 'Missing GOOGLE_SHEET_ID or GOOGLE_SERVICE_ACCOUNT_KEY' }), { status: 500 })
        }

        const key = JSON.parse(keyJson as string)

        const jwt = new google.auth.JWT({
            email: key.client_email,
            key: key.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        } as any)

        await jwt.authorize()
        const sheets = google.sheets({ version: 'v4', auth: jwt })

        const { type, data } = body as any

        let values: any[] = []

        if (type === 'message') {
            values = [[new Date().toISOString(), data.id, data.title || '', data.body || '']]
        } else if (type === 'credential') {
            values = [[new Date().toISOString(), data.id, data.site || '', data.url || '', data.user || '', data.pass || '']]
        } else if (type === 'link') {
            values = [[new Date().toISOString(), data.id, data.name || '', data.url || '']]
        } else {
            values = [[new Date().toISOString(), JSON.stringify(data)]]
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:Z',
            valueInputOption: 'RAW',
            requestBody: { values },
        })

        return new Response(JSON.stringify({ ok: true }), { status: 200 })
    } catch (err: any) {
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
    }
}

// add the helper inside the AppProvider component (or near other helpers)
async function sendToSheets(type: 'message' | 'credential' | 'link', data: any) {
    try {
        await fetch('/api/sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data }),
        })
    } catch (err) {
        console.error('sheets error', err)
    }
}

// modify your add functions to call sendToSheets (example snippets)
const addMessage = (data: Omit<CannedMessage, 'id'>) => {
    const newMessage = { ...data, id: uuidv4() }
    setMessages(prev => [...prev, newMessage])
    void sendToSheets('message', newMessage)
}

const addCredential = (data: Omit<Credential, 'id'>) => {
    const newCredential = { ...data, id: uuidv4() }
    setCredentials(prev => [...prev, newCredential])
    void sendToSheets('credential', newCredential)
}

const addLink = (data: Omit<Link, 'id'>) => {
    const newLink = { ...data, id: uuidv4() }
    setLinks(prev => [...prev, newLink])
    void sendToSheets('link', newLink)
}