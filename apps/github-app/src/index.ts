import Fastify from "fastify";
import crypto from "node:crypto";
import { getInstallationClient } from "./octokit.js";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

const fastify = Fastify({ logger: true });

fastify.post("/github/webhook", async (req, reply) => {
  const event = req.headers["x-github-event"] as string;
  const delivery = req.headers["x-github-delivery"];
  const action = (req.body as any)?.action;

  fastify.log.info({ event, action, delivery }, "webhook received");

  if (
    event === "pull_request" &&
    (action === "opened" || action === "synchronize")
  ) {
    const payload = req.body as any;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const headSha = payload.pull_request.head.sha;

    const octokit = await getInstallationClient();
    await octokit.checks.create({
      owner,
      repo,
      name: "AI PR Reviewer",
      head_sha: headSha,
      status: "completed",
      conclusion: "neutral",
      output: {
        title: "Setup OK",
        summary: "Webhook received and Check Run posted by AI PR Reviewer.",
        text: "Next step: parse diff and add real annotations.",
      },
    });
  }

  reply.code(200).send({ ok: true });
});

fastify.get("/healthz", async () => ({ ok: true }));

fastify
  .listen({ port: 3000, host: "0.0.0.0" })
  .then(() => fastify.log.info("listening on :3000"))
  .catch((e) => {
    fastify.log.error(e);
    process.exit(1);
  });
