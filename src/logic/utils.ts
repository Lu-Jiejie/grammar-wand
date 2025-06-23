export async function safeAwait<T>(promise: Promise<T>): Promise<{
  success: true
  value: T
} | {
  success: false
  error: unknown
}> {
  try {
    const value = await promise
    return {
      success: true,
      value,
    }
  }
  catch (error) {
    return {
      success: false,
      error,
    }
  }
}
