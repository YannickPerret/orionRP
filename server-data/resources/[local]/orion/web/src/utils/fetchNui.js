export async function sendNui(eventName, data = null, resourceName = 'orion') {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, options);
    if (!resp.ok) {
      console.error('Erreur de réponse du serveur:', resp.statusText);
      return { error: resp.statusText };
    }
    return await resp.json();
  } catch (err) {
    console.error('Erreur lors du parsing JSON:', err);
    return { error: err.message };
  }
}
