/**
 * Simple wrapper around fetch API tailored for CEF/NUI use. This abstraction
 * can be extended to include AbortController if needed or if the response isn't
 * JSON. Tailor it to your needs.
 *
 * @param eventName - The endpoint eventname to target
 * @param data - Data you wish to send in the NUI Callback
 *
 * @return returnData - A promise for the data sent back by the NuiCallbacks CB argument
 */

export async function sendNui(eventName, data = null) {
  const resourceName = "nomDeVotreResource"; // Remplacez par le nom de votre resource

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  };

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, options);
    if (!resp.ok) {
      console.error("Erreur de réponse du serveur:", resp.statusText);
      return null;
    }
    return await resp.json();
  } catch (err) {
    console.error("Erreur lors du parsing JSON:", err);
    return null;
  }
}
