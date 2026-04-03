export async function gerarReceita(form) {
  const res = await fetch("http://localhost:3001/gerar-receita", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
}