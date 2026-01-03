import axios from "axios";
import { ClientSecretCredential } from "@azure/identity";

const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID!,
  process.env.AZURE_CLIENT_ID!,
  process.env.AZURE_CLIENT_SECRET!
);


const SCOPE = "https://ai.azure.com/.default";

const FOUNDRY_ENDPOINT =
  "";




export async function callFoundryWorkflow({
  text,
}: {
  text: string;
}) {
  const token = await credential.getToken(SCOPE);

  console.log("[Auth Debug]", {
    hasToken: !!token,
    expiresOn: token?.expiresOnTimestamp,
  });

  if (!token) {
    throw new Error("Failed to obtain Azure AD token for Foundry");
  }

  // ✅ CONVERSATION-BASED PAYLOAD (REQUIRED)
  const response = await axios.post(
    FOUNDRY_ENDPOINT,
    {
      messages: [
        {
          role: "user",
          content: text
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
    }
  );



  return response.data;
}
