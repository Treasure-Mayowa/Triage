

export async function dataUpdate () {
    const request = await fetch('https://triage-pww1.onrender.com')
    const response = await request.json()
    return response
}