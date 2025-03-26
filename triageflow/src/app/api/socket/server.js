export async function dataUpdate () {
  try {
      await fetch('https://triage-pww1.onrender.com')
      await fetch('https://triage-pww1.onrender.com/socket-emergency')
      return { success: true }
    } catch (error) {
      console.error("dataUpdate error:", error)
      return { error: "Failed to update data" }
    }
}