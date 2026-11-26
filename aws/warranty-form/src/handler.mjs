import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

const ses = new SESv2Client({})

const FROM = process.env.FROM_ADDRESS
const TO = (process.env.TO_ADDRESS ?? '').split(',').map(s => s.trim()).filter(Boolean)

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

const escape = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c])

export const handler = async (event) => {
  let data
  try {
    data = JSON.parse(event.body ?? '{}')
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  const { name, phone, email, jobDate, description } = data
  if (!name || !phone || !email || !jobDate || !description) {
    return json(400, { error: 'Missing required field' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'Invalid email' })
  }

  const subject = `Warranty request from ${name}`
  const text =
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Email: ${email}\n` +
    `Original job date: ${jobDate}\n\n` +
    `Description:\n${description}\n`
  const html =
    `<p><strong>Name:</strong> ${escape(name)}</p>` +
    `<p><strong>Phone:</strong> ${escape(phone)}</p>` +
    `<p><strong>Email:</strong> ${escape(email)}</p>` +
    `<p><strong>Original job date:</strong> ${escape(jobDate)}</p>` +
    `<p><strong>Description:</strong><br>${escape(description).replace(/\n/g, '<br>')}</p>`

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: FROM,
        Destination: { ToAddresses: TO },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: {
              Text: { Data: text, Charset: 'UTF-8' },
              Html: { Data: html, Charset: 'UTF-8' },
            },
          },
        },
      })
    )
  } catch (err) {
    console.error('SES send failed', err)
    return json(502, { error: 'Email delivery failed' })
  }

  return json(200, { ok: true })
}
