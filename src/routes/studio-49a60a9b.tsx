import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  studioCreateCollection,
  studioData,
  studioDeleteCollection,
  studioLogin,
  studioLogout,
  studioSetMembership,
  studioStatus,
  type StudioData,
} from "@/lib/admin.server";

// Hidden brand panel: not linked anywhere and kept out of search engines.
export const Route = createFileRoute("/studio-49a60a9b")({
  loader: async () => {
    const { signedIn } = await studioStatus();
    return { signedIn, data: signedIn ? await studioData().catch(() => null) : null };
  },
  head: () => ({ meta: [{ title: "Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Studio,
});

const MESSAGES: Record<string, string> = {
  studio_wrong_password: "Неверный пароль",
  studio_unauthorized: "Сессия закончилась — войдите заново",
  studio_invalid_title: "Название от 2 до 80 символов",
  studio_not_configured: "Админка ещё не настроена на сервере",
};
const explain = (error: unknown) => MESSAGES[error instanceof Error ? error.message : ""] ?? "Не получилось, попробуйте ещё раз";

function Studio() {
  const { signedIn, data } = Route.useLoaderData();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [local, setLocal] = useState<StudioData | null>(null);
  const view = local ?? data;

  const run = async (action: () => Promise<unknown>, reload = true) => {
    setBusy(true);
    setMessage("");
    try {
      await action();
      if (reload) {
        setLocal(await studioData());
      }
    } catch (error) {
      setMessage(explain(error));
      if (error instanceof Error && error.message === "studio_unauthorized") await router.invalidate();
    } finally {
      setBusy(false);
    }
  };

  if (!signedIn) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24">
        <h1 className="text-xl font-semibold">Studio</h1>
        <form
          className="mt-6 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void run(async () => {
              await studioLogin({ data: { password } });
              setPassword("");
              await router.invalidate();
            }, false);
          }}
        >
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" className="w-full border px-3 py-2" />
          <button disabled={busy || !password} className="w-full bg-black px-3 py-2 text-white disabled:opacity-50">Войти</button>
          {message && <p className="text-sm text-red-600">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Коллекции</h1>
        <button className="text-sm underline" onClick={() => void run(async () => { await studioLogout(); setLocal(null); await router.invalidate(); }, false)}>Выйти</button>
      </div>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      {!view ? (
        <p className="mt-8 text-sm">Не удалось загрузить данные из Shopify.</p>
      ) : (
        <>
          <section className="mt-8">
            <ul className="space-y-2">
              {view.collections.map((c) => (
                <li key={c.id} className="flex items-center justify-between border px-3 py-2 text-sm">
                  <span>{c.title} <span className="text-neutral-500">· {c.count}</span></span>
                  <button
                    disabled={busy}
                    className="text-red-600 underline disabled:opacity-50"
                    onClick={() => {
                      if (window.confirm(`Удалить коллекцию «${c.title}»? Товары останутся в магазине.`)) void run(() => studioDeleteCollection({ data: { id: c.id } }));
                    }}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  await studioCreateCollection({ data: { title } });
                  setTitle("");
                });
              }}
            >
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Новая коллекция" className="flex-1 border px-3 py-2 text-sm" />
              <button disabled={busy || title.trim().length < 2} className="bg-black px-4 py-2 text-sm text-white disabled:opacity-50">Создать</button>
            </form>
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-semibold">Товары</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {view.products.map((p) => (
                <div key={p.id} className="flex gap-3 border p-3">
                  {p.image && <img src={p.image} alt="" className="h-24 w-20 object-cover" />}
                  <div className="text-sm">
                    <p className="font-medium">{p.title}</p>
                    <div className="mt-2 space-y-1">
                      {view.collections.map((c) => (
                        <label key={c.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            disabled={busy}
                            checked={p.collectionIds.includes(c.id)}
                            onChange={(event) => void run(() => studioSetMembership({ data: { collectionId: c.id, productId: p.id, member: event.target.checked } }))}
                          />
                          {c.title}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
