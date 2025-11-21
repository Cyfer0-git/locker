export const runtime = 'nodejs'

import fs from 'fs'
import { google } from 'googleapis'

export async function POST(req: Request) {
  try {
    // safe body parsing
    const raw = await req.text()
    if (!raw || raw.trim() === '') {
      console.error('Empty request body')
      return new Response(JSON.stringify({ error: 'Empty request body' }), { status: 400 })
    }
    let body: any
    try {
      body = JSON.parse(raw)
    } catch (parseErr) {
      console.error('Invalid JSON body for /api/sheets:', raw)
      return new Response(JSON.stringify({ error: 'Invalid JSON body', detail: String(parseErr) }), { status: 400 })
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const rawKeyEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS

    if (!spreadsheetId) {
      console.error('Missing GOOGLE_SHEET_ID')
      return new Response(JSON.stringify({ error: 'Missing GOOGLE_SHEET_ID' }), { status: 500 })
    }

    // load service account JSON
    let keyObj: any = null
    if (rawKeyEnv) {
      let keyStr = rawKeyEnv.trim()
      if ((keyStr.startsWith("'") && keyStr.endsWith("'")) || (keyStr.startsWith('"') && keyStr.endsWith('"'))) {
        keyStr = keyStr.slice(1, -1)
      }
      keyStr = keyStr.replace(/\\n/g, '\n')
      try {
        keyObj = JSON.parse(keyStr)
      } catch (e) {
        console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY', e)
        return new Response(JSON.stringify({ error: 'Invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON' }), { status: 500 })
      }
    } else if (keyFilePath) {
      try {
        const rawFile = fs.readFileSync(keyFilePath, 'utf8')
        keyObj = JSON.parse(rawFile)
      } catch (e) {
        console.error('Failed to read/parse GOOGLE_APPLICATION_CREDENTIALS file', keyFilePath, e)
        return new Response(JSON.stringify({ error: 'Invalid GOOGLE_APPLICATION_CREDENTIALS path or file' }), { status: 500 })
      }
    } else {
      console.error('No service account key provided (env or file)')
      return new Response(JSON.stringify({ error: 'Provide GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS' }), { status: 500 })
    }

    console.log('sheets route using spreadsheetId=', spreadsheetId, 'client_email=', keyObj?.client_email)

    const jwt = new google.auth.JWT({
      email: keyObj.client_email,
      key: keyObj.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    } as any)

    await jwt.authorize()
    const sheets = google.sheets({ version: 'v4', auth: jwt })

    const { type, data } = body as any
    const values =
      type === 'message'
        ? [[new Date().toISOString(), data.id, data.title || '', data.body || '']]
        : type === 'credential'
        ? [[new Date().toISOString(), data.id, data.site || '', data.url || '', data.user || '', data.pass || '']]
        : type === 'link'
        ? [[new Date().toISOString(), data.id, data.name || '', data.url || '']]
        : [[new Date().toISOString(), JSON.stringify(data)]]

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:Z', // change Sheet1 if your tab has a different name
      valueInputOption: 'RAW',
      requestBody: { values },
    })

    console.log('Sheets API OK response', res.data)
    return new Response(JSON.stringify({ ok: true, result: res.data }), { status: 200 })
  } catch (err: any) {
    console.error('sheets route error', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

console.log('sheets route loaded')