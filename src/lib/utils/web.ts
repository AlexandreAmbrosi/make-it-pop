export const webResponse = (body, status, headers): Response => {
  return new Response(body || null, {
    status: status || 200,
    headers: {
      ...(headers || {}),
    },
  })
}

export const webJson = (body, status, headers): Response => {
  return webResponse(JSON.stringify(body), status || 200, {
    ...headers,
    'Content-Type': 'application/json',
  })
}

export const webRedirect = (path, status, headers): Response => {
  return webResponse(null, status || 302, {
    ...headers,
    Location: path,
  })
}
