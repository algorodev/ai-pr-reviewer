import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

export async function getInstallationClient() {
  const appId = Number(process.env.APP_ID);
  const privateKey = Buffer.from(
    process.env.PRIVATE_KEY_BASE64 || "",
    "base64",
  ).toString("utf8");
  const installationId = Number(process.env.INSTALLATION_ID);

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });
}
