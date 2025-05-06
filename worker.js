
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/upload") {
      const formData = await request.formData();
      const logo = formData.get("logo");
      if (logo) {
        const arrayBuffer = await logo.arrayBuffer();
        await env.LOGO_KV.put("logo", arrayBuffer);
        return new Response("Uploaded", { status: 200 });
      }
    }

    if (request.method === "GET" && url.pathname === "/logo") {
      const logoData = await env.LOGO_KV.get("logo", "arrayBuffer");
      if (logoData) {
        return new Response(logoData, {
          headers: { "Content-Type": "image/png" },
        });
      }
      return new Response("Not Found", { status: 404 });
    }

    const html = await env.ASSETS.fetch(request);
    return html;
  },
};
